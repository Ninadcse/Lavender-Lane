const products = [
  {id:1,name:"The Sunday Linen Shirt",category:"Clothing",price:2450,tag:"NEW ARRIVAL",image:"https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Soft Form Everyday Tote",category:"Accessories",price:1650,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"The Quiet Classic Dress",category:"Clothing",price:3850,tag:"NEW ARRIVAL",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Everyday Minimal Scarf",category:"Accessories",price:950,tag:"JUST IN",image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"The Essential Knit",category:"Essentials",price:2950,tag:"TIMELESS",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Modern Day Shoulder Bag",category:"Accessories",price:2250,tag:"EDITORS' PICK",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Relaxed Tailored Trousers",category:"Clothing",price:2750,tag:"EASY LIVING",image:"https://images.unsplash.com/photo-1506629905607-d9c297d2e6d2?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"The Daily Layer Tee",category:"Essentials",price:1250,tag:"WARDROBE HERO",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85"}
];
let activeFilter = "All";
let cart = JSON.parse(localStorage.getItem("lavenderLaneCart") || "[]");
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(amount);

function renderProducts(){
  const search = ($("#search-input").value || "").trim().toLowerCase();
  let shown = products.filter(p => (activeFilter==="All" || p.category===activeFilter) && (p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)));
  const sort = $("#sort-select").value;
  if(sort==="low") shown.sort((a,b)=>a.price-b.price);
  if(sort==="high") shown.sort((a,b)=>b.price-a.price);
  $("#product-grid").innerHTML = shown.length ? shown.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="add-button" data-add="${p.id}">Add to bag +</button></div>
      <div class="product-info"><h3>${p.name}</h3><div class="product-meta"><span>${p.category}</span><span class="product-price">${money(p.price)}</span></div></div>
    </article>`).join("") : `<p>No matching pieces found. Try another search.</p>`;
}
function saveCart(){localStorage.setItem("lavenderLaneCart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();showToast("Added to your bag");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  $("#cart-count").textContent=count;$("#drawer-count").textContent=`(${count})`;$("#cart-subtotal").textContent=money(subtotal);
  $("#checkout-open").disabled=count===0;
  $("#cart-items").innerHTML=count?cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`}).join(""):`<p class="empty-cart">Your bag is waiting for something lovely.</p>`;
}
function openCart(){ $("#cart-drawer").classList.add("open");$("#cart-drawer").setAttribute("aria-hidden","false");$("#drawer-backdrop").classList.remove("hidden");}
function closeCart(){ $("#cart-drawer").classList.remove("open");$("#cart-drawer").setAttribute("aria-hidden","true");$("#drawer-backdrop").classList.add("hidden");}
let toastTimer;
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}

$("#product-grid").addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add));});
$("#cart-items").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]");const remove=e.target.closest("[data-remove]");if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart();}});
$("#filters").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;activeFilter=btn.dataset.filter;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===btn));renderProducts();});
document.querySelectorAll("[data-category-link]").forEach(link=>link.addEventListener("click",()=>{activeFilter=link.dataset.categoryLink;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts();}));
$("#search-input").addEventListener("input",renderProducts);$("#sort-select").addEventListener("change",renderProducts);
$("#search-toggle").addEventListener("click",()=>{$("#search-bar").classList.toggle("hidden");if(!$("#search-bar").classList.contains("hidden"))$("#search-input").focus();});
$("#menu-toggle").addEventListener("click",()=>$("#mobile-nav").classList.toggle("hidden"));
$("#mobile-nav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#mobile-nav").classList.add("hidden");});
$("#cart-open").addEventListener("click",openCart);$("#cart-close").addEventListener("click",closeCart);$("#drawer-backdrop").addEventListener("click",closeCart);
$("#checkout-open").addEventListener("click",()=>{closeCart();$("#checkout-dialog").showModal();});
$("#checkout-close").addEventListener("click",()=>$("#checkout-dialog").close());
$("#checkout-form").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} × ${item.qty} — ${money(p.price*item.qty)}`;}).join("\n");
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  $("#order-preview").textContent=`ORDER PREVIEW — NOT SUBMITTED\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\nDestination: ${data.get("destination")}\nAddress: ${data.get("address")}\n\n${lines}\n\nSubtotal: ${money(total)}\n\nThis is a front-end demonstration only. No order has been sent, no payment has been taken, and no store has received these details.`;
  $("#order-preview").classList.remove("hidden");
});
$("#newsletter-form").addEventListener("submit",e=>{e.preventDefault();$("#newsletter-message").textContent="Thank you! This preview form is not connected to an email list yet.";});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();