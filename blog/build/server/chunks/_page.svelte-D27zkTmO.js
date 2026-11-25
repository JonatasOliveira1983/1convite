import { G as head, Q as escape_html, J as attr, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let newCategoryName = "";
    let newCategoryDescription = "";
    let editingId = null;
    let editingName = "";
    let editingDescription = "";
    head("1b18cg2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin | ${escape_html(t(lang(), "admin.products.categories_title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="categories-page svelte-1b18cg2"><div class="page-header svelte-1b18cg2"><h1 class="svelte-1b18cg2">${escape_html(t(lang(), "admin.products.categories_title"))}</h1> <p class="subtitle svelte-1b18cg2">Crie e gerencie as categorias dos seus recursos digitais</p></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-1b18cg2">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1b18cg2">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid-layout svelte-1b18cg2"><div class="card create-card svelte-1b18cg2"><h2 class="svelte-1b18cg2">Nova Categoria</h2> <form method="POST" action="?/create" class="form-container svelte-1b18cg2"><div class="form-group svelte-1b18cg2"><label for="name" class="svelte-1b18cg2">Nome da Categoria</label> <input type="text" id="name" name="name"${attr("value", newCategoryName)} placeholder="Ex: E-books, Scripts, Cursos" required="" minlength="2" class="svelte-1b18cg2"/></div> <div class="form-group svelte-1b18cg2"><label for="description" class="svelte-1b18cg2">Descrição (Opcional)</label> <textarea id="description" name="description" placeholder="Breve descrição da categoria..." rows="2" class="svelte-1b18cg2">`);
    const $$body = escape_html(newCategoryDescription);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <button type="submit" class="btn btn-primary" style="align-self: flex-end;">${escape_html(t(lang(), "admin.products.categories_new"))}</button></form></div> <div class="card svelte-1b18cg2"><h2 class="svelte-1b18cg2">Todas as Categorias (${escape_html(data.categories.length)})</h2> `);
    if (data.categories.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-1b18cg2"><p>${escape_html(t(lang(), "admin.categories.empty"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="categories-list svelte-1b18cg2"><!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<div class="category-item svelte-1b18cg2">`);
        if (editingId === category.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<form method="POST" action="?/update" class="edit-form svelte-1b18cg2"><input type="hidden" name="id"${attr("value", category.id)}/> <div class="form-group svelte-1b18cg2"><label for="edit_name" class="svelte-1b18cg2">${escape_html(t(lang(), "admin.ui.name"))}</label> <input type="text" id="edit_name" name="name"${attr("value", editingName)} required="" minlength="2" class="edit-input svelte-1b18cg2"/></div> <div class="form-group svelte-1b18cg2" style="margin-top: 0.5rem;"><label for="edit_desc" class="svelte-1b18cg2">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="edit_desc" name="description" rows="2" class="edit-input svelte-1b18cg2">`);
          const $$body_1 = escape_html(editingDescription);
          if ($$body_1) {
            $$renderer2.push(`${$$body_1}`);
          }
          $$renderer2.push(`</textarea></div> <div class="edit-actions svelte-1b18cg2"><button type="submit" class="btn btn-small btn-primary">${escape_html(t(lang(), "admin.ui.save"))}</button> <button type="button" class="btn btn-small btn-secondary">Cancelar</button></div></form>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="category-details svelte-1b18cg2"><span class="category-name svelte-1b18cg2">${escape_html(category.name)}</span> `);
          if (category.description) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="category-desc svelte-1b18cg2">${escape_html(category.description)}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <span class="category-slug svelte-1b18cg2">slug: <code class="svelte-1b18cg2">${escape_html(category.slug)}</code></span></div> <div class="category-actions svelte-1b18cg2"><button type="button" class="btn btn-small btn-secondary">Editar</button> <form method="POST" action="?/delete" style="display: inline;"><input type="hidden" name="id"${attr("value", category.id)}/> <button type="submit" class="btn btn-small btn-danger">${escape_html(t(lang(), "admin.ui.delete"))}</button></form></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D27zkTmO.js.map
