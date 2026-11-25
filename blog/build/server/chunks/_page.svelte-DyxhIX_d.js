import { J as attr, O as stringify, Q as escape_html, I as attr_class, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let accessType = data.course.access_type || "premium";
    let coverPreview = data.course.cover_image || "";
    let uploading = false;
    let editingLessonId = null;
    $$renderer2.push(`<div class="edit-page svelte-8kcoq1"><div class="page-header svelte-8kcoq1"><a href="/admin/courses" class="back-link svelte-8kcoq1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> Cursos</a> <div class="header-actions svelte-8kcoq1"><a${attr("href", `/members/area/${stringify(data.course.slug)}`)} target="_blank" class="btn btn-secondary btn-sm svelte-8kcoq1">Ver página</a> <form method="POST" action="?/deleteCourse"><button type="submit" class="btn btn-danger btn-sm svelte-8kcoq1">Excluir Curso</button></form></div></div> <section class="section svelte-8kcoq1"><h2 class="svelte-8kcoq1">Dados do Curso</h2> `);
    if (form?.courseError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-8kcoq1">${escape_html(form.courseError)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.courseSuccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-8kcoq1">${escape_html(form.courseSuccess)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST" action="?/updateCourse" class="course-form"><div class="form-grid svelte-8kcoq1"><div class="form-main"><div class="form-group svelte-8kcoq1"><label for="title" class="svelte-8kcoq1">Título *</label> <input id="title" name="title" type="text" required=""${attr("value", data.course.title)} class="svelte-8kcoq1"/></div> <div class="form-group svelte-8kcoq1"><label for="description" class="svelte-8kcoq1">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="description" name="description" rows="3" class="svelte-8kcoq1">`);
    const $$body = escape_html(data.course.description || "");
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-row svelte-8kcoq1"><div class="form-group svelte-8kcoq1"><label for="access_type" class="svelte-8kcoq1">Tipo de Acesso</label> `);
    $$renderer2.select(
      {
        id: "access_type",
        name: "access_type",
        value: accessType,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "free" }, ($$renderer4) => {
          $$renderer4.push(`Gratuito`);
        });
        $$renderer3.option({ value: "premium" }, ($$renderer4) => {
          $$renderer4.push(`Premium`);
        });
        $$renderer3.option({ value: "paid" }, ($$renderer4) => {
          $$renderer4.push(`Pago individualmente`);
        });
      },
      "svelte-8kcoq1"
    );
    $$renderer2.push(`</div> `);
    if (accessType === "paid") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-group svelte-8kcoq1"><label for="price" class="svelte-8kcoq1">Preço (R$)</label> <input id="price" name="price" type="number" min="0" step="0.01"${attr("value", (data.course.price_cents / 100).toFixed(2))} class="svelte-8kcoq1"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input type="hidden" name="price" value="0" class="svelte-8kcoq1"/>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-8kcoq1"><label class="toggle-label svelte-8kcoq1"><input type="hidden" name="published" value="0" class="svelte-8kcoq1"/> <input type="checkbox" name="published" value="1"${attr("checked", data.course.published === 1, true)} class="svelte-8kcoq1"/> <span>Publicado</span></label></div></div> <div class="form-side"><div class="section-label svelte-8kcoq1">Imagem de Capa</div> `);
    if (coverPreview) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="cover-preview svelte-8kcoq1"><img${attr("src", coverPreview)} alt="Capa" class="svelte-8kcoq1"/> <button type="button" class="remove-cover svelte-8kcoq1">✕</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<label${attr_class("cover-upload svelte-8kcoq1", void 0, { "uploading": uploading })}><input type="file" accept="image/*" style="display:none" class="svelte-8kcoq1"/> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> <span>${escape_html("Enviar imagem")}</span></label>`);
    }
    $$renderer2.push(`<!--]--> <input type="hidden" name="cover_image"${attr("value", coverPreview)} class="svelte-8kcoq1"/></div></div> <div class="form-footer svelte-8kcoq1"><button type="submit" class="btn btn-primary">Salvar Curso</button></div></form></section> <section class="section svelte-8kcoq1"><div class="section-header svelte-8kcoq1"><h2 class="svelte-8kcoq1">Aulas (${escape_html(data.lessons.length)})</h2> <button type="button" class="btn btn-primary btn-sm svelte-8kcoq1">${escape_html("+ Nova Aula")}</button></div> `);
    if (form?.lessonError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-8kcoq1">${escape_html(form.lessonError)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.lessonSuccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-8kcoq1">${escape_html(form.lessonSuccess)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="lessons-list svelte-8kcoq1"><!--[-->`);
    const each_array = ensure_array_like(data.lessons);
    for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
      let lesson = each_array[idx];
      $$renderer2.push(`<div${attr_class("lesson-item svelte-8kcoq1", void 0, { "editing": editingLessonId === lesson.id })}><div class="lesson-info svelte-8kcoq1" role="button" tabindex="0"><div class="lesson-drag svelte-8kcoq1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg></div> <div class="lesson-meta svelte-8kcoq1"><span class="lesson-num svelte-8kcoq1">${escape_html(idx + 1)}</span> `);
      if (lesson.topic) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="lesson-topic svelte-8kcoq1">${escape_html(lesson.topic)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="lesson-title svelte-8kcoq1">${escape_html(lesson.title)}</span> `);
      if (lesson.video_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="lesson-badge video svelte-8kcoq1">▶ Vídeo</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (lesson.is_preview) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="lesson-badge preview svelte-8kcoq1">Preview</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!lesson.published) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="lesson-badge draft svelte-8kcoq1">Rascunho</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${attr_class("expand-icon svelte-8kcoq1", void 0, { "rotated": editingLessonId === lesson.id })}><path d="M6 9l6 6 6-6"></path></svg></div> `);
      if (editingLessonId === lesson.id) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="lesson-form-box lesson-form-box--inline svelte-8kcoq1"><form method="POST" action="?/updateLesson"><input type="hidden" name="lesson_id"${attr("value", lesson.id)} class="svelte-8kcoq1"/> <input type="hidden" name="sort_order"${attr("value", lesson.sort_order)} class="svelte-8kcoq1"/> <div class="form-group svelte-8kcoq1"><label class="svelte-8kcoq1">Título da Aula *</label> <input name="title" type="text" required=""${attr("value", lesson.title)} class="svelte-8kcoq1"/></div> <div class="form-group svelte-8kcoq1"><label class="svelte-8kcoq1">Tópico / Módulo <span class="hint svelte-8kcoq1">(agrupa aulas em seções)</span></label> <input name="topic" type="text" placeholder="Ex: Módulo 1 - Fundamentos"${attr("value", lesson.topic || "")} class="svelte-8kcoq1"/></div> <div class="form-row svelte-8kcoq1"><div class="form-group svelte-8kcoq1"><label class="svelte-8kcoq1">URL do Vídeo</label> <input name="video_url" type="text" placeholder="https://youtu.be/..."${attr("value", lesson.video_url || "")} class="svelte-8kcoq1"/></div> <div class="form-group svelte-8kcoq1"><label class="svelte-8kcoq1">Plataforma</label> <select name="video_type" class="svelte-8kcoq1">`);
        $$renderer2.option(
          {
            value: "youtube",
            selected: !lesson.video_type || lesson.video_type === "youtube"
          },
          ($$renderer3) => {
            $$renderer3.push(`YouTube`);
          }
        );
        $$renderer2.option({ value: "vimeo", selected: lesson.video_type === "vimeo" }, ($$renderer3) => {
          $$renderer3.push(`Vimeo`);
        });
        $$renderer2.push(`</select></div></div> <div class="form-group svelte-8kcoq1"><label class="svelte-8kcoq1">Conteúdo / Descrição (HTML)</label> <textarea name="content" rows="4" class="svelte-8kcoq1">`);
        const $$body_1 = escape_html(lesson.content || "");
        if ($$body_1) {
          $$renderer2.push(`${$$body_1}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-row-checks svelte-8kcoq1"><label class="toggle-label svelte-8kcoq1"><input type="hidden" name="published" value="0" class="svelte-8kcoq1"/> <input type="checkbox" name="published" value="1"${attr("checked", lesson.published === 1, true)} class="svelte-8kcoq1"/> <span>Publicada</span></label> <label class="toggle-label svelte-8kcoq1"><input type="hidden" name="is_preview" value="0" class="svelte-8kcoq1"/> <input type="checkbox" name="is_preview" value="1"${attr("checked", lesson.is_preview === 1, true)} class="svelte-8kcoq1"/> <span>Preview gratuito</span></label></div> <div class="form-footer svelte-8kcoq1"><button type="submit" formaction="?/deleteLesson" class="btn btn-danger btn-sm svelte-8kcoq1">${escape_html(t(lang(), "admin.ui.delete"))}</button> <button type="button" class="btn btn-secondary btn-sm svelte-8kcoq1">${escape_html(t(lang(), "admin.ui.cancel"))}</button> <button type="submit" class="btn btn-primary btn-sm svelte-8kcoq1">Salvar Aula</button></div></form></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (data.lessons.length === 0 && true) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-lessons svelte-8kcoq1">Nenhuma aula criada ainda. Clique em "+ Nova Aula" para começar.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section> <section class="section svelte-8kcoq1"><div class="section-header svelte-8kcoq1"><h2 class="svelte-8kcoq1">Materiais (${escape_html(data.materials.length)})</h2> <button type="button" class="btn btn-primary btn-sm svelte-8kcoq1">${escape_html("+ Adicionar Material")}</button></div> `);
    if (form?.materialError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-8kcoq1">${escape_html(form.materialError)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.materialSuccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-8kcoq1">${escape_html(form.materialSuccess)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="materials-list svelte-8kcoq1"><!--[-->`);
    const each_array_1 = ensure_array_like(data.materials);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let mat = each_array_1[$$index_1];
      $$renderer2.push(`<div class="material-item svelte-8kcoq1"><div class="mat-icon svelte-8kcoq1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div> <div class="mat-info svelte-8kcoq1"><span class="mat-title svelte-8kcoq1">${escape_html(mat.title)}</span> `);
      if (mat.description) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="mat-desc svelte-8kcoq1">${escape_html(mat.description)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <span class="mat-type svelte-8kcoq1">${escape_html(mat.file_type || "arquivo")}</span> <form method="POST" action="?/deleteMaterial"><input type="hidden" name="material_id"${attr("value", mat.id)} class="svelte-8kcoq1"/> <button type="submit" class="btn-icon-danger svelte-8kcoq1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg></button></form></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (data.materials.length === 0 && true) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-lessons svelte-8kcoq1">Nenhum material adicionado.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DyxhIX_d.js.map
