import { G as head, X as attr_style, O as stringify, J as attr, Q as escape_html, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { A as AdRenderer } from './AdRenderer-Ccc4IUSO.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const duration = data.link.ad_duration_seconds;
    let secondsLeft = duration;
    let progress = derived(() => secondsLeft / duration * 100);
    head("70kbgx", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.link.meta_title || `${t(lang(), "shortlink.accessing")} | ${data.siteTitle}`)}</title>`);
      });
      if (data.link.meta_description) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="description"${attr("content", data.link.meta_description)} class="svelte-70kbgx"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (data.link.is_indexed === 1) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="robots" content="index, follow" class="svelte-70kbgx"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<meta name="robots" content="noindex, nofollow" class="svelte-70kbgx"/>`);
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`<div class="interstitial-page svelte-70kbgx"><div class="progress-bar-container svelte-70kbgx"><div class="progress-bar svelte-70kbgx"${attr_style(`width: ${stringify(progress())}%`)}></div></div> <header class="header svelte-70kbgx"><a href="/" class="brand svelte-70kbgx">`);
    if (data.siteLogo) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", data.siteLogo)}${attr("alt", data.siteTitle)} class="logo svelte-70kbgx"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="site-title svelte-70kbgx">${escape_html(data.siteTitle)}</span></a></header> <main class="main-content svelte-70kbgx"><div class="info-card svelte-70kbgx"><div class="status-header svelte-70kbgx"><div class="spinner svelte-70kbgx"></div> <h2 class="svelte-70kbgx">${escape_html(t(lang(), "shortlink.redirecting"))}</h2></div> <p class="description svelte-70kbgx">${escape_html(t(lang(), "shortlink.wait_body"))}</p> <div class="countdown-badge svelte-70kbgx">`);
    if (secondsLeft > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(t(lang(), "shortlink.redirect_in", { n: secondsLeft }))}`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "shortlink.redirect_now"))}`);
    }
    $$renderer2.push(`<!--]--></div> <div class="actions svelte-70kbgx"><button class="btn btn-primary btn-redirect svelte-70kbgx"${attr("disabled", true, true)}>`);
    if (secondsLeft > 0 && true) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(t(lang(), "shortlink.wait_n", { n: secondsLeft }))}`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "shortlink.go_destination"))}`);
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="ad-card-wrapper svelte-70kbgx">`);
    AdRenderer($$renderer2, { ads: [data.ad], placement: "interstitial" });
    $$renderer2.push(`<!----></div></main> <footer class="footer svelte-70kbgx"><p class="svelte-70kbgx">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} ${escape_html(data.siteTitle)}. ${escape_html(t(lang(), "common.all_rights"))}</p></footer></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte--rdeP7hF.js.map
