import { G as head, Q as escape_html, J as attr, I as attr_class, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, f as formatMoney, b as adminErrorMessage } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data, form } = $$props;
    let loading = false;
    const formError = derived(() => adminErrorMessage(lang(), form?.error));
    let showHtml = false;
    let titleValue = form?.title || "";
    let htmlContent = form?.content || "";
    let excerptValue = form?.excerpt || "";
    let slugValue = form?.slug || "";
    let coverImageValue = form?.cover_image || "";
    form?.pinterest_image || "";
    let youtubeVideoUrlValue = form?.youtube_video_url || "";
    let tagsValue = form?.tags || "";
    head("w7gc21", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin | ${escape_html(t(lang(), "admin.posts.create_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="editor-page svelte-w7gc21"><div class="editor-header svelte-w7gc21"><h1 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.create_title"))}</h1> <div class="header-actions svelte-w7gc21"><a href="/admin/posts" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a></div></div> `);
    if (formError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="message message-error">${escape_html(formError())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" enctype="multipart/form-data"><div class="editor-layout svelte-w7gc21"><div class="editor-main svelte-w7gc21"><div class="title-input-wrapper svelte-w7gc21"><input type="text" id="title" name="title" class="title-input svelte-w7gc21"${attr("value", titleValue)} required=""${attr("placeholder", t(lang(), "admin.posts.title_placeholder"))}/></div> <div class="content-editor-wrapper svelte-w7gc21"><div class="editor-toolbar svelte-w7gc21"><div class="toolbar-group svelte-w7gc21"><button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.bold"))}><strong>B</strong></button> <button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.italic"))}><em>I</em></button></div> <div class="toolbar-divider svelte-w7gc21"></div> <div class="toolbar-group svelte-w7gc21"><button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.heading_2"))}>H2</button> <button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.heading_3"))}>H3</button></div> <div class="toolbar-divider svelte-w7gc21"></div> <div class="toolbar-group svelte-w7gc21"><button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.paragraph"))}>¶</button> <button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.list"))}>☰</button> <button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.quote"))}>"</button></div> <div class="toolbar-divider svelte-w7gc21"></div> <div class="toolbar-group svelte-w7gc21"><button type="button" class="toolbar-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.link"))}>🔗</button> <button type="button" class="toolbar-btn youtube-btn svelte-w7gc21"${attr("title", t(lang(), "admin.posts.insert_youtube"))}>▶️</button></div> <div class="toolbar-spacer svelte-w7gc21"></div> <div class="toolbar-group svelte-w7gc21"><button type="button"${attr_class("toolbar-btn html-btn svelte-w7gc21", void 0, { "active": showHtml })}${attr("title", t(lang(), "admin.posts.toggle_html"))}>&lt;/></button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="visual-editor article-content svelte-w7gc21" contenteditable="true" role="textbox" aria-multiline="true"${attr("data-placeholder", t(lang(), "admin.posts.editor_placeholder"))} tabindex="0"></div>`);
    }
    $$renderer2.push(`<!--]--> <input type="hidden" name="content"${attr("value", htmlContent)}/></div></div> <div class="editor-sidebar svelte-w7gc21"><div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.publication"))}</h3> <div class="publish-options svelte-w7gc21"><label class="checkbox-label svelte-w7gc21"><input type="checkbox" name="published"${attr("checked", form?.published || false, true)} class="svelte-w7gc21"/> <span>${escape_html(t(lang(), "admin.posts.publish_now"))}</span></label> <label class="checkbox-label svelte-w7gc21"><input type="checkbox" name="is_18_plus"${attr("checked", form?.is_18_plus || false, true)} class="svelte-w7gc21"/> <span>${escape_html(t(lang(), "admin.posts.is_18"))}</span></label></div> <button type="submit" class="btn btn-primary publish-btn svelte-w7gc21"${attr("disabled", loading, true)}>${escape_html(t(lang(), "admin.posts.publish"))}</button></div> <div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.post_url"))}</h3> <div class="form-group svelte-w7gc21"><input type="text" id="slug" name="slug" class="form-input"${attr("value", slugValue)}${attr("placeholder", t(lang(), "admin.posts.slug_placeholder"))}/> <small class="hint svelte-w7gc21">${escape_html(t(lang(), "admin.posts.slug_hint"))}</small></div></div> <div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.cover_image"))}</h3> <div class="form-group svelte-w7gc21"><input type="text" id="cover_image" name="cover_image" class="form-input"${attr("value", coverImageValue)}${attr("placeholder", t(lang(), "admin.posts.cover_url_placeholder"))}/> <div class="file-picker-row svelte-w7gc21"><input id="cover_image_file" type="file" name="cover_image_file" class="file-input-hidden svelte-w7gc21" accept="image/*"/> <label for="cover_image_file" class="btn btn-small">${escape_html(t(lang(), "admin.posts.choose_file"))}</label> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (coverImageValue) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="cover-preview svelte-w7gc21"><img${attr("src", coverImageValue)}${attr("alt", t(lang(), "admin.posts.preview"))} class="svelte-w7gc21"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <small class="hint svelte-w7gc21">${escape_html(t(lang(), "admin.posts.cover_hint"))}</small></div></div> <div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.featured_video"))}</h3> <div class="form-group svelte-w7gc21"><input type="url" id="youtube_video_url" name="youtube_video_url" class="form-input"${attr("value", youtubeVideoUrlValue)}${attr("placeholder", t(lang(), "admin.posts.youtube_url_placeholder"))}/> <small class="hint svelte-w7gc21">${escape_html(t(lang(), "admin.posts.featured_video_hint"))}</small></div></div> <div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.excerpt"))}</h3> <div class="form-group svelte-w7gc21"><textarea id="excerpt" name="excerpt" class="form-textarea excerpt-textarea svelte-w7gc21" rows="4"${attr("placeholder", t(lang(), "admin.posts.excerpt_placeholder"))}>`);
    const $$body_1 = escape_html(excerptValue);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea></div></div> <div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.tags"))}</h3> <div class="form-group svelte-w7gc21"><input type="text" id="tags" name="tags" class="form-input"${attr("placeholder", t(lang(), "admin.posts.tags_placeholder"))}${attr("value", tagsValue)}/> <small class="hint svelte-w7gc21">${escape_html(t(lang(), "admin.posts.tags_hint"))}</small></div></div> `);
    if (data.categories && data.categories.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.categories"))}</h3> <div class="categories-checkboxes"><!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<label class="checkbox-label svelte-w7gc21"><input type="checkbox" name="categories"${attr("value", category.id)} class="svelte-w7gc21"/> <span>${escape_html(category.name)}</span></label>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.products && data.products.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sidebar-card svelte-w7gc21"><h3 class="svelte-w7gc21">${escape_html(t(lang(), "admin.posts.products_attached"))}</h3> <div class="categories-checkboxes"><!--[-->`);
      const each_array_1 = ensure_array_like(data.products);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<label class="checkbox-label svelte-w7gc21"><input type="checkbox" name="products"${attr("value", product.id)} class="svelte-w7gc21"/> <span>${escape_html(product.name)}
                    (${escape_html(product.price_cents === 0 ? t(lang(), "admin.posts.free") : formatMoney(lang(), product.price_cents))})</span></label>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></form></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bi1LJXZ6.js.map
