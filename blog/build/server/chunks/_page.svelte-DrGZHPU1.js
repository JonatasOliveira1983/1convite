import { G as head, Q as escape_html, R as ensure_array_like, I as attr_class, J as attr, O as stringify } from './root-bZgTCCHH.js';
import './state.svelte-BCGVlO8d.js';
import './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    head("1k1q4sy", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Gerenciar Comunidade VIP | Painel Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="admin-page-header svelte-1k1q4sy"><div><h1 class="svelte-1k1q4sy">💬 Gerenciar Comunidade VIP</h1> <p class="subtitle svelte-1k1q4sy">Modere discussões, fixe comunicados oficiais e gerencie o engajamento dos membros.</p></div> <a href="/members/area" target="_blank" class="btn btn-outline">👁️ Abrir Comunidade</a></div> <div class="stats-grid svelte-1k1q4sy"><div class="stat-card svelte-1k1q4sy"><div class="stat-icon svelte-1k1q4sy">💬</div> <div class="stat-info svelte-1k1q4sy"><span class="stat-value svelte-1k1q4sy">${escape_html(data.stats.totalTopics)}</span> <span class="stat-label svelte-1k1q4sy">Tópicos Criados</span></div></div> <div class="stat-card svelte-1k1q4sy"><div class="stat-icon svelte-1k1q4sy">🗣️</div> <div class="stat-info svelte-1k1q4sy"><span class="stat-value svelte-1k1q4sy">${escape_html(data.stats.totalComments)}</span> <span class="stat-label svelte-1k1q4sy">Respostas / Comentários</span></div></div> <div class="stat-card svelte-1k1q4sy"><div class="stat-icon svelte-1k1q4sy">❤️</div> <div class="stat-info svelte-1k1q4sy"><span class="stat-value svelte-1k1q4sy">${escape_html(data.stats.totalLikes)}</span> <span class="stat-label svelte-1k1q4sy">Curtidas Totais</span></div></div></div> <div class="card svelte-1k1q4sy"><div class="table-wrapper svelte-1k1q4sy"><table class="data-table svelte-1k1q4sy"><thead><tr><th class="svelte-1k1q4sy">Status</th><th class="svelte-1k1q4sy">Tópico / Título</th><th class="svelte-1k1q4sy">Autor</th><th class="svelte-1k1q4sy">Categoria</th><th class="svelte-1k1q4sy">Engajamento</th><th class="svelte-1k1q4sy">Data</th><th class="actions-col svelte-1k1q4sy">Ações</th></tr></thead><tbody>`);
    if (data.topics.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tr><td colspan="7" class="empty-cell svelte-1k1q4sy">Nenhum tópico publicado na comunidade ainda.</td></tr>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(data.topics);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let topic = each_array[$$index];
        $$renderer2.push(`<tr${attr_class("svelte-1k1q4sy", void 0, { "row-pinned": topic.is_pinned })}><td class="svelte-1k1q4sy">`);
        if (topic.is_pinned) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="status-badge status-pinned svelte-1k1q4sy">📌 Fixado</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="status-badge status-normal svelte-1k1q4sy">Normal</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="svelte-1k1q4sy"><a${attr("href", `/members/area/topic/${stringify(topic.id)}`)} target="_blank" class="topic-link-title svelte-1k1q4sy">${escape_html(topic.title)}</a></td><td class="svelte-1k1q4sy"><div class="author-cell svelte-1k1q4sy"><span class="author-email">${escape_html(topic.user_email)}</span> `);
        if (topic.user_role === "admin") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-sm badge-admin svelte-1k1q4sy">Admin</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="svelte-1k1q4sy"><span class="cat-pill svelte-1k1q4sy">${escape_html(topic.category)}</span></td><td class="svelte-1k1q4sy"><span class="engagement svelte-1k1q4sy">❤️ ${escape_html(topic.likes_count)} · 💬 ${escape_html(topic.comments_count)}</span></td><td class="svelte-1k1q4sy">${escape_html(formatDate(topic.created_at))}</td><td class="svelte-1k1q4sy"><div class="action-buttons svelte-1k1q4sy"><form method="POST" action="?/togglePin"><input type="hidden" name="topic_id"${attr("value", topic.id)}/> <input type="hidden" name="is_pinned"${attr("value", topic.is_pinned ? "true" : "false")}/> <button type="submit" class="btn-sm btn-pin svelte-1k1q4sy"${attr("title", topic.is_pinned ? "Desfixar Tópico" : "Fixar no Topo")}>${escape_html(topic.is_pinned ? "📌 Desfixar" : "📌 Fixar")}</button></form> <form method="POST" action="?/deleteTopic"><input type="hidden" name="topic_id"${attr("value", topic.id)}/> <button type="submit" class="btn-sm btn-delete svelte-1k1q4sy" title="Excluir Tópico">🗑️ Excluir</button></form></div></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DrGZHPU1.js.map
