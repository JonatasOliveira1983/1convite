import { G as head, Q as escape_html, J as attr, R as ensure_array_like, O as stringify, K as derived, L as store_get, I as attr_class, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { a as LANDING_AGENT_PROMPT } from './landing-cli-manifest-CzRTn1Jl.js';
import { P as Pagination } from './Pagination-DH52TBvr.js';

function LandingCliPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      tokenConfigured = false,
      tokenExpiresAt = null,
      form = void 0
    } = $$props;
    let generating = false;
    const token = derived(() => form?.cliToken || "");
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://seusite.com";
    $$renderer2.push(`<section class="cli-panel svelte-1s8spqf"><header class="svelte-1s8spqf"><div><span class="svelte-1s8spqf">Automação</span><h2 class="svelte-1s8spqf">CLI de Landing Pages</h2><p class="svelte-1s8spqf">Crie, edite e publique landings por JSON. Elas aparecem na lista e continuam editáveis no Builder visual.</p></div> <aside class="svelte-1s8spqf"><strong${attr_class("svelte-1s8spqf", void 0, { "ready": tokenConfigured || token() })}>● ${escape_html(tokenConfigured || token() ? "Token configurado" : "Token não configurado")}</strong> `);
    if (token()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="token-row svelte-1s8spqf"><code class="token svelte-1s8spqf">${escape_html(token())}</code><button type="button" class="token-copy svelte-1s8spqf">${escape_html("Copiar")}</button></div><small class="svelte-1s8spqf">Copie agora: ele não será exibido novamente.</small>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<small class="svelte-1s8spqf">${escape_html(tokenExpiresAt ? `Expira em ${new Date(tokenExpiresAt).toLocaleDateString("pt-BR")}.` : "Gere um token para usar a API.")}</small>`);
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/regenerateCliToken"><button type="submit"${attr("disabled", generating, true)} class="svelte-1s8spqf">${escape_html(tokenConfigured ? "Regenerar token" : "Gerar token")}</button></form></aside></header> <div class="auth svelte-1s8spqf"><strong>Header obrigatório</strong><code>Authorization: Bearer ${escape_html(token() || "SEU_TOKEN")}</code></div> <div class="endpoints svelte-1s8spqf"><details open="" class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="get svelte-1s8spqf">GET</b><code>/api/cli/landing-pages/schema</code><span class="svelte-1s8spqf">Contrato para agentes de IA</span></summary><div class="svelte-1s8spqf"><p>Retorna fluxo, limites, regras visuais, tipos de bloco e todas as propriedades aceitas.</p><pre class="svelte-1s8spqf">curl -H "Authorization: Bearer SEU_TOKEN" ${escape_html(baseUrl)}/api/cli/landing-pages/schema</pre></div></details> <details open="" class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="get svelte-1s8spqf">GET</b><code>/api/cli/landing-pages/resources</code><span class="svelte-1s8spqf">Produtos e posts disponíveis</span></summary><div class="svelte-1s8spqf"><pre class="svelte-1s8spqf">curl -H "Authorization: Bearer SEU_TOKEN" ${escape_html(baseUrl)}/api/cli/landing-pages/resources</pre></div></details> <details open="" class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="ai svelte-1s8spqf">IA</b><code>Prompt pronto para o agente</code><span class="svelte-1s8spqf">Instruções copiáveis</span></summary><div class="svelte-1s8spqf"><p>Cole o prompt abaixo no agente junto com a URL do site e o token.</p><button class="copy svelte-1s8spqf" type="button">${escape_html("Copiar prompt do agente")}</button><pre class="svelte-1s8spqf">${escape_html(LANDING_AGENT_PROMPT)}</pre></div></details> <details class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="html svelte-1s8spqf">HTML</b><code>Página 100% personalizada</code><span class="svelte-1s8spqf">Uma landing inteira em um bloco</span></summary><div class="svelte-1s8spqf"><p>O agente pode criar todo o <code>&lt;main></code> em um único bloco <code>html</code>, com CSS inline responsivo. Use links <code>&lt;a></code> para CTAs; scripts, estilos globais, iframes, formulários e eventos JavaScript são removidos por segurança.</p><button class="copy svelte-1s8spqf" type="button">${escape_html("Copiar exemplo HTML completo")}</button><pre class="svelte-1s8spqf">{
  "title": "Landing autoral em HTML",
  "slug": "landing-autoral",
  "status": "draft",
  "blocks": [{
    "id": "pagina-html",
    "type": "html",
    "content": "&lt;main style="font-family:Inter,Arial,sans-serif;background:#070b18;color:#fff">&lt;section style="max-width:1120px;margin:auto;padding:96px 24px;text-align:center">&lt;p style="color:#60a5fa;font-weight:800">NOVA EXPERIÊNCIA&lt;/p>&lt;h1 style="font-size:clamp(42px,7vw,78px);line-height:1;margin:20px 0">Uma landing totalmente nova&lt;/h1>&lt;p style="max-width:680px;margin:0 auto 32px;color:#cbd5e1;font-size:20px">HTML autoral, responsivo e editável no Builder.&lt;/p>&lt;a href="#oferta" style="display:inline-block;padding:16px 26px;border-radius:12px;background:#3b82f6;color:#fff;text-decoration:none;font-weight:800">Conhecer oferta&lt;/a>&lt;/section>&lt;/main>"
  }]
}</pre></div></details> <details open="" class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="post svelte-1s8spqf">POST</b><code>/api/cli/landing-pages</code><span class="svelte-1s8spqf">Criar landing</span></summary><div class="svelte-1s8spqf"><p>Salve como <code>landing.json</code>, ajuste os recursos e envie:</p><button class="copy svelte-1s8spqf" type="button">${escape_html("Copiar landing.json")}</button><pre class="svelte-1s8spqf">{
  "title": "Oferta Premium",
  "slug": "oferta-premium",
  "status": "draft",
  "settings": { "seoTitle": "Oferta Premium", "containerWidth": "1200px" },
  "blocks": [
    {
      "id": "hero-cli",
      "type": "hero",
      "properties": {
        "eyebrow": "CONTEÚDO PREMIUM",
        "title": "Landing criada pela CLI",
        "subtitle": "Depois, edite tudo visualmente no Builder.",
        "primaryText": "Ver oferta",
        "primaryHref": "#oferta",
        "image": "https://exemplo.com/hero.jpg"
      }
    },
    {
      "id": "produto-cli",
      "type": "product-showcase",
      "properties": {
        "productId": 1,
        "name": "Nome do produto",
        "description": "Descrição da oferta",
        "price": "R$ 49,90",
        "image": "https://exemplo.com/produto.jpg",
        "buttonText": "Comprar agora",
        "buttonHref": "/product/slug-do-produto"
      }
    },
    {
      "id": "posts-cli",
      "type": "posts-grid",
      "properties": {
        "title": "Leia também",
        "posts": [{ "id": 10, "title": "Título", "slug": "titulo", "href": "/post/titulo" }]
      }
    },
    {
      "id": "html-cli",
      "type": "html",
      "content": "&lt;section style="padding:32px;background:#111827;color:white">&lt;h2>Bônus&lt;/h2>&lt;/section>"
    }
  ]
}</pre><pre class="svelte-1s8spqf">curl -X POST -H "Authorization: Bearer SEU_TOKEN" -H "Content-Type: application/json" --data-binary @landing.json ${escape_html(baseUrl)}/api/cli/landing-pages</pre></div></details> <details class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="get svelte-1s8spqf">GET</b><code>/api/cli/landing-pages</code><span class="svelte-1s8spqf">Listar e pesquisar</span></summary><div class="svelte-1s8spqf"><pre class="svelte-1s8spqf">curl -H "Authorization: Bearer SEU_TOKEN" "${escape_html(baseUrl)}/api/cli/landing-pages?page=1&amp;limit=25&amp;search=oferta"</pre></div></details> <details class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="put svelte-1s8spqf">PUT</b><code>/api/cli/landing-pages/:id</code><span class="svelte-1s8spqf">Editar ou publicar</span></summary><div class="svelte-1s8spqf"><pre class="svelte-1s8spqf">curl -X PUT -H "Authorization: Bearer SEU_TOKEN" -H "Content-Type: application/json" -d '{"status":"published"}' ${escape_html(baseUrl)}/api/cli/landing-pages/1</pre></div></details> <details class="svelte-1s8spqf"><summary class="svelte-1s8spqf"><b class="del svelte-1s8spqf">DELETE</b><code>/api/cli/landing-pages/:id?confirm=:id</code><span class="svelte-1s8spqf">Excluir definitivamente</span></summary><div class="svelte-1s8spqf"><pre class="svelte-1s8spqf">curl -X DELETE -H "Authorization: Bearer SEU_TOKEN" "${escape_html(baseUrl)}/api/cli/landing-pages/1?confirm=1"</pre></div></details></div> <footer class="svelte-1s8spqf"><strong>Blocos:</strong> hero, product-showcase, posts-grid, trust-bar, section, container, columns, column, text, image, button, video, divider, spacer, html, cta, testimonial, pricing e faq.<small class="svelte-1s8spqf">HTML é sanitizado; scripts, iframes, formulários, eventos e URLs perigosas são removidos.</small></footer></section>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let copiedSlug = null;
    head("muc4p5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin | ${escape_html(t(lang(), "admin.landing_pages.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="landing-manager-container svelte-muc4p5"><div class="header-section svelte-muc4p5"><div><h1 class="page-title svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.title"))}</h1> <p class="page-subtitle svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.subtitle"))}</p></div> <button class="create-btn svelte-muc4p5"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" class="btn-icon svelte-muc4p5"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg> ${escape_html(t(lang(), "admin.landing_pages.button"))}</button></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert alert-error svelte-muc4p5"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> ${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="list-toolbar svelte-muc4p5"><form method="GET" class="search-form svelte-muc4p5" role="search"><span class="search-icon svelte-muc4p5" aria-hidden="true">⌕</span> <input type="search" name="q"${attr("value", data.search || "")} placeholder="Buscar por título ou slug..." aria-label="Buscar landing page por título ou slug" class="svelte-muc4p5"/> `);
    if (data.search) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a class="clear-search svelte-muc4p5" href="/admin/landing-pages">Limpar</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button type="submit" class="svelte-muc4p5">Buscar</button></form> <div class="list-summary svelte-muc4p5"><strong class="svelte-muc4p5">${escape_html(data.pagination.total)}</strong><span>${escape_html(data.pagination.total === 1 ? "landing encontrada" : "landings encontradas")}</span></div></div> `);
    if (!data.landingPages || data.landingPages.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state-card svelte-muc4p5"><div class="illustration-box svelte-muc4p5"><svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="illustration-svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><line x1="12" y1="13" x2="16" y2="13"></line><line x1="12" y1="16" x2="16" y2="16"></line></svg></div> `);
      if (data.search) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<h2 class="empty-title svelte-muc4p5">Nenhuma landing encontrada</h2> <p class="empty-description svelte-muc4p5">Não encontramos título ou slug correspondente a “${escape_html(data.search)}”. Tente outro termo.</p> <a class="create-btn secondary-create svelte-muc4p5" href="/admin/landing-pages">Ver todas as landings</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<h2 class="empty-title svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.empty_title"))}</h2> <p class="empty-description svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.empty_desc"))}</p> <button class="create-btn svelte-muc4p5"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" class="btn-icon svelte-muc4p5"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path></svg> ${escape_html(t(lang(), "admin.landing_pages.create_first"))}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container svelte-muc4p5"><table class="landing-table svelte-muc4p5"><thead><tr><th class="svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.col_title"))}</th><th class="svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.col_slug"))}</th><th class="svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.col_status"))}</th><th class="svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.col_created"))}</th><th class="actions-header svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.col_actions"))}</th></tr></thead><tbody class="svelte-muc4p5"><!--[-->`);
      const each_array = ensure_array_like(data.landingPages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<tr class="svelte-muc4p5"><td class="svelte-muc4p5"><div class="title-cell svelte-muc4p5"><span class="page-name svelte-muc4p5">${escape_html(item.title)}</span></div></td><td class="svelte-muc4p5"><div class="slug-cell svelte-muc4p5"><a${attr("href", `/p/${stringify(item.slug)}`)} target="_blank" rel="noopener noreferrer" class="slug-link svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.open_public"))}>/p/${escape_html(item.slug)} <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" class="link-icon svelte-muc4p5"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg></a> <button type="button" class="copy-url-btn svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.copy_url"))}>${escape_html(copiedSlug === item.slug ? "✓" : "⧉")}</button></div></td><td class="svelte-muc4p5">`);
        if (item.status === "published") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="status-badge published svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.published"))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="status-badge draft svelte-muc4p5">${escape_html(t(lang(), "admin.landing_pages.draft"))}</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="svelte-muc4p5"><span class="date-txt svelte-muc4p5">${escape_html(new Date(item.created_at).toLocaleDateString(lang() === "pt" ? "pt-BR" : lang() === "es" ? "es-ES" : "en-US"))}</span></td><td class="actions-cell svelte-muc4p5"><a${attr("href", `/admin/landing-pages/${stringify(item.id)}`)} class="action-btn edit-btn svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.visual_editor"))}><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg> ${escape_html(t(lang(), "admin.landing_pages.visual_editor"))}</a> <form method="POST" action="?/duplicate" class="inline-form svelte-muc4p5"><input type="hidden" name="id"${attr("value", item.id)}/> <button type="submit" class="action-btn details-btn svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.duplicate"))}><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z"></path></svg></button></form> <button class="action-btn details-btn svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.edit_details"))}><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg></button> <button class="action-btn delete-btn svelte-muc4p5"${attr("title", t(lang(), "admin.landing_pages.delete_page"))}><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></button></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div> <div class="pagination-wrapper svelte-muc4p5">`);
      Pagination($$renderer2, {
        currentPage: data.pagination.page,
        totalPages: data.pagination.totalPages,
        baseUrl: `/admin/landing-pages${data.search ? `?q=${encodeURIComponent(data.search)}` : ""}`
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    LandingCliPanel($$renderer2, {
      tokenConfigured: data.cliTokenConfigured,
      tokenExpiresAt: form?.cliTokenExpiresAt || data.cliTokenExpiresAt,
      form
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-1-->");
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
//# sourceMappingURL=_page.svelte-mqZvWgRB.js.map
