import { Q as escape_html, J as attr, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let accessType = form?.values?.access_type || "premium";
    let coverPreview = form?.values?.cover_image || "";
    let uploading = false;
    $$renderer2.push(`<div class="form-page svelte-ll8chk"><div class="form-header svelte-ll8chk"><a href="/admin/courses" class="back-link svelte-ll8chk"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> Voltar</a> <h1 class="svelte-ll8chk">${escape_html(t(lang(), "admin.courses.new"))}</h1></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-ll8chk">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" class="course-form svelte-ll8chk"><div class="form-grid svelte-ll8chk"><div class="form-main"><div class="form-group svelte-ll8chk"><label for="title" class="svelte-ll8chk">Título do Curso *</label> <input id="title" name="title" type="text" required="" placeholder="Ex: Marketing Digital para Iniciantes"${attr("value", form?.values?.title || "")} class="svelte-ll8chk"/></div> <div class="form-group svelte-ll8chk"><label for="description" class="svelte-ll8chk">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="description" name="description" rows="4" placeholder="Descreva o que o aluno vai aprender..." class="svelte-ll8chk">`);
    const $$body = escape_html(form?.values?.description || "");
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-row svelte-ll8chk"><div class="form-group svelte-ll8chk"><label for="access_type" class="svelte-ll8chk">Tipo de Acesso</label> `);
    $$renderer2.select(
      {
        id: "access_type",
        name: "access_type",
        value: accessType,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "free" }, ($$renderer4) => {
          $$renderer4.push(`Gratuito (qualquer membro)`);
        });
        $$renderer3.option({ value: "premium" }, ($$renderer4) => {
          $$renderer4.push(`Premium (assinantes)`);
        });
        $$renderer3.option({ value: "paid" }, ($$renderer4) => {
          $$renderer4.push(`Pago individualmente`);
        });
      },
      "svelte-ll8chk"
    );
    $$renderer2.push(`</div> `);
    if (accessType === "paid") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-group svelte-ll8chk"><label for="price" class="svelte-ll8chk">Preço (R$)</label> <input id="price" name="price" type="number" min="0" step="0.01" placeholder="0,00"${attr("value", form?.values?.price || "")} class="svelte-ll8chk"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input type="hidden" name="price" value="0" class="svelte-ll8chk"/>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-ll8chk"><label class="toggle-label svelte-ll8chk"><input type="hidden" name="published" value="0" class="svelte-ll8chk"/> <input type="checkbox" name="published" value="1"${attr("checked", form?.values?.published === "1", true)} class="svelte-ll8chk"/> <span class="toggle-text svelte-ll8chk">Publicar agora</span></label></div></div> <div class="form-side"><div class="cover-section"><label class="section-label svelte-ll8chk">Imagem de Capa</label> `);
    if (coverPreview) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="cover-preview svelte-ll8chk"><img${attr("src", coverPreview)} alt="Capa do curso" class="svelte-ll8chk"/> <button type="button" class="remove-cover svelte-ll8chk">✕</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<label${attr_class("cover-upload svelte-ll8chk", void 0, { "uploading": uploading })}><input type="file" accept="image/*" style="display:none" class="svelte-ll8chk"/> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> <span>${escape_html("Clique para enviar")}</span></label>`);
    }
    $$renderer2.push(`<!--]--> <input type="hidden" name="cover_image"${attr("value", coverPreview)} class="svelte-ll8chk"/></div></div></div> <div class="form-footer svelte-ll8chk"><a href="/admin/courses" class="btn btn-secondary">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary">Criar Curso</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BgYiMVX8.js.map
