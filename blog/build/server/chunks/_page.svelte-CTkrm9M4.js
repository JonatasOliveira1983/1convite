import { Q as escape_html, J as attr, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let adType = data.ad.type;
    let adPlacement = data.ad.placement;
    function getPreviewSize() {
      if (adPlacement === "sidebar") return "300x300px";
      if (adPlacement === "home_middle") return "1200x250px";
      if (adPlacement === "in_article") return t(lang(), "admin.ads.adaptive");
      return "Sem tamanho fixo";
    }
    $$renderer2.push(`<div class="ads-page svelte-1rjeu8p"><div class="page-header svelte-1rjeu8p"><h1 class="svelte-1rjeu8p">${escape_html(t(lang(), "admin.ads.edit_campaign"))}</h1> <p class="subtitle svelte-1rjeu8p">${escape_html(t(lang(), "admin.ads.edit_subtitle"))}</p></div> <form method="POST" enctype="multipart/form-data" class="svelte-1rjeu8p"><div class="form-section svelte-1rjeu8p"><div class="form-group svelte-1rjeu8p"><label for="name" class="svelte-1rjeu8p">Nome da Campanha</label> <input type="text" id="name" name="name"${attr("value", data.ad.name)} placeholder="Ex: Promoção de Verão 2026" required="" class="svelte-1rjeu8p"/></div> <div class="form-row svelte-1rjeu8p"><div class="form-group svelte-1rjeu8p"><label for="placement" class="svelte-1rjeu8p">Posicionamento</label> `);
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
      "svelte-1rjeu8p"
    );
    $$renderer2.push(`</div> <div class="form-group svelte-1rjeu8p"><label for="weight" class="svelte-1rjeu8p">Prioridade</label> <div class="weight-input svelte-1rjeu8p"><input type="range" id="weight" name="weight" min="1" max="10"${attr("value", data.ad.weight)} class="svelte-1rjeu8p"/> <span class="weight-value svelte-1rjeu8p">${escape_html(data.ad.weight)}x</span></div></div></div> <div class="form-group svelte-1rjeu8p"><label for="type" class="svelte-1rjeu8p">Tipo de Anúncio</label> <div class="type-grid svelte-1rjeu8p"><label${attr_class("type-card svelte-1rjeu8p", void 0, { "active": adType === "native" })}><input type="radio" name="type" value="native"${attr("checked", adType === "native", true)} class="svelte-1rjeu8p"/> <div class="type-icon svelte-1rjeu8p"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></div> <div class="type-info svelte-1rjeu8p"><span class="type-name svelte-1rjeu8p">Conteúdo Nativo</span> <span class="type-desc svelte-1rjeu8p">Integra-se ao design</span></div></label> <label${attr_class("type-card svelte-1rjeu8p", void 0, { "active": adType === "image" })}><input type="radio" name="type" value="image"${attr("checked", adType === "image", true)} class="svelte-1rjeu8p"/> <div class="type-icon svelte-1rjeu8p"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div> <div class="type-info svelte-1rjeu8p"><span class="type-name svelte-1rjeu8p">Banner/Imagem</span> <span class="type-desc svelte-1rjeu8p">Imagem com link</span></div></label> <label${attr_class("type-card svelte-1rjeu8p", void 0, { "active": adType === "html" })}><input type="radio" name="type" value="html"${attr("checked", adType === "html", true)} class="svelte-1rjeu8p"/> <div class="type-icon svelte-1rjeu8p"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></div> <div class="type-info svelte-1rjeu8p"><span class="type-name svelte-1rjeu8p">Script/HTML</span> <span class="type-desc svelte-1rjeu8p">Google Adsense</span></div></label> <label${attr_class("type-card svelte-1rjeu8p", void 0, { "active": adType === "text" })}><input type="radio" name="type" value="text"${attr("checked", adType === "text", true)} class="svelte-1rjeu8p"/> <div class="type-icon svelte-1rjeu8p"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div> <div class="type-info svelte-1rjeu8p"><span class="type-name svelte-1rjeu8p">Apenas Texto</span> <span class="type-desc svelte-1rjeu8p">Texto clicável</span></div></label> <label${attr_class("type-card svelte-1rjeu8p", void 0, { "active": adType === "video" })}><input type="radio" name="type" value="video"${attr("checked", adType === "video", true)} class="svelte-1rjeu8p"/> <div class="type-icon svelte-1rjeu8p"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></div> <div class="type-info svelte-1rjeu8p"><span class="type-name svelte-1rjeu8p">Vídeo YouTube</span> <span class="type-desc svelte-1rjeu8p">Vídeo com autoplay e expansão</span></div></label></div></div> `);
    if (adType === "image" && data.ad.image_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="current-image-preview svelte-1rjeu8p"><span class="preview-label svelte-1rjeu8p">Imagem Atual:</span> <img${attr("src", data.ad.image_url)} alt="Banner atual" class="svelte-1rjeu8p"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (adType === "image") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-group svelte-1rjeu8p"><label for="image_file" class="svelte-1rjeu8p">Alterar Banner/Imagem</label> <div class="image-upload-wrapper svelte-1rjeu8p"><input type="file" id="image_file" name="image_file" accept="image/*" class="file-input svelte-1rjeu8p"/> <div class="url-fallback svelte-1rjeu8p"><span class="svelte-1rjeu8p">Ou use uma URL:</span> <input type="url" id="image_url" name="image_url"${attr("value", data.ad.image_url || "")} placeholder="https://exemplo.com/banner.jpg" class="svelte-1rjeu8p"/></div></div> <small class="svelte-1rjeu8p">Recomendado: ${escape_html(getPreviewSize())}</small></div> <div class="form-group svelte-1rjeu8p"><label for="link_url" class="svelte-1rjeu8p">Link de Destino</label> <input type="url" id="link_url" name="link_url"${attr("value", data.ad.link_url)} placeholder="https://..." required="" class="svelte-1rjeu8p"/></div>`);
    } else if (adType === "html") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="form-group svelte-1rjeu8p"><label for="content" class="svelte-1rjeu8p">Código HTML/Script</label> <textarea id="content" name="content" rows="6" placeholder="Cole aqui seu script..." class="svelte-1rjeu8p">`);
      const $$body = escape_html(data.ad.content || "");
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div>`);
    } else if (adType === "text") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="form-group svelte-1rjeu8p"><label for="content" class="svelte-1rjeu8p">Texto do Anúncio</label> <input type="text" id="content" name="content"${attr("value", data.ad.content)} placeholder="Ex: Conheça nossos serviços!" required="" class="svelte-1rjeu8p"/></div> <div class="form-group svelte-1rjeu8p"><label for="link_url" class="svelte-1rjeu8p">Link de Destino</label> <input type="url" id="link_url" name="link_url"${attr("value", data.ad.link_url)} placeholder="https://..." required="" class="svelte-1rjeu8p"/></div>`);
    } else if (adType === "native") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div class="form-group svelte-1rjeu8p"><label for="content" class="svelte-1rjeu8p">Label (texto acima do título)</label> <input type="text" id="content" name="content"${attr("value", data.ad.content || "")} placeholder="Ex: Conteúdo Recomendado" class="svelte-1rjeu8p"/></div>`);
    } else if (adType === "video") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div class="form-group svelte-1rjeu8p"><label for="youtube_video_url" class="svelte-1rjeu8p">URL do Vídeo do YouTube</label> <input type="url" id="youtube_video_url" name="youtube_video_url"${attr("value", data.ad.youtube_video_url || "")} placeholder="https://www.youtube.com/watch?v=..." required="" class="svelte-1rjeu8p"/></div> <div class="form-group svelte-1rjeu8p"><label for="link_url" class="svelte-1rjeu8p">Link de Destino (Opcional)</label> <input type="url" id="link_url" name="link_url"${attr("value", data.ad.link_url || "")} placeholder="https://seusite.com" class="svelte-1rjeu8p"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="section-divider svelte-1rjeu8p"></div> <div class="form-section svelte-1rjeu8p"><label class="checkbox-label svelte-1rjeu8p"><input type="checkbox" name="is_active"${attr("checked", data.ad.is_active === 1, true)} class="svelte-1rjeu8p"/> <span>Campanha Ativa</span></label></div> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1rjeu8p">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-actions svelte-1rjeu8p"><a href="/admin/ads" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary">Salvar Alterações</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CTkrm9M4.js.map
