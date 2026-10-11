/* ============================================================================
   CART.JS — Pharmacie Al Masjid
   ----------------------------------------------------------------------------
   - Product catalogue (edit PRODUCTS to update the shop)
   - localStorage cart that persists across every page
   - Auto-injected cart drawer + toast (single source of truth)
   - "Order via WhatsApp" builds a formatted message and opens wa.me
   ============================================================================ */

/* ------------------------------------------------------------- CONFIG */
const SHOP_CONFIG = {
  whatsapp: "212665146419",           // 06 65 14 64 19 in international format
  currency: "DH",
  storageKey: "almajid_cart_v1"
};

/* --------------------------------------------------------- PRODUCT DATA
   category: skin | baby | beauty | mom  |  tag + tagType optional
   Replace image URLs with your own photos any time.                     */
window.PRODUCTS = [
  { id: "sk1", name: "Sérum Vitamine C Éclat", price: 189, category: "skin", tag: "Bestseller", tagType: "green", rating: 4.8,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", emoji: "🧴",
    desc: "Éclaircit, unifie et booste l'éclat du teint." },
  { id: "sk2", name: "Crème Hydratante SPF 50", price: 145, category: "skin", tag: "Protection", tagType: "gold", rating: 4.7,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", emoji: "☀️",
    desc: "Hydratation longue durée avec protection solaire." },
  { id: "sk3", name: "Nettoyant Doux Moussant", price: 89, category: "skin", tag: null, tagType: null, rating: 4.6,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80", emoji: "🫧",
    desc: "Purifie sans agresser, idéal peaux sensibles." },
  { id: "sk4", name: "Masque Argile Purifiant", price: 79, category: "skin", tag: null, tagType: null, rating: 4.5,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80", emoji: "🌿",
    desc: "Matifie et resserre les pores en 10 minutes." },

  { id: "ba1", name: "Lait de Toilette Bébé", price: 69, category: "baby", tag: "Doux", tagType: "gold", rating: 4.9,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80", emoji: "🍼",
    desc: "Formule hypoallergénique pour la peau délicate." },
  { id: "ba2", name: "Crème Change Protectrice", price: 75, category: "baby", tag: null, tagType: null, rating: 4.8,
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80", emoji: "👶",
    desc: "Apaise et protège contre les rougeurs." },
  { id: "ba3", name: "Shampooing Bébé Sans Larmes", price: 59, category: "baby", tag: null, tagType: null, rating: 4.7,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80", emoji: "🛁",
    desc: "Nettoie en douceur, ne pique pas les yeux." },

  { id: "be1", name: "Rouge à Lèvres Mat", price: 119, category: "beauty", tag: "Nouveau", tagType: null, rating: 4.6,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80", emoji: "💄",
    desc: "Tenue longue durée, fini velours intense." },
  { id: "be2", name: "Fond de Teint Fluide", price: 159, category: "beauty", tag: null, tagType: null, rating: 4.5,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80", emoji: "🎨",
    desc: "Couvrance modulable, effet peau nue." },
  { id: "be3", name: "Palette Yeux Nude", price: 199, category: "beauty", tag: "Coup de cœur", tagType: "gold", rating: 4.8,
    image: "https://images.unsplash.com/photo-1583241800698-9c2b2b1f0a02?auto=format&fit=crop&w=600&q=80", emoji: "✨",
    desc: "12 teintes pigmentées, mates et satinées." },
  { id: "be4", name: "Eau de Parfum Fleur d'Oranger", price: 249, category: "beauty", tag: null, tagType: null, rating: 4.7,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80", emoji: "🌸",
    desc: "Sillage floral frais et raffiné." },

  { id: "mo1", name: "Complément Prénatal Vitamines", price: 179, category: "mom", tag: "Conseillé", tagType: "gold", rating: 4.9,
    image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=600&q=80", emoji: "💊",
    desc: "Soutient maman et bébé avant et pendant." },
  { id: "mo2", name: "Thermomètre Digital Rapide", price: 99, category: "mom", tag: null, tagType: null, rating: 4.7,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80", emoji: "🌡️",
    desc: "Mesure fiable en 10 secondes." },
  { id: "mo3", name: "Sérum Physiologique Bébé", price: 45, category: "mom", tag: "Essentiel", tagType: "green", rating: 4.9,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", emoji: "💧",
    desc: "Indispensable pour le nez de bébé." },
  { id: "mo4", name: "Crème Spéciale Vergetures", price: 129, category: "mom", tag: null, tagType: null, rating: 4.6,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80", emoji: "🤰",
    desc: "Nourrit et améliore l'élasticité de la peau." }
];

/* --------------------------------------------------- CATEGORY META (UI) */
window.CATEGORIES = {
  skin:   { label: "Skincare" },
  baby:   { label: "Bébé" },
  beauty: { label: "Beauté" },
  mom:    { label: "Maman & Famille" }
};

/* =================================================================== CART */
const Cart = (() => {
  const { storageKey, currency } = SHOP_CONFIG;
  let items = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch (e) {}
  }
  function find(id) { return items.find(i => i.id === id); }
  function product(id) { return window.PRODUCTS.find(p => p.id === id); }
  function count() { return items.reduce((n, i) => n + i.qty, 0); }
  function total() { return items.reduce((sum, i) => sum + i.price * i.qty, 0); }

  function add(id, qty = 1) {
    const p = product(id);
    if (!p) return;
    const line = find(id);
    if (line) line.qty += qty;
    else items.push({ id, name: p.name, price: p.price, image: p.image, emoji: p.emoji, qty });
    save(); render(); bumpUI();
  }
  function setQty(id, qty) {
    const line = find(id);
    if (!line) return;
    if (qty <= 0) return remove(id);
    line.qty = qty; save(); render(); bumpUI();
  }
  function remove(id) {
    items = items.filter(i => i.id !== id); save(); render(); bumpUI();
  }

  /* ---- drawer rendering ---- */
  function render() {
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.textContent = n;
      el.classList.toggle("show", n > 0);
    });
    const list = document.getElementById("cartItems");
    const foot = document.getElementById("cartFoot");
    const badge = document.getElementById("cartHeadCount");
    if (badge) badge.textContent = `${n} article${n > 1 ? "s" : ""}`;
    if (!list) return;

    if (!items.length) {
      list.innerHTML = `<div class="cart-empty">
        <span class="em">🛒</span>
        <p>Votre panier est vide.</p>
        <a href="shop.html" class="btn btn--primary" data-cart-close>Découvrir la boutique</a>
      </div>`;
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "block";

    list.innerHTML = items.map(i => `
      <div class="cart-item">
        <div class="cart-item__img">
          ${i.image ? `<img src="${i.image}" alt="${i.name}" onerror="this.style.display='none'">` : (i.emoji || "💊")}
        </div>
        <div>
          <div class="cart-item__name">${i.name}</div>
          <div class="cart-item__price">${i.price} ${currency}</div>
          <div class="cart-item__ctl">
            <div class="qty">
              <button type="button" data-qty="-1" data-id="${i.id}" aria-label="Diminuer">−</button>
              <span>${i.qty}</span>
              <button type="button" data-qty="1" data-id="${i.id}" aria-label="Augmenter">+</button>
            </div>
            <button type="button" class="cart-item__remove" data-remove="${i.id}">Retirer</button>
          </div>
        </div>
        <div class="cart-item__total">${i.price * i.qty} ${currency}</div>
      </div>`).join("");

    const t = document.getElementById("cartTotalVal");
    if (t) t.textContent = `${total()} ${currency}`;
  }

  /* ---- micro interactions ---- */
  function bumpUI() {
    const btn = document.querySelector(".cart-btn");
    const badge = document.querySelector(".cart-count");
    if (btn) { btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump"); }
    if (badge && count() > 0) { badge.classList.remove("pulse"); void badge.offsetWidth; badge.classList.add("pulse"); }
  }

  /* ---- open / close ---- */
  function open() {
    document.getElementById("cartDrawer")?.classList.add("open");
    document.getElementById("cartOverlay")?.classList.add("show");
    document.body.classList.add("no-scroll");
    render();
  }
  function close() {
    document.getElementById("cartDrawer")?.classList.remove("open");
    document.getElementById("cartOverlay")?.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }

  /* ---- WhatsApp order ---- */
  function orderWhatsApp() {
    if (!items.length) { Toast("Votre panier est vide 🛒"); return; }
    let msg = "Bonjour Pharmacie Al Masjid, je souhaite commander :\n";
    items.forEach(i => { msg += `- ${i.name} (x${i.qty})\n`; });
    msg += `\nTotal : ${total()} ${currency}`;
    const url = `https://wa.me/${SHOP_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return { add, setQty, remove, open, close, render, orderWhatsApp, count, total };
})();

window.Cart = Cart;

/* =================================================================== TOAST */
function Toast(message, icon = "check") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const icons = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    cart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 7H6"/></svg>'
  };
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="ic">${icons[icon] || icons.check}</span><span>${message}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2600);
}
window.Toast = Toast;

/* ==================================================== INJECT DRAWER + WIRING */
document.addEventListener("DOMContentLoaded", () => {
  /* build the drawer once */
  if (!document.getElementById("cartDrawer")) {
    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cartOverlay";

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.id = "cartDrawer";
    drawer.setAttribute("aria-label", "Panier");
    drawer.innerHTML = `
      <div class="cart-head">
        <h3>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e23b31" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 7H6"/></svg>
          Mon panier
          <span class="count-pill" id="cartHeadCount">0 article</span>
        </h3>
        <button class="cart-close" id="cartClose" aria-label="Fermer le panier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="cart-body" id="cartItems"></div>
      <div class="cart-foot" id="cartFoot">
        <div class="cart-total"><span>Total à payer</span><b id="cartTotalVal">0 DH</b></div>
        <button class="btn btn--wa btn--block" id="orderWa">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.2-.7.1-.7.9-.9 1.1-.4.2-.7 0a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4A3.7 3.7 0 0 0 5 8.3a6.4 6.4 0 0 0 1.4 3.4 14.6 14.6 0 0 0 5.6 4.9c.8.3 1.4.5 1.8.6a4.5 4.5 0 0 0 2 .1 3.4 3.4 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.7-.4M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2"/></svg>
          Commander via WhatsApp
        </button>
        <button class="btn btn--ghost btn--block" id="continueShopping">Continuer mes achats</button>
        <p class="hint">Votre commande est envoyée directement au pharmacien.</p>
      </div>`;

    document.body.append(overlay, drawer);
  }

  /* ensure the cart trigger exists in the navbar */
  document.querySelectorAll("[data-cart-open]").forEach(btn =>
    btn.addEventListener("click", e => { e.preventDefault(); Cart.open(); })
  );

  /* drawer events (delegated) */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-qty],[data-remove],[data-add-to-cart],[data-cart-close]");

    if (e.target.closest("#cartOverlay,#cartClose,#continueShopping")) return Cart.close();
    if (e.target.closest("#orderWa")) return Cart.orderWhatsApp();
    if (!t) return;

    if (t.matches("[data-add-to-cart]")) {
      const id = t.getAttribute("data-add-to-cart");
      Cart.add(id);
      const p = window.PRODUCTS.find(x => x.id === id);
      Toast(`${p ? p.name : "Article"} ajouté au panier`, "cart");
      t.classList.add("added");
      setTimeout(() => t.classList.remove("added"), 900);
    }
    if (t.matches("[data-qty]")) {
      const id = t.getAttribute("data-id");
      const current = JSON.parse(localStorage.getItem(SHOP_CONFIG.storageKey) || "[]").find(i => i.id === id);
      Cart.setQty(id, (current ? current.qty : 0) + parseInt(t.getAttribute("data-qty"), 10));
    }
    if (t.matches("[data-remove]")) Cart.remove(t.getAttribute("data-remove"));
    if (t.matches("[data-cart-close]")) Cart.close();
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") Cart.close(); });

  Cart.render();
});
