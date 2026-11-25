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
    head("7ke6fz", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "legal.privacy_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="privacy-page svelte-7ke6fz"><div class="container svelte-7ke6fz">`);
    Breadcrumb($$renderer2, { items: [{ label: t(lang(), "legal.privacy_crumb") }] });
    $$renderer2.push(`<!----> <article class="content svelte-7ke6fz"><h1 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy_title"))}</h1> <p class="svelte-7ke6fz"><strong>${escape_html(t(lang(), "common.last_updated"))}</strong> ${escape_html(formatDate(lang(), /* @__PURE__ */ new Date()))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s1_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s1_p"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_t"))}</h2> <h3 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_h1"))}</h3> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_i1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_i2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_i3"))}</li></ul> <h3 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_h2"))}</h3> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_n1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_n2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s2_n3"))}</li></ul> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_p"))}</p> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_i1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_i2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_i3"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s3_i4"))}</li></ul> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_p"))}</p> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_i1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_i2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_i3"))}</li></ul> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s4_note"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s5_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s5_p"))}</p> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s5_i1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s5_i2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s5_i3"))}</li></ul> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s6_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s6_p"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_p"))}</p> <ul class="svelte-7ke6fz"><li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_i1"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_i2"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_i3"))}</li> <li class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s7_i4"))}</li></ul> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s8_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s8_p"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s9_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s9_p"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s10_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s10_p"))}</p> <h2 class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s11_t"))}</h2> <p class="svelte-7ke6fz">${escape_html(t(lang(), "legal.privacy.s11_p"))}</p></article></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C_nY3pF1.js.map
