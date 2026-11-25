import { G as head, Q as escape_html, I as attr_class, J as attr, R as ensure_array_like, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { t, b as adminErrorMessage, a as formatDate } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const formError = derived(() => adminErrorMessage(lang(), form?.error));
    const formSuccessMsg = derived(() => {
      if (!form?.success) return "";
      if (form.message === "NL_DELETE_SUCCESS") return t(lang(), "admin.newsletter.errors.delete_success");
      if (form.message === "NL_CAMPAIGN_SENT") {
        return t(lang(), "admin.newsletter.errors.campaign_sent", { subject: form.subject || "", n: String(form.count ?? 0) });
      }
      return adminErrorMessage(lang(), form.message) || t(lang(), "admin.newsletter.success_generic");
    });
    let searchInput = data.searchQuery || "";
    let activeTab = "subscribers";
    function formatDate$1(dateString) {
      return formatDate(lang(), dateString, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    head("11kr2sw", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.newsletter.title"))} &amp; ${escape_html(t(lang(), "admin.newsletter.campaigns"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-header-row svelte-11kr2sw"><div><h1 class="admin-title">${escape_html(t(lang(), "admin.newsletter.manager_title"))}</h1> <p class="admin-subtitle svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.subtitle"))}</p></div> <div class="header-actions">`);
    if (data.resendReady) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn btn-primary">✉️ ${escape_html(t(lang(), "admin.newsletter.new_campaign"))}</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a href="/admin/settings" class="btn btn-secondary" style="border-color: #eab308; color: #d97706;">⚠️ ${escape_html(t(lang(), "admin.newsletter.configure_resend"))}</a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="stats-grid svelte-11kr2sw"><div class="stat-card svelte-11kr2sw"><div class="stat-icon svelte-11kr2sw">👥</div> <div class="stat-details svelte-11kr2sw"><span class="stat-label svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.active_subs"))}</span> <span class="stat-value svelte-11kr2sw">${escape_html(data.activeCount)}</span></div></div> <div class="stat-card svelte-11kr2sw"><div class="stat-icon svelte-11kr2sw">📨</div> <div class="stat-details svelte-11kr2sw"><span class="stat-label svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.campaigns_sent"))}</span> <span class="stat-value svelte-11kr2sw">${escape_html(data.total || 0)}</span></div></div> <div class="stat-card svelte-11kr2sw"><div class="stat-icon svelte-11kr2sw">⚙️</div> <div class="stat-details svelte-11kr2sw"><span class="stat-label svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.resend_integration"))}</span> <span${attr_class("stat-value svelte-11kr2sw", void 0, { "configured": data.resendReady })}>${escape_html(data.resendReady ? t(lang(), "admin.newsletter.status_active") : t(lang(), "admin.newsletter.status_pending"))}</span></div></div></div> `);
    if (formError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error">${escape_html(formError())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success">${escape_html(formSuccessMsg())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="tabs-container svelte-11kr2sw"><button${attr_class("tab-btn svelte-11kr2sw", void 0, { "active": activeTab === "subscribers" })}>${escape_html(t(lang(), "admin.newsletter.tab_subscribers"))}</button> <button${attr_class("tab-btn svelte-11kr2sw", void 0, { "active": activeTab === "campaigns" })}>${escape_html(t(lang(), "admin.newsletter.tab_campaigns"))}</button></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="search-bar-wrapper svelte-11kr2sw"><form class="search-form svelte-11kr2sw"><input type="text"${attr("value", searchInput)}${attr("placeholder", t(lang(), "admin.newsletter.search_placeholder"))} class="search-input svelte-11kr2sw"/> <button type="submit" class="btn btn-search svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.search"))}</button> `);
      if (data.searchQuery) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="/admin/newsletter" class="btn btn-secondary">${escape_html(t(lang(), "admin.newsletter.clear"))}</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></form></div> <div class="admin-table-container svelte-11kr2sw"><table class="table svelte-11kr2sw"><thead><tr><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.col_id"))}</th><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.email"))}</th><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.name"))}</th><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.newsletter.col_subscribed_at"))}</th><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.status"))}</th><th class="svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody>`);
      if (data.subscribers.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<tr><td colspan="6" class="text-center py-4 svelte-11kr2sw">${escape_html(data.searchQuery ? t(lang(), "admin.newsletter.empty_search") : t(lang(), "admin.newsletter.empty_subs"))}</td></tr>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array = ensure_array_like(data.subscribers);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let sub = each_array[$$index];
        $$renderer2.push(`<tr><td class="svelte-11kr2sw">${escape_html(sub.id)}</td><td class="svelte-11kr2sw"><strong>${escape_html(sub.email)}</strong></td><td class="svelte-11kr2sw">${escape_html(sub.name || "-")}</td><td class="svelte-11kr2sw">${escape_html(formatDate$1(sub.created_at))}</td><td class="svelte-11kr2sw"><span${attr_class(`status status-${sub.status === "active" ? "published" : "draft"}`, "svelte-11kr2sw")}>${escape_html(sub.status === "active" ? t(lang(), "admin.newsletter.status_sub_active") : t(lang(), "admin.newsletter.status_sub_inactive"))}</span></td><td class="svelte-11kr2sw"><form action="?/delete" method="POST"><input type="hidden" name="id"${attr("value", sub.id)}/> <button type="submit" class="btn btn-small btn-danger svelte-11kr2sw">${escape_html(t(lang(), "admin.ui.delete"))}</button></form></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> `);
      if (data.totalPages > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="pagination">`);
        if (data.page > 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `?page=${stringify(data.page - 1)}${data.searchQuery ? `&q=${data.searchQuery}` : ""}`)} class="btn">${escape_html(t(lang(), "admin.newsletter.previous"))}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span class="page-info">${escape_html(t(lang(), "admin.newsletter.page_of", { current: String(data.page), total: String(data.totalPages) }))}</span> `);
        if (data.page < data.totalPages) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `?page=${stringify(data.page + 1)}${data.searchQuery ? `&q=${data.searchQuery}` : ""}`)} class="btn">${escape_html(t(lang(), "admin.newsletter.next"))}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BGCQn6Kn.js.map
