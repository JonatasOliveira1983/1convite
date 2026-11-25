import { G as head, Q as escape_html, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { B as Breadcrumb } from './ToastContainer.svelte_svelte_type_style_lang-CZx3uIFq.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, a as formatDate } from './i18n-LdHmnyr8.js';
import './server-B3psWENk.js';
import './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

/* empty css                                                             */
/* empty css                                                       */
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || data?.settings?.site_language || "pt");
    head("yiqd0o", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "legal.cookies_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="cookies-page svelte-yiqd0o"><div class="container svelte-yiqd0o">`);
    Breadcrumb($$renderer2, { items: [{ label: t(lang(), "legal.cookies_crumb") }] });
    $$renderer2.push(`<!----> <article class="content svelte-yiqd0o"><h1 class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_title"))}</h1> <p class="svelte-yiqd0o"><strong>${escape_html(t(lang(), "common.last_updated"))}</strong> ${escape_html(formatDate(lang(), /* @__PURE__ */ new Date()))}</p> <h2 class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s1_t"))}</h2> <p class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s1_p"))}</p> <h2 class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s2_t"))}</h2> <p class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s2_p"))}</p> <h2 class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s3_t"))}</h2> <p class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s3_p"))}</p> <h2 class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s4_t"))}</h2> <p class="svelte-yiqd0o">${escape_html(t(lang(), "legal.cookies_page.s4_p"))}</p></article></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-tA7yw4-Z.js.map
