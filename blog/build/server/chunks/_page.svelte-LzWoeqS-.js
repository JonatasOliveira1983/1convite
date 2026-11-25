import { Q as escape_html, I as attr_class, R as ensure_array_like, J as attr, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data } = $$props;
    function formatPrice(cents) {
      if (cents === 0) return "Gratuito / Apenas Link";
      return (cents / 100).toLocaleString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { style: "currency", currency: "BRL" });
    }
    function truncate(str, len = 60) {
      if (!str) return "";
      return str.length > len ? str.slice(0, len) + "..." : str;
    }
    const notifyFlash = derived(() => {
      const n = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("notify");
      if (!n) return null;
      const sent = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("sent") || "0";
      const failed = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("failed") || "0";
      if (n === "ok") return {
        type: "ok",
        text: `Produto salvo. E-mail de atualização enviado para ${sent} comprador(es).`
      };
      if (n === "no_buyers") return {
        type: "warn",
        text: "Produto salvo. Nenhum comprador elegível encontrado para notificar."
      };
      if (n === "no_resend") return {
        type: "err",
        text: "Produto salvo, mas Resend não está configurado (API key). Configure em Configurações → Resend."
      };
      if (n === "fail") return {
        type: "err",
        text: `Produto salvo, mas o envio falhou (enviados: ${sent}, falhas: ${failed}). Verifique domínio From no Resend e os logs do servidor.`
      };
      if (n === "error") return {
        type: "err",
        text: "Produto salvo, mas houve erro ao preparar a notificação. Veja os logs do servidor."
      };
      return null;
    });
    $$renderer2.push(`<div class="products-list-page svelte-6t53h5"><div class="page-header svelte-6t53h5"><div class="header-text"><h1 class="svelte-6t53h5">${escape_html(t(lang(), "admin.products.heading"))} Digitais</h1> <p class="subtitle svelte-6t53h5">${escape_html(t(lang(), "admin.products.heading"))}</p></div> <div class="header-actions svelte-6t53h5" style="display: flex; gap: 0.75rem; align-items: center;"><a href="/admin/products/categories" class="btn btn-secondary svelte-6t53h5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg> Categorias</a> <a href="/admin/products/new" class="btn btn-primary svelte-6t53h5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Novo Produto</a></div></div> `);
    if (notifyFlash()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("notify-banner svelte-6t53h5", void 0, {
        "ok": notifyFlash().type === "ok",
        "warn": notifyFlash().type === "warn",
        "err": notifyFlash().type === "err"
      })}>${escape_html(notifyFlash().text)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="table-container svelte-6t53h5">`);
    if (data.products && data.products.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<table class="data-table svelte-6t53h5"><thead class="svelte-6t53h5"><tr class="svelte-6t53h5"><th class="svelte-6t53h5">${escape_html(t(lang(), "admin.ui.name"))}</th><th class="svelte-6t53h5">${escape_html(t(lang(), "admin.ui.description"))}</th><th class="svelte-6t53h5">${escape_html(t(lang(), "admin.ui.price"))}</th><th class="svelte-6t53h5">Tipo de Recurso</th><th class="svelte-6t53h5">Link / Arquivo</th><th class="actions-header svelte-6t53h5">${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody class="svelte-6t53h5"><!--[-->`);
      const each_array = ensure_array_like(data.products);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let product = each_array[$$index];
        $$renderer2.push(`<tr class="svelte-6t53h5"><td class="font-semibold svelte-6t53h5" data-label="Nome"><div class="product-name-cell svelte-6t53h5">`);
        if (product.image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", product.image_url)}${attr("alt", product.name)} class="product-list-thumb svelte-6t53h5"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="product-list-thumb-placeholder svelte-6t53h5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="product-info-stack svelte-6t53h5"><span class="product-name-text svelte-6t53h5">${escape_html(product.name)}</span> `);
        if (product.slug) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="product-slug-row svelte-6t53h5"><a${attr("href", `/product/${stringify(product.slug)}`)} target="_blank" class="product-slug-link svelte-6t53h5" title="Visualizar página pública do produto">/product/${escape_html(product.slug)}</a> <button type="button" class="btn-copy-slug svelte-6t53h5" title="Copiar link completo"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div></td><td class="text-muted svelte-6t53h5" data-label="Descrição">${escape_html(truncate(product.description))}</td><td data-label="Preço" class="svelte-6t53h5"><span${attr_class("price-badge svelte-6t53h5", void 0, { "free": product.price_cents === 0 })}>${escape_html(formatPrice(product.price_cents))}</span></td><td data-label="Tipo" class="svelte-6t53h5">`);
        if (product.file_url) {
          $$renderer2.push("<!--[0-->");
          if (product.file_url.startsWith("http")) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="type-badge svelte-6t53h5" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">Cloudinary</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="type-badge file svelte-6t53h5">Arquivo Local</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else if (product.external_link) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="type-badge link svelte-6t53h5">Link Externo</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="type-badge empty svelte-6t53h5">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="file-link-cell svelte-6t53h5" data-label="Arquivo/Link">`);
        if (product.file_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `/api/download/${stringify(product.id)}`)} target="_blank" class="download-link svelte-6t53h5" title="Visualizar arquivo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> Arquivo</a>`);
        } else if (product.external_link) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<a${attr("href", product.external_link)} target="_blank" class="external-url svelte-6t53h5" title="Abrir link externo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Link</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-muted svelte-6t53h5">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="table-actions svelte-6t53h5" data-label="Ações"><a${attr("href", `/admin/products/${stringify(product.id)}`)} class="btn btn-small btn-secondary" title="Editar">Editar</a> <form method="POST" action="?/delete" style="display:inline;"><input type="hidden" name="id"${attr("value", product.id)}/> <button type="submit" class="btn btn-small btn-danger"${attr("title", t(lang(), "admin.ui.delete"))}>${escape_html(t(lang(), "admin.ui.delete"))}</button></form></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-state svelte-6t53h5"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-6t53h5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> <p class="svelte-6t53h5">${escape_html(t(lang(), "admin.products.empty"))}</p> <a href="/admin/products/new" class="btn btn-primary btn-small">Cadastrar Primeiro Produto</a></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-LzWoeqS-.js.map
