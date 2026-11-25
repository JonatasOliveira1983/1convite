import { G as head, Q as escape_html, J as attr, O as stringify, R as ensure_array_like, X as attr_style, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import './state.svelte-BCGVlO8d.js';
import { A as AdRenderer } from './AdRenderer-Ccc4IUSO.js';
import { P as Pagination } from './Pagination-DH52TBvr.js';
import './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let searchInput = "";
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
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
    head("160w91v", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(data.currentCategory?.name || "Categoria")}</title>`);
      });
    });
    $$renderer2.push(`<div class="page-wrapper container svelte-160w91v"><header class="category-header svelte-160w91v"><div class="header-content"><span class="category-badge svelte-160w91v">${escape_html(t(lang(), "category.explore"))}</span> <h1 class="category-title svelte-160w91v">${escape_html(data.currentCategory?.name || "Posts")}</h1> <div class="category-stats svelte-160w91v"><span class="stat-item">${escape_html(data.posts.length)} artigos encontrados</span></div></div></header> <div class="main-layout svelte-160w91v"><div class="content-area">`);
    if (data.posts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state"><div class="empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div> <h3>${escape_html(t(lang(), "category.empty_title"))}</h3> <p>Ainda não publicamos artigos nesta seção. Volte em breve!</p> <a${attr("href", `${stringify(base)}/`)} class="btn btn-primary">${escape_html(t(lang(), "category.view_all"))}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="posts-masonry svelte-160w91v"><!--[-->`);
      const each_array = ensure_array_like(data.posts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        $$renderer2.push(`<article class="post-card svelte-160w91v"><a${attr("href", `${stringify(base)}/post/${stringify(post.slug)}`)} class="post-image-link svelte-160w91v">`);
        if (hasNoImage(post)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="no-image-placeholder svelte-160w91v"${attr_style(`background: ${stringify(getPlaceholderBackground(post))}`)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon svelte-160w91v"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <div class="no-image-placeholder-title svelte-160w91v">${escape_html(post.title)}</div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(getPostImage(post), 800))}${attr("alt", post.title)}${attr_class("post-image svelte-160w91v", void 0, { "blurred": post.is_18_plus && true })} loading="lazy" width="800" height="450"/>`);
        }
        $$renderer2.push(`<!--]--></a> <div class="post-info svelte-160w91v"><div class="post-meta svelte-160w91v"><span class="post-date svelte-160w91v">${escape_html(formatDate(post.created_at))}</span> `);
        if (post.is_18_plus) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="age-badge-small">+18</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <h2 class="post-title svelte-160w91v"><a${attr("href", `${stringify(base)}/post/${stringify(post.slug)}`)} class="svelte-160w91v">${escape_html(post.title)}</a></h2></div></article>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    Pagination($$renderer2, { currentPage: data.currentPage, totalPages: data.totalPages });
    $$renderer2.push(`<!----></div> <aside class="sidebar svelte-160w91v"><div class="widget search-widget svelte-160w91v"><form class="search-form-premium svelte-160w91v"><div class="search-input-wrapper svelte-160w91v"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-160w91v"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <input type="text"${attr("value", searchInput)}${attr("placeholder", t(lang(), "category.search_label"))} class="search-input svelte-160w91v"/></div> <button type="submit" class="search-submit svelte-160w91v">${escape_html(t(lang(), "category.search_btn"))}</button></form></div> `);
    if (data.sidebarAds && data.sidebarAds.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="widget ad-widget svelte-160w91v">`);
      AdRenderer($$renderer2, { ads: data.sidebarAds, placement: "sidebar" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="widget categories-widget svelte-160w91v"><h2 class="widget-title svelte-160w91v">${escape_html(t(lang(), "common.categories"))}</h2> <ul class="categories-list svelte-160w91v"><li><a${attr("href", `${stringify(base)}/`)} class="category-link svelte-160w91v"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg> ${escape_html(t(lang(), "common.all_posts"))}</a></li> <!--[-->`);
    const each_array_1 = ensure_array_like(data.categories);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let cat = each_array_1[$$index_1];
      $$renderer2.push(`<li><a${attr("href", `${stringify(base)}/category/${stringify(cat.slug)}`)}${attr_class("category-link svelte-160w91v", void 0, { "active": cat.slug === data.categorySlug })}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg> ${escape_html(cat.name)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="widget popular-widget svelte-160w91v"><h2 class="widget-title svelte-160w91v">${escape_html(t(lang(), "common.popular_posts"))}</h2> <div class="popular-list svelte-160w91v"><!--[-->`);
    const each_array_2 = ensure_array_like(data.popularPosts.slice(0, 4));
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let pop = each_array_2[i];
      $$renderer2.push(`<a${attr("href", `${stringify(base)}/post/${stringify(pop.slug)}`)} class="popular-item svelte-160w91v"><span class="popular-number svelte-160w91v">${escape_html(i + 1)}</span> <div class="popular-thumb-wrapper svelte-160w91v">`);
      if (hasNoImage(pop)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="popular-placeholder svelte-160w91v"${attr_style(`background: ${stringify(getPlaceholderBackground(pop))}`)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="placeholder-small-icon svelte-160w91v"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<img${attr("src", optimizeImageUrl(getPostImage(pop), 200))}${attr("alt", pop.title)} class="popular-thumb svelte-160w91v" loading="lazy" width="80" height="60"/>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="popular-info svelte-160w91v"><h4 class="svelte-160w91v">${escape_html(pop.title)}</h4> <span class="popular-date svelte-160w91v">${escape_html(formatDate(pop.created_at))}</span></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div></aside></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BJzGolrY.js.map
