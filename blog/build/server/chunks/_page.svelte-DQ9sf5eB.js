import { G as head, Q as escape_html, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, m as memberErrorMessage } from './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { form } = $$props;
    let loading = false;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const errorMsg = derived(() => memberErrorMessage(lang(), form?.error));
    head("1x2alt2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "members.register_title"))} | ${escape_html(t(lang(), "members.area_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="register-container svelte-1x2alt2"><div class="register-card svelte-1x2alt2"><div class="card-header svelte-1x2alt2"><h1 class="svelte-1x2alt2">${escape_html(t(lang(), "members.register_title"))}</h1> <p class="subtitle svelte-1x2alt2">${escape_html(t(lang(), "members.register_subtitle"))}</p></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1x2alt2">${escape_html(errorMsg())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="register-form svelte-1x2alt2"><div class="form-group svelte-1x2alt2"><label for="email" class="svelte-1x2alt2">${escape_html(t(lang(), "common.email"))}</label> <input type="email" id="email" name="email" placeholder="exemplo@email.com" required=""${attr("disabled", loading, true)} class="svelte-1x2alt2"/></div> <div class="form-group svelte-1x2alt2"><label for="password" class="svelte-1x2alt2">${escape_html(t(lang(), "common.password"))}</label> <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" required=""${attr("disabled", loading, true)} class="svelte-1x2alt2"/></div> <div class="form-group svelte-1x2alt2"><label for="confirmPassword" class="svelte-1x2alt2">${escape_html(t(lang(), "members.confirm_password"))}</label> <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repita sua senha" required=""${attr("disabled", loading, true)} class="svelte-1x2alt2"/></div> <button type="submit" class="btn btn-primary btn-full svelte-1x2alt2"${attr("disabled", loading, true)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "members.sign_up_btn"))}`);
    }
    $$renderer2.push(`<!--]--></button></form> <div class="card-footer svelte-1x2alt2"><span>${escape_html(t(lang(), "members.has_account"))}</span> <a href="/members/login" class="link svelte-1x2alt2">${escape_html(t(lang(), "common.login"))}</a></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DQ9sf5eB.js.map
