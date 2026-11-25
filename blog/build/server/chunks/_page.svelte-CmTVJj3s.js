import { G as head, Q as escape_html, I as attr_class, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, m as memberErrorMessage } from './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    let waitSeconds = derived(() => form?.waitSeconds || 0);
    let remaining = derived(() => form?.remaining ?? void 0);
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const errorMsg = derived(() => memberErrorMessage(lang(), form?.error));
    head("js6g66", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "common.login"))} | ${escape_html(t(lang(), "members.area_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="login-container svelte-js6g66"><div class="login-card svelte-js6g66"><div class="card-header svelte-js6g66"><h1 class="svelte-js6g66">${escape_html(t(lang(), "members.area_title"))}</h1> <p class="subtitle svelte-js6g66">`);
    if (data.enableOtpLogin) {
      $$renderer2.push("<!--[0-->");
      if (form?.otpSent) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`${escape_html(t(lang(), "members.otp_sent"))}`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`${escape_html(t(lang(), "members.otp_prompt"))}`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "members.login_subtitle"))}`);
    }
    $$renderer2.push(`<!--]--></p></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("alert error svelte-js6g66", void 0, { "warning": waitSeconds() > 0 })}>${escape_html(errorMsg())} `);
      if (remaining() !== void 0 && waitSeconds() === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="remaining svelte-js6g66">${escape_html(t(lang(), "members.remaining", { n: remaining() }))}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.enableOtpLogin) {
      $$renderer2.push("<!--[0-->");
      if (!form?.otpSent) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<form method="POST" action="?/sendOtp" class="login-form svelte-js6g66"><div class="form-group svelte-js6g66"><label for="email" class="svelte-js6g66">${escape_html(t(lang(), "common.email"))}</label> <input type="email" id="email" name="email" placeholder="exemplo@email.com" required=""${attr("disabled", waitSeconds() > 0, true)} class="svelte-js6g66"/></div> <button type="submit" class="btn btn-primary btn-full svelte-js6g66"${attr("disabled", waitSeconds() > 0, true)}>`);
        if (waitSeconds() > 0) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`${escape_html(t(lang(), "members.wait_s", { n: waitSeconds() }))}`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(t(lang(), "members.send_code"))}`);
        }
        $$renderer2.push(`<!--]--></button></form>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<form method="POST" action="?/verifyOtp" class="login-form svelte-js6g66"><input type="hidden" name="email"${attr("value", form.email)} class="svelte-js6g66"/> <div class="form-group svelte-js6g66"><label for="code" class="svelte-js6g66">${escape_html(t(lang(), "members.access_code"))}</label> <input type="text" id="code" name="code" placeholder="123456" inputmode="numeric" maxlength="10" required=""${attr("disabled", waitSeconds() > 0, true)} style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem; padding: 0.5rem;" class="svelte-js6g66"/></div> <button type="submit" class="btn btn-primary btn-full svelte-js6g66"${attr("disabled", waitSeconds() > 0, true)}>`);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(t(lang(), "members.confirm_enter"))}`);
        }
        $$renderer2.push(`<!--]--></button> <a href="/members/login" class="btn btn-secondary btn-full svelte-js6g66" style="text-align: center; border: 1px solid var(--border-color); margin-top: 0.5rem;">${escape_html(t(lang(), "common.back"))}</a></form>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form method="POST" action="?/login" class="login-form svelte-js6g66"><div class="form-group svelte-js6g66"><label for="email" class="svelte-js6g66">${escape_html(t(lang(), "common.email"))}</label> <input type="email" id="email" name="email" placeholder="exemplo@email.com" required=""${attr("disabled", waitSeconds() > 0, true)} class="svelte-js6g66"/></div> <div class="form-group svelte-js6g66"><label for="password" class="svelte-js6g66">${escape_html(t(lang(), "common.password"))}</label> <input type="password" id="password" name="password" placeholder="••••••••" required=""${attr("disabled", waitSeconds() > 0, true)} class="svelte-js6g66"/></div> <button type="submit" class="btn btn-primary btn-full svelte-js6g66"${attr("disabled", waitSeconds() > 0, true)}>`);
      if (waitSeconds() > 0) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`${escape_html(t(lang(), "members.wait_s", { n: waitSeconds() }))}`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`${escape_html(t(lang(), "common.login"))}`);
      }
      $$renderer2.push(`<!--]--></button></form>`);
    }
    $$renderer2.push(`<!--]--> <div class="card-footer svelte-js6g66"><span>${escape_html(t(lang(), "members.no_account"))}</span> <a href="/members/register" class="link svelte-js6g66">${escape_html(t(lang(), "members.sign_up"))}</a></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CmTVJj3s.js.map
