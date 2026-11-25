import { G as head, Q as escape_html, J as attr, O as stringify, I as attr_class, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data, form } = $$props;
    let post = derived(() => form?.post || data.post);
    let loading = false;
    let showHtml = false;
    let activeTab = "general";
    let pinterestEnabledValue = false;
    let is18PlusValue = false;
    let pinterestImageValue = "";
    let youtubeVideoUrlValue = "";
    let tagsValue = "";
    let selectedCategoryIds = data.postCategoryIds ? [...data.postCategoryIds] : [];
    let selectedProductIds = data.postProductIds ? [...data.postProductIds] : [];
    let htmlContent = form?.post?.content || data.post?.content || "";
    let coverImageValue = form?.post?.cover_image || data.post?.cover_image || "";
    head("91ioq4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin | ${escape_html(t(lang(), "admin.posts.edit_title"))}: ${escape_html(post().title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="editor-page svelte-91ioq4"><div class="editor-header svelte-91ioq4"><h1 class="svelte-91ioq4">${escape_html(t(lang(), "admin.posts.edit_title"))}</h1> <div class="header-actions svelte-91ioq4"><a${attr("href", `/post/${stringify(post().slug)}`)} class="btn" target="_blank">👁️ Ver Post</a> <a href="/admin/posts" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a></div></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="message message-error">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" enctype="multipart/form-data"><div class="tab-navigation svelte-91ioq4"><button type="button"${attr_class("tab-button svelte-91ioq4", void 0, { "active": activeTab === "general" })}>📝 Geral</button> <button type="button"${attr_class("tab-button svelte-91ioq4", void 0, { "active": activeTab === "pinterest" })}><svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style="color: #e60023; display: inline-block; margin-right: 4px; vertical-align: middle;"><path d="M9.04 14.63c-.35 1.89-.78 3.7-2.06 4.65-.39-2.79.58-4.87 1.03-7.09-1.73-2.9 1.5-5.87 3.37-2.79 2.34 3.69-2.03 7.14.91 8.01 3.07.91 4.33-3.94 2.42-5.36-2.76-1.97-8.02-.45-6.97 4.42.27 1.22 1.41 1.59.49 2.28-.73.53-1.97-.17-2.3-1.21-.79-2.57.28-5.35 1.68-7.11 1.4-1.76 3.5-2.01 5.43-1.99 3.29.03 6.38 1.48 6.81 5.26.49 4.28-1.82 8.98-6.12 8.66-1.17-.08-1.99-.64-2.16-1.73zM10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"></path></svg>Pinterest</button></div> <div class="tab-panel svelte-91ioq4"${attr("hidden", activeTab !== "general")}><div class="editor-layout svelte-91ioq4"><div class="editor-main svelte-91ioq4"><div class="title-input-wrapper svelte-91ioq4"><input type="text" id="title" name="title" class="title-input svelte-91ioq4"${attr("value", post().title)} required="" placeholder="Adicionar título"/></div> <div class="content-editor-wrapper svelte-91ioq4"><div class="editor-toolbar svelte-91ioq4"><div class="toolbar-group svelte-91ioq4"><button type="button" class="toolbar-btn svelte-91ioq4" title="Negrito (Ctrl+B)"><strong>B</strong></button> <button type="button" class="toolbar-btn svelte-91ioq4" title="Itálico (Ctrl+I)"><em>I</em></button></div> <div class="toolbar-divider svelte-91ioq4"></div> <div class="toolbar-group svelte-91ioq4"><button type="button" class="toolbar-btn svelte-91ioq4" title="Título 2">H2</button> <button type="button" class="toolbar-btn svelte-91ioq4" title="Título 3">H3</button></div> <div class="toolbar-divider svelte-91ioq4"></div> <div class="toolbar-group svelte-91ioq4"><button type="button" class="toolbar-btn svelte-91ioq4" title="Parágrafo">¶</button> <button type="button" class="toolbar-btn svelte-91ioq4" title="Lista">☰</button> <button type="button" class="toolbar-btn svelte-91ioq4" title="Citação">"</button></div> <div class="toolbar-divider svelte-91ioq4"></div> <div class="toolbar-group svelte-91ioq4"><button type="button" class="toolbar-btn svelte-91ioq4" title="Link">🔗</button> <button type="button" class="toolbar-btn youtube-btn svelte-91ioq4" title="Inserir vídeo do YouTube">▶️</button></div> <div class="toolbar-spacer svelte-91ioq4"></div> <div class="toolbar-group svelte-91ioq4"><button type="button"${attr_class("toolbar-btn html-btn svelte-91ioq4", void 0, { "active": showHtml })} title="Ver/Editar HTML">&lt;/></button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="visual-editor article-content svelte-91ioq4" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Comece a escrever seu post..." tabindex="0"></div>`);
    }
    $$renderer2.push(`<!--]--> <input type="hidden" name="content"${attr("value", htmlContent)}/></div></div> <div class="editor-sidebar svelte-91ioq4"><div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Publicação</h3> <div class="publish-options svelte-91ioq4"><label class="checkbox-label svelte-91ioq4"><input type="checkbox" name="published"${attr("checked", Boolean(post().published), true)} class="svelte-91ioq4"/> <span>Publicado</span></label> <label class="checkbox-label svelte-91ioq4"><input type="checkbox" name="is_18_plus"${attr("checked", is18PlusValue, true)} class="svelte-91ioq4"/> <span>Conteúdo +18</span></label></div> <button type="submit" class="btn btn-primary publish-btn svelte-91ioq4"${attr("disabled", loading, true)}>${escape_html(t(lang(), "admin.ui.save_changes"))}</button></div> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">URL do Post</h3> <div class="form-group svelte-91ioq4"><input type="text" id="slug" name="slug" class="form-input"${attr("value", post().slug)} placeholder="url-do-post"/> <small class="hint svelte-91ioq4">Altere com cuidado (pode quebrar links existentes)</small></div></div> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Imagem de Capa</h3> <div class="form-group svelte-91ioq4"><input type="text" id="cover_image" name="cover_image" class="form-input"${attr("value", coverImageValue)} placeholder="https://exemplo.com/imagem.jpg ou escolha um arquivo abaixo"/> <div class="file-picker-row"><input id="cover_image_file" type="file" name="cover_image_file" class="file-input-hidden svelte-91ioq4" accept="image/*"/> <label for="cover_image_file" class="btn btn-small svelte-91ioq4">Escolher arquivo</label> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (coverImageValue) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="cover-preview svelte-91ioq4"><img${attr("src", coverImageValue)} alt="Preview" class="svelte-91ioq4"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <small class="hint svelte-91ioq4">URL da imagem de destaque ou envie um arquivo (proporção 16:9 recomendada)</small></div></div> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Vídeo em Destaque (YouTube)</h3> <div class="form-group svelte-91ioq4"><input type="url" id="youtube_video_url" name="youtube_video_url" class="form-input"${attr("value", youtubeVideoUrlValue)} placeholder="https://www.youtube.com/watch?v=..."/> <small class="hint svelte-91ioq4">Opcional. Insira a URL do vídeo do YouTube para ativar o player automático com animação premium no post.</small></div></div> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Resumo</h3> <div class="form-group svelte-91ioq4"><textarea id="excerpt" name="excerpt" class="form-textarea excerpt-textarea svelte-91ioq4" rows="4" placeholder="Breve descrição do post...">`);
    const $$body_1 = escape_html(post().excerpt || "");
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea></div></div> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Tags (Invisíveis)</h3> <div class="form-group svelte-91ioq4"><input type="text" id="tags" name="tags" class="form-input" placeholder="Ex: IA, SEO, Pinterest, Svelte"${attr("value", tagsValue)}/> <small class="hint svelte-91ioq4">Separadas por vírgula. Usadas para melhorar as recomendações de conteúdo do blog.</small></div></div> `);
    if (data.categories && data.categories.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Categorias</h3> <div class="categories-checkboxes"><!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<label class="checkbox-label svelte-91ioq4"><input type="checkbox" name="categories"${attr("value", category.id)}${attr("checked", selectedCategoryIds.includes(category.id), true)} class="svelte-91ioq4"/> <span>${escape_html(category.name)}</span></label>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.products && data.products.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Produtos Digitais Anexados</h3> <div class="categories-checkboxes"><!--[-->`);
      const each_array_1 = ensure_array_like(data.products);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<label class="checkbox-label svelte-91ioq4"><input type="checkbox" name="products"${attr("value", product.id)}${attr("checked", selectedProductIds.includes(product.id), true)} class="svelte-91ioq4"/> <span>${escape_html(product.name)} (${escape_html(product.price_cents === 0 ? "Grátis" : (product.price_cents / 100).toLocaleString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { style: "currency", currency: "BRL" }))})</span></label>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="sidebar-card svelte-91ioq4"><h3 class="svelte-91ioq4">Informações</h3> <div class="info-item svelte-91ioq4"><span class="info-label svelte-91ioq4">Criado em:</span> <span class="info-value svelte-91ioq4">${escape_html(post().created_at ? new Date(post().created_at).toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR") : "-")}</span></div> `);
    if (post().updated_at) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="info-item svelte-91ioq4"><span class="info-label svelte-91ioq4">Atualizado em:</span> <span class="info-value svelte-91ioq4">${escape_html(new Date(post().updated_at).toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR"))}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></div> <div class="tab-panel svelte-91ioq4"${attr("hidden", activeTab !== "pinterest")}><div class="pinterest-layout svelte-91ioq4"><div class="pinterest-main svelte-91ioq4"><div class="pinterest-card svelte-91ioq4"><h2 class="svelte-91ioq4"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" style="color: #e60023; display: inline-block; margin-right: 6px; vertical-align: middle;"><path d="M9.04 14.63c-.35 1.89-.78 3.7-2.06 4.65-.39-2.79.58-4.87 1.03-7.09-1.73-2.9 1.5-5.87 3.37-2.79 2.34 3.69-2.03 7.14.91 8.01 3.07.91 4.33-3.94 2.42-5.36-2.76-1.97-8.02-.45-6.97 4.42.27 1.22 1.41 1.59.49 2.28-.73.53-1.97-.17-2.3-1.21-.79-2.57.28-5.35 1.68-7.11 1.4-1.76 3.5-2.01 5.43-1.99 3.29.03 6.38 1.48 6.81 5.26.49 4.28-1.82 8.98-6.12 8.66-1.17-.08-1.99-.64-2.16-1.73zM10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"></path></svg>Configuração do Pinterest</h2> <p class="pinterest-description svelte-91ioq4">Configure este post para ser distribuído automaticamente via feed RSS para o Pinterest.
            O Pinterest importará seus artigos como Pins automaticamente.</p> <div class="pinterest-toggle-wrapper svelte-91ioq4"><label class="pinterest-toggle-label svelte-91ioq4"><input type="checkbox" name="pinterest_enabled"${attr("checked", pinterestEnabledValue, true)} class="svelte-91ioq4"/> <span class="toggle-switch svelte-91ioq4"></span> <span class="toggle-text svelte-91ioq4"><strong class="svelte-91ioq4">Disponibilizar no Feed do Pinterest</strong> <small class="svelte-91ioq4">Ative para incluir este post no feed RSS do Pinterest</small></span></label></div> <div class="pinterest-image-section svelte-91ioq4"><h3 class="svelte-91ioq4">Imagem Vertical para o Pin (9:16)</h3> <p class="hint svelte-91ioq4">Use uma imagem vertical otimizada para o Pinterest (1000×1500px ou 1080×1920px recomendado).
              Esta imagem é independente da imagem de capa do blog.</p> <div class="form-group svelte-91ioq4"><label for="pinterest_image" class="form-label">URL da Imagem Pinterest</label> <input type="text" id="pinterest_image" name="pinterest_image" class="form-input"${attr("value", pinterestImageValue)} placeholder="https://exemplo.com/imagem-vertical.jpg"/> <div class="file-upload-row svelte-91ioq4"><input id="pinterest_image_file" type="file" name="pinterest_image_file" class="file-input-hidden svelte-91ioq4" accept="image/*"/> <label for="pinterest_image_file" class="btn btn-small svelte-91ioq4">Escolher arquivo</label> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button type="button" class="btn btn-small svelte-91ioq4">🔗 Inserir URL da Imagem</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="pinterest-info svelte-91ioq4"><h3 class="svelte-91ioq4">📋 Como funciona</h3> <ol class="pinterest-steps svelte-91ioq4"><li class="svelte-91ioq4">Ative o toggle "Disponibilizar no Feed do Pinterest"</li> <li class="svelte-91ioq4">Faça upload de uma imagem vertical (proporção 9:16)</li> <li class="svelte-91ioq4">Salve o post</li> <li class="svelte-91ioq4">Cadastre no Pinterest o feed global (<code class="svelte-91ioq4">/pinterest.xml</code>) ou um feed por categoria
                (<code class="svelte-91ioq4">/pinterest_categoria.xml</code>) para usar como pasta/board</li></ol> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="pinterest-actions svelte-91ioq4"><button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html(t(lang(), "admin.ui.save_changes"))}</button> <p class="hint svelte-91ioq4">Salve o post nesta aba para manter o toggle e a imagem do Pinterest após recarregar a página.</p></div></div></div></div></div></form></div> `);
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
//# sourceMappingURL=_page.svelte-CZT33fZJ.js.map
