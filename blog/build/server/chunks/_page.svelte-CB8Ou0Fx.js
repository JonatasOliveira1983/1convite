import { G as head, Q as escape_html, R as ensure_array_like, J as attr, O as stringify, X as attr_style, K as derived, L as store_get, I as attr_class, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { B as Breadcrumb } from './ToastContainer.svelte_svelte_type_style_lang-CZx3uIFq.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, a as formatDate } from './i18n-LdHmnyr8.js';
import './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

/* empty css                                                       */
/* empty css                                                  */
/* empty css                                                  */
/* empty css                                                             */
/* empty css                                                       */
function CategoryBadge($$renderer, $$props) {
  let {
    name = "",
    slug = "",
    href = "",
    size = "md",
    color = "",
    count
  } = $$props;
  const colors = [
    "#4a90d9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16"
  ];
  function getColor(name2) {
    if (color) return color;
    let hash = 0;
    for (let i = 0; i < name2.length; i++) {
      hash = name2.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
  const badgeColor = derived(() => getColor(name || slug));
  const computedHref = derived(() => href || `/category/${slug}`);
  $$renderer.push(`<a${attr("href", computedHref())}${attr_class(`category-badge size-${stringify(size)}`, "svelte-1xlnsor")}${attr_style(`--badge-color: ${stringify(badgeColor())}`)}><span class="badge-icon svelte-1xlnsor"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg></span> <span class="badge-text svelte-1xlnsor">${escape_html(name || slug)}</span> `);
  if (count !== void 0) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span class="badge-count svelte-1xlnsor">${escape_html(count)}</span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></a>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let categories = derived(() => data.categories || []);
    let totalPosts = derived(() => categories().reduce((acc, cat) => acc + (cat.post_count || 0), 0));
    const categoryColors = [
      "#4a90d9",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16"
    ];
    function getCategoryColor(name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return categoryColors[Math.abs(hash) % categoryColors.length];
    }
    head("13grsjl", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "categories.title"))}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", t(lang(), "categories.explore", { count: categories().length, posts: totalPosts() }))}/>`);
    });
    $$renderer2.push(`<div class="categories-page svelte-13grsjl"><div class="container svelte-13grsjl"><header class="page-header svelte-13grsjl">`);
    Breadcrumb($$renderer2, {
      items: [
        {
          label: t(lang(), "categories.title"),
          icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'
        }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="page-title svelte-13grsjl">${escape_html(t(lang(), "categories.title"))}</h1> <p class="page-subtitle svelte-13grsjl">${escape_html(t(lang(), "categories.explore", { count: categories().length, posts: totalPosts() }))}</p></header> `);
    if (categories().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-13grsjl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-13grsjl"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg> <h3 class="svelte-13grsjl">${escape_html(t(lang(), "categories.empty_title"))}</h3> <p class="svelte-13grsjl">${escape_html(t(lang(), "categories.empty_body"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="categories-grid svelte-13grsjl"><!--[-->`);
      const each_array = ensure_array_like(categories());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `${stringify(base)}/category/${stringify(category.slug)}`)} class="category-card svelte-13grsjl"><div class="category-icon svelte-13grsjl"${attr_style(`background: ${stringify(getCategoryColor(category.name))}15; color: ${stringify(getCategoryColor(category.name))}`)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-13grsjl"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg></div> <div class="category-content svelte-13grsjl"><h3 class="category-name svelte-13grsjl">${escape_html(category.name)}</h3> `);
        if (category.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="category-description svelte-13grsjl">${escape_html(category.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="category-meta svelte-13grsjl"><span class="post-count svelte-13grsjl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-13grsjl"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> ${escape_html(t(lang(), "categories.posts_count", { n: category.post_count || 0 }))}</span> `);
        if (category.updated_at) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="last-update">${escape_html(t(lang(), "categories.updated", { date: formatDate(lang(), category.updated_at) }))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="category-arrow svelte-13grsjl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-13grsjl"><polyline points="9,18 15,12 9,6"></polyline></svg></div></a>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (categories().length > 8) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="tags-cloud svelte-13grsjl"><h2 class="section-title svelte-13grsjl">Todas as Tags</h2> <div class="tags-list svelte-13grsjl"><!--[-->`);
        const each_array_1 = ensure_array_like(categories());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let category = each_array_1[$$index_1];
          CategoryBadge($$renderer2, {
            name: category.name,
            slug: category.slug,
            count: category.post_count,
            size: "md"
          });
        }
        $$renderer2.push(`<!--]--></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> le>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CB8Ou0Fx.js.map
