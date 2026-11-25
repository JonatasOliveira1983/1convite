import { J as attr, O as stringify, Q as escape_html, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';

function Breadcrumb($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { items = [] } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    if (items.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<nav class="breadcrumb svelte-mhuuw7"${attr("aria-label", t(lang(), "breadcrumb.aria"))}><ol class="breadcrumb-list svelte-mhuuw7"><li class="breadcrumb-item svelte-mhuuw7"><a${attr("href", `${stringify(base)}/`)} class="breadcrumb-link svelte-mhuuw7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-mhuuw7"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg> <span class="sr-only svelte-mhuuw7">${escape_html(t(lang(), "breadcrumb.home"))}</span></a></li> <!--[-->`);
      const each_array = ensure_array_like(items);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let item = each_array[i];
        $$renderer2.push(`<li class="breadcrumb-item svelte-mhuuw7"><svg class="breadcrumb-separator svelte-mhuuw7" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"></polyline></svg> `);
        if (item.href && i < items.length - 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", item.href)} class="breadcrumb-link svelte-mhuuw7">`);
          if (item.icon) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="breadcrumb-icon svelte-mhuuw7">${html(item.icon)}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> ${escape_html(item.label)}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="breadcrumb-current svelte-mhuuw7">`);
          if (item.icon) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="breadcrumb-icon svelte-mhuuw7">${html(item.icon)}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> ${escape_html(item.label)}</span>`);
        }
        $$renderer2.push(`<!--]--></li>`);
      }
      $$renderer2.push(`<!--]--></ol></nav>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { Breadcrumb as B };
//# sourceMappingURL=ToastContainer.svelte_svelte_type_style_lang-CZx3uIFq.js.map
