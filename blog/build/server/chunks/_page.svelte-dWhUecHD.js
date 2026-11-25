import { I as attr_class, J as attr, Q as escape_html, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let adType = "native";
    let adPlacement = "in_article";
    $$renderer2.push(`<div class="ads-page svelte-wev960"><div class="page-header svelte-wev960"><h1 class="svelte-wev960">Nova Campanha</h1> <p class="subtitle svelte-wev960">Crie um novo anúncio ou conteúdo nativo</p></div> <form method="POST" enctype="multipart/form-data" class="svelte-wev960"><div class="form-section svelte-wev960"><div class="form-group svelte-wev960"><label for="name" class="svelte-wev960">Nome da Campanha</label> <input type="text" id="name" name="name" placeholder="Ex: Promoção de Verão 2026" required="" class="svelte-wev960"/></div> <div class="form-row svelte-wev960"><div class="form-group svelte-wev960"><label for="placement" class="svelte-wev960">Posicionamento</label> `);
    $$renderer2.select(
      {
        id: "placement",
        name: "placement",
        value: adPlacement,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "in_article" }, ($$renderer4) => {
          $$renderer4.push(`Dentro do Artigo (Nativo)`);
        });
        $$renderer3.option({ value: "sidebar" }, ($$renderer4) => {
          $$renderer4.push(`Sidebar (Quadrado)`);
        });
        $$renderer3.option({ value: "home_middle" }, ($$renderer4) => {
          $$renderer4.push(`Home (Entre posts)`);
        });
        $$renderer3.option({ value: "post_inline" }, ($$renderer4) => {
          $$renderer4.push(`Post (Interno)`);
        });
      },
      "svelte-wev960"
    );
    $$renderer2.push(`</div> <div class="form-group svelte-wev960"><label for="weight" class="svelte-wev960">Prioridade</label> <div class="weight-input svelte-wev960"><input type="range" id="weight" name="weight" min="1" max="10" value="1" class="svelte-wev960"/> <span class="weight-value svelte-wev960">1x</span></div></div></div> <div class="form-group svelte-wev960"><label for="type" class="svelte-wev960">Tipo de Anúncio</label> <div class="type-grid svelte-wev960"><label${attr_class("type-card svelte-wev960", void 0, { "active": adType === "native" })}><input type="radio" name="type" value="native"${attr("checked", adType === "native", true)} class="svelte-wev960"/> <div class="type-icon svelte-wev960"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></div> <div class="type-info svelte-wev960"><span class="type-name svelte-wev960">Conteúdo Nativo</span> <span class="type-desc svelte-wev960">Integra-se ao design do blog</span></div></label> <label${attr_class("type-card svelte-wev960", void 0, { "active": adType === "image" })}><input type="radio" name="type" value="image"${attr("checked", adType === "image", true)} class="svelte-wev960"/> <div class="type-icon svelte-wev960"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div> <div class="type-info svelte-wev960"><span class="type-name svelte-wev960">Banner/Imagem</span> <span class="type-desc svelte-wev960">Imagem com link clicável</span></div></label> <label${attr_class("type-card svelte-wev960", void 0, { "active": adType === "html" })}><input type="radio" name="type" value="html"${attr("checked", adType === "html", true)} class="svelte-wev960"/> <div class="type-icon svelte-wev960"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></div> <div class="type-info svelte-wev960"><span class="type-name svelte-wev960">Script/HTML</span> <span class="type-desc svelte-wev960">Google Adsense, etc</span></div></label> <label${attr_class("type-card svelte-wev960", void 0, { "active": adType === "text" })}><input type="radio" name="type" value="text"${attr("checked", adType === "text", true)} class="svelte-wev960"/> <div class="type-icon svelte-wev960"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div> <div class="type-info svelte-wev960"><span class="type-name svelte-wev960">Apenas Texto</span> <span class="type-desc svelte-wev960">Texto clicável</span></div></label> <label${attr_class("type-card svelte-wev960", void 0, { "active": adType === "video" })}><input type="radio" name="type" value="video"${attr("checked", adType === "video", true)} class="svelte-wev960"/> <div class="type-icon svelte-wev960"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></div> <div class="type-info svelte-wev960"><span class="type-name svelte-wev960">Vídeo YouTube</span> <span class="type-desc svelte-wev960">Vídeo com autoplay e expansão</span></div></label></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="native-preview svelte-wev960"><div class="preview-header svelte-wev960"><span>Prévia do Anúncio Nativo</span></div> <div class="preview-content svelte-wev960"><div class="preview-image svelte-wev960"></div> <div class="preview-text svelte-wev960"><div class="preview-label svelte-wev960"></div> <div class="preview-title svelte-wev960"></div> <div class="preview-cta svelte-wev960"></div></div></div></div> <div class="form-group svelte-wev960"><label for="content" class="svelte-wev960">Label (texto acima do título)</label> <input type="text" id="content" name="content" placeholder="Ex: Conteúdo Recomendado" class="svelte-wev960"/></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="section-divider svelte-wev960"></div> <div class="form-section svelte-wev960"><label class="checkbox-label svelte-wev960"><input type="checkbox" name="is_active" checked="" class="svelte-wev960"/> <span>Campanha Ativa</span></label></div> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-wev960">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-actions svelte-wev960"><a href="/admin/ads" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary">Criar Campanha</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-dWhUecHD.js.map
