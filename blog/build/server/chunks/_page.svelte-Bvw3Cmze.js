import { G as head, I as attr_class, Q as escape_html, R as ensure_array_like, J as attr, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import './state.svelte-BCGVlO8d.js';
import { f as formatMoney } from './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    let activeTab = "community";
    let selectedCategory = "Todos";
    const communityCategories = [
      "Todos",
      "Geral",
      "Dúvidas",
      "Ideias & Sugestões",
      "Anúncios"
    ];
    function formatPrice(cents) {
      return formatMoney(lang(), cents, displayCurrency());
    }
    function formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang() === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function getUserBadge(role) {
      if (role === "admin") return { label: "🛡️ Admin", class: "badge-admin" };
      return { label: "⭐ Membro VIP", class: "badge-vip" };
    }
    let filteredTopics = derived(
      () => data.communityTopics
    );
    head("mcvju2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Comunidade VIP &amp; Área de Membros</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex"/>`);
    });
    $$renderer2.push(`<div class="area-container svelte-mcvju2"><header class="area-hero svelte-mcvju2"><div class="hero-badge svelte-mcvju2"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> `);
    if (data.hasPremium) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>Comunidade VIP · Assinante Ativo</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span>Área de Membros · Acesso Gratuito</span>`);
    }
    $$renderer2.push(`<!--]--></div> <h1 class="svelte-mcvju2">Comunidade VIP &amp; Área de Membros</h1> <p class="subtitle svelte-mcvju2">Conecte-se com outros membros, troque conhecimento em discussões exclusivas e acesse seus cursos.</p> <div class="hero-actions svelte-mcvju2">`);
    if (!data.hasPremium) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a href="/premium" class="btn btn-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Assinar Plano VIP</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <a href="/members/dashboard" class="btn btn-outline">Minha Conta</a></div></header> <div class="tabs-nav svelte-mcvju2"><button${attr_class("tab-link svelte-mcvju2", void 0, { "active": activeTab === "community" })}>💬 Feed &amp; Discussões <span class="count-pill svelte-mcvju2">${escape_html(data.communityTopics.length)}</span></button> <button${attr_class("tab-link svelte-mcvju2", void 0, { "active": activeTab === "courses" })}>🎓 Cursos Exclusivos <span class="count-pill svelte-mcvju2">${escape_html(data.courses.length)}</span></button></div> `);
    {
      $$renderer2.push("<!--[0-->");
      if (!data.hasPremium) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="paywall-box svelte-mcvju2"><div class="paywall-icon-wrap svelte-mcvju2"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div> <h2 class="svelte-mcvju2">A Comunidade VIP é Exclusiva para Assinantes</h2> <p class="svelte-mcvju2">Faça o upgrade da sua conta para publicar tópicos, tirar dúvidas diretamente com os autores e interagir no feed de discussões.</p> <div class="paywall-grid svelte-mcvju2"><div class="paywall-benefit svelte-mcvju2"><span class="benefit-check svelte-mcvju2">✓</span> <span>Feed interativo de perguntas e respostas</span></div> <div class="paywall-benefit svelte-mcvju2"><span class="benefit-check svelte-mcvju2">✓</span> <span>Contato direto com administradores e especialistas</span></div> <div class="paywall-benefit svelte-mcvju2"><span class="benefit-check svelte-mcvju2">✓</span> <span>Acesso ilimitado a todos os cursos e materiais</span></div></div> <div class="paywall-cta-row svelte-mcvju2"><a href="/premium" class="btn btn-primary btn-lg">`);
        if (data.cheapestPlan) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`Desbloquear Comunidade VIP por ${escape_html(formatPrice(data.cheapestPlan.price_cents))}`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`Assinar Plano VIP`);
        }
        $$renderer2.push(`<!--]--></a></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="feed-toolbar svelte-mcvju2"><div class="filter-pills svelte-mcvju2"><!--[-->`);
        const each_array = ensure_array_like(communityCategories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer2.push(`<button${attr_class("filter-pill svelte-mcvju2", void 0, { "active": selectedCategory === cat })}>${escape_html(cat)}</button>`);
        }
        $$renderer2.push(`<!--]--></div> <button class="btn btn-primary btn-sm">✨ Criar Discussão</button></div> `);
        {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="topics-list svelte-mcvju2">`);
        if (filteredTopics().length === 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="empty-box svelte-mcvju2"><p>Nenhuma discussão nesta categoria ainda. Seja o primeiro a criar um tópico!</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(filteredTopics());
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let topic = each_array_1[$$index_1];
            $$renderer2.push(`<a${attr("href", `/members/area/topic/${stringify(topic.id)}`)}${attr_class("topic-card svelte-mcvju2", void 0, { "is-pinned": topic.is_pinned })}><div class="topic-card-header svelte-mcvju2"><div class="author-block svelte-mcvju2"><div class="avatar svelte-mcvju2">${escape_html(topic.user_email[0].toUpperCase())}</div> <div class="author-meta svelte-mcvju2"><span class="author-name svelte-mcvju2">${escape_html(topic.user_email.split("@")[0])}</span> <span${attr_class(`badge-role ${stringify(getUserBadge(topic.user_role).class)}`, "svelte-mcvju2")}>${escape_html(getUserBadge(topic.user_role).label)}</span></div></div> <span class="topic-date svelte-mcvju2">${escape_html(formatDate(topic.created_at))}</span></div> <h2 class="topic-card-title svelte-mcvju2">`);
            if (topic.is_pinned) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="pinned-tag svelte-mcvju2">📌 FIXADO</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--> ${escape_html(topic.title)}</h2> <p class="topic-snippet svelte-mcvju2">${escape_html(topic.content.slice(0, 140))}${escape_html(topic.content.length > 140 ? "..." : "")}</p> <div class="topic-card-footer svelte-mcvju2"><span class="cat-badge svelte-mcvju2">${escape_html(topic.category)}</span> <div class="topic-stats svelte-mcvju2"><span${attr_class("stat-item svelte-mcvju2", void 0, { "liked": topic.user_has_liked })}>❤️ ${escape_html(topic.likes_count)}</span> <span class="stat-item svelte-mcvju2">💬 ${escape_html(topic.comments_count)} respostas</span></div></div></a>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bvw3Cmze.js.map
