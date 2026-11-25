import { G as head, Q as escape_html, R as ensure_array_like, J as attr, O as stringify, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    head("1wdbc8k", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.posts.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-header svelte-1wdbc8k"><h1 class="admin-title svelte-1wdbc8k">${escape_html(t(lang(), "admin.posts.heading"))}</h1> <a href="/admin/posts/new" class="btn btn-primary">${escape_html(t(lang(), "admin.posts.new"))}</a></div> `);
    if (data.posts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state"><p>${escape_html(t(lang(), "admin.posts.empty"))}</p> <a href="/admin/posts/new" class="btn btn-primary">${escape_html(t(lang(), "admin.posts.create_first"))}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="admin-table-container svelte-1wdbc8k"><table class="table"><thead><tr><th>${escape_html(t(lang(), "admin.ui.title"))}</th><th>${escape_html(t(lang(), "admin.ui.slug"))}</th><th>${escape_html(t(lang(), "admin.ui.date"))}</th><th>${escape_html(t(lang(), "admin.ui.status"))}</th><th>${escape_html(t(lang(), "admin.ui.actions"))}</th></tr></thead><tbody><!--[-->`);
      const each_array = ensure_array_like(data.posts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        $$renderer2.push(`<tr><td><a${attr("href", `/admin/posts/${stringify(post.id)}`)}>${escape_html(post.title)}</a></td><td style="font-family: monospace; font-size: 0.875rem;">${escape_html(post.slug)}</td><td>${escape_html(formatDate(post.created_at))}</td><td><span${attr_class(`status status-${post.published ? "published" : "draft"}`, "svelte-1wdbc8k")}>${escape_html(post.published ? t(lang(), "admin.ui.published") : t(lang(), "admin.ui.draft"))}</span></td><td><div class="actions svelte-1wdbc8k"><a${attr("href", `/admin/posts/${stringify(post.id)}`)} class="btn btn-small">${escape_html(t(lang(), "admin.ui.edit"))}</a> <form${attr("action", `/admin/posts/${stringify(post.id)}/delete`)} method="POST" style="display: inline;"><button type="submit" class="btn btn-small btn-danger svelte-1wdbc8k">${escape_html(t(lang(), "admin.ui.delete"))}</button></form></div></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-OZR069aX.js.map
