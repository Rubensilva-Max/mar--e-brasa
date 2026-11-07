const PHONE = "5585991359742";
const products = [
 {id:1,name:"Salmão na brasa",category:"Peixes",price:58.90,tag:"MAIS PEDIDO",desc:"Salmão grelhado, crosta delicada de ervas e legumes da estação.",img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85"},
 {id:2,name:"Camarões dourados",category:"Frutos do mar",price:49.90,tag:"DA CASA",desc:"Camarões salteados na manteiga de alho, ervas frescas e toque cítrico.",img:"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85"},
 {id:3,name:"Salada mediterrânea",category:"Saladas",price:32.90,tag:"LEVE & FRESCA",desc:"Folhas selecionadas, tomate, queijo, castanhas e molho da casa.",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"},
 {id:4,name:"Polvo na manteiga",category:"Frutos do mar",price:62.90,tag:"ESPECIAL",desc:"Polvo macio na manteiga de ervas, batatas rústicas e páprica.",img:"https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=85"},
 {id:5,name:"Bruschetta artesanal",category:"Entradas",price:24.90,tag:"PARA COMEÇAR",desc:"Pão de fermentação natural, tomate confitado e manjericão fresco.",img:"https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=85"},
 {id:6,name:"Peixe do dia",category:"Peixes",price:54.90,tag:"FRESCO DO DIA",desc:"Filé grelhado com purê cremoso e acompanhamento sazonal.",img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"}
];
let cart = [];
const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const productsEl=document.getElementById("products");
function renderProducts(category="Todos"){
 const list=category==="Todos"?products:products.filter(p=>p.category===category);
 productsEl.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div><div class="product-info"><div class="product-top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><p>${p.desc}</p><button class="add-button" data-add="${p.id}">ADICIONAR AO PEDIDO <b>＋</b></button></div></article>`).join("");
}
renderProducts();
document.getElementById("categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts(b.dataset.category)});
const panel=document.getElementById("cartPanel"),overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("show");document.body.style.overflow="hidden"}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show");document.body.style.overflow=""}
document.getElementById("openCart").onclick=openCart;document.getElementById("openCart2").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("backToMenu").onclick=()=>{closeCart();document.getElementById("cardapio").scrollIntoView({behavior:"smooth"})};
document.getElementById("menuToggle").onclick=()=>document.querySelector(".nav").classList.toggle("show");
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav").classList.remove("show")));
productsEl.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;addItem(Number(b.dataset.add));showToast()});
function addItem(id){const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});renderCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0),subtotal=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
 document.getElementById("cartCount").textContent=count;
 const empty=cart.length===0;
 document.getElementById("cartItems").innerHTML=empty?`<div class="empty-cart"><span>♧</span><h3>Sua sacola está vazia</h3><p>Escolha seus pratos favoritos no cardápio.</p><button class="primary-btn" id="backToMenu2">VER CARDÁPIO ↗</button></div>`:cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remover</button></div>`}).join("");
 document.getElementById("checkoutArea").hidden=empty;document.getElementById("subtotal").textContent=money(subtotal);
 const back=document.getElementById("backToMenu2");if(back)back.onclick=()=>{closeCart();document.getElementById("cardapio").scrollIntoView({behavior:"smooth"})};
}
document.getElementById("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q)changeQty(Number(q.dataset.qty),Number(q.dataset.delta));if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));renderCart()}});
document.querySelectorAll('input[name="fulfillment"]').forEach(r=>r.addEventListener("change",()=>{document.getElementById("addressField").hidden=document.querySelector('input[name="fulfillment"]:checked').value!=="Delivery"}));
document.querySelectorAll('input[name="payment"]').forEach(r=>r.addEventListener("change",()=>{document.getElementById("changeField").hidden=document.querySelector('input[name="payment"]:checked').value!=="Dinheiro"}));
function showToast(){const t=document.getElementById("toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1700)}
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length)return;
 const name=document.getElementById("customerName").value.trim(),fulfillment=document.querySelector('input[name="fulfillment"]:checked').value,payment=document.querySelector('input[name="payment"]:checked').value;
 const address=document.getElementById("customerAddress").value.trim(),notes=document.getElementById("orderNotes").value.trim(),change=document.getElementById("changeFor").value.trim();
 if(fulfillment==="Delivery"&&!address){alert("Informe o endereço para entrega.");document.getElementById("customerAddress").focus();return}
 const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `• ${x.qty}x ${p.name} — ${money(p.price*x.qty)}`}).join("\n");
 const subtotal=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
 let message=`Olá! Quero fazer um pedido no Maré & Brasa.\n\n${lines}\n\n*Subtotal: ${money(subtotal)}*\n*Nome:* ${name}\n*Recebimento:* ${fulfillment}`;
 if(fulfillment==="Delivery")message+=`\n*Endereço:* ${address}`;
 message+=`\n*Pagamento:* ${payment}`;if(payment==="Dinheiro"&&change)message+=`\n*Troco para:* ${change}`;if(notes)message+=`\n*Observações:* ${notes}`;
 message+="\n\nAguardo a confirmação. Obrigado!";
 window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
renderCart();