import { I as attr_class, L as store_get, Q as escape_html, J as attr, O as stringify, R as ensure_array_like, X as attr_style, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { A as AdRenderer } from './AdRenderer-Ccc4IUSO.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import './html-FW6Ia4bL.js';

function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function getPostImage(post) {
      if (post.cover_image) return post.cover_image;
      const match = post.content?.match(/<img[^>]+src="([^">]+)"/);
      if (match) return match[1];
      return null;
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
    $$renderer2.push(`<div${attr_class("error-page svelte-1j96wlh", void 0, {
      "has-recommendations": store_get($$store_subs ??= {}, "$page", page).status === 404
    })}><div class="error-container svelte-1j96wlh"><div class="error-content svelte-1j96wlh"><div class="error-icon svelte-1j96wlh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1j96wlh"><path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h1 class="error-code svelte-1j96wlh">${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <h2 class="error-title svelte-1j96wlh">`);
    if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(t(lang(), "error.not_found"))}`);
    } else if (store_get($$store_subs ??= {}, "$page", page).status === 500) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`${escape_html(t(lang(), "error.server"))}`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "error.generic"))}`);
    }
    $$renderer2.push(`<!--]--></h2> <p class="error-message svelte-1j96wlh">`);
    if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(t(lang(), "error.not_found_body"))}`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message || t(lang(), "error.generic_body"))}`);
    }
    $$renderer2.push(`<!--]--></p> <div class="error-actions svelte-1j96wlh"><a${attr("href", `${stringify(base)}/`)} class="btn btn-primary svelte-1j96wlh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1j96wlh"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg> ${escape_html(t(lang(), "common.back_home"))}</a> <button class="btn btn-secondary svelte-1j96wlh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1j96wlh"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12,19 5,12 12,5"></polyline></svg> ${escape_html(t(lang(), "common.back"))}</button></div></div> `);
    if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
      $$renderer2.push("<!--[0-->");
      if (data?.sidebarAds && data.sidebarAds.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="error-ad-wrapper svelte-1j96wlh">`);
        AdRenderer($$renderer2, { ads: data.sidebarAds, placement: "sidebar" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data?.popularPosts && data.popularPosts.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="suggested-posts-section svelte-1j96wlh"><h3 class="suggested-title svelte-1j96wlh">${escape_html(t(lang(), "error.recommended"))}</h3> <div class="posts-grid svelte-1j96wlh"><!--[-->`);
        const each_array = ensure_array_like(data.popularPosts.slice(0, 3));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let post = each_array[$$index];
          $$renderer2.push(`<a${attr("href", `${stringify(base)}/post/${stringify(post.slug)}`)} class="post-card svelte-1j96wlh">`);
          if (!hasNoImage(post)) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="post-card-image svelte-1j96wlh"><img${attr("src", optimizeImageUrl(getPostImage(post), 400))}${attr("alt", post.title)} loading="lazy" class="svelte-1j96wlh"/></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<div class="no-image-placeholder svelte-1j96wlh"${attr_style(`background: ${stringify(getPlaceholderBackground(post))}`)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon svelte-1j96wlh"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <div class="no-image-placeholder-title svelte-1j96wlh">${escape_html(post.title)}</div></div>`);
          }
          $$renderer2.push(`<!--]--> <div class="post-card-content svelte-1j96wlh"><h4 class="svelte-1j96wlh">${escape_html(post.title)}</h4> `);
          if (post.excerpt) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="svelte-1j96wlh">${escape_html(post.excerpt.slice(0, 80))}...</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></a>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _error as default };
//# sourceMappingURL=_error.svelte-D0kX9B76.js.map
