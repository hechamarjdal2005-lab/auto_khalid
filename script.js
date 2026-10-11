/* ============================================================================
   SCRIPT.JS — Pharmacie Al Masjid
   ----------------------------------------------------------------------------
   General interactions: navbar, mobile menu, scroll reveal, product rendering,
   shop filtering + search, page transitions, counters, contact form.
   (Cart logic lives in cart.js — loaded first.)
   ============================================================================ */

/* ------------------------------------------------------- PRODUCT CARD UI */
function productCard(p) {
  const cat = (window.CATEGORIES[p.category] || {}).label || "";
  const tag = p.tag
    ? `<span class="prod-tag ${p.tagType || ""}">${p.tag}</span>` : "";
  return `
    <article class="prod-card reveal" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
      <div class="prod-card__media">
        ${tag}
        <span class="fallback">${p.emoji || "💊"}</span>
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy"
              onerror="this.classList.add('hide')">` : ""}
      </div>
      <div class="prod-card__body">
        <span class="prod-card__cat">${cat}</span>
        <h3 class="prod-card__name">${p.name}</h3>
        <div class="prod-card__rating">
          <span class="stars">★★★★★</span> ${p.rating.toFixed(1)}
        </div>
        <div class="prod-card__foot">
          <div class="prod-card__price">${p.price} <small>DH</small></div>
          <button class="add-btn" data-add-to-cart="${p.id}" aria-label="Ajouter ${p.name} au panier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/>
              <path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L23 7H6"/>
            </svg>
          </button>
        </div>
      </div>
    </article>`;
}

function renderInto(selector, list) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = list.map(productCard).join("");
}

/* ------------------------------------------------------------- SHOP PAGE */
function initShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  let activeCat = "all";
  let query = "";

  function update() {
    let list = window.PRODUCTS;
    if (activeCat !== "all") list = list.filter(p => p.category === activeCat);
    if (query) {
      const q = query.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
    }
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state"><span class="em">🔍</span>Aucun produit ne correspond à votre recherche.</div>`;
    } else {
      grid.innerHTML = list.map(productCard).join("");
      observeReveals();
    }
  }

  function setChip(cat) {
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.toggle("active", c.dataset.filter === cat));
    activeCat = cat;
    update();
  }

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => setChip(chip.dataset.filter));
  });

  const search = document.getElementById("searchInput");
  if (search) search.addEventListener("input", e => { query = e.target.value; update(); });

  /* preselect from ?cat= (category cards / footer links) */
  const qcat = new URLSearchParams(location.search).get("cat");
  if (qcat && (qcat === "all" || window.CATEGORIES[qcat])) { setChip(qcat); }
  else update();
}

/* --------------------------------------------------------------- NAVBAR */
function initNav() {
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".hamburger");
  const menu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".nav-overlay");

  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    burger?.classList.remove("open");
    menu?.classList.remove("open");
    overlay?.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }
  burger?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    document.body.classList.toggle("no-scroll", open);
  });
  overlay?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* active link */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });
}

/* -------------------------------------------------------- SCROLL REVEAL */
let revealObserver;
function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.in-view), .rating-hero:not(.in-view), .stat-grid:not(.in-view)");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in-view")); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in-view"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  els.forEach(el => revealObserver.observe(el));
}

/* ---------------------------------------------------------- COUNTERS */
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.dec) ? parseInt(el.dataset.dec) : 0;
      let cur = 0;
      const step = target / 42;
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target.toFixed(dec); return; }
        el.textContent = cur.toFixed(dec);
        requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ---------------------------------------------------- TESTIMONIAL STARS */
function initStars() {
  document.querySelectorAll(".rating-hero").forEach(el => {
    const spans = el.querySelectorAll(".stars span");
    if (!spans.length) {
      el.querySelector(".stars").innerHTML = "★★★★★".split("").map(s => `<span>${s}</span>`).join("");
    }
  });
}

/* -------------------------------------------------------- PAGE TRANSITION */
function initPageTransition() {
  const layer = document.querySelector(".page-transition");
  if (!layer) return;
  requestAnimationFrame(() => { layer.style.transform = "scaleY(0)"; });
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http") ||
        href.startsWith("mailto") || href.startsWith("tel") ||
        href.startsWith("https") || a.target === "_blank" || a.hasAttribute("download")) return;
    e.preventDefault();
    layer.classList.add("cover");
    setTimeout(() => { window.location.href = href; }, 420);
  });
}

/* --------------------------------------------------------- CONTACT FORM */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.querySelector("[name=name]").value.trim();
    window.Toast(`Merci ${name || ""} ! Votre message a bien été envoyé.`, "check");
    form.reset();
  });
}

/* ------------------------------------------------------------- INIT ALL */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  renderInto("#featuredGrid", window.PRODUCTS.filter(p => p.tag).slice(0, 4));
  initShop();
  initCounters();
  initStars();
  initPageTransition();
  initContactForm();
  observeReveals();
  /* re-observe after images/content settle */
  window.addEventListener("load", observeReveals);
});
