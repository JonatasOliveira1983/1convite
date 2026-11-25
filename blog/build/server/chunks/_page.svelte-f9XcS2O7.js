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
    let editingId = null;
    let editingName = "";
    head("11a9ln1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.categories.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="categories-page svelte-11a9ln1"><div class="page-header svelte-11a9ln1"><h1 class="svelte-11a9ln1">${escape_html(t(lang(), "admin.categories.heading"))}</h1> <p class="subtitle svelte-11a9ln1">${escape_html(t(lang(), "admin.categories.heading"))}</p></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert success svelte-11a9ln1">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-11a9ln1">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="card create-card svelte-11a9ln1"><h2 class="svelte-11a9ln1">${escape_html(t(lang(), "admin.categories.new"))}</h2> <form method="POST" action="?/create"><div class="inline-form svelte-11a9ln1"><input type="text" name="name"${attr("value", newCategoryName)} placeholder="Nome da categoria..." required="" minlength="2" class="svelte-11a9ln1"/> <button type="submit" class="btn btn-primary">${escape_html(t(lang(), "admin.ui.create"))}</button></div></form></div> <div class="card svelte-11a9ln1"><h2 class="svelte-11a9ln1">Todas as ${escape_html(t(lang(), "admin.categories.heading"))} (${escape_html(data.categories.length)})</h2> `);
    if (data.categories.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-11a9ln1"><p>Nenhuma categoria cadastrada.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="categories-list svelte-11a9ln1"><!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer2.push(`<div class="category-item svelte-11a9ln1">`);
        if (editingId === category.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<form method="POST" action="?/update" class="edit-form svelte-11a9ln1"><input type="hidden" name="id"${attr("value", category.id)}/> <input type="text" name="name"${attr("value", editingName)} required="" minlength="2" class="edit-input svelte-11a9ln1"/> <label class="checkbox-label svelte-11a9ln1"><input type="checkbox" name="pinterest_enabled"${attr("checked", !!category.pinterest_enabled, true)} class="svelte-11a9ln1"/> <span>Pinterest Feed</span></label> <div class="edit-actions svelte-11a9ln1"><button type="submit" class="btn btn-small btn-primary">${escape_html(t(lang(), "admin.ui.save"))}</button> <button type="button" class="btn btn-small">${escape_html(t(lang(), "admin.ui.cancel"))}</button></div></form>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="category-info svelte-11a9ln1"><span class="category-name svelte-11a9ln1">${escape_html(category.name)}</span> <span class="category-slug svelte-11a9ln1">/${escape_html(category.slug)}</span> `);
          if (category.pinterest_enabled) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="pinterest-badge svelte-11a9ln1" title="Feed do Pinterest habilitado"><svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style="color: #e60023"><path d="M9.04 14.63c-.35 1.89-.78 3.7-2.06 4.65-.39-2.79.58-4.87 1.03-7.09-1.73-2.9 1.5-5.87 3.37-2.79 2.34 3.69-2.03 7.14.91 8.01 3.07.91 4.33-3.94 2.42-5.36-2.76-1.97-8.02-.45-6.97 4.42.27 1.22 1.41 1.59.49 2.28-.73.53-1.97-.17-2.3-1.21-.79-2.57.28-5.35 1.68-7.11 1.4-1.76 3.5-2.01 5.43-1.99 3.29.03 6.38 1.48 6.81 5.26.49 4.28-1.82 8.98-6.12 8.66-1.17-.08-1.99-.64-2.16-1.73zM10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0z"></path></svg></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="category-actions svelte-11a9ln1"><button type="button" class="btn btn-small">${escape_html(t(lang(), "admin.ui.edit"))}</button> <form method="POST" action="?/delete" style="display:inline;"><input type="hidden" name="id"${attr("value", category.id)}/> <button type="submit" class="btn btn-small btn-danger svelte-11a9ln1">${escape_html(t(lang(), "admin.ui.delete"))}</button></form></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-f9XcS2O7.js.map
