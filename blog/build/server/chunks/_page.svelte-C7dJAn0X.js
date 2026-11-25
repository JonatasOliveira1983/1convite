import { G as head, Q as escape_html, R as ensure_array_like, I as attr_class, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, f as formatMoney } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => data.settings?.site_language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const paymentGateway = derived(() => data.paymentGateway || store_get($$store_subs ??= {}, "$page", page).data.paymentGateway || "asaas");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    function formatPrice(cents) {
      return formatMoney(lang(), cents, displayCurrency());
    }
    const faq1a = derived(() => paymentGateway() === "stripe" ? t(lang(), "premium_page.faq_1_a_stripe") : t(lang(), "premium_page.faq_1_a_asaas"));
    const faq3a = derived(() => paymentGateway() === "stripe" ? t(lang(), "premium_page.faq_3_a_stripe") : t(lang(), "premium_page.faq_3_a_asaas"));
    head("feopv2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "premium_page.badge"))}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", t(lang(), "premium_page.meta_desc"))}/>`);
    });
    $$renderer2.push(`<div class="premium-page svelte-feopv2"><div class="premium-header svelte-feopv2"><span class="premium-badge svelte-feopv2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ${escape_html(t(lang(), "premium_page.badge"))}</span> <h1 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.title"))}</h1> <p class="subtitle svelte-feopv2">${escape_html(t(lang(), "premium_page.subtitle"))}</p></div> `);
    if (data.plans.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-feopv2"><p>${escape_html(t(lang(), "premium_page.empty"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="plans-grid svelte-feopv2"><!--[-->`);
      const each_array = ensure_array_like(data.plans);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let plan = each_array[$$index_1];
        $$renderer2.push(`<div${attr_class("plan-card svelte-feopv2", void 0, { "featured": plan.features && plan.features.length > 3 })}>`);
        if (plan.features && plan.features.length > 3) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="featured-badge svelte-feopv2">${escape_html(t(lang(), "premium_page.most_popular"))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="plan-header svelte-feopv2"><h2 class="plan-name svelte-feopv2">${escape_html(plan.name)}</h2> `);
        if (plan.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="plan-description svelte-feopv2">${escape_html(plan.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="plan-price svelte-feopv2"><span class="price-value svelte-feopv2">${escape_html(formatPrice(plan.price_cents))}</span> <span class="price-period svelte-feopv2">${escape_html(plan.interval_days === 30 ? t(lang(), "premium_page.per_month") : t(lang(), "premium_page.per_days", { n: plan.interval_days }))}</span></div> `);
        if (plan.features) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<ul class="plan-features svelte-feopv2"><!--[-->`);
          const each_array_1 = ensure_array_like(plan.features);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let feature = each_array_1[$$index];
            $$renderer2.push(`<li class="svelte-feopv2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-feopv2"><polyline points="20 6 9 17 4 12"></polyline></svg> ${escape_html(feature)}</li>`);
          }
          $$renderer2.push(`<!--]--></ul>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="premium-subscription-actions" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">`);
        if (!data.paymentConfigured) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="gateway-offline svelte-feopv2">${escape_html(t(lang(), "premium_page.gateway_offline"))}</p>`);
        } else if (data.paymentGateway === "stripe") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<form method="POST" action="?/subscribe"${attr("data-plan-id", plan.id)} style="width: 100%;"><input type="hidden" name="plan_id"${attr("value", plan.id)}/> <button type="submit" class="btn btn-primary btn-full svelte-feopv2" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; width: 100%;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> <span>${escape_html(t(lang(), "premium_page.subscribe_stripe"))}</span></button></form>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<form method="POST" action="?/subscribe"${attr("data-plan-id", plan.id)} style="width: 100%;"><input type="hidden" name="plan_id"${attr("value", plan.id)}/> <input type="hidden" name="method" value="pix"/> <button type="submit" class="btn btn-primary btn-full btn-pix svelte-feopv2" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; width: 100%;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"></path><path d="M12 7l-5 5 5 5 5-5-5-5z"></path></svg> <span>${escape_html(t(lang(), "premium_page.subscribe_pix"))}</span></button></form> <form method="POST" action="?/subscribe"${attr("data-plan-id", plan.id)} style="width: 100%;"><input type="hidden" name="plan_id"${attr("value", plan.id)}/> <input type="hidden" name="method" value="credit_card"/> <button type="submit" class="btn btn-secondary btn-full svelte-feopv2" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; width: 100%;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> <span>${escape_html(t(lang(), "premium_page.subscribe_card"))}</span></button></form>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="faq-section svelte-feopv2"><h2 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_title"))}</h2> <div class="faq-grid svelte-feopv2"><div class="faq-item svelte-feopv2"><h3 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_1_q"))}</h3> <p class="svelte-feopv2">${escape_html(faq1a())}</p></div> <div class="faq-item svelte-feopv2"><h3 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_2_q"))}</h3> <p class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_2_a"))}</p></div> <div class="faq-item svelte-feopv2"><h3 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_3_q"))}</h3> <p class="svelte-feopv2">${escape_html(faq3a())}</p></div> <div class="faq-item svelte-feopv2"><h3 class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_4_q"))}</h3> <p class="svelte-feopv2">${escape_html(t(lang(), "premium_page.faq_4_a"))}</p></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C7dJAn0X.js.map
