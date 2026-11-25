import { G as head, Q as escape_html, R as ensure_array_like, I as attr_class, J as attr, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, f as formatMoney } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function formatPrice(cents) {
      return formatMoney(lang(), cents || 0);
    }
    const activeCount = derived(() => data.plans.filter((p) => p.is_active === 1).length);
    const avgPrice = derived(() => data.plans.length ? data.plans.reduce((sum, p) => sum + (p.price_cents || 0), 0) / data.plans.length : 0);
    head("aalb81", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.premium.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="premium-admin svelte-aalb81"><div class="page-header svelte-aalb81"><div class="page-header-title"><h1 class="svelte-aalb81">${escape_html(t(lang(), "admin.premium.heading"))}</h1> <p class="subtitle svelte-aalb81">${escape_html(t(lang(), "admin.premium.subtitle"))}</p></div> <a href="/admin/premium/plans/new" class="btn btn-primary svelte-aalb81"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> ${escape_html(t(lang(), "admin.premium.new"))}</a></div> <div class="stats-row svelte-aalb81"><div class="stat-card svelte-aalb81"><span class="stat-number svelte-aalb81">${escape_html(data.plans.length)}</span> <span class="stat-label svelte-aalb81">${escape_html(t(lang(), "admin.premium.plans_stat"))}</span></div> <div class="stat-card svelte-aalb81"><span class="stat-number svelte-aalb81">${escape_html(activeCount())}</span> <span class="stat-label svelte-aalb81">${escape_html(t(lang(), "admin.premium.active_stat"))}</span></div> <div class="stat-card svelte-aalb81"><span class="stat-number svelte-aalb81">${escape_html(formatPrice(avgPrice()))}</span> <span class="stat-label svelte-aalb81">${escape_html(t(lang(), "admin.premium.avg_price_stat"))}</span></div></div> <div class="card svelte-aalb81">`);
    if (data.plans.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-aalb81"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> <p>${escape_html(t(lang(), "admin.premium.empty"))}</p> <a href="/admin/premium/plans/new" class="btn btn-small btn-primary svelte-aalb81">${escape_html(t(lang(), "admin.premium.create_first"))}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="plans-list svelte-aalb81"><!--[-->`);
      const each_array = ensure_array_like(data.plans);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let plan = each_array[$$index];
        $$renderer2.push(`<div${attr_class("plan-item svelte-aalb81", void 0, { "inactive": plan.is_active !== 1 })}><div class="plan-info svelte-aalb81"><h3 class="plan-name svelte-aalb81">${escape_html(plan.name)}</h3> `);
        if (plan.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="plan-desc svelte-aalb81">${escape_html(plan.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="plan-details svelte-aalb81"><div class="plan-price svelte-aalb81"><span class="price svelte-aalb81">${escape_html(formatPrice(plan.price_cents))}</span> <span class="interval svelte-aalb81">${escape_html(t(lang(), "admin.premium.per_days", { n: String(plan.interval_days || 30) }))}</span></div> <span${attr_class(`status-badge ${plan.is_active === 1 ? "active" : "inactive"}`, "svelte-aalb81")}>${escape_html(plan.is_active === 1 ? t(lang(), "admin.premium.active") : t(lang(), "admin.premium.inactive"))}</span></div> <div class="plan-actions svelte-aalb81"><a${attr("href", `/admin/premium/plans/${stringify(plan.id)}`)} class="btn btn-small btn-icon svelte-aalb81"${attr("title", t(lang(), "admin.premium.edit"))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DkK2DD83.js.map
