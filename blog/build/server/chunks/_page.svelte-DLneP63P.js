import { Q as escape_html, J as attr, R as ensure_array_like, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data, form } = $$props;
    let name = data.product.name;
    let slug = data.product.slug || "";
    let description = data.product.description || "";
    let priceValue = data.product.price_cents > 0 ? String(data.product.price_cents / 100).replace(".", ",") : "";
    const isCurrentlyCloudinary = !!(data.product.file_url && data.product.file_url.startsWith("http"));
    let resourceType = data.product.resource_type || (data.product.file_url ? isCurrentlyCloudinary ? "cloudinary" : "file" : data.product.external_link ? "link" : "file");
    let externalLink = data.product.external_link || "";
    let accessLabel = data.product.access_label || "";
    let driveInstructions = data.product.drive_instructions || "";
    let deliveryDeadline = data.product.delivery_deadline || "";
    let loading = false;
    let imagePreviewUrl = data.product.image_url;
    let removeImage = false;
    let removeFile = false;
    let notifyBuyers = false;
    let categoryId = data.product.category_id ? String(data.product.category_id) : "";
    let youtubeVideoUrl = data.product.youtube_video_url || "";
    let isPremiumIncludedVal = data.product.is_premium_included || 0;
    let hasExtraService = data.product.has_extra_service === 1;
    let extraServiceTitle = data.product.extra_service_title || "";
    let extraServicePriceValue = data.product.extra_service_price_cents && data.product.extra_service_price_cents > 0 ? String(data.product.extra_service_price_cents / 100).replace(".", ",") : "";
    let extraServiceDescription = data.product.extra_service_description || "";
    function formatPrice(cents) {
      return (cents / 100).toLocaleString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { style: "currency", currency: "BRL" });
    }
    function parsePrice(value) {
      if (!value) return 0;
      const str = value.trim();
      if (!str) return 0;
      if (str.includes(",") || str.includes(".")) {
        const normalized = str.replace(",", ".");
        const num2 = parseFloat(normalized);
        return isNaN(num2) ? 0 : Math.round(num2 * 100);
      }
      const num = parseInt(str, 10);
      return isNaN(num) ? 0 : num * 100;
    }
    $$renderer2.push(`<div class="edit-product-page svelte-a2k48x"><div class="page-header svelte-a2k48x"><h1 class="svelte-a2k48x">${escape_html(t(lang(), "admin.products.edit"))} Digital</h1> <p class="subtitle svelte-a2k48x">Modifique as informações do seu recurso digital</p></div> <form method="POST" enctype="multipart/form-data" class="product-form svelte-a2k48x"><div class="form-section svelte-a2k48x"><div class="form-group svelte-a2k48x"><label for="name" class="svelte-a2k48x">Nome do Produto</label> <input type="text" id="name" name="name"${attr("value", name)} placeholder="Ex: E-book de Introdução ao Svelte em PDF" required="" class="svelte-a2k48x"/></div> <div class="form-group svelte-a2k48x"><label for="slug" class="svelte-a2k48x">Slug do Produto (URL)</label> <input type="text" id="slug" name="slug"${attr("value", slug)} placeholder="url-do-produto" class="svelte-a2k48x"/> <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;" class="svelte-a2k48x">Deixe em branco para gerar automaticamente com base no nome.</small></div> <div class="form-group svelte-a2k48x"><label for="description" class="svelte-a2k48x">${escape_html(t(lang(), "admin.ui.description"))}</label> <textarea id="description" name="description" rows="3" placeholder="Breve resumo sobre o arquivo/link..." class="svelte-a2k48x">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-group svelte-a2k48x"><label for="category_id" class="svelte-a2k48x">${escape_html(t(lang(), "admin.ui.category"))}</label> `);
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
          $$renderer3.option({ value: String(cat.id) }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cat.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-a2k48x"
    );
    $$renderer2.push(` <small style="margin-top: 0.25rem; display: block;" class="svelte-a2k48x"><a href="/admin/products/categories" target="_blank" style="color: var(--accent-color, #3b82f6); text-decoration: none; font-weight: 600;">Gerenciar Categorias →</a></small></div> <div class="form-group svelte-a2k48x"><label for="youtube_video_url" class="svelte-a2k48x">URL do Vídeo do YouTube (Opcional)</label> <input type="text" id="youtube_video_url" name="youtube_video_url"${attr("value", youtubeVideoUrl)} placeholder="Ex: https://www.youtube.com/watch?v=..." class="svelte-a2k48x"/> <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;" class="svelte-a2k48x">Se preenchido, um player de vídeo explicativo com autoplay/mute expandirá automaticamente 2 segundos após a pessoa entrar na página do produto.</small></div> <div class="form-group svelte-a2k48x"><label for="product_image" class="svelte-a2k48x">Imagem Ilustrativa (Opcional)</label> `);
    if (data.product.image_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><input type="checkbox" id="remove_image_checkbox"${attr("checked", removeImage, true)} style="width: auto; margin: 0;" class="svelte-a2k48x"/> <label for="remove_image_checkbox" style="font-weight: normal; cursor: pointer; margin: 0;" class="svelte-a2k48x">Remover imagem ilustrativa atual</label></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input type="hidden" name="remove_image"${attr("value", "0")} class="svelte-a2k48x"/> `);
    if (imagePreviewUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="image-preview-container svelte-a2k48x"><img${attr("src", imagePreviewUrl)} alt="Imagem do produto" class="image-preview svelte-a2k48x"/> <span class="preview-badge svelte-a2k48x">${escape_html(imagePreviewUrl === data.product.image_url ? "Imagem atual" : "Nova imagem selecionada")}</span> `);
      if (imagePreviewUrl !== data.product.image_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="button" class="btn-remove-image svelte-a2k48x">Cancelar alteração</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input type="file" id="product_image" name="product_image" class="file-input svelte-a2k48x" accept="image/jpeg,image/png,image/gif,image/webp"/> <small class="svelte-a2k48x">Envie uma nova imagem para substituir a atual. (Formatos: JPG, PNG, WebP. Máx. 5MB)</small></div></div> <div class="section-divider svelte-a2k48x"></div> <div class="form-section svelte-a2k48x"><div class="form-row svelte-a2k48x"><div class="form-group svelte-a2k48x"><label for="price_display" class="svelte-a2k48x">Preço (opcional, em R$)</label> <div class="price-input-group svelte-a2k48x"><input type="text" id="price_display" name="price_display" placeholder="19,90"${attr("value", priceValue)} class="svelte-a2k48x"/> <span class="input-suffix svelte-a2k48x">R$</span></div> <input type="hidden" id="price_cents_val" name="price_cents"${attr("value", data.product.price_cents)} class="svelte-a2k48x"/> `);
    if (priceValue && parsePrice(priceValue) > 0) {
      $$renderer2.push("<!--[0-->");
      if (parsePrice(priceValue) < 500) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<small style="color: #dc2626; font-weight: 600; display: block; margin-top: 0.25rem;" class="svelte-a2k48x">⚠️ Atenção: O Asaas exige um valor mínimo de R$ 5,00 para pagamentos. Valores menores que R$ 5,00 darão erro na compra.</small>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<small class="svelte-a2k48x">Valor cadastrado: ${escape_html(formatPrice(parsePrice(priceValue)))}</small>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<small class="free-info svelte-a2k48x">Deixe em branco ou 0 para download gratuito. (Mínimo de R$ 5,00 para produtos pagos)</small>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-a2k48x"><label for="resource_type" class="svelte-a2k48x">Tipo de Recurso</label> `);
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
      "svelte-a2k48x"
    );
    $$renderer2.push(`</div></div> <div class="form-group svelte-a2k48x" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box;"><label for="is_premium_included" style="font-weight: 700; margin: 0; text-transform: none; letter-spacing: 0; font-size: 0.95rem; color: #0f172a;" class="svelte-a2k48x">Disponibilidade na Assinatura Premium</label> `);
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
            $$renderer4.push(`🔒 Included only in Plan: ${escape_html(plan.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-a2k48x"
    );
    $$renderer2.push(` <span style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin-top: 0.25rem;">Selecione qual nível de assinatura premium do site dará acesso gratuito a este produto digital. <strong>Acesso vitalício permanente:</strong> quem comprar de forma avulsa sempre manterá acesso definitivo, mesmo que cancele a assinatura ou não seja Premium.</span></div> <div class="form-group order-bump-group svelte-a2k48x" style="background: #f0f9ff; padding: 1.25rem; border-radius: 8px; border: 1px solid #bae6fd; margin-bottom: 1.5rem;"><div style="display: flex; align-items: center; justify-content: space-between;"><div><label for="has_extra_service" style="font-weight: 700; font-size: 0.95rem; color: #0369a1; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; text-transform: none; letter-spacing: 0; margin: 0;" class="svelte-a2k48x"><input type="checkbox" id="has_extra_service" name="has_extra_service"${attr("checked", hasExtraService, true)} style="width: 18px; height: 18px; accent-color: #0284c7; cursor: pointer;" class="svelte-a2k48x"/> ⚡ Oferecer Serviço ou Item Extra no Checkout (Order Bump)</label> <span style="font-size: 0.8rem; color: #0891b2; display: block; margin-top: 0.35rem; line-height: 1.4;">Ofereça um serviço complementar opcional no momento da compra (ex: Instalação no servidor, suporte VIP, mentoria).</span></div></div> `);
    if (hasExtraService) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; border-top: 1px dashed #7dd3fc;"><div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;"><div><label for="extra_service_title" style="font-size: 0.85rem; font-weight: 600; color: #0369a1; display: block; margin-bottom: 0.3rem;" class="svelte-a2k48x">Título do Serviço / Item Extra *</label> <input type="text" id="extra_service_title" name="extra_service_title"${attr("value", extraServiceTitle)} placeholder="Ex: Serviço de Instalação e Configuração"${attr("required", hasExtraService, true)} style="background: #fff; border: 1px solid #7dd3fc; border-radius: 6px; padding: 0.6rem; font-size: 0.9rem; width: 100%; box-sizing: border-box;" class="svelte-a2k48x"/></div> <div><label for="extra_service_price_display" style="font-size: 0.85rem; font-weight: 600; color: #0369a1; display: block; margin-bottom: 0.3rem;" class="svelte-a2k48x">Valor Adicional (R$)</label> <input type="text" id="extra_service_price_display" placeholder="50,00"${attr("value", extraServicePriceValue)} style="background: #fff; border: 1px solid #7dd3fc; border-radius: 6px; padding: 0.6rem; font-size: 0.9rem; width: 100%; box-sizing: border-box;" class="svelte-a2k48x"/> <input type="hidden" name="extra_service_price_cents"${attr("value", parsePrice(extraServicePriceValue))} class="svelte-a2k48x"/> <small style="font-size: 0.75rem; color: #0284c7; margin-top: 0.2rem; display: block;" class="svelte-a2k48x">${escape_html(extraServicePriceValue ? formatPrice(parsePrice(extraServicePriceValue)) : "R$ 0,00")}</small></div></div> <div><label for="extra_service_description" style="font-size: 0.85rem; font-weight: 600; color: #0369a1; display: block; margin-bottom: 0.3rem;" class="svelte-a2k48x">Descrição do Serviço (Opcional)</label> <textarea id="extra_service_description" name="extra_service_description" rows="2" placeholder="Ex: Deixamos a aplicação instalada e rodando perfeitamente no seu servidor em até 24 horas." style="background: #fff; border: 1px solid #7dd3fc; border-radius: 6px; padding: 0.6rem; font-size: 0.9rem; width: 100%; box-sizing: border-box;" class="svelte-a2k48x">`);
      const $$body_1 = escape_html(extraServiceDescription);
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (resourceType === "file") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-group file-upload-group svelte-a2k48x"><label for="product_file" class="svelte-a2k48x">Arquivo Digital no Servidor (Deixe vazio para manter o atual)</label> `);
      if (data.product.file_url && !isCurrentlyCloudinary) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><input type="checkbox" id="remove_file_checkbox"${attr("checked", removeFile, true)} style="width: auto; margin: 0;" class="svelte-a2k48x"/> <label for="remove_file_checkbox" style="font-weight: normal; cursor: pointer; margin: 0;" class="svelte-a2k48x">Remover arquivo digital atual</label></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <input type="hidden" name="remove_file"${attr("value", "0")} class="svelte-a2k48x"/> `);
      if (data.product.file_url && !isCurrentlyCloudinary && !removeFile) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="current-file-badge svelte-a2k48x"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> <span>Arquivo atual (disco): <strong>${escape_html(data.product.file_url.split("/").pop())}</strong></span></div>`);
      } else if (data.product.file_url && !isCurrentlyCloudinary && removeFile) ;
      else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div${attr_class("file-dropzone svelte-a2k48x", void 0, { "has-file": false })}><input type="file" id="product_file" name="product_file" accept=".pdf,.zip,.rar,.7z,.png,.jpg,.jpeg,.gif,.webp,.mp3,.mp4,.txt" class="svelte-a2k48x"/> <div class="dropzone-text svelte-a2k48x">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-a2k48x"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> <span>Clique para selecionar um novo arquivo para substituir o atual</span>`);
      }
      $$renderer2.push(`<!--]--> <span class="file-types svelte-a2k48x">Formatos suportados: PDF, ZIP, RAR, 7Z, Imagens, Vídeo, Áudio (Máx. 30MB)</span></div></div></div>`);
    } else if (resourceType === "cloudinary") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="form-group file-upload-group svelte-a2k48x"><label for="product_file" class="svelte-a2k48x">☁️ Arquivo no Cloudinary (Deixe vazio para manter o atual)</label> <div class="cloudinary-info svelte-a2k48x"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-a2k48x"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Download via proxy seguro — a URL do Cloudinary nunca é exposta. Ao enviar novo arquivo, o antigo é deletado automaticamente.</div> `);
      if (data.product.file_url && isCurrentlyCloudinary) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="current-file-badge cloudinary-badge svelte-a2k48x"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg> <span>Arquivo atual no Cloudinary — envie um novo para substituir</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <input type="hidden" name="remove_file" value="0" class="svelte-a2k48x"/> <div${attr_class("file-dropzone svelte-a2k48x", void 0, { "has-file": false })}><input type="file" id="product_file" name="product_file" accept=".pdf,.zip,.rar,.7z,.txt" class="svelte-a2k48x"/> <div class="dropzone-text svelte-a2k48x">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-a2k48x"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> <span>Clique para enviar nova versão (substitui o arquivo anterior)</span>`);
      }
      $$renderer2.push(`<!--]--> <span class="file-types svelte-a2k48x">Formatos: PDF, ZIP, RAR, 7Z, TXT (Máx. 100MB)</span></div></div></div>`);
    } else if (resourceType === "manual") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="manual-delivery-fields"><div class="manual-delivery-info"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> O comprador informará o Gmail, GitHub ou outro identificador antes de pagar. Você entrega manualmente e marca como entregue no painel de vendas.</div> <div class="form-group svelte-a2k48x"><label for="external_link" class="svelte-a2k48x">🔗 Link do Recurso (Drive/GitHub/etc.) <span class="required-mark">*</span></label> <input type="url" id="external_link" name="external_link"${attr("value", externalLink)} placeholder="https://drive.google.com/..." required="" class="svelte-a2k48x"/> <small class="svelte-a2k48x">⚠️ Este link é <strong>privado</strong> — nunca é exposto ao comprador. Use-o como referência para você ao compartilhar.</small></div> <div class="form-group svelte-a2k48x"><label for="access_label" class="svelte-a2k48x">🏷️ Label do campo para o comprador</label> <input type="text" id="access_label" name="access_label"${attr("value", accessLabel)} placeholder="Ex: Seu Gmail, Seu usuário do GitHub..." class="svelte-a2k48x"/> <small class="svelte-a2k48x">Texto exibido ao comprador pedindo o identificador. Ex: "Seu Gmail para receber o acesso".</small></div> <div class="form-group svelte-a2k48x"><label for="drive_instructions" class="svelte-a2k48x">📝 Instruções pós-compra</label> <textarea id="drive_instructions" name="drive_instructions" rows="3" placeholder="Ex: Após o pagamento confirmado, compartilharemos o acesso em até 24h no Gmail informado." class="svelte-a2k48x">`);
      const $$body_2 = escape_html(driveInstructions);
      if ($$body_2) {
        $$renderer2.push(`${$$body_2}`);
      }
      $$renderer2.push(`</textarea> <small class="svelte-a2k48x">Texto exibido ao comprador após a compra (na página do produto).</small></div> <div class="form-group svelte-a2k48x"><label for="delivery_deadline" class="svelte-a2k48x">⏱️ Prazo estimado de entrega</label> <input type="text" id="delivery_deadline" name="delivery_deadline"${attr("value", deliveryDeadline)} placeholder="Ex: até 24h, até 48h, imediato..." class="svelte-a2k48x"/> <small class="svelte-a2k48x">Exibido ao comprador enquanto aguarda o compartilhamento.</small></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="form-group svelte-a2k48x"><label for="external_link" class="svelte-a2k48x">Link Externo</label> <input type="url" id="external_link" name="external_link"${attr("value", externalLink)} placeholder="https://exemplo.com/recurso" required="" class="svelte-a2k48x"/> <small class="svelte-a2k48x">Insira a URL completa (incluindo https://) para redirecionamento do download.</small></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-a2k48x">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="section-divider svelte-a2k48x"></div> <div class="form-section notify-box svelte-a2k48x"><div class="form-group svelte-a2k48x" style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.5rem;"><input type="checkbox" id="notify_buyers" name="notify_buyers" value="on"${attr("checked", notifyBuyers, true)} style="width: auto; margin: 0.2rem 0 0 0; cursor: pointer;" class="svelte-a2k48x"/> <div><label for="notify_buyers" style="font-weight: 600; cursor: pointer; margin: 0; text-transform: none; letter-spacing: 0; font-size: 0.9rem;" class="svelte-a2k48x">Notificar compradores por e-mail sobre esta atualização</label> <small style="display: block; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.4;" class="svelte-a2k48x">Envia via <strong>Resend</strong> para quem comprou o produto (status pago) e, se for recurso Premium, para assinantes ativos.
                        Exige API key e e-mail From em <a href="/admin/settings">Configurações → Resend</a>.</small></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="form-actions svelte-a2k48x"><a href="/admin/products" class="btn">${escape_html(t(lang(), "admin.ui.cancel"))}</a> <button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html(t(lang(), "admin.ui.save_changes"))}</button></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DLneP63P.js.map
