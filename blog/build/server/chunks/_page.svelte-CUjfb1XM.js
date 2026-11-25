import { G as head, J as attr, O as stringify, X as attr_style, Q as escape_html, I as attr_class, R as ensure_array_like, L as store_get, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { A as AdRenderer } from './AdRenderer-Ccc4IUSO.js';
import { N as NewsletterSignup } from './NewsletterSignup-DnH6c8tG.js';
import { t, f as formatMoney, a as formatDate } from './i18n-LdHmnyr8.js';
import { P as Pagination } from './Pagination-DH52TBvr.js';
import './html-FW6Ia4bL.js';

function Search($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { value = "", placeholder = "" } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const i18nPlaceholder = derived(() => placeholder || t(lang(), "search.placeholder"));
    let inputValue = value;
    $$renderer2.push(`<form class="search-container svelte-1002zyw"><div class="search-input-wrapper svelte-1002zyw"><svg class="search-icon svelte-1002zyw" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg> <input type="search"${attr("value", inputValue)}${attr("placeholder", i18nPlaceholder())} class="search-input svelte-1002zyw"${attr("aria-label", t(lang(), "search.aria"))}/> `);
    if (inputValue.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button" class="search-clear svelte-1002zyw"${attr("aria-label", t(lang(), "search.clear"))}><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button type="submit" class="search-submit svelte-1002zyw">${escape_html(t(lang(), "search.button"))}</button></form>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => data.language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || data.displayCurrency || "BRL");
    let searchInput = data.searchQuery || "";
    let currentProductIndex = 0;
    let feedLoadingMode = derived(() => data.settings?.feed_loading_mode === "infinite" ? "infinite" : "pagination");
    function getInitialPosts() {
      return data.currentPage === 1 && !data.searchQuery ? data.posts.slice(1) : data.posts;
    }
    let displayedPosts = getInitialPosts();
    let infinitePage = data.currentPage ?? 1;
    let infiniteTotalPages = data.totalPages ?? 1;
    function formatDate$1(dateString) {
      return formatDate(lang(), dateString, { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
    }
    function getPostImage(post) {
      if (post.cover_image) return post.cover_image;
      const match = post.content?.match(/<img[^>]+src="([^">]+)"/);
      if (match) return match[1];
      return `https://picsum.photos/seed/${post.id}/800/600`;
    }
    function hasNoImage(post) {
      if (post.cover_image && post.cover_image.trim().length > 0) return false;
      if (post.content && post.content.includes("<img")) {
        const match = post.content.match(/<img[^>]+src="([^">]+)"/);
        if (match && match[1]) return false;
      }
      return true;
    }
    function getPlaceholderBackground(post) {
      const gradients = [
        "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        // Blue
        "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        // Emerald
        "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
        // Yellow
        "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
        // Pink
        "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
        // Purple
        "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
        // Orange
        "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)",
        // Teal
        "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
        // Rose
        "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
        // Indigo
        "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
        // Amber
      ];
      const idStr = String(post.id || post.slug || "0");
      let hash = 0;
      for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % gradients.length;
      return gradients[index];
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | Home</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", data.settings?.site_description || "Blog oficial")}/>`);
    });
    $$renderer2.push(`<div class="page-wrapper container svelte-1uha8ag">`);
    if (data.currentPage === 1 && !data.searchQuery && data.posts.length > 0) {
      $$renderer2.push("<!--[0-->");
      const heroPost = data.posts[0];
      $$renderer2.push(`<section class="hero-section svelte-1uha8ag"><a${attr("href", `${stringify(base)}/post/${stringify(heroPost.slug)}`)} class="hero-link svelte-1uha8ag"><div class="hero-image-wrapper svelte-1uha8ag">`);
      if (hasNoImage(heroPost)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="no-image-placeholder svelte-1uha8ag"${attr_style(`background: ${stringify(getPlaceholderBackground(heroPost))}`)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon svelte-1uha8ag"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <div class="no-image-placeholder-title svelte-1uha8ag">${escape_html(heroPost.title)}</div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<img${attr("src", optimizeImageUrl(getPostImage(heroPost), 1200))}${attr("alt", heroPost.title)}${attr_class("hero-image svelte-1uha8ag", void 0, { "blurred": heroPost.is_18_plus && true })} loading="eager" fetchpriority="high" width="1200" height="630"/>`);
      }
      $$renderer2.push(`<!--]--> <button class="pinterest-save-btn svelte-1uha8ag"${attr("aria-label", t(lang(), "home.save_pinterest"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.605 0 12.017 0z"></path></svg> ${escape_html(t(lang(), "home.save"))}</button> <div class="hero-overlay svelte-1uha8ag"><span class="hero-category svelte-1uha8ag">${escape_html(heroPost.categories ? heroPost.categories.split(",")[0] : t(lang(), "common.featured"))}</span></div></div> <div class="hero-text"><h1 class="hero-title svelte-1uha8ag">${escape_html(heroPost.title)}</h1> `);
      if (heroPost.excerpt) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="hero-excerpt svelte-1uha8ag">${escape_html(heroPost.excerpt)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="hero-footer svelte-1uha8ag"><span class="hero-date svelte-1uha8ag">${escape_html(formatDate$1(heroPost.created_at))}</span> <span class="read-more svelte-1uha8ag">${escape_html(t(lang(), "home.read_article"))}</span></div></div></a></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.homeMiddleAds && data.homeMiddleAds.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="home-ad-wrapper svelte-1uha8ag">`);
      AdRenderer($$renderer2, { ads: data.homeMiddleAds, placement: "home_middle" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="main-layout svelte-1uha8ag"><main class="content-area svelte-1uha8ag">`);
    if (data.searchQuery) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="section-header"><h2 class="section-title">${escape_html(t(lang(), "home.results_for", { q: data.searchQuery }))}</h2></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.posts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-card svelte-1uha8ag"><div class="empty-content svelte-1uha8ag"><div class="empty-illustration svelte-1uha8ag"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path><path d="M11 8v6M8 11h6" opacity="0.5"></path></svg></div> <h3 class="svelte-1uha8ag">${escape_html(t(lang(), "home.empty_title"))}</h3> <p class="svelte-1uha8ag">${escape_html(data.searchQuery ? t(lang(), "home.empty_search") : t(lang(), "home.empty_default"))}</p> <a${attr("href", `${stringify(base)}/`)} class="btn btn-outline svelte-1uha8ag">${escape_html(t(lang(), "common.clear_search"))}</a></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="organic-feed svelte-1uha8ag"><!--[-->`);
      const each_array = ensure_array_like(displayedPosts);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let post = each_array[i];
        $$renderer2.push(`<article class="feed-item svelte-1uha8ag"><a${attr("href", `${stringify(base)}/post/${stringify(post.slug)}`)} class="feed-card svelte-1uha8ag"><div class="feed-image-wrapper svelte-1uha8ag">`);
        if (hasNoImage(post)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="no-image-placeholder svelte-1uha8ag"${attr_style(`background: ${stringify(getPlaceholderBackground(post))}`)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon svelte-1uha8ag"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <div class="no-image-placeholder-title svelte-1uha8ag">${escape_html(post.title)}</div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(getPostImage(post), 800))}${attr("alt", post.title)}${attr_class("feed-image svelte-1uha8ag", void 0, { "blurred": post.is_18_plus && true })} loading="lazy" width="800" height="450"/>`);
        }
        $$renderer2.push(`<!--]--> <button class="pinterest-save-btn svelte-1uha8ag"${attr("aria-label", t(lang(), "home.save_pinterest"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.605 0 12.017 0z"></path></svg> ${escape_html(t(lang(), "home.save"))}</button> <div class="feed-chips svelte-1uha8ag"><span class="feed-chip svelte-1uha8ag">${escape_html(post.categories ? post.categories.split(",")[0] : t(lang(), "common.post"))}</span> `);
        if (post.is_18_plus) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="feed-chip age-restricted svelte-1uha8ag">18+</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="feed-info svelte-1uha8ag">`);
        if (post.recommendationReason) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="recommendation-badge-wrapper svelte-1uha8ag"><span class="recommendation-badge svelte-1uha8ag">${escape_html(post.recommendationReason)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <h2 class="feed-title svelte-1uha8ag">${escape_html(post.title)}</h2> <div class="feed-meta svelte-1uha8ag"><span class="feed-date svelte-1uha8ag">${escape_html(formatDate$1(post.created_at))}</span></div></div></div></a></article>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (feedLoadingMode() === "infinite") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="infinite-footer svelte-1uha8ag"><div class="infinite-sentinel svelte-1uha8ag"></div> `);
        if (infinitePage >= infiniteTotalPages && displayedPosts.length > 0) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<div class="infinite-done svelte-1uha8ag">${escape_html(t(lang(), "home.end_of_page"))}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (feedLoadingMode() === "pagination") {
        $$renderer2.push("<!--[0-->");
        Pagination($$renderer2, {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          baseUrl: "/"
        });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main> <aside class="sidebar svelte-1uha8ag"><div class="widget search-widget svelte-1uha8ag">`);
    Search($$renderer2, {
      value: searchInput,
      placeholder: t(lang(), "home.search_placeholder")
    });
    $$renderer2.push(`<!----></div> <div class="widget categories-widget svelte-1uha8ag"><h2 class="widget-title svelte-1uha8ag">${escape_html(t(lang(), "common.categories"))}</h2> <ul class="categories-list svelte-1uha8ag"><li><a${attr("href", `${stringify(base)}/`)} class="category-link active svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg> ${escape_html(t(lang(), "common.all"))}</a></li> <!--[-->`);
    const each_array_1 = ensure_array_like(data.categories);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<li><a${attr("href", `${stringify(base)}/category/${stringify(cat.slug)}`)} class="category-link svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg> ${escape_html(cat.name)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> `);
    if (data.products && data.products.length > 0) {
      $$renderer2.push("<!--[0-->");
      const displayMode = data.settings?.sidebar_products_display_mode || "carousel";
      $$renderer2.push(`<div class="widget products-widget svelte-1uha8ag"><h2 class="widget-title svelte-1uha8ag">${escape_html(t(lang(), "home.digital_products"))}</h2> `);
      if (displayMode === "carousel") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="products-carousel svelte-1uha8ag"><div class="carousel-inner svelte-1uha8ag"><!--[-->`);
        const each_array_2 = ensure_array_like(data.products);
        for (let idx = 0, $$length = each_array_2.length; idx < $$length; idx++) {
          let product = each_array_2[idx];
          $$renderer2.push(`<div${attr_class("carousel-slide svelte-1uha8ag", void 0, { "active": currentProductIndex === idx })}><div class="product-sidebar-card svelte-1uha8ag">`);
          if (product.image_url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="product-sidebar-image-wrapper svelte-1uha8ag"><img${attr("src", product.image_url)}${attr("alt", product.name)} class="product-sidebar-image svelte-1uha8ag"/></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="product-sidebar-icon svelte-1uha8ag">`);
            if (product.file_url) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--> <h3 class="product-sidebar-name svelte-1uha8ag">${escape_html(product.name)}</h3> `);
          if (product.description) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="product-sidebar-desc svelte-1uha8ag">${escape_html(product.description)}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <div class="product-sidebar-footer svelte-1uha8ag"><span class="product-sidebar-price svelte-1uha8ag">${escape_html(product.price_cents === 0 ? t(lang(), "common.free") : formatMoney(lang(), product.price_cents, displayCurrency()))}</span> `);
          if (product.price_cents > 0 && !product.hasPurchased) {
            $$renderer2.push("<!--[0-->");
            if (data.settings?.enable_member_login !== "1") {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<button class="product-sidebar-btn btn btn-small btn-secondary svelte-1uha8ag" disabled="" style="opacity: 0.6; cursor: not-allowed;">${escape_html(t(lang(), "common.unavailable"))}</button>`);
            } else if (!data.user) {
              $$renderer2.push("<!--[1-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/members/login?redirectTo=${stringify(encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)} class="product-sidebar-btn btn btn-small btn-primary svelte-1uha8ag">${escape_html(t(lang(), "common.buy"))}</a>`);
            } else if (store_get($$store_subs ??= {}, "$page", page).data.paymentGateway === "stripe") {
              $$renderer2.push("<!--[2-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}`)} class="product-sidebar-btn btn btn-small btn-primary svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.buy"))}</a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<div class="product-sidebar-btn-group svelte-1uha8ag"><a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}?method=pix`)} class="product-sidebar-btn btn btn-small btn-primary btn-pix-small svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.pix"))}</a> <a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}?method=credit_card`)} class="product-sidebar-btn btn btn-small btn-secondary btn-card-small svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.card"))}</a></div>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            if (product.file_url) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/api/download/${stringify(product.id)}`)} rel="external" class="product-sidebar-btn btn btn-small btn-primary svelte-1uha8ag">${escape_html(t(lang(), "common.download"))}</a>`);
            } else if (product.external_link) {
              $$renderer2.push("<!--[1-->");
              $$renderer2.push(`<a${attr("href", product.external_link)} target="_blank" class="product-sidebar-btn btn btn-small btn-secondary svelte-1uha8ag">${escape_html(t(lang(), "common.access"))}</a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div></div></div>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (data.products.length > 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="carousel-nav svelte-1uha8ag"><button type="button" class="carousel-nav-btn prev svelte-1uha8ag"${attr("aria-label", t(lang(), "common.previous"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg></button> <span class="carousel-indicator svelte-1uha8ag">${escape_html(currentProductIndex + 1)} / ${escape_html(data.products.length)}</span> <button type="button" class="carousel-nav-btn next svelte-1uha8ag"${attr("aria-label", t(lang(), "common.next"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg></button></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="products-sidebar-list svelte-1uha8ag"><!--[-->`);
        const each_array_3 = ensure_array_like(data.products.slice(0, 5));
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let product = each_array_3[$$index_3];
          $$renderer2.push(`<div class="product-sidebar-list-item svelte-1uha8ag">`);
          if (product.image_url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<img${attr("src", product.image_url)}${attr("alt", product.name)} class="product-list-item-thumb svelte-1uha8ag"/>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="product-list-item-icon svelte-1uha8ag">`);
            if (product.file_url) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          }
          $$renderer2.push(`<!--]--> <div class="product-list-item-info svelte-1uha8ag"><span class="product-list-item-name svelte-1uha8ag"${attr("title", product.name)}>${escape_html(product.name)}</span> <div class="product-list-item-footer svelte-1uha8ag"><span class="product-list-item-price svelte-1uha8ag">${escape_html(product.price_cents === 0 ? t(lang(), "common.free") : formatMoney(lang(), product.price_cents, displayCurrency()))}</span> `);
          if (product.price_cents > 0 && !product.hasPurchased) {
            $$renderer2.push("<!--[0-->");
            if (data.settings?.enable_member_login !== "1") {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="product-list-item-link svelte-1uha8ag" style="opacity: 0.5; cursor: not-allowed; text-decoration: none;">${escape_html(t(lang(), "common.unavailable"))}</span>`);
            } else if (!data.user) {
              $$renderer2.push("<!--[1-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/members/login?redirectTo=${stringify(encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)} class="product-list-item-link svelte-1uha8ag">${escape_html(t(lang(), "common.buy"))}</a>`);
            } else if (store_get($$store_subs ??= {}, "$page", page).data.paymentGateway === "stripe") {
              $$renderer2.push("<!--[2-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}`)} class="product-list-item-link svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.buy"))}</a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<span class="product-list-item-btn-group svelte-1uha8ag"><a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}?method=pix`)} class="product-list-item-link text-pix svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.pix"))}</a> <span class="product-list-item-divider svelte-1uha8ag">/</span> <a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}?method=credit_card`)} class="product-list-item-link svelte-1uha8ag" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.card"))}</a></span>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            if (product.file_url) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<a${attr("href", `${stringify(base)}/api/download/${stringify(product.id)}`)} rel="external" class="product-list-item-link svelte-1uha8ag">${escape_html(t(lang(), "common.download"))}</a>`);
            } else if (product.external_link) {
              $$renderer2.push("<!--[1-->");
              $$renderer2.push(`<a${attr("href", product.external_link)} target="_blank" class="product-list-item-link svelte-1uha8ag">${escape_html(t(lang(), "common.access"))}</a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="widget newsletter-widget svelte-1uha8ag">`);
    NewsletterSignup($$renderer2, {});
    $$renderer2.push(`<!----></div> <div class="widget svelte-1uha8ag" style="padding: 0; overflow: hidden; border: 1px solid rgba(249, 115, 22, 0.35); border-radius: 16px; background: #121215;"><a href="https://1convite.com.br/#planos" style="display: block; text-decoration: none; color: #ffffff;"><img${attr("src", `${stringify(base)}/banner-1convite.jpg`)} alt="1Convite — O Reino no seu bolso" style="width: 100%; height: auto; display: block;"/> <div style="padding: 16px; text-align: center;"><strong style="display: block; font-size: 0.96rem; margin-bottom: 6px; color: #ffffff;">Bíblia em Áudio + Meditações + Convites</strong> <span style="display: inline-block; width: 100%; padding: 10px 14px; border-radius: 999px; background: #10b981; color: #052e16; font-weight: 800; font-size: 0.84rem; box-sizing: border-box;">Conhecer Planos 1Convite →</span></div></a></div> `);
    if (data.sidebarAds && data.sidebarAds.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="widget ad-widget svelte-1uha8ag">`);
      AdRenderer($$renderer2, { ads: data.sidebarAds, placement: "sidebar" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></aside></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CUjfb1XM.js.map
