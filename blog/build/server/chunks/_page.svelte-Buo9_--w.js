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
    head("1e0rsuc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "legal.terms_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="terms-page svelte-1e0rsuc"><div class="container svelte-1e0rsuc">`);
    Breadcrumb($$renderer2, { items: [{ label: t(lang(), "legal.terms_crumb") }] });
    $$renderer2.push(`<!----> <article class="content svelte-1e0rsuc"><h1 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms_title"))}</h1> <p class="svelte-1e0rsuc"><strong>${escape_html(t(lang(), "common.last_updated"))}</strong> ${escape_html(formatDate(lang(), /* @__PURE__ */ new Date()))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s1_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s1_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s2_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s2_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s3_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s3_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s4_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s4_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s5_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s5_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s6_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s6_p"))}</p> <h2 class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s7_t"))}</h2> <p class="svelte-1e0rsuc">${escape_html(t(lang(), "legal.terms.s7_p"))}</p></article></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Buo9_--w.js.map
