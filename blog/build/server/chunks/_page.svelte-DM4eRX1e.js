import { G as head, Q as escape_html, R as ensure_array_like, I as attr_class, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let loadingToggle = null;
    let loadingDelete = null;
    function formatDate(isoString) {
      if (!isoString) return "-";
      return new Date(isoString).toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function isPremiumActive(status, expiresAt) {
      if (!status || status !== "active") return false;
      if (!expiresAt) return false;
      return new Date(expiresAt) > /* @__PURE__ */ new Date();
    }
    head("1p497kv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.users.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-header svelte-1p497kv"><div><h1 class="admin-title svelte-1p497kv">${escape_html(t(lang(), "admin.users.heading"))}</h1> <p class="admin-subtitle svelte-1p497kv">${escape_html(t(lang(), "admin.users.subtitle"))}</p></div></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1p497kv">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-1p497kv">${escape_html(form.success)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="admin-table-container svelte-1p497kv"><table class="table"><thead><tr><th>ID</th><th>${escape_html(t(lang(), "admin.users.col_email"))}</th><th>${escape_html(t(lang(), "admin.users.col_joined"))}</th><th>${escape_html(t(lang(), "admin.users.col_premium"))}</th><th>${escape_html(t(lang(), "admin.users.col_plan"))}</th><th>${escape_html(t(lang(), "admin.users.col_expiry"))}</th><th>${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody>`);
    if (data.members.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tr><td colspan="7" class="text-center py-4 svelte-1p497kv">${escape_html(t(lang(), "admin.users.empty"))}</td></tr>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array = ensure_array_like(data.members);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let member = each_array[$$index_1];
      const isPremium = isPremiumActive(member.sub_status, member.sub_expires_at);
      $$renderer2.push(`<tr><td>${escape_html(member.id)}</td><td><strong>${escape_html(member.username)}</strong></td><td>${escape_html(formatDate(member.created_at))}</td><td><span${attr_class(`status status-${isPremium ? "published" : "draft"}`, "svelte-1p497kv")}>${escape_html(isPremium ? "Premium Ativo" : "Inativo / Gratuito")}</span></td><td>${escape_html(member.plan_name || "-")}</td><td>${escape_html(member.sub_expires_at ? formatDate(member.sub_expires_at) : "-")}</td><td><div class="actions-wrapper svelte-1p497kv"><form action="?/togglePremium" method="POST" class="svelte-1p497kv"><input type="hidden" name="user_id"${attr("value", member.id)}/> `);
      if (isPremium) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<input type="hidden" name="action" value="revoke"/> <button type="submit" class="btn btn-small btn-secondary"${attr("disabled", loadingToggle === member.id, true)}>${escape_html(loadingToggle === member.id ? "Aguarde..." : '{t(lang, "admin.users.revoke_premium")}')}</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<input type="hidden" name="action" value="grant"/> `);
        if (data.plans && data.plans.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<select name="plan_id" class="plan-select svelte-1p497kv"${attr("disabled", loadingToggle === member.id, true)}><!--[-->`);
          const each_array_1 = ensure_array_like(data.plans);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let plan = each_array_1[$$index];
            if (plan.is_active !== 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.option({ value: plan.id }, ($$renderer3) => {
                $$renderer3.push(`${escape_html(plan.name)}`);
              });
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></select>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <button type="submit" class="btn btn-small btn-primary"${attr("disabled", loadingToggle === member.id, true)}>${escape_html(loadingToggle === member.id ? "Aguarde..." : "Dar Premium")}</button>`);
      }
      $$renderer2.push(`<!--]--></form> <form action="?/delete" method="POST" class="svelte-1p497kv"><input type="hidden" name="user_id"${attr("value", member.id)}/> <button type="submit" class="btn btn-small btn-danger svelte-1p497kv"${attr("disabled", loadingDelete === member.id, true)}>${escape_html(loadingDelete === member.id ? "Excluindo..." : "Excluir")}</button></form></div></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DM4eRX1e.js.map
