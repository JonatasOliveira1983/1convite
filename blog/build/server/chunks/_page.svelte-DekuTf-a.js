import { G as head, Q as escape_html, J as attr, L as store_get, I as attr_class, O as stringify, R as ensure_array_like, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, m as memberErrorMessage, f as formatMoney, a as formatDate } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const paymentGateway = derived(() => data.paymentGateway || store_get($$store_subs ??= {}, "$page", page).data.paymentGateway || "asaas");
    const requiresCpf = derived(() => data.requiresCpf ?? paymentGateway() !== "stripe");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    let loading = false;
    let profileLoading = false;
    let nameValue = data.user?.name || "";
    let cpfValue = data.user?.cpf || "";
    let phoneValue = data.user?.phone || "";
    const hasProfileError = derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("error") === "update_profile");
    const formError = derived(() => memberErrorMessage(lang(), form?.error));
    const formSuccess = derived(() => memberErrorMessage(lang(), form?.success));
    const profileDesc = derived(() => paymentGateway() === "stripe" ? t(lang(), "members.profile_desc_stripe") : t(lang(), "members.profile_desc_asaas"));
    const profileIncompleteMsg = derived(() => paymentGateway() === "stripe" ? t(lang(), "members.profile_incomplete_payment_stripe") : t(lang(), "members.profile_incomplete_payment"));
    function formatDate$1(isoString) {
      if (!isoString) return t(lang(), "members.na");
      return formatDate(lang(), isoString, { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    function formatPrice(cents) {
      return formatMoney(lang(), cents, displayCurrency());
    }
    function canCancelSubscription(sub) {
      if (!sub || sub.status !== "active") return false;
      if (sub.asaas_subscription_id) return true;
      if (sub.stripe_subscription_id && !String(sub.stripe_subscription_id).startsWith("cs_pending:")) {
        return true;
      }
      return false;
    }
    function getStatusLabel(status) {
      switch (status) {
        case "active":
          return t(lang(), "members.status_active");
        case "pending":
          return t(lang(), "members.status_pending");
        case "cancelled":
          return t(lang(), "members.status_cancelled");
        case "approved":
        case "confirmed":
        case "completed":
          return t(lang(), "members.approved");
        default:
          return status;
      }
    }
    function paymentMethodLabel(method) {
      if (!method) return t(lang(), "members.payment_method_card_pix");
      const m = String(method).toLowerCase();
      if (m === "card_pix" || method === "Cartão/Pix" || method === "Card/Pix") {
        return t(lang(), "members.payment_method_card_pix");
      }
      if (m === "stripe" || m === "card" || m === "credit_card") {
        return t(lang(), "members.payment_method_stripe");
      }
      if (m === "pix") return t(lang(), "common.pix");
      return method;
    }
    function intervalLabel(intervalDays) {
      if (!intervalDays || intervalDays === 30) return t(lang(), "members.per_month");
      return t(lang(), "members.per_days", { n: String(intervalDays) });
    }
    function formatCPF(val) {
      const clean = val.replace(/\D/g, "").substring(0, 11);
      if (clean.length <= 3) return clean;
      if (clean.length <= 6) return `${clean.substring(0, 3)}.${clean.substring(3)}`;
      if (clean.length <= 9) return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6)}`;
      return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
    }
    function formatPhone(val) {
      const clean = val.replace(/\D/g, "").substring(0, 11);
      if (clean.length <= 2) return clean;
      if (clean.length <= 6) return `(${clean.substring(0, 2)}) ${clean.substring(2)}`;
      if (clean.length <= 10) return `(${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`;
      return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
    }
    head("1r4vq77", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "members.dashboard_title"))} | ${escape_html(t(lang(), "members.area_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="dashboard-container svelte-1r4vq77"><div class="dashboard-header svelte-1r4vq77"><div><h1 class="svelte-1r4vq77">${escape_html(t(lang(), "members.dashboard_title"))}</h1> <p class="subtitle svelte-1r4vq77">${escape_html(t(lang(), "members.welcome", { user: data.user?.username || "" }))}</p></div> <form method="POST" action="/members/logout"><button type="submit" class="btn btn-secondary btn-logout svelte-1r4vq77">${escape_html(t(lang(), "members.logout_account"))}</button></form></div> `);
    if (hasProfileError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert warning svelte-1r4vq77">${escape_html(profileIncompleteMsg())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (formError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1r4vq77">${escape_html(formError())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (formSuccess()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-1r4vq77">${escape_html(formSuccess())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="dashboard-grid svelte-1r4vq77"><div class="dashboard-col svelte-1r4vq77"><div class="card profile-card svelte-1r4vq77"><h2 class="svelte-1r4vq77">${escape_html(t(lang(), "members.profile_data"))}</h2> <p class="card-desc svelte-1r4vq77">${escape_html(profileDesc())}</p> <form method="POST" action="?/updateProfile" class="profile-form svelte-1r4vq77"><input type="hidden" name="redirectTo"${attr("value", store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("redirectTo") || "")} class="svelte-1r4vq77"/> <div class="form-group svelte-1r4vq77"><label for="name" class="svelte-1r4vq77">${escape_html(t(lang(), "members.full_name"))}</label> <input type="text" id="name" name="name"${attr("value", nameValue)}${attr("placeholder", t(lang(), "members.full_name_placeholder"))} required=""${attr("disabled", profileLoading, true)} class="svelte-1r4vq77"/></div> <div class="form-group svelte-1r4vq77"><label for="cpf" class="svelte-1r4vq77">${escape_html(requiresCpf() ? t(lang(), "members.cpf") : t(lang(), "members.cpf_optional"))}</label> <input type="text" id="cpf" name="cpf"${attr("value", formatCPF(cpfValue))}${attr("placeholder", t(lang(), "members.cpf_placeholder"))}${attr("required", requiresCpf(), true)}${attr("disabled", profileLoading, true)} class="svelte-1r4vq77"/></div> <div class="form-group svelte-1r4vq77"><label for="phone" class="svelte-1r4vq77">${escape_html(t(lang(), "members.phone_optional"))}</label> <input type="text" id="phone" name="phone"${attr("value", formatPhone(phoneValue))}${attr("placeholder", t(lang(), "members.phone_placeholder"))}${attr("disabled", profileLoading, true)} class="svelte-1r4vq77"/></div> <button type="submit" class="btn btn-primary btn-full"${attr("disabled", profileLoading, true)} style="margin-top: 1rem;">${escape_html(t(lang(), "members.save_profile"))}</button></form></div> <div class="card courses-card svelte-1r4vq77"><div class="courses-card-icon svelte-1r4vq77">🎓</div> <h2 class="svelte-1r4vq77">${escape_html(t(lang(), "members.area_title"))}</h2> <p class="svelte-1r4vq77">${escape_html(t(lang(), "members.welcome_area"))}</p> <a href="/members/area" class="btn btn-primary courses-btn svelte-1r4vq77">${escape_html(t(lang(), "members.access_courses"))}</a></div></div> <div class="dashboard-col svelte-1r4vq77"><div class="card subscription-card svelte-1r4vq77"><h2 class="svelte-1r4vq77">${escape_html(t(lang(), "members.premium_sub"))}</h2> `);
    if (data.subscription) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sub-info svelte-1r4vq77"><div class="info-row svelte-1r4vq77"><span class="info-label svelte-1r4vq77">${escape_html(t(lang(), "members.plan"))}</span> <span class="info-value plan-name svelte-1r4vq77">${escape_html(data.subscription.plan_name)}</span></div> <div class="info-row svelte-1r4vq77"><span class="info-label svelte-1r4vq77">${escape_html(t(lang(), "members.price"))}</span> <span class="info-value svelte-1r4vq77">${escape_html(formatPrice(data.subscription.price_cents))}${escape_html(intervalLabel(data.subscription.interval_days))}</span></div> <div class="info-row svelte-1r4vq77"><span class="info-label svelte-1r4vq77">${escape_html(t(lang(), "members.status"))}</span> <span${attr_class(`status-badge ${stringify(data.subscription.status)}`, "svelte-1r4vq77")}>${escape_html(getStatusLabel(data.subscription.status))}</span></div> <div class="info-row svelte-1r4vq77"><span class="info-label svelte-1r4vq77">${escape_html(t(lang(), "members.valid_until"))}</span> <span class="info-value svelte-1r4vq77">${escape_html(formatDate$1(data.subscription.expires_at))}</span></div></div> `);
      if (canCancelSubscription(data.subscription)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<form method="POST" action="?/cancel" class="cancel-form svelte-1r4vq77"><button type="submit" class="btn btn-outline btn-cancel svelte-1r4vq77"${attr("disabled", loading, true)}>${escape_html(t(lang(), "members.cancel_sub"))}</button></form>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-subscription svelte-1r4vq77"><p class="svelte-1r4vq77">${escape_html(t(lang(), "members.no_sub"))}</p> <a href="/premium" class="btn btn-primary">${escape_html(t(lang(), "members.view_plans"))}</a></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card purchased-products-card svelte-1r4vq77"><h2 class="svelte-1r4vq77">${escape_html(t(lang(), "members.my_downloads"))}</h2> `);
    if (data.purchasedProducts && data.purchasedProducts.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="purchased-products-list svelte-1r4vq77"><!--[-->`);
      const each_array = ensure_array_like(data.purchasedProducts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let product = each_array[$$index];
        $$renderer2.push(`<div class="purchased-product-item svelte-1r4vq77">`);
        if (product.image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", product.image_url)}${attr("alt", product.name)} class="purchased-product-thumb svelte-1r4vq77"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="purchased-product-icon svelte-1r4vq77">`);
          if (product.file_url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="purchased-product-info svelte-1r4vq77"><span class="purchased-product-name svelte-1r4vq77"${attr("title", product.name)}>${escape_html(product.name)}</span> `);
        if (product.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="purchased-product-desc svelte-1r4vq77"${attr("title", product.description)}>${escape_html(product.description)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="purchased-product-action svelte-1r4vq77">`);
        if (product.file_url || product.external_link) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/api/download/${stringify(product.id)}`)} rel="external" class="btn btn-small btn-primary svelte-1r4vq77"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> ${escape_html(product.file_url ? t(lang(), "members.download") : t(lang(), "members.access"))}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <a${attr("href", `/product/${stringify(product.slug)}`)} class="btn btn-small btn-outline svelte-1r4vq77">${escape_html(t(lang(), "members.view_page"))}</a></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-purchased-products svelte-1r4vq77"><p>${escape_html(t(lang(), "members.no_products"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card payments-card svelte-1r4vq77"><h2 class="svelte-1r4vq77">${escape_html(t(lang(), "members.payments_history"))}</h2> `);
    if (data.payments && data.payments.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="table-responsive svelte-1r4vq77"><table class="payments-table svelte-1r4vq77"><thead><tr><th class="svelte-1r4vq77">${escape_html(t(lang(), "members.date"))}</th><th class="svelte-1r4vq77">${escape_html(t(lang(), "members.amount"))}</th><th class="svelte-1r4vq77">${escape_html(t(lang(), "members.payment_method"))}</th><th class="svelte-1r4vq77">${escape_html(t(lang(), "members.status"))}</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(data.payments);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let payment = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="svelte-1r4vq77">${escape_html(formatDate$1(payment.created_at))}</td><td class="svelte-1r4vq77">${escape_html(formatPrice(payment.amount_cents))}</td><td class="svelte-1r4vq77">${escape_html(paymentMethodLabel(payment.payment_method))}</td><td class="svelte-1r4vq77"><span${attr_class(`status-badge ${stringify(payment.status)}`, "svelte-1r4vq77")}>${escape_html(getStatusLabel(payment.status))}</span></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="empty-payments svelte-1r4vq77">${escape_html(t(lang(), "members.no_payments"))}</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DekuTf-a.js.map
