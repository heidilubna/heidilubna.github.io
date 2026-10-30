const loader=document.getElementById("loader");
window.addEventListener("load",()=>setTimeout(()=>loader?.classList.add("hide"),700));

const reveals=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
 }),{threshold:.1});
 reveals.forEach(el=>observer.observe(el));
}else reveals.forEach(el=>el.classList.add("visible"));

document.querySelectorAll(".tilt-card").forEach(card=>{
 card.addEventListener("mousemove",e=>{
  if(innerWidth<850)return;
  const r=card.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
  card.style.transform=`perspective(900px) rotateX(${-y/r.height*5}deg) rotateY(${x/r.width*5}deg)`;
 });
 card.addEventListener("mouseleave",()=>card.style.transform="");
});

const translations={
 en:{
  navHome:"Home",navStory:"Our Story",navMenu:"Menu",navGallery:"Gallery",navOrderShort:"Order",navContact:"Contact",navOrder:"Order cupcakes",
  chooseLabel:"Choose cupcakes",selectFlavor:"select a flavor",quantity:"Quantity",currentTotalLabel:"Current total",
  add:"＋ add",toast:"Added to your sweet box ♡",submit:"Place order",
  orderReceived:"Thank you, NAME! Your request for QTY × FLAVOR on DATE has been received.",
  placeholderName:"your name",placeholderPhone:"08xxxxxxxxxx",placeholderEmail:"you@email.com",placeholderMessage:"any special request?"
 },
 id:{
  navHome:"Beranda",navStory:"Cerita Kami",navMenu:"Menu",navGallery:"Galeri",navOrderShort:"Pesan",navContact:"Kontak",navOrder:"Pesan cupcake",
  chooseLabel:"Pilih cupcake",selectFlavor:"pilih rasa",quantity:"Jumlah",currentTotalLabel:"Total saat ini",
  add:"＋ tambah",toast:"Ditambahkan ke kotak manismu ♡",submit:"Kirim pesanan",
  orderReceived:"Terima kasih, NAME! Pesananmu untuk QTY × FLAVOR pada DATE telah diterima.",
  placeholderName:"nama kamu",placeholderPhone:"08xxxxxxxxxx",placeholderEmail:"kamu@email.com",placeholderMessage:"ada permintaan khusus?"
 }
};
let currentLang="en";

const cards=[...document.querySelectorAll(".menu-card")];
const flavorSelect=document.getElementById("flavor");
const quantity=document.getElementById("quantity");
const totalEl=document.getElementById("currentTotal");
const toast=document.getElementById("toast");
const form=document.getElementById("orderForm");

cards.forEach(card=>{
 const img=card.querySelector(".photo-art");
 if(img)img.addEventListener("error",()=>img.classList.add("image-failed"));
});
if(flavorSelect){
 cards.forEach(card=>{
  const o=document.createElement("option");
  o.value=card.dataset.name;o.textContent=card.dataset.name;
  flavorSelect.appendChild(o);
 });
}
function money(n){return "Rp "+Number(n).toLocaleString("id-ID");}
function updateTotal(){
 const q=Math.max(0,parseInt(quantity?.value||0,10));
 const card=cards.find(c=>c.dataset.name===flavorSelect?.value);
 const price=card?Number(card.dataset.price):0;
 if(totalEl)totalEl.textContent=money(price*q);
}
function setLanguage(lang){
 currentLang=lang;document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{
  const key=el.dataset.i18n;if(!translations[lang][key])return;
  if(el.tagName==="LABEL" && el.querySelector("select")){
   const textNode=[...el.childNodes].find(n=>n.nodeType===3 && n.textContent.trim());
   if(textNode)textNode.nodeValue=" "+translations[lang][key];
  }else el.textContent=translations[lang][key];
 });
 if(flavorSelect)flavorSelect.options[0].textContent=translations[lang].selectFlavor;
 document.querySelectorAll(".add-btn").forEach(b=>b.textContent=translations[lang].add);
 document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
 const map={customerName:"placeholderName",phone:"placeholderPhone",email:"placeholderEmail",message:"placeholderMessage"};
 Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.placeholder=translations[lang][key];});
 updateTotal();
}
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));
flavorSelect?.addEventListener("change",updateTotal);
quantity?.addEventListener("input",updateTotal);
quantity?.addEventListener("change",updateTotal);

document.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{
 const card=btn.closest(".menu-card");
 if(flavorSelect){flavorSelect.value=card.dataset.name;updateTotal();}
 if(toast){toast.textContent=translations[currentLang].toast;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1500);}
}));

if(form)form.addEventListener("submit",e=>{
 e.preventDefault();
 const name=document.getElementById("customerName")?.value.trim()||"",
       flavor=flavorSelect?.value||"Mixed Box",
       qty=Math.max(1,parseInt(quantity?.value||1,10)),
       date=document.getElementById("date")?.value||"",
       card=cards.find(c=>c.dataset.name===flavor),
       total=card?Number(card.dataset.price)*qty:0,
       status=document.getElementById("formStatus");
 if(status){
  const msg=translations[currentLang].orderReceived
    .replace("NAME",name).replace("QTY",qty).replace("FLAVOR",flavor).replace("DATE",date);
  status.textContent=msg+" "+(currentLang==="id"?"Total: ":"Total: ")+money(total)+".";
  status.style.color="#7a4b51";
 }
});

const toggle=document.querySelector(".menu-toggle");
toggle?.addEventListener("click",()=>document.querySelector(".navbar")?.classList.toggle("open"));
document.querySelectorAll(".navbar nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".navbar")?.classList.remove("open")));
const dateInput=document.getElementById("date");
if(dateInput)dateInput.min=new Date().toISOString().split("T")[0];
updateTotal();

/* cursor */
const dot=document.querySelector(".cursor-dot"),ring=document.querySelector(".cursor-ring");
if(dot&&ring){
 window.addEventListener("mousemove",e=>{
  dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";
  ring.animate({left:e.clientX+"px",top:e.clientY+"px"},{duration:300,fill:"forwards"});
 });
}
