import { G as head, Q as escape_html, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, b as adminErrorMessage } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const formError = derived(() => adminErrorMessage(lang(), form?.message || form?.error));
    let priceValue = "";
    let intervalDays = "30";
    let priceCents = 0;
    head("18nfiho", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.premium.create_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="new-plan-page svelte-18nfiho"><div class="page-header svelte-18nfiho"><h1 class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.create_title"))}</h1> <p class="subtitle svelte-18nfiho">${escape_html(t(lang(), "admin.premium.create_subtitle"))}</p></div> <form method="POST" class="plan-form svelte-18nfiho"><div class="form-section svelte-18nfiho"><div class="form-group svelte-18nfiho"><label for="name" class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.plan_name"))}</label> <input type="text" id="name" name="name"${attr("placeholder", t(lang(), "admin.premium.name_placeholder"))} required="" class="svelte-18nfiho"/></div> <div class="form-group svelte-18nfiho"><label for="slug" class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.slug_label"))}</label> <input type="text" id="slug" name="slug"${attr("placeholder", t(lang(), "admin.premium.slug_placeholder"))} required="" class="svelte-18nfiho"/> <small class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.slug_hint"))}</small></div> <div class="form-group svelte-18nfiho"><label for="description" class="svelte-18nfiho">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="description" name="description" rows="2"${attr("placeholder", t(lang(), "admin.premium.description_placeholder"))} class="svelte-18nfiho"></textarea></div></div> <div class="section-divider svelte-18nfiho"></div> <div class="form-section svelte-18nfiho"><div class="form-row svelte-18nfiho"><div class="form-group svelte-18nfiho"><label for="price_cents" class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.price_cents"))}</label> <div class="price-input-group svelte-18nfiho"><input type="text" id="price_cents" name="price_cents_display"${attr("placeholder", t(lang(), "admin.premium.price_placeholder"))}${attr("value", priceValue)} class="svelte-18nfiho"/> <span class="input-suffix svelte-18nfiho">${escape_html(t(lang(), "admin.premium.currency_suffix"))}</span></div> <input type="hidden" name="price_cents"${attr("value", priceCents)} class="svelte-18nfiho"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-18nfiho"><label for="interval_days" class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.billing_cycle"))}</label> `);
    $$renderer2.select(
      {
        id: "interval_days",
        name: "interval_days",
        value: intervalDays,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "30" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.premium.interval_monthly"))}`);
        });
        $$renderer3.option({ value: "90" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.premium.interval_quarterly"))}`);
        });
        $$renderer3.option({ value: "180" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.premium.interval_semiannual"))}`);
        });
        $$renderer3.option({ value: "365" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.premium.interval_yearly"))}`);
        });
      },
      "svelte-18nfiho"
    );
    $$renderer2.push(`</div></div></div> <div class="section-divider svelte-18nfiho"></div> <div class="form-section svelte-18nfiho"><div class="form-group svelte-18nfiho"><label for="features" class="svelte-18nfiho">${escape_html(t(lang(), "admin.premium.features"))}</label> <textarea id="features" name="features" rows="6"${attr("placeholder", t(lang(), "admin.premium.features_placeholder"))} class="svelte-18nfiho"></textarea></div></div> <div class="form-section svelte-18nfiho"><label class="checkbox-label svelte-18nfiho"><input type="checkbox" name="is_active" checked="" class="svelte-18nfiho"/> <span>${escape_html(t(lang(), "admin.premium.plan_active"))}</span></label></div> `);
    if (formError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-18nfiho">${escape_html(formError())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-actions svelte-18nfiho"><a href="/admin/premium/plans" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary">${escape_html(t(lang(), "admin.premium.create_plan"))}</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BOUIBfYo.js.map
