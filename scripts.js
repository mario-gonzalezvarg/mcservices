// scripts.js
"use strict";

const SiteApp = (() => {
  const BREAKPOINT = {
    md: window.matchMedia("(max-width: 980px)"),
    sm: window.matchMedia("(max-width: 560px)"),
  };

  const CSS_VAR = Object.freeze({
    bgImage: "--bg-image",
    bgOverlay: "--bg-overlay",
    gridCol: "--col",
    gridRow: "--row",
  });

  const OVERLAY_PRESET = Object.freeze({
    soft: "linear-gradient(180deg, rgba(3, 4, 3, 0.08), rgba(3, 4, 3, 0.35))",
    strong: "linear-gradient(180deg, rgba(3, 4, 3, 0.18), rgba(3, 4, 3, 0.42))",
  });

  const APP_CONFIG = {
    text: {
      brand: {name: "MaGa Cleaning Services"},
      nav: { home: "Home", services: "Services", contact: "Contact", signup: "Sign Up" },
      hero: {
        title: "Cleaning Your Worries Away",
        subtitle: "A clean space, is a clean mind.",
        ctaPrimary: "About",
        ctaSecondary: "Services",
        scrollHint: "Contact",
      },
      impact: {
        title: "A Real impact on Environment",
        lead:
          "A purchase can be mapped to measurable outcomes by tracking trees planted, materials saved, and emissions reduced.",
        body:
          "Transparent reporting links each product to a supply chain footprint, then aggregates the results into community-level impact.",
      },
      products: {
        title: "Our Company",
        lead: "Curated, low-maintenance plants sized for desks, shelves, and living rooms.",
      },
      community: {
        title: "Join Our Community",
        lead:
          "Community programs translate individual purchases into shared environmental outcomes through local planting and education.",
        newsletter: { placeholder: "Enter your email" },
      },
      footer: { backToTop: "Back to top" },
    },

    assets: {
      brand: {
        logo: {src: "assets/logo.png", alt: "MaGa Cleaning Services"},
      },
      hero: {
        background: { src: "assets/Rainer.jpg" },
        main: {
          src: "assets/touch.png",
          alt: "Olive-gloved hand reaching toward an industrial vacuum nozzle on an off-white background",
        },
        leaf: { src: "assets/hero-leaf.jpg", alt: "Close-up texture of green leaves" },
        forest: { src: "assets/hero-forest.jpg", alt: "Forest greenery background" },
      },
      impact: {
        forest: { src: "assets/spaceNeedle.jpg" },
        leaf: { src: "assets/impact-leaf.jpg" },
      },
      community: {
        background: { src: "assets/community-bg.jpg" },
        hands: { src: "assets/community-hands.jpg", alt: "Hands gathered in a circle" },
        meeting: { src: "assets/community-meeting.jpg", alt: "People collaborating at a table" },
        trail: { src: "assets/community-trail.jpg", alt: "Forest trail with sunlight" },
      },
      products: {
        plant1: { src: "assets/plant-1.jpg", alt: "Arborvite plant" },
        plant2: { src: "assets/plant-2.jpg", alt: "Arborvite tall plant" },
        plant3: { src: "assets/plant-3.jpg", alt: "Arborvite compact plant" },
        plant4: { src: "assets/plant-4.jpg", alt: "Arborvite statement plant" },
      },
    },

    partnerRows: {
      default: ["WOODCHUCK | USA", "10", "TREE TRIBE", "trvst"],
    },

    tileGrids: {
      hero: {
        // tiles: [
        //   { type: "kicker", text: "Our top picks", place: { base: { col: "1 / 3", row: "1 / 2" } } },
        //   { type: "image", assetPath: "assets.hero.main", place: { base: { col: "3 / 7", row: "1 / 4" } } },
        //   {
        //     type: "text",
        //     text: "In publishing and graphic design, placeholder copy can be used to preview layout and rhythm.",
        //     place: { base: { col: "1 / 3", row: "2 / 4" } },
        //   },
        //   {
        //     type: "text",
        //     text: "Sustainable sourcing focuses on traceability, lower waste, and durable materials.",
        //     place: { base: { col: "1 / 4", row: "4 / 6" } },
        //   },
        //   { type: "image", assetPath: "assets.hero.leaf", place: { base: { col: "4 / 6", row: "4 / 6" } } },
        //   { type: "image", assetPath: "assets.hero.forest", place: { base: { col: "6 / 7", row: "4 / 6" } } },
        // ],
      },

      community: {
        tiles: [
          { type: "image", assetPath: "assets.community.hands", place: { base: { col: "1 / 3", row: "1 / 3" } } },
          {
            type: "text",
            text: "Community work runs continuously to support restoration projects and measurable long-term impact.",
            place: { base: { col: "3 / 5", row: "1 / 3" } },
          },
          {
            type: "image",
            assetPath: "assets.community.meeting",
            place: { base: { col: "5 / 7", row: "1 / 4" } },
          },
          { type: "kicker", text: "Get updates from our newsletter", place: { base: { col: "1 / 4", row: "3 / 5" } } },
          { type: "image", assetPath: "assets.community.trail", place: { base: { col: "4 / 7", row: "4 / 6" } } },
        ],
      },
    },

    metricGrids: {
      impact: [
        { type: "metric", variant: "dark", label: "Climate Impact", value: "60%" },
        { type: "metric", variant: "light", label: "Trees Saved", value: "1.5M" },
        { type: "image", bgAssetPath: "assets.impact.forest", overlay: "strong" },
        { type: "image", bgAssetPath: "assets.impact.leaf", overlay: "soft" },
      ],
    },

    productGrids: {
      catalog: [
        { name: "Arborvite", price: 75, assetPath: "assets.products.plant1" },
        { name: "Arborvite", price: 55, assetPath: "assets.products.plant2" },
        { name: "Arborvite", price: 20, assetPath: "assets.products.plant3" },
        { name: "Arborvite", price: 82, assetPath: "assets.products.plant4" },
        { name: "Arborvite", price: null, assetPath: null, disabled: true },
      ],
    },
  };

  function query(selector, root = document) {
    return root.querySelector(selector);
  }

  function queryAll(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function getValueByPath(root, path) {
    if (!path) return null;
    const parts = String(path).split(".");
    let cur = root;
    for (const p of parts) {
      if (cur == null || typeof cur !== "object" || !(p in cur)) return null;
      cur = cur[p];
    }
    return cur;
  }

  function getRefByPath(root, path) {
    if (!path) return null;
    const parts = String(path).split(".");
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (cur == null || typeof cur !== "object" || !(p in cur)) return null;
      cur = cur[p];
    }
    const key = parts[parts.length - 1];
    if (cur == null || typeof cur !== "object" || !(key in cur)) return null;
    return { obj: cur, key, value: cur[key] };
  }

  function createEl(tag, { className, text, attrs } = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null) continue;
        node.setAttribute(k, String(v));
      }
    }
    for (const child of children) node.appendChild(child);
    return node;
  }

  function updateYear() {
    const el = query("#year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function applyTextBindings() {
    queryAll("[data-text]").forEach((node) => {
      const path = node.getAttribute("data-text");
      const value = getValueByPath(APP_CONFIG, path);
      if (value == null) return;
      node.textContent = String(value);
    });
  }

  function applyAttributeBindings() {
    queryAll("[data-attr]").forEach((node) => {
      const spec = node.getAttribute("data-attr");
      if (!spec) return;
      const idx = spec.indexOf(":");
      if (idx <= 0) return;

      const attrName = spec.slice(0, idx).trim();
      const path = spec.slice(idx + 1).trim();
      const value = getValueByPath(APP_CONFIG, path);
      if (value == null) return;

      node.setAttribute(attrName, String(value));
    });
  }

  function resolveAsset(assetPath) {
    const asset = getValueByPath(APP_CONFIG, assetPath);
    if (!asset || typeof asset !== "object" || !asset.src) return null;
    return asset;
  }

  function applyBackgroundBindings() {
    queryAll("[data-bg]").forEach((node) => {
      const assetPath = node.getAttribute("data-bg");
      const asset = resolveAsset(assetPath);
      if (!asset) return;
      node.style.setProperty(CSS_VAR.bgImage, `url("${asset.src}")`);
    });
  }

  function applyImageBindings(root = document) {
    queryAll("[data-img]", root).forEach((img) => {
      const assetPath = img.getAttribute("data-img");
      const asset = resolveAsset(assetPath);
      if (!asset) return;

      img.src = asset.src;
      if (asset.alt != null) img.alt = asset.alt;
      img.loading ||= "lazy";
      img.decoding ||= "async";
    });
  }

  function applyOverlayBindings(root = document) {
    queryAll("[data-overlay]", root).forEach((node) => {
      const key = node.getAttribute("data-overlay");
      const overlay = key ? OVERLAY_PRESET[key] : null;
      if (!overlay) return;
      node.style.setProperty(CSS_VAR.bgOverlay, overlay);
    });
  }

  function applyGridPlacement(root = document) {
    const isSm = BREAKPOINT.sm.matches;
    const isMd = BREAKPOINT.md.matches;

    queryAll("[data-col][data-row]", root).forEach((node) => {
      const col =
        (isSm && node.getAttribute("data-col-sm")) ||
        (isMd && node.getAttribute("data-col-md")) ||
        node.getAttribute("data-col");

      const row =
        (isSm && node.getAttribute("data-row-sm")) ||
        (isMd && node.getAttribute("data-row-md")) ||
        node.getAttribute("data-row");

      if (col) node.style.setProperty(CSS_VAR.gridCol, col);
      if (row) node.style.setProperty(CSS_VAR.gridRow, row);
    });
  }

  function renderPartnerRows() {
    queryAll("[data-partners]").forEach((row) => {
      const key = row.getAttribute("data-partners") || "default";
      const items = APP_CONFIG.partnerRows[key];
      if (!Array.isArray(items)) return;

      const frag = document.createDocumentFragment();
      for (const label of items) {
        frag.appendChild(createEl("span", { className: "c-partner", text: label }));
      }
      row.replaceChildren(frag);
    });
  }

  function renderTileGrids() {
    queryAll("[data-tile-grid]").forEach((gridNode) => {
      const key = gridNode.getAttribute("data-tile-grid");
      const grid = key ? APP_CONFIG.tileGrids[key] : null;
      if (!grid || !Array.isArray(grid.tiles)) return;

      const frag = document.createDocumentFragment();

      for (const tile of grid.tiles) {
        const place = tile.place?.base;
        const attrs = place ? { "data-col": place.col, "data-row": place.row } : {};

        let node;
        if (tile.type === "image") {
          const img = createEl("img", { attrs: { "data-img": tile.assetPath } });
          node = createEl("article", { className: "c-tile c-tile--img", attrs }, [img]);
        } else if (tile.type === "kicker") {
          const p = createEl("p", { className: "c-tile__kicker", text: tile.text });
          node = createEl("article", { className: "c-tile c-tile--glass", attrs }, [p]);
        } else {
          const p = createEl("p", { className: "c-tile__text", text: tile.text });
          node = createEl("article", { className: "c-tile c-tile--glass", attrs }, [p]);
        }

        frag.appendChild(node);
      }

      gridNode.replaceChildren(frag);
      applyImageBindings(gridNode);
      applyGridPlacement(gridNode);
    });
  }

  function renderMetricGrids() {
    queryAll("[data-metric-grid]").forEach((gridNode) => {
      const key = gridNode.getAttribute("data-metric-grid");
      const items = key ? APP_CONFIG.metricGrids[key] : null;
      if (!Array.isArray(items)) return;

      const frag = document.createDocumentFragment();

      for (const item of items) {
        if (item.type === "metric") {
          frag.appendChild(
            createEl("div", { className: `c-stat c-stat--${item.variant}` }, [
              createEl("div", { className: "c-stat__label", text: item.label }),
              createEl("div", { className: "c-stat__value", text: item.value }),
            ])
          );
          continue;
        }

        frag.appendChild(
          createEl("div", {
            className: "c-stat c-stat--img u-bg",
            attrs: { "data-bg": item.bgAssetPath, "data-overlay": item.overlay },
          })
        );
      }

      gridNode.replaceChildren(frag);
      applyBackgroundBindings();
      applyOverlayBindings(gridNode);
    });
  }

  function renderProductGrids() {
    queryAll("[data-product-grid]").forEach((gridNode) => {
      const key = gridNode.getAttribute("data-product-grid");
      const items = key ? APP_CONFIG.productGrids[key] : null;
      if (!Array.isArray(items)) return;

      const frag = document.createDocumentFragment();

      for (const p of items) {
        const isDisabled = !!p.disabled;
        const cardClass = `c-product${isDisabled ? " c-product--muted" : ""}`;

        const media = createEl("div", { className: "c-product__media" });
        if (p.assetPath) media.appendChild(createEl("img", { attrs: { "data-img": p.assetPath } }));

        const meta = createEl("div", { className: "c-product__meta" }, [
          createEl("div", { className: "c-product__name", text: p.name }),
          createEl("div", { className: "c-product__price", text: p.price == null ? "$—" : `$${p.price}` }),
        ]);

        const cta = isDisabled
          ? createEl("span", {
              className: "c-btn c-btn--soft c-product__cta is-disabled",
              text: "Buy Now",
              attrs: { "aria-disabled": "true" },
            })
          : createEl("a", { className: "c-btn c-btn--soft c-product__cta", text: "Buy Now", attrs: { href: "#signup" } });

        frag.appendChild(createEl("article", { className: cardClass, attrs: { role: "listitem" } }, [media, meta, cta]));
      }

      gridNode.replaceChildren(frag);
      applyImageBindings(gridNode);
    });
  }

  function setupActiveNav() {
    const links = queryAll(".c-nav__link[href^='#']");
    if (links.length === 0) return;

    const sections = links.map((a) => query(a.getAttribute("href"))).filter(Boolean);

    const setActive = (hash) => {
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === hash));
    };

    if (location.hash) setActive(location.hash);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.02 }
    );

    sections.forEach((s) => obs.observe(s));
  }

  function setupNewsletter() {
    const form = query(".c-newsletter");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const input = form.querySelector("input[type='email']");
      const btn = form.querySelector("button");
      if (!input || !btn) return;

      if (!input.checkValidity()) {
        form.classList.add("is-error");
        input.focus();
        window.setTimeout(() => form.classList.remove("is-error"), 900);
        return;
      }

      const prev = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "✓";
      input.value = "";

      window.setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = prev;
      }, 1200);
    });
  }

  function render() {
    applyTextBindings();
    applyAttributeBindings();
    updateYear();

    renderPartnerRows();
    renderTileGrids();
    renderMetricGrids();
    renderProductGrids();

    applyBackgroundBindings();
    applyOverlayBindings(document);
    applyImageBindings(document);
    applyGridPlacement(document);
  }

  function init() {
    render();
    setupActiveNav();
    setupNewsletter();

    const onBpChange = () => applyGridPlacement(document);
    BREAKPOINT.md.addEventListener("change", onBpChange);
    BREAKPOINT.sm.addEventListener("change", onBpChange);
  }

  function setAsset(assetPath, { src, alt } = {}) {
    const ref = getRefByPath(APP_CONFIG, assetPath);
    if (!ref || ref.value == null || typeof ref.value !== "object") return false;
    if (src) ref.value.src = src;
    if (alt !== undefined) ref.value.alt = alt;
    render();
    return true;
  }

  function bindAssetPicker({ input, assetPath, alt } = {}) {
    const inputEl = typeof input === "string" ? query(input) : input;
    if (!inputEl || !assetPath) return () => {};

    let lastUrl = null;

    const onChange = () => {
      const file = inputEl.files && inputEl.files[0];
      if (!file) return;

      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(file);

      setAsset(assetPath, { src: lastUrl, alt: alt ?? file.name ?? "" });
    };

    inputEl.addEventListener("change", onChange);

    return () => {
      inputEl.removeEventListener("change", onChange);
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = null;
    };
  }

  return Object.freeze({
    init,
    render,
    assets: Object.freeze({ set: setAsset, bindPicker: bindAssetPicker }),
    config: APP_CONFIG,
  });
})();

document.addEventListener("DOMContentLoaded", () => SiteApp.init());
window.SiteApp = SiteApp;
