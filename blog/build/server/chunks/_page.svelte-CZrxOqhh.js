import { G as head, Q as escape_html, J as attr, I as attr_class, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { h as html } from './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data, form } = $$props;
    let currentToken = derived(() => form?.token || data.token || "");
    let tokenConfigured = derived(() => Boolean(currentToken()) || data.tokenConfigured);
    let showToken = false;
    let loading = false;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://seusite.com";
    function cb(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    head("113gjnt", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.cli.title"))} / API</title>`);
      });
    });
    $$renderer2.push(`<div class="cli-page svelte-113gjnt"><div class="page-header svelte-113gjnt"><div><h1 class="svelte-113gjnt">🖥️ ${escape_html(t(lang(), "admin.cli.heading"))}</h1> <p class="subtitle svelte-113gjnt">${escape_html(t(lang(), "admin.cli.subtitle"))}</p></div></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert alert-error svelte-113gjnt">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="section svelte-113gjnt"><div class="token-card svelte-113gjnt"><div class="token-card-header svelte-113gjnt"><div class="token-header-left svelte-113gjnt"><div class="token-icon svelte-113gjnt">🔑</div> <div><h2 class="svelte-113gjnt">${escape_html(t(lang(), "admin.cli.auth_token"))}</h2> <p class="svelte-113gjnt">${escape_html(t(lang(), "admin.cli.auth_token_desc"))}</p></div></div> <form method="POST" action="?/regenerate"><button type="submit" class="btn btn-danger svelte-113gjnt"${attr("disabled", loading, true)}>${escape_html("🔄 Regenerar Token")}</button></form></div> <div class="token-display svelte-113gjnt"><div class="token-field svelte-113gjnt"><span${attr_class("token-value svelte-113gjnt", void 0, { "revealed": showToken })}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(tokenConfigured() ? "••••••••••••••••••••••••••••••••••••••" : t(lang(), "admin.cli.no_token"))}`);
    }
    $$renderer2.push(`<!--]--></span> <div class="token-actions svelte-113gjnt"><button type="button" class="icon-btn svelte-113gjnt"${attr("title", "Mostrar")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--></button> <button type="button" class="icon-btn svelte-113gjnt"${attr("title", t(lang(), "admin.cli.copy_token"))}${attr("disabled", !currentToken(), true)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> `);
    if (!tokenConfigured()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="token-hint svelte-113gjnt">⚠️ Clique em "Regenerar Token" para gerar seu primeiro token.</p>`);
    } else if (!currentToken()) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="token-hint svelte-113gjnt">🔒 Token protegido. Por segurança, ele só é exibido uma vez. Regenere para obter um novo valor.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="token-hint svelte-113gjnt">⚠️ Copie agora: o token não será exibido novamente e expira em 90 dias.</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="token-usage svelte-113gjnt"><span class="usage-label svelte-113gjnt">Uso no header:</span> <code class="svelte-113gjnt">Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}</code> <button type="button" class="copy-inline svelte-113gjnt" title="Copiar Header">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div></div></section> <section class="section svelte-113gjnt"><h2 class="section-title svelte-113gjnt">🏷️ ${escape_html(t(lang(), "admin.cli.categories_title"))}</h2> <div class="table-card svelte-113gjnt"><table class="ref-table svelte-113gjnt"><thead><tr><th class="svelte-113gjnt">ID</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.name"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.slug"))}</th><th class="svelte-113gjnt">Pinterest</th><th class="svelte-113gjnt">Posts</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(data.categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.push(`<tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">${escape_html(cat.id)}</code></td><td class="svelte-113gjnt">${escape_html(cat.name)}</td><td class="svelte-113gjnt"><code class="svelte-113gjnt">${escape_html(cat.slug)}</code></td><td class="center svelte-113gjnt">${escape_html(cat.pinterest_enabled ? "✅" : "—")}</td><td class="center svelte-113gjnt">${escape_html(cat.post_count || 0)}</td></tr>`);
    }
    $$renderer2.push(`<!--]-->`);
    if (data.categories.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tr class="svelte-113gjnt"><td colspan="5" class="empty svelte-113gjnt">${escape_html(t(lang(), "admin.cli.no_categories"))}</td></tr>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></tbody></table></div></section> <section class="section svelte-113gjnt"><h2 class="section-title svelte-113gjnt">📝 ${escape_html(t(lang(), "admin.cli.recent_posts"))}</h2> <div class="table-card svelte-113gjnt"><table class="ref-table svelte-113gjnt"><thead><tr><th class="svelte-113gjnt">ID</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.title"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.slug"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.status"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.ui.date"))}</th></tr></thead><tbody><!--[-->`);
    const each_array_1 = ensure_array_like(data.posts);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let post = each_array_1[$$index_1];
      $$renderer2.push(`<tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">${escape_html(post.id)}</code></td><td class="post-title svelte-113gjnt">${escape_html(post.title)}</td><td class="svelte-113gjnt"><code class="small svelte-113gjnt">${escape_html(post.slug)}</code></td><td class="center svelte-113gjnt"><span${attr_class("badge svelte-113gjnt", void 0, { "badge-pub": post.published, "badge-draft": !post.published })}>${escape_html(post.published ? t(lang(), "admin.ui.published") : t(lang(), "admin.ui.draft"))}</span></td><td class="svelte-113gjnt">${escape_html(new Date(post.created_at).toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR"))}</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></section> <section class="section svelte-113gjnt"><h2 class="section-title svelte-113gjnt">📚 ${escape_html(t(lang(), "admin.cli.full_docs"))}</h2> <div class="doc-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method get svelte-113gjnt">GET</span> <code class="endpoint svelte-113gjnt">/api/cli/posts</code> <span class="doc-desc svelte-113gjnt">Listar posts com paginação</span></div> <div class="doc-body svelte-113gjnt"><div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">curl -H "Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}" \\
  "${escape_html(baseUrl)}/api/cli/posts?page=1&amp;limit=25"</code></pre></div> <div class="response-example svelte-113gjnt"><div class="code-label svelte-113gjnt">Resposta</div> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">{ "posts": [...], "pagination": { "page": 1, "limit": 25, "total": 42, "totalPages": 2 } }</code></pre></div></div></div> <div class="doc-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method post svelte-113gjnt">POST</span> <code class="endpoint svelte-113gjnt">/api/cli/posts</code> <span class="doc-desc svelte-113gjnt">${escape_html(t(lang(), "admin.cli.create_post"))}</span></div> <div class="doc-body svelte-113gjnt"><div class="fields-grid svelte-113gjnt"><div class="field-item required svelte-113gjnt"><code class="svelte-113gjnt">title</code> <span class="svelte-113gjnt">string — obrigatório</span></div> <div class="field-item required svelte-113gjnt"><code class="svelte-113gjnt">content</code> <span class="svelte-113gjnt">string HTML — obrigatório</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">excerpt</code> <span class="svelte-113gjnt">string — resumo</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">cover_image</code> <span class="svelte-113gjnt">string URL — imagem de capa</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">published</code> <span class="svelte-113gjnt">boolean — publicar (default: false)</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">pinterest_enabled</code> <span class="svelte-113gjnt">boolean — incluir no feed Pinterest</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">pinterest_image</code> <span class="svelte-113gjnt">string URL — imagem vertical 9:16</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">category_ids</code> <span class="svelte-113gjnt">number[] — ex: [1, 2]</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">is_18_plus</code> <span class="svelte-113gjnt">boolean — conteúdo adulto</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">is_premium</code> <span class="svelte-113gjnt">boolean — conteúdo premium</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">youtube_video_url</code> <span class="svelte-113gjnt">string URL — vídeo relacionado</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">tags</code> <span class="svelte-113gjnt">string — tags separadas por vírgula</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">slug</code> <span class="svelte-113gjnt">string — URL customizada (opcional)</span></div></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">curl -X POST \\
  -H "Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Meu Post Incrível",
    "content": "&lt;p>Conteúdo do post em &lt;strong>HTML&lt;/strong>.&lt;/p>",
    "excerpt": "Resumo do post",
    "cover_image": "https://exemplo.com/imagem.jpg",
    "published": true,
    "pinterest_enabled": true,
    "pinterest_image": "https://exemplo.com/vertical.jpg",
    "category_ids": [${escape_html(data.categories[0]?.id || 1)}],
    "is_18_plus": false
  }' \\
  ${escape_html(baseUrl)}/api/cli/posts</code></pre></div> <div class="response-example svelte-113gjnt"><div class="code-label svelte-113gjnt">Resposta 201</div> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">{ "success": true, "id": 42, "slug": "meu-post-incrivel" }</code></pre></div></div></div> <div class="doc-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method get svelte-113gjnt">GET</span> <code class="endpoint svelte-113gjnt">/api/cli/posts/:id</code> <span class="doc-desc svelte-113gjnt">${escape_html(t(lang(), "admin.cli.get_post"))}</span></div> <div class="doc-body svelte-113gjnt"><div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">curl -H "Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}" \\
  ${escape_html(baseUrl)}/api/cli/posts/1</code></pre></div></div></div> <div class="doc-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method put svelte-113gjnt">PUT</span> <code class="endpoint svelte-113gjnt">/api/cli/posts/:id</code> <span class="doc-desc svelte-113gjnt">${escape_html(t(lang(), "admin.cli.edit_post"))}</span></div> <div class="doc-body svelte-113gjnt"><div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Publicar + ativar Pinterest</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PUT \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"published": true, "pinterest_enabled": true}' \\
  ${baseUrl}/api/cli/posts/1`))}</code></pre></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Atualizar categorias</div> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PUT \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"category_ids": [${data.categories.map((c) => c.id).join(", ") || "1, 2"}]}' \\
  ${baseUrl}/api/cli/posts/1`))}</code></pre></div></div></div> <div class="doc-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method delete svelte-113gjnt">DELETE</span> <code class="endpoint svelte-113gjnt">/api/cli/posts/:id</code> <span class="doc-desc svelte-113gjnt">${escape_html(t(lang(), "admin.cli.delete_post"))}</span></div> <div class="doc-body svelte-113gjnt"><div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">curl -X DELETE \\
  -H "Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}" \\
  ${escape_html(baseUrl)}/api/cli/posts/1?confirm=1</code></pre></div></div></div> <div class="section-divider svelte-113gjnt"><span>🖼️ Upload de Imagens — Cloudinary</span></div> <div class="doc-card upload-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method post svelte-113gjnt">POST</span> <code class="endpoint svelte-113gjnt">/api/cli/upload</code> <span class="doc-desc svelte-113gjnt">${escape_html(t(lang(), "admin.cli.upload_desc"))}</span></div> <div class="doc-body svelte-113gjnt"><div class="pinterest-tip svelte-113gjnt"><span class="svelte-113gjnt">💡</span> <div><strong>Fluxo recomendado:</strong> Faça o upload da imagem primeiro com este endpoint, 
            pegue a <code class="svelte-113gjnt">url</code> retornada e use-a nos campos <code class="svelte-113gjnt">cover_image</code> ou <code class="svelte-113gjnt">pinterest_image</code> ao criar/editar posts. O upload é feito diretamente 
            para o Cloudinary via servidor — seguro, sem expor credenciais.</div></div> <div class="fields-grid svelte-113gjnt"><div class="field-item required svelte-113gjnt"><code class="svelte-113gjnt">file</code> <span class="svelte-113gjnt">arquivo — JPG, PNG, WEBP, GIF, AVIF (máx 20MB)</span></div> <div class="field-item svelte-113gjnt"><code class="svelte-113gjnt">folder</code> <span class="svelte-113gjnt">string — subpasta no Cloudinary (default: "blog")</span></div></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Upload de imagem</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X POST \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -F "file=@/caminho/para/imagem.jpg" \\
  -F "folder=blog" \\
  ${baseUrl}/api/cli/upload`))}</code></pre></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Criar post com imagem em um só fluxo (shell script)</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`#!/bin/bash
TOKEN="${currentToken() || "SEU_TOKEN"}"
BASE="${baseUrl}"

# 1. Faz upload da imagem
IMAGEM_URL=$(curl -s -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -F "file=@capa.jpg" \\
  "$BASE/api/cli/upload" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])")

echo "Imagem: $IMAGEM_URL"

# 2. Cria o post com a URL retornada
curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{\\"title\\": \\"Título\\", \\"content\\": \\"<p>Corpo</p>\\", \\"cover_image\\": \\"$IMAGEM_URL\\", \\"published\\": true}" \\
  "$BASE/api/cli/posts"`))}</code></pre></div> <div class="response-example svelte-113gjnt"><div class="code-label svelte-113gjnt">Resposta 201</div> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">{ "success": true, "url": "https://res.cloudinary.com/SEU_CLOUD/image/upload/v123/blog/imagem.jpg", "filename": "capa.jpg", "size": 348210, "type": "image/jpeg" }</code></pre></div></div></div> <div class="section-divider svelte-113gjnt"><span>📌 Pinterest — Automação de Feed</span></div> <div class="doc-card pinterest-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method post svelte-113gjnt">POST</span> <code class="endpoint svelte-113gjnt">/api/cli/posts</code> <span class="doc-desc svelte-113gjnt">Criar post com Pinterest ativado (exemplo completo)</span></div> <div class="doc-body svelte-113gjnt"><div class="pinterest-tip svelte-113gjnt"><span class="svelte-113gjnt">💡</span> <div><strong>Como funciona:</strong> Ao criar ou editar um post, passe <code class="svelte-113gjnt">pinterest_enabled: true</code> e opcionalmente <code class="svelte-113gjnt">pinterest_image</code> com URL de uma imagem vertical (9:16, ideal 1000×1500px). 
            O post aparecerá automaticamente em <code class="svelte-113gjnt">/pinterest.xml</code> e nos feeds por categoria.</div></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Post com Pinterest</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">curl -X POST \\
  -H "Authorization: Bearer ${escape_html(currentToken() || "SEU_TOKEN")}" \\
  -H "Content-Type: application/json" \\
  -d '{ 
    "title": "Look do Dia: Casual Chic",
    "content": "&lt;p>Conteúdo do post...&lt;/p>",
    "excerpt": "Visual leve e sofisticado para o dia a dia",
    "cover_image": "https://res.cloudinary.com/exemplo/imagem.jpg",
    "published": true,
    "pinterest_enabled": true,
    "pinterest_image": "https://res.cloudinary.com/exemplo/vertical-9x16.jpg",
    "category_ids": [${escape_html(data.categories[0]?.id || 1)}],
    "is_18_plus": false
  }' \\
  ${escape_html(baseUrl)}/api/cli/posts</code></pre></div></div></div> <div class="doc-card pinterest-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method put svelte-113gjnt">PUT</span> <code class="endpoint svelte-113gjnt">/api/cli/posts/:id</code> <span class="doc-desc svelte-113gjnt">Ativar ou desativar Pinterest em post existente</span></div> <div class="doc-body svelte-113gjnt"><div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Ativar Pinterest + definir imagem vertical</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PUT \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"pinterest_enabled": true, "pinterest_image": "https://res.cloudinary.com/exemplo/vertical.jpg"}' \\
  ${baseUrl}/api/cli/posts/1`))}</code></pre></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Desativar Pinterest</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PUT \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"pinterest_enabled": false}' \\
  ${baseUrl}/api/cli/posts/1`))}</code></pre></div></div></div> <div class="doc-card pinterest-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method patch svelte-113gjnt">PATCH</span> <code class="endpoint svelte-113gjnt">/api/cli/categories/:id</code> <span class="doc-desc svelte-113gjnt">Ativar ou desativar o feed Pinterest de uma categoria</span></div> <div class="doc-body svelte-113gjnt"><div class="pinterest-tip svelte-113gjnt"><span class="svelte-113gjnt">💡</span> <div><strong>Por que isso importa:</strong> Cada categoria com <code class="svelte-113gjnt">pinterest_enabled: true</code> gera 
            automaticamente o feed <code class="svelte-113gjnt">/pinterest_&lt;slug>.xml</code> para conectar como board separado no Pinterest.
            Por exemplo, a categoria "Looks" gera o feed <code class="svelte-113gjnt">/pinterest_looks.xml</code>.</div></div> <div class="fields-grid svelte-113gjnt"><div class="field-item required svelte-113gjnt"><code class="svelte-113gjnt">pinterest_enabled</code> <span class="svelte-113gjnt">boolean — obrigatório</span></div></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Ativar Pinterest na categoria</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PATCH \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"pinterest_enabled": true}' \\
  ${baseUrl}/api/cli/categories/${data.categories[0]?.id || 1}`))}</code></pre></div> <div class="code-block-wrapper svelte-113gjnt"><div class="code-label svelte-113gjnt">curl — Desativar Pinterest na categoria</div> <button class="copy-btn svelte-113gjnt">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${escape_html(t(lang(), "admin.ui.copy"))}`);
    }
    $$renderer2.push(`<!--]--></button> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">${html(cb(`curl -X PATCH \\
  -H "Authorization: Bearer ${currentToken() || "SEU_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{"pinterest_enabled": false}' \\
  ${baseUrl}/api/cli/categories/${data.categories[0]?.id || 1}`))}</code></pre></div> <div class="response-example svelte-113gjnt"><div class="code-label svelte-113gjnt">Resposta</div> <pre class="svelte-113gjnt"><code class="svelte-113gjnt">{ "success": true, "category": { "id": 1, "name": "Looks", "slug": "looks", "pinterest_enabled": true }, "message": "Pinterest ativado para a categoria \\"Looks\\"." }</code></pre></div> `);
    if (data.categories.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="categories-quick svelte-113gjnt"><strong>Suas categorias (use o ID no comando acima):</strong> <div class="cat-pills svelte-113gjnt"><!--[-->`);
      const each_array_2 = ensure_array_like(data.categories);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let cat = each_array_2[$$index_2];
        $$renderer2.push(`<div${attr_class("cat-pill svelte-113gjnt", void 0, { "pill-active": Boolean(cat.pinterest_enabled) })}><code>${escape_html(cat.id)}</code> <span>${escape_html(cat.name)}</span> <span class="pill-status svelte-113gjnt">${escape_html(cat.pinterest_enabled ? "📌 " + t(lang(), "admin.cli.active") : "— " + t(lang(), "admin.cli.inactive"))}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="doc-card error-codes-card svelte-113gjnt"><div class="doc-header svelte-113gjnt"><span class="method info svelte-113gjnt">INFO</span> <code class="endpoint svelte-113gjnt">${escape_html(t(lang(), "admin.cli.error_codes"))}</code></div> <div class="doc-body svelte-113gjnt"><table class="ref-table svelte-113gjnt"><thead><tr><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.cli.code"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.cli.meaning"))}</th><th class="svelte-113gjnt">${escape_html(t(lang(), "admin.cli.solution"))}</th></tr></thead><tbody><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">401</code></td><td class="svelte-113gjnt">Header Authorization ausente</td><td class="svelte-113gjnt">Adicione <code class="svelte-113gjnt">-H "Authorization: Bearer TOKEN"</code></td></tr><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">403</code></td><td class="svelte-113gjnt">Token inválido ou expirado</td><td class="svelte-113gjnt">Regenere o token nesta página</td></tr><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">400</code></td><td class="svelte-113gjnt">Dados inválidos</td><td class="svelte-113gjnt">Verifique o JSON e campos obrigatórios</td></tr><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">404</code></td><td class="svelte-113gjnt">Post/recurso não encontrado</td><td class="svelte-113gjnt">Verifique o ID ou slug</td></tr><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">201</code></td><td class="svelte-113gjnt">Post criado com sucesso</td><td class="svelte-113gjnt">—</td></tr><tr class="svelte-113gjnt"><td class="svelte-113gjnt"><code class="svelte-113gjnt">200</code></td><td class="svelte-113gjnt">Sucesso</td><td class="svelte-113gjnt">—</td></tr></tbody></table></div></div></section></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CZrxOqhh.js.map
