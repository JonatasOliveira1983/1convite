import { Q as escape_html, R as ensure_array_like, J as attr, X as attr_style, O as stringify, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let deletingId = null;
    const accessLabels = { free: "Grátis", premium: "Premium", paid: "Pago" };
    const accessColors = { free: "#10b981", premium: "#6366f1", paid: "#f59e0b" };
    $$renderer2.push(`<div class="page-header svelte-nbog41"><div><h1 class="svelte-nbog41">${escape_html(t(lang(), "admin.courses.heading"))}</h1> <p class="subtitle svelte-nbog41">Gerencie os cursos da área de membros</p></div> <a href="/admin/courses/new" class="btn btn-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Novo Curso</a></div> `);
    if (data.courses.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-nbog41"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-nbog41"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> <h3 class="svelte-nbog41">Nenhum curso criado</h3> <p class="svelte-nbog41">Crie seu primeiro curso para a área de membros.</p> <a href="/admin/courses/new" class="btn btn-primary">Criar Primeiro Curso</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="courses-grid svelte-nbog41"><!--[-->`);
      const each_array = ensure_array_like(data.courses);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let course = each_array[$$index];
        $$renderer2.push(`<div class="course-card svelte-nbog41">`);
        if (course.cover_image) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="course-cover svelte-nbog41"><img${attr("src", course.cover_image)}${attr("alt", course.title)} class="svelte-nbog41"/></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="course-cover course-cover--placeholder svelte-nbog41"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="course-info svelte-nbog41"><div class="course-meta svelte-nbog41"><span class="access-badge svelte-nbog41"${attr_style(`background: ${stringify(accessColors[course.access_type] || "#6366f1")}20; color: ${stringify(accessColors[course.access_type] || "#6366f1")}`)}>${escape_html(accessLabels[course.access_type] || course.access_type)} `);
        if (course.access_type === "paid" && course.price_cents > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`· ${escape_html((course.price_cents / 100).toLocaleString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { style: "currency", currency: "BRL" }))}`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></span> <span${attr_class("status-badge svelte-nbog41", void 0, { "published": course.published })}>${escape_html(course.published ? t(lang(), "admin.ui.published") : t(lang(), "admin.ui.draft"))}</span></div> <h3 class="course-title svelte-nbog41">${escape_html(course.title)}</h3> <div class="course-stats svelte-nbog41"><span class="svelte-nbog41"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> ${escape_html(t(lang(), "admin.courses.lessons_count", { n: course.lesson_count }))}</span> <span class="svelte-nbog41"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> ${escape_html(t(lang(), "admin.courses.materials_count", { n: course.material_count }))}</span></div> <div class="course-actions svelte-nbog41"><a${attr("href", `/admin/courses/${stringify(course.id)}`)} class="btn btn-sm btn-secondary svelte-nbog41">${escape_html(t(lang(), "admin.ui.edit"))}</a> <a${attr("href", `/members/area/${stringify(course.slug)}`)} target="_blank" class="btn btn-sm btn-ghost svelte-nbog41">Ver</a> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", course.id)}/> <button type="submit" class="btn btn-sm btn-danger svelte-nbog41"${attr("disabled", deletingId === course.id, true)}>${escape_html(deletingId === course.id ? "..." : t(lang(), "admin.ui.delete"))}</button></form></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DlAHZq9c.js.map
