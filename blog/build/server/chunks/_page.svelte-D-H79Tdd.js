import { G as head, Q as escape_html, I as attr_class, O as stringify, J as attr, R as ensure_array_like, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import './state.svelte-BCGVlO8d.js';
import './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let commentContent = "";
    function formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang() === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function getUserBadge(role) {
      if (role === "admin") return { label: "🛡️ Admin", class: "badge-admin" };
      return { label: "⭐ Membro VIP", class: "badge-vip" };
    }
    head("luddvm", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.topic.title)} | Comunidade VIP</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex"/>`);
    });
    $$renderer2.push(`<div class="topic-container svelte-luddvm"><div class="top-nav svelte-luddvm"><a href="/members/area" class="back-link svelte-luddvm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg> Voltar para Comunidade</a></div> <article class="topic-card svelte-luddvm"><header class="topic-header"><div class="topic-meta svelte-luddvm"><span class="category-badge svelte-luddvm">${escape_html(data.topic.category)}</span> `);
    if (data.topic.is_pinned) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="pinned-badge svelte-luddvm">📌 Fixado</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <h1 class="topic-title svelte-luddvm">${escape_html(data.topic.title)}</h1> <div class="author-bar svelte-luddvm"><div class="author-avatar svelte-luddvm">${escape_html(data.topic.user_email[0].toUpperCase())}</div> <div class="author-info svelte-luddvm"><div class="author-name svelte-luddvm">${escape_html(data.topic.user_email.split("@")[0])} <span${attr_class(`badge ${stringify(getUserBadge(data.topic.user_role).class)}`, "svelte-luddvm")}>${escape_html(getUserBadge(data.topic.user_role).label)}</span></div> <time class="topic-date svelte-luddvm">${escape_html(formatDate(data.topic.created_at))}</time></div></div></header> <div class="topic-body svelte-luddvm">${escape_html(data.topic.content)}</div> <footer class="topic-footer svelte-luddvm"><div class="footer-actions svelte-luddvm"><form method="POST" action="?/toggleLike"><button type="submit"${attr_class("btn-like svelte-luddvm", void 0, { "liked": data.topic.user_has_liked })}><svg width="18" height="18" viewBox="0 0 24 24"${attr("fill", data.topic.user_has_liked ? "currentColor" : "none")} stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> <span>${escape_html(data.topic.likes_count)} Curtidas</span></button></form> <span class="comments-count svelte-luddvm">💬 ${escape_html(data.comments.length)} Respostas</span></div> `);
    if (data.user && (data.user.id === data.topic.user_id || data.user.role === "admin")) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<form method="POST" action="?/deleteTopic"><input type="hidden" name="topic_id"${attr("value", data.topic.id)}/> <button type="submit" class="btn-delete svelte-luddvm">🗑️ Excluir Tópico</button></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></footer></article> <section class="comments-section svelte-luddvm"><h2 class="svelte-luddvm">Respostas (${escape_html(data.comments.length)})</h2> <form method="POST" action="?/addComment" class="comment-form svelte-luddvm"><div class="form-group"><textarea name="content" rows="3" placeholder="Escreva sua resposta para a comunidade..." required="" class="svelte-luddvm">`);
    const $$body = escape_html(commentContent);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <button type="submit" class="btn btn-primary"${attr("disabled", !commentContent.trim(), true)}>${escape_html("💬 Responder")}</button></form> <div class="comments-list svelte-luddvm">`);
    if (data.comments.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="no-comments svelte-luddvm"><p>Nenhuma resposta ainda. Seja o primeiro a participar da conversa!</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.comments);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let comment = each_array[$$index];
        $$renderer2.push(`<div class="comment-card svelte-luddvm"><div class="comment-header svelte-luddvm"><div class="comment-author svelte-luddvm"><div class="avatar-small svelte-luddvm">${escape_html(comment.user_email[0].toUpperCase())}</div> <div><strong class="comment-name svelte-luddvm">${escape_html(comment.user_email.split("@")[0])}</strong> <span${attr_class(`badge ${stringify(getUserBadge(comment.user_role).class)}`, "svelte-luddvm")}>${escape_html(getUserBadge(comment.user_role).label)}</span></div></div> <div class="comment-actions svelte-luddvm"><time class="comment-date svelte-luddvm">${escape_html(formatDate(comment.created_at))}</time> `);
        if (data.user && (data.user.id === comment.user_id || data.user.role === "admin")) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<form method="POST" action="?/deleteComment"><input type="hidden" name="comment_id"${attr("value", comment.id)}/> <input type="hidden" name="topic_id"${attr("value", data.topic.id)}/> <button type="submit" class="btn-icon-delete svelte-luddvm" title="Excluir resposta">✕</button></form>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="comment-content svelte-luddvm">${escape_html(comment.content)}</div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></section></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D-H79Tdd.js.map
