import { G as head, Q as escape_html, I as attr_class, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { form } = $$props;
    let waitSeconds = derived(() => form?.waitSeconds || 0);
    let remaining = derived(() => form?.remaining ?? void 0);
    head("18c6u1m", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.login.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="login-page svelte-18c6u1m"><main class="login-main svelte-18c6u1m"><div class="login-content svelte-18c6u1m"><div class="login-intro svelte-18c6u1m"><h1 class="svelte-18c6u1m">${escape_html(t(lang(), "admin.login.heading"))}</h1> <p class="svelte-18c6u1m">${escape_html(t(lang(), "admin.login.subtitle"))}</p></div> <div class="login-form-wrapper svelte-18c6u1m"><h2 class="form-title svelte-18c6u1m">${escape_html(t(lang(), "admin.login.form_title"))}</h2> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("message svelte-18c6u1m", void 0, {
        "message-error": waitSeconds() === 0,
        "message-warning": waitSeconds() > 0
      })}>${escape_html(form.error)} `);
      if (remaining() !== void 0 && waitSeconds() === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="remaining svelte-18c6u1m">${escape_html(t(lang(), "admin.ui.remaining", { n: remaining() }))}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/login"><div class="form-group"><label for="username" class="form-label">${escape_html(t(lang(), "admin.ui.username"))}</label> <input type="text" id="username" name="username" class="form-input login-input svelte-18c6u1m" required="" autocomplete="username"${attr("disabled", waitSeconds() > 0, true)}/></div> <div class="form-group"><label for="password" class="form-label">${escape_html(t(lang(), "admin.ui.password"))}</label> <input type="password" id="password" name="password" class="form-input login-input svelte-18c6u1m" required="" autocomplete="current-password"${attr("disabled", waitSeconds() > 0, true)}/></div> <button type="submit" class="btn btn-primary login-btn svelte-18c6u1m"${attr("disabled", waitSeconds() > 0, true)}>`);
    if (waitSeconds() > 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`${escape_html(t(lang(), "admin.ui.wait_s", { n: waitSeconds() }))}`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "admin.ui.login"))}`);
    }
    $$renderer2.push(`<!--]--></button></form></div></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Dn1XfdAU.js.map
