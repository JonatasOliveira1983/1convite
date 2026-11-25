import { Q as escape_html, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';

/* empty css                                               */
function NewsletterSignup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      title = "",
      description = "",
      placeholder = "",
      buttonText = ""
    } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const i18nTitle = derived(() => title || t(lang(), "newsletter.title"));
    const i18nDescription = derived(() => description || t(lang(), "newsletter.description"));
    const i18nPlaceholder = derived(() => placeholder || t(lang(), "newsletter.placeholder"));
    const i18nButton = derived(() => buttonText || t(lang(), "newsletter.button"));
    let email = "";
    let loading = false;
    $$renderer2.push(`<div class="newsletter-widget svelte-1kz8p5t">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<h3 class="newsletter-title svelte-1kz8p5t">${escape_html(i18nTitle())}</h3> <p class="newsletter-description svelte-1kz8p5t">${escape_html(i18nDescription())}</p> <form class="newsletter-form svelte-1kz8p5t"><div class="newsletter-input-wrapper"><input type="email"${attr("value", email)} class="newsletter-input svelte-1kz8p5t"${attr("placeholder", i18nPlaceholder())} required=""${attr("aria-label", t(lang(), "newsletter.email_aria"))}${attr("disabled", loading, true)}/></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="newsletter-btn svelte-1kz8p5t"${attr("disabled", loading, true)}>${escape_html(i18nButton())} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></button></form>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { NewsletterSignup as N };
//# sourceMappingURL=NewsletterSignup-DnH6c8tG.js.map
