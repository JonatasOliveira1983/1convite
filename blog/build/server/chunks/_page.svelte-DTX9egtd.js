import { Q as escape_html, R as ensure_array_like, I as attr_class, O as stringify, X as attr_style, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { h as html } from './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function getPlacementName(placement) {
      const placements = {
        sidebar: "Sidebar",
        home_middle: "Home (Meio)",
        post_inline: "Post (Interno)",
        in_article: "Artigo (Nativo)"
      };
      return placements[placement] || placement;
    }
    function getTypeName(type) {
      const types = {
        html: "Script/HTML",
        image: "Banner/Imagem",
        text: "Texto",
        native: "Conteúdo Nativo"
      };
      return types[type] || type;
    }
    function getTypeIcon(type) {
      const icons = {
        html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        text: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        native: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
      };
      return icons[type] || "";
    }
    $$renderer2.push(`<div class="ads-page svelte-rhcrw1"><div class="page-header svelte-rhcrw1"><div class="page-header-title"><h1 class="svelte-rhcrw1">${escape_html(t(lang(), "admin.ads.heading"))}</h1> <p class="subtitle svelte-rhcrw1">${escape_html(t(lang(), "admin.ads.heading"))}</p></div> <a href="/admin/ads/new" class="btn btn-primary svelte-rhcrw1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Nova Campanha</a></div> <div class="stats-row svelte-rhcrw1"><div class="stat-card svelte-rhcrw1"><span class="stat-number svelte-rhcrw1">${escape_html(data.ads.length)}</span> <span class="stat-label svelte-rhcrw1">Total</span></div> <div class="stat-card svelte-rhcrw1"><span class="stat-number svelte-rhcrw1">${escape_html(data.ads.filter((a) => a.is_active === 1).length)}</span> <span class="stat-label svelte-rhcrw1">Ativas</span></div> <div class="stat-card svelte-rhcrw1"><span class="stat-number svelte-rhcrw1">${escape_html(data.ads.filter((a) => a.type === "native").length)}</span> <span class="stat-label svelte-rhcrw1">Nativos</span></div></div> <div class="card svelte-rhcrw1">`);
    if (data.ads.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-rhcrw1"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> <p>${escape_html(t(lang(), "admin.ads.empty"))}</p> <a href="/admin/ads/new" class="btn btn-small btn-primary svelte-rhcrw1">Começar agora</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container svelte-rhcrw1"><table class="table svelte-rhcrw1"><thead><tr class="svelte-rhcrw1"><th class="svelte-rhcrw1">Campanha</th><th class="svelte-rhcrw1">Local</th><th class="svelte-rhcrw1">${escape_html(t(lang(), "admin.ui.type"))}</th><th class="svelte-rhcrw1">Peso</th><th class="svelte-rhcrw1">${escape_html(t(lang(), "admin.ui.status"))}</th><th class="text-right svelte-rhcrw1">${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(data.ads);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let ad = each_array[$$index];
        $$renderer2.push(`<tr${attr_class("svelte-rhcrw1", void 0, { "inactive": ad.is_active !== 1 })}><td class="svelte-rhcrw1"><div class="ad-info svelte-rhcrw1"><span class="ad-name svelte-rhcrw1">${escape_html(ad.name)}</span> `);
        if (ad.link_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="ad-link svelte-rhcrw1">${escape_html(ad.link_url)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="svelte-rhcrw1"><span${attr_class(`badge badge-${stringify(ad.placement)}`, "svelte-rhcrw1")}>${escape_html(getPlacementName(ad.placement))}</span></td><td class="svelte-rhcrw1"><span${attr_class(`type-badge type-${stringify(ad.type)}`, "svelte-rhcrw1")}>${html(getTypeIcon(ad.type))} ${escape_html(getTypeName(ad.type))}</span></td><td class="svelte-rhcrw1"><div class="weight-display svelte-rhcrw1"><span class="weight-bar svelte-rhcrw1"${attr_style(`width: ${stringify(ad.weight * 10)}%`)}></span> <span class="weight-text svelte-rhcrw1">${escape_html(ad.weight)}x</span></div></td><td class="svelte-rhcrw1"><span${attr_class(`status-badge ${ad.is_active ? "active" : "inactive"}`, "svelte-rhcrw1")}>${escape_html(ad.is_active ? "Ativo" : "Pausado")}</span></td><td class="text-right svelte-rhcrw1"><div class="actions svelte-rhcrw1"><a${attr("href", `/admin/ads/${stringify(ad.id)}`)} class="btn btn-small btn-icon svelte-rhcrw1" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></a> <form${attr("action", `/admin/ads/${stringify(ad.id)}/delete`)} method="POST" style="display:inline;"><button type="submit" class="btn btn-small btn-icon btn-danger svelte-rhcrw1"${attr("title", t(lang(), "admin.ui.delete"))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></form></div></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DTX9egtd.js.map
