import { G as head, Q as escape_html, I as attr_class, R as ensure_array_like, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let activeTab = "overview";
    function formatCurrency(value) {
      return new Intl.NumberFormat(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { style: "currency", currency: "BRL" }).format(value);
    }
    function getItemTypeLabel(type) {
      switch (type) {
        case "product":
          return t(lang(), "admin.sales.product");
        case "course":
          return t(lang(), "admin.sales.course");
        case "subscription":
          return t(lang(), "admin.sales.subscription");
        default:
          return type;
      }
    }
    head("1bas9j7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.sales.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="sales-dashboard svelte-1bas9j7"><div class="sales-header svelte-1bas9j7"><div><h1 class="svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.heading"))}</h1> <p class="subtitle svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.subtitle"))}</p></div></div> <div class="tabs-nav svelte-1bas9j7"><button${attr_class("tab-btn svelte-1bas9j7", void 0, { "active": activeTab === "overview" })}>${escape_html(t(lang(), "admin.sales.tab_overview"))}</button> <button${attr_class("tab-btn svelte-1bas9j7", void 0, { "active": activeTab === "history" })}>${escape_html(t(lang(), "admin.sales.tab_history"))}</button> <button${attr_class("tab-btn svelte-1bas9j7", void 0, { "active": activeTab === "holdings" })}>${escape_html(t(lang(), "admin.sales.tab_holdings"))}</button></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="metrics-grid svelte-1bas9j7"><div class="metric-card svelte-1bas9j7"><div class="metric-icon faturamento svelte-1bas9j7"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bas9j7"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div> <div class="metric-info svelte-1bas9j7"><span class="metric-value svelte-1bas9j7">${escape_html(formatCurrency(data.summary?.totalRevenue || 0))}</span> <span class="metric-label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.total_revenue"))}</span></div></div> <div class="metric-card svelte-1bas9j7"><div class="metric-icon produtos svelte-1bas9j7"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bas9j7"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div> <div class="metric-info svelte-1bas9j7"><span class="metric-value svelte-1bas9j7">${escape_html(data.summary?.productSalesCount || 0)}</span> <span class="metric-label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.products_sold", { amount: formatCurrency(data.summary?.productRevenue || 0) }))}</span></div></div> <div class="metric-card svelte-1bas9j7"><div class="metric-icon cursos svelte-1bas9j7"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bas9j7"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg></div> <div class="metric-info svelte-1bas9j7"><span class="metric-value svelte-1bas9j7">${escape_html(data.summary?.courseSalesCount || 0)}</span> <span class="metric-label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.courses_sold", { amount: formatCurrency(data.summary?.courseRevenue || 0) }))}</span></div></div> <div class="metric-card svelte-1bas9j7"><div class="metric-icon assinaturas svelte-1bas9j7"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bas9j7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div> <div class="metric-info svelte-1bas9j7"><span class="metric-value svelte-1bas9j7">${escape_html(data.summary?.activeSubscriptionsCount || 0)}</span> <span class="metric-label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.active_subs", {
        amount: formatCurrency(data.summary?.subscriptionRevenue || 0)
      }))}</span></div></div></div> <div class="overview-details svelte-1bas9j7"><div class="details-card svelte-1bas9j7"><h2 class="svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.revenue_dist"))}</h2> <div class="distribution-list svelte-1bas9j7"><div class="distribution-item svelte-1bas9j7"><span class="dot product-dot svelte-1bas9j7"></span> <span class="label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.digital_products"))}</span> <span class="value svelte-1bas9j7">${escape_html(formatCurrency(data.summary?.productRevenue || 0))}</span></div> <div class="distribution-item svelte-1bas9j7"><span class="dot course-dot svelte-1bas9j7"></span> <span class="label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.courses_videos"))}</span> <span class="value svelte-1bas9j7">${escape_html(formatCurrency(data.summary?.courseRevenue || 0))}</span></div> <div class="distribution-item svelte-1bas9j7"><span class="dot sub-dot svelte-1bas9j7"></span> <span class="label svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.premium_subs"))}</span> <span class="value svelte-1bas9j7">${escape_html(formatCurrency(data.summary?.subscriptionRevenue || 0))}</span></div></div></div> <div class="details-card svelte-1bas9j7"><h2 class="svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.recent_sales"))}</h2> `);
      if (data.history && data.history.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="recent-sales-list svelte-1bas9j7"><!--[-->`);
        const each_array = ensure_array_like(data.history.slice(0, 5));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let sale = each_array[$$index];
          $$renderer2.push(`<div class="recent-sale-item svelte-1bas9j7"><div class="sale-main svelte-1bas9j7"><span class="sale-title svelte-1bas9j7">${escape_html(sale.item_name)}</span> <span class="sale-user svelte-1bas9j7">${escape_html(sale.user_name || sale.username)}</span></div> <div class="sale-meta svelte-1bas9j7"><span class="sale-price svelte-1bas9j7">${escape_html(formatCurrency(sale.amount_cents / 100))}</span> <span${attr_class(`badge badge-${stringify(sale.item_type)}`, "svelte-1bas9j7")}>${escape_html(getItemTypeLabel(sale.item_type))}</span></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="empty-text svelte-1bas9j7">${escape_html(t(lang(), "admin.sales.no_sales"))}</p>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BVhtAnC1.js.map
