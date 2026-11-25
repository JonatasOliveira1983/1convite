import { G as head, Q as escape_html, J as attr, R as ensure_array_like, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, b as adminErrorMessage } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { P as Pagination } from './Pagination-DH52TBvr.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const formError = derived(() => {
      if (!form?.message) return "";
      if (form.message === "SL_SLUG_IN_USE") {
        return t(lang(), "admin.shortlinks.errors.slug_in_use", { slug: form.slug || "" });
      }
      return adminErrorMessage(lang(), form.message);
    });
    const formSuccessMsg = derived(() => {
      if (!form?.success) return "";
      if (form.action === "create") return t(lang(), "admin.shortlinks.created_success");
      if (form.action === "delete") return t(lang(), "admin.shortlinks.deleted_success");
      return t(lang(), "admin.shortlinks.updated_success");
    });
    let newSlug = "";
    let newDestinationUrl = "";
    let newUseAdInterstitial = false;
    let newIsIndexed = false;
    let editingId = null;
    let editingSlug = "";
    let editingDestinationUrl = "";
    let editingUseAdInterstitial = false;
    let editingIsIndexed = false;
    let searchQuery = data.q || "";
    let copiedSlug = null;
    head("1wesq8o", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.shortlinks.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="shortlinks-page svelte-1wesq8o"><div class="page-header svelte-1wesq8o"><h1 class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.heading_full"))}</h1> <p class="subtitle svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.subtitle"))}</p></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-1wesq8o">${escape_html(formSuccessMsg())}</div>`);
    } else if (formError()) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="alert error svelte-1wesq8o">${escape_html(formError())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.activeAdsCount === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert warning-alert svelte-1wesq8o"><strong>${escape_html(t(lang(), "admin.shortlinks.monetization_title"))}</strong> ${escape_html(t(lang(), "admin.shortlinks.no_ads_warning"))}
            ${escape_html(t(lang(), "admin.shortlinks.monetization_body"))} <a href="/admin/ads" class="alert-link svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.ads_link"))}</a>.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="card create-card svelte-1wesq8o"><h2 class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.create_new"))}</h2> <form method="POST" action="?/create"><div class="form-grid svelte-1wesq8o"><div class="form-group svelte-1wesq8o"><label for="slug" class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.short_url"))}</label> <div class="input-prefix-wrapper svelte-1wesq8o"><span class="url-prefix svelte-1wesq8o">/l/</span> <input type="text" id="slug" name="slug"${attr("value", newSlug)}${attr("placeholder", t(lang(), "admin.shortlinks.slug_placeholder"))} required="" pattern="^[a-zA-Z0-9-_]+$"${attr("title", t(lang(), "admin.shortlinks.slug_pattern_title"))} class="svelte-1wesq8o"/></div></div> <div class="form-group svelte-1wesq8o"><label for="destination_url" class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.destination"))}</label> <input type="url" id="destination_url" name="destination_url"${attr("value", newDestinationUrl)}${attr("placeholder", t(lang(), "admin.shortlinks.destination_placeholder"))} required="" class="svelte-1wesq8o"/></div></div> <div class="interstitial-settings svelte-1wesq8o"><label class="checkbox-label toggle-switch svelte-1wesq8o"><input type="checkbox" name="use_ad_interstitial"${attr("checked", newUseAdInterstitial, true)} class="svelte-1wesq8o"/> <span class="slider svelte-1wesq8o"></span> <span class="toggle-text svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.show_ad"))}</span></label> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="indexing-settings svelte-1wesq8o"><label class="checkbox-label toggle-switch svelte-1wesq8o"><input type="checkbox" name="is_indexed"${attr("checked", newIsIndexed, true)} class="svelte-1wesq8o"/> <span class="slider svelte-1wesq8o"></span> <span class="toggle-text svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.allow_index"))}</span></label> <p class="settings-help svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.index_help"))}</p> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="form-actions svelte-1wesq8o"><button type="submit" class="btn btn-primary">${escape_html(t(lang(), "admin.shortlinks.create_btn"))}</button></div></form></div> <div class="card search-card svelte-1wesq8o"><form method="GET" action="" class="search-form svelte-1wesq8o"><div class="search-input-wrapper svelte-1wesq8o"><input type="text" name="q"${attr("placeholder", t(lang(), "admin.shortlinks.search_placeholder"))}${attr("value", searchQuery)} class="svelte-1wesq8o"/> `);
    if (searchQuery) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a href="?" class="btn-clear-search svelte-1wesq8o"${attr("title", t(lang(), "admin.shortlinks.clear_search"))}>✕</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button type="submit" class="btn btn-primary btn-search svelte-1wesq8o">${escape_html(t(lang(), "admin.ui.search"))}</button></div></form></div> <div class="card svelte-1wesq8o"><h2 class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.heading"))} — ${escape_html(t(lang(), "admin.shortlinks.registered", { n: String(data.totalCount) }))}</h2> `);
    if (data.shortlinks.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-1wesq8o"><p>${escape_html(data.q ? t(lang(), "admin.shortlinks.empty_search") : t(lang(), "admin.shortlinks.empty"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container svelte-1wesq8o"><table class="links-table svelte-1wesq8o"><thead><tr><th class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.col_short"))}</th><th class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.col_destination"))}</th><th class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.col_settings"))}</th><th class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.clicks"))}</th><th class="svelte-1wesq8o">${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(data.shortlinks);
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let link = each_array_1[$$index_2];
        if (editingId === link.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<tr class="edit-row svelte-1wesq8o"><td colspan="5" class="svelte-1wesq8o"><form method="POST" action="?/update" class="row-edit-form svelte-1wesq8o"><input type="hidden" name="id"${attr("value", link.id)} class="svelte-1wesq8o"/> <div class="form-grid svelte-1wesq8o"><div class="form-group svelte-1wesq8o"><label${attr("for", `edit_slug_${stringify(link.id)}`)} class="svelte-1wesq8o">${escape_html(t(lang(), "admin.ui.slug"))}</label> <div class="input-prefix-wrapper svelte-1wesq8o"><span class="url-prefix svelte-1wesq8o">/l/</span> <input type="text"${attr("id", `edit_slug_${stringify(link.id)}`)} name="slug"${attr("value", editingSlug)} required="" class="svelte-1wesq8o"/></div></div> <div class="form-group svelte-1wesq8o"><label${attr("for", `edit_dest_${stringify(link.id)}`)} class="svelte-1wesq8o">${escape_html(t(lang(), "admin.shortlinks.destination"))}</label> <input type="url"${attr("id", `edit_dest_${stringify(link.id)}`)} name="destination_url"${attr("value", editingDestinationUrl)} required="" class="svelte-1wesq8o"/></div></div> <div class="row-edit-options svelte-1wesq8o"><label class="checkbox-label svelte-1wesq8o"><input type="checkbox" name="use_ad_interstitial"${attr("checked", editingUseAdInterstitial, true)} class="svelte-1wesq8o"/> <span>${escape_html(t(lang(), "admin.shortlinks.show_ad_interstitial"))}</span></label> `);
          {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <label class="checkbox-label svelte-1wesq8o"><input type="checkbox" name="is_indexed"${attr("checked", editingIsIndexed, true)} class="svelte-1wesq8o"/> <span>${escape_html(t(lang(), "admin.shortlinks.index_google"))}</span></label></div> `);
          {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <div class="edit-actions"><button type="submit" class="btn btn-small btn-primary">${escape_html(t(lang(), "admin.ui.save"))}</button> <button type="button" class="btn btn-small">${escape_html(t(lang(), "admin.ui.cancel"))}</button></div></form></td></tr>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<tr class="svelte-1wesq8o"><td class="svelte-1wesq8o"><div class="link-copy-container svelte-1wesq8o"><a${attr("href", `/l/${stringify(link.slug)}`)} target="_blank" class="shortlink-anchor svelte-1wesq8o">/l/${escape_html(link.slug)}</a> <button type="button" class="btn-copy svelte-1wesq8o"${attr("title", t(lang(), "admin.shortlinks.copy_full"))}>`);
          if (copiedSlug === link.slug) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="copied-text svelte-1wesq8o">✓ ${escape_html(t(lang(), "admin.shortlinks.copied"))}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
          }
          $$renderer2.push(`<!--]--></button></div></td><td class="svelte-1wesq8o"><span class="dest-url svelte-1wesq8o"${attr("title", link.destination_url)}>${escape_html(link.destination_url)}</span></td><td class="svelte-1wesq8o"><div class="config-badges svelte-1wesq8o">`);
          if (link.use_ad_interstitial === 1) {
            $$renderer2.push("<!--[0-->");
            if (link.fixed_ad_id) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="badge badge-ad svelte-1wesq8o">📌 ${escape_html(t(lang(), "admin.shortlinks.badge_fixed_ad", { s: String(link.ad_duration_seconds) }))}</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<span class="badge badge-ad svelte-1wesq8o">📢 ${escape_html(t(lang(), "admin.shortlinks.badge_ad", { s: String(link.ad_duration_seconds) }))}</span>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="badge badge-direct svelte-1wesq8o">⚡ ${escape_html(t(lang(), "admin.shortlinks.badge_direct"))}</span>`);
          }
          $$renderer2.push(`<!--]--> `);
          if (link.is_indexed === 1) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="badge badge-indexed svelte-1wesq8o"${attr("title", t(lang(), "admin.shortlinks.badge_indexed_title"))}>🔍 ${escape_html(t(lang(), "admin.shortlinks.badge_indexed"))}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="badge badge-noindex svelte-1wesq8o"${attr("title", t(lang(), "admin.shortlinks.badge_private_title"))}>🔒 ${escape_html(t(lang(), "admin.shortlinks.badge_private"))}</span>`);
          }
          $$renderer2.push(`<!--]--></div></td><td class="svelte-1wesq8o"><span class="clicks-badge svelte-1wesq8o">${escape_html(link.clicks_count)}</span></td><td class="svelte-1wesq8o"><div class="action-buttons svelte-1wesq8o"><button type="button" class="btn btn-small svelte-1wesq8o">${escape_html(t(lang(), "admin.ui.edit"))}</button> <form method="POST" action="?/delete" style="display:inline;" class="svelte-1wesq8o"><input type="hidden" name="id"${attr("value", link.id)} class="svelte-1wesq8o"/> <button type="submit" class="btn btn-small btn-danger svelte-1wesq8o">${escape_html(t(lang(), "admin.ui.delete"))}</button></form></div></td></tr>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> `);
      if (data.totalPages > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="pagination-wrapper svelte-1wesq8o">`);
        Pagination($$renderer2, {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          baseUrl: "/admin/shortlinks?q=" + encodeURIComponent(data.q || "")
        });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CfUrVEZg.js.map
