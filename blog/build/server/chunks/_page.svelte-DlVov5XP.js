import { G as head, Q as escape_html, J as attr, I as attr_class, R as ensure_array_like, X as attr_style, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import { t, f as formatMoney } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => data.settings?.site_language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    let searchQuery = "";
    let selectedCategory = "all";
    function formatPrice(cents) {
      if (cents === 0) return t(lang(), "products.free");
      return formatMoney(lang(), cents, displayCurrency());
    }
    function getPlaceholderBackground(id) {
      const gradients = [
        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
        "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
      ];
      const hash = String(id).charCodeAt(0) || 0;
      return gradients[hash % gradients.length];
    }
    const categories = derived(() => (data.categories ?? []).filter((c) => c?.name));
    const filteredProducts = derived(() => data.products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all";
      return matchesSearch && matchesCategory;
    }));
    const siteTitle = derived(() => data.settings?.site_title || "Blog");
    function getProductSummary(description) {
      if (!description) return "";
      const cleanText = description.replace(/\s+/g, " ").trim();
      if (cleanText.length <= 130) return cleanText;
      return cleanText.substring(0, 130) + "...";
    }
    head("1dj9mz1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "products.title"))} | ${escape_html(siteTitle())}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", t(lang(), "products.meta_desc"))}/>`);
    });
    $$renderer2.push(`<div class="vitrine-container svelte-1dj9mz1"><div class="vitrine-header svelte-1dj9mz1"><h1 class="svelte-1dj9mz1">${escape_html(t(lang(), "products.title"))}</h1> <p class="svelte-1dj9mz1">${escape_html(t(lang(), "products.subtitle"))}</p> <div class="filter-bar svelte-1dj9mz1"><div class="search-wrapper svelte-1dj9mz1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1dj9mz1"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <input type="text"${attr("placeholder", t(lang(), "products.search_placeholder"))}${attr("value", searchQuery)} class="svelte-1dj9mz1"/></div></div> `);
    if (categories().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="category-pills svelte-1dj9mz1"><button${attr_class("pill-btn svelte-1dj9mz1", void 0, { "active": selectedCategory === "all" })}>${escape_html(t(lang(), "common.all"))}</button> <!--[-->`);
      const each_array = ensure_array_like(categories());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer2.push(`<button${attr_class("pill-btn svelte-1dj9mz1", void 0, { "active": selectedCategory === String(cat.id) })}>${escape_html(cat.name)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (filteredProducts().length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="products-grid svelte-1dj9mz1"><!--[-->`);
      const each_array_1 = ensure_array_like(filteredProducts());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<div class="product-card svelte-1dj9mz1"><div class="product-thumbnail svelte-1dj9mz1">`);
        if (product.category) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="category-tag svelte-1dj9mz1">${escape_html(product.category)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (product.image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(product.image_url, 400, 300))}${attr("alt", product.name)} class="svelte-1dj9mz1"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="thumbnail-placeholder svelte-1dj9mz1"${attr_style(`background: ${stringify(getPlaceholderBackground(product.id))}`)}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="product-info svelte-1dj9mz1"><h3 class="product-title svelte-1dj9mz1">${escape_html(product.name)}</h3> `);
        if (product.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="description-wrapper svelte-1dj9mz1"><p class="product-desc svelte-1dj9mz1">${escape_html(getProductSummary(product.description))}</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="product-footer svelte-1dj9mz1"><span class="product-price svelte-1dj9mz1">${escape_html(formatPrice(product.price_cents))}</span> <a${attr("href", `/product/${stringify(product.slug)}`)} class="btn btn-primary btn-view svelte-1dj9mz1"><span>${escape_html(t(lang(), "products.view_details"))}</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-state svelte-1dj9mz1"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1dj9mz1"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg> <h3 class="svelte-1dj9mz1">${escape_html(t(lang(), "products.empty_title"))}</h3> <p class="svelte-1dj9mz1">${escape_html(t(lang(), "products.empty_body"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DlVov5XP.js.map
