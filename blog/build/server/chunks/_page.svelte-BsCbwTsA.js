import { Q as escape_html, J as attr, R as ensure_array_like, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { form, data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let name = "";
    let slug = "";
    let description = "";
    let priceValue = "";
    let resourceType = "file";
    let loading = false;
    let categoryId = "";
    let youtubeVideoUrl = "";
    let isPremiumIncludedVal = 0;
    let hasExtraService = false;
    $$renderer2.push(`<div class="new-product-page svelte-nbvn7e"><div class="page-header svelte-nbvn7e"><h1 class="svelte-nbvn7e">${escape_html(t(lang(), "admin.products.new"))} Digital</h1> <p class="subtitle svelte-nbvn7e">Adicione um novo recurso para venda ou download nos seus posts</p></div> <form method="POST" enctype="multipart/form-data" class="product-form svelte-nbvn7e"><div class="form-section svelte-nbvn7e"><div class="form-group svelte-nbvn7e"><label for="name" class="svelte-nbvn7e">Nome do Produto</label> <input type="text" id="name" name="name"${attr("value", name)} placeholder="Ex: E-book de Introdução ao Svelte em PDF" required="" class="svelte-nbvn7e"/></div> <div class="form-group svelte-nbvn7e"><label for="slug" class="svelte-nbvn7e">Slug do Produto (URL)</label> <input type="text" id="slug" name="slug"${attr("value", slug)} placeholder="url-do-produto" class="svelte-nbvn7e"/> <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;" class="svelte-nbvn7e">Deixe em branco para gerar automaticamente com base no nome.</small></div> <div class="form-group svelte-nbvn7e"><label for="description" class="svelte-nbvn7e">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="description" name="description" rows="3" placeholder="Breve resumo sobre o arquivo/link..." class="svelte-nbvn7e">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-group svelte-nbvn7e"><label for="category_id" class="svelte-nbvn7e">${escape_html(t(lang(), "admin.ui.category"))}</label> `);
    $$renderer2.select(
      {
        id: "category_id",
        name: "category_id",
        value: categoryId,
        style: "background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.75rem; border-radius: var(--radius-md); width: 100%;",
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Sem Categoria (Geral)`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(data.categories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cat = each_array[$$index];
          $$renderer3.option({ value: cat.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cat.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-nbvn7e"
    );
    $$renderer2.push(` <small style="margin-top: 0.25rem; display: block;" class="svelte-nbvn7e"><a href="/admin/products/categories" target="_blank" style="color: var(--accent-color, #3b82f6); text-decoration: none; font-weight: 600;">Gerenciar Categorias →</a></small></div> <div class="form-group svelte-nbvn7e"><label for="youtube_video_url" class="svelte-nbvn7e">URL do Vídeo do YouTube (Opcional)</label> <input type="text" id="youtube_video_url" name="youtube_video_url"${attr("value", youtubeVideoUrl)} placeholder="Ex: https://www.youtube.com/watch?v=..." class="svelte-nbvn7e"/> <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;" class="svelte-nbvn7e">Se preenchido, um player de vídeo explicativo com autoplay/mute expandirá automaticamente 2 segundos após a pessoa entrar na página do produto.</small></div> <div class="form-group svelte-nbvn7e"><label for="product_image" class="svelte-nbvn7e">Imagem Ilustrativa (Opcional)</label> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input type="file" id="product_image" name="product_image" class="file-input svelte-nbvn7e" accept="image/jpeg,image/png,image/gif,image/webp"/> <small class="svelte-nbvn7e">Envie uma imagem para os usuários identificarem o produto. (Formatos: JPG, PNG, WebP. Máx. 5MB)</small></div></div> <div class="section-divider svelte-nbvn7e"></div> <div class="form-section svelte-nbvn7e"><div class="form-row svelte-nbvn7e"><div class="form-group svelte-nbvn7e"><label for="price_display" class="svelte-nbvn7e">Preço (opcional, em R$)</label> <div class="price-input-group svelte-nbvn7e"><input type="text" id="price_display" name="price_display" placeholder="19,90"${attr("value", priceValue)} class="svelte-nbvn7e"/> <span class="input-suffix svelte-nbvn7e">R$</span></div> <input type="hidden" id="price_cents_val" name="price_cents" value="0" class="svelte-nbvn7e"/> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<small class="free-info svelte-nbvn7e">Deixe em branco ou 0 para download gratuito. (Mínimo de R$ 5,00 para produtos pagos)</small>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-nbvn7e"><label for="resource_type" class="svelte-nbvn7e">Tipo de Recurso</label> `);
    $$renderer2.select(
      {
        id: "resource_type",
        name: "resource_type",
        value: resourceType,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "file" }, ($$renderer4) => {
          $$renderer4.push(`Upload no Servidor (disco)`);
        });
        $$renderer3.option({ value: "cloudinary" }, ($$renderer4) => {
          $$renderer4.push(`☁️ Upload no Cloudinary (ZIP/PDF)`);
        });
        $$renderer3.option({ value: "link" }, ($$renderer4) => {
          $$renderer4.push(`Link de Terceiros (URL)`);
        });
        $$renderer3.option({ value: "manual" }, ($$renderer4) => {
          $$renderer4.push(`🤝 Entrega Manual (Drive, GitHub, etc.)`);
        });
      },
      "svelte-nbvn7e"
    );
    $$renderer2.push(`</div></div> <div class="form-group svelte-nbvn7e" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box;"><label for="is_premium_included" style="font-weight: 700; margin: 0; text-transform: none; letter-spacing: 0; font-size: 0.95rem; color: #0f172a;" class="svelte-nbvn7e">Disponibilidade na Assinatura Premium</label> `);
    $$renderer2.select(
      {
        id: "is_premium_included",
        name: "is_premium_included",
        value: isPremiumIncludedVal,
        style: "background: #fff; border: 1px solid #cbd5e1; color: #0f172a; padding: 0.6rem; border-radius: 6px; width: 100%; font-size: 0.9rem; cursor: pointer; outline: none;",
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: 0 }, ($$renderer4) => {
          $$renderer4.push(`Não incluso no Premium (apenas venda avulsa)`);
        });
        $$renderer3.option({ value: 1 }, ($$renderer4) => {
          $$renderer4.push(`🌟 Incluso em qualquer Plano Premium (Livre para todos os assinantes)`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(data.premiumPlans);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let plan = each_array_1[$$index_1];
          $$renderer3.option({ value: plan.id }, ($$renderer4) => {
            $$renderer4.push(`🔒 Incluso apenas no Plano: ${escape_html(plan.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-nbvn7e"
    );
    $$renderer2.push(` <span style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin-top: 0.25rem;">Selecione qual nível de assinatura premium do site dará acesso gratuito a este produto digital. <strong>Acesso vitalício permanente:</strong> quem comprar de forma avulsa sempre manterá acesso definitivo, mesmo que cancele a assinatura ou não seja Premium.</span></div> <div class="form-group order-bump-group svelte-nbvn7e" style="background: #f0f9ff; padding: 1.25rem; border-radius: 8px; border: 1px solid #bae6fd; margin-bottom: 1.5rem;"><div style="display: flex; align-items: center; justify-content: space-between;"><div><label for="has_extra_service" style="font-weight: 700; font-size: 0.95rem; color: #0369a1; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; text-transform: none; letter-spacing: 0; margin: 0;" class="svelte-nbvn7e"><input type="checkbox" id="has_extra_service" name="has_extra_service"${attr("checked", hasExtraService, true)} style="width: 18px; height: 18px; accent-color: #0284c7; cursor: pointer;" class="svelte-nbvn7e"/> ⚡ Oferecer Serviço ou Item Extra no Checkout (Order Bump)</label> <span style="font-size: 0.8rem; color: #0891b2; display: block; margin-top: 0.35rem; line-height: 1.4;">Ofereça um serviço complementar opcional no momento da compra (ex: Instalação no servidor, suporte VIP, mentoria).</span></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-group file-upload-group svelte-nbvn7e"><label for="product_file" class="svelte-nbvn7e">${escape_html("Arquivo Digital (disco do servidor)")}</label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div${attr_class("file-dropzone svelte-nbvn7e", void 0, { "has-file": false })}><input type="file" id="product_file" name="product_file"${attr("accept", ".pdf,.zip,.rar,.7z,.png,.jpg,.jpeg,.gif,.webp,.mp3,.mp4,.txt")} required="" class="svelte-nbvn7e"/> <div class="dropzone-text svelte-nbvn7e">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-nbvn7e"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> <span>Clique para selecionar o arquivo</span>`);
      }
      $$renderer2.push(`<!--]--> <span class="file-types svelte-nbvn7e">${escape_html("Formatos: PDF, ZIP, RAR, 7Z, Imagens, Vídeo, Áudio (Máx. 30MB)")}</span></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-nbvn7e">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-actions svelte-nbvn7e"><a href="/admin/products" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Criar Produto")}</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BsCbwTsA.js.map
