import { G as head, Q as escape_html, J as attr, X as attr_style, O as stringify, R as ensure_array_like, I as attr_class, L as store_get, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import './state.svelte-BCGVlO8d.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import { t, f as formatMoney } from './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => data.settings?.site_language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const paymentGateway = derived(() => store_get($$store_subs ??= {}, "$page", page).data.paymentGateway || "asaas");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    const securePaymentLabel = derived(() => paymentGateway() === "stripe" ? t(lang(), "product.secure_payment_stripe") : t(lang(), "product.secure_payment_asaas"));
    let isDescExpanded = false;
    let videoExpanded = false;
    let buyerAccessId = "";
    const isManual = derived(() => data.product.resource_type === "manual");
    let includeExtraService = false;
    const currentTotalPriceCents = derived(() => data.product.price_cents + 0);
    const extraQuery = derived(() => "");
    const accessLabel = derived(() => data.product.access_label || t(lang(), "product.access_email_label"));
    const buyerIdValid = derived(() => buyerAccessId.trim().length >= 3);
    let isDownloading = false;
    let userRating = 0;
    let hoveredRating = 0;
    let reviewComment = "";
    let isSubmittingReview = false;
    function getYouTubeId(url) {
      if (!url) return null;
      let str = url.trim();
      if (!str) return null;
      const iframeMatch = str.match(/src=["']([^"']+)["']/i);
      if (iframeMatch) {
        str = iframeMatch[1];
      }
      if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        return str;
      }
      const patterns = [
        /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /[?&]v=([a-zA-Z0-9_-]{11})/
      ];
      for (const pattern of patterns) {
        const match = str.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      if (str.includes("youtu")) {
        const fallback = str.match(/([a-zA-Z0-9_-]{11})/);
        if (fallback && fallback[1]) return fallback[1];
      }
      return null;
    }
    const videoId = derived(() => getYouTubeId(data.product.youtube_video_url || ""));
    function formatPrice(cents) {
      if (cents === 0) return t(lang(), "product.free");
      return formatMoney(lang(), cents, displayCurrency());
    }
    function getPlaceholderBackground(id) {
      const gradients = [
        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        // Blue
        "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        // Emerald
        "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
        // Amber
        "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        // Pink
        "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
        // Purple
        "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
        // Orange
        "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
        // Teal
        "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
        // Rose
        "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)"
        // Indigo
      ];
      const hash = String(id).charCodeAt(0) || 0;
      const index = hash % gradients.length;
      return gradients[index];
    }
    const siteTitle = derived(() => data.settings?.site_title || "Blog");
    head("1qe2lqq", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.product.name)} | ${escape_html(siteTitle())}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", data.product.description || `Adquira já o produto digital ${data.product.name}`)} class="svelte-1qe2lqq"/> <meta property="og:title"${attr("content", `${data.product.name} | ${siteTitle()}`)} class="svelte-1qe2lqq"/> <meta property="og:description"${attr("content", data.product.description || `Adquira já o produto digital ${data.product.name}`)} class="svelte-1qe2lqq"/> <meta property="og:type" content="product" class="svelte-1qe2lqq"/> <meta property="og:url"${attr("content", store_get($$store_subs ??= {}, "$page", page).url.href)} class="svelte-1qe2lqq"/> `);
      if (data.product.image_url) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta property="og:image"${attr("content", data.product.image_url)} class="svelte-1qe2lqq"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta name="twitter:card" content="summary_large_image" class="svelte-1qe2lqq"/> <meta name="twitter:title"${attr("content", `${data.product.name} | ${siteTitle()}`)} class="svelte-1qe2lqq"/> <meta name="twitter:description"${attr("content", data.product.description || `Adquira já o produto digital ${data.product.name}`)} class="svelte-1qe2lqq"/>`);
    });
    $$renderer2.push(`<div class="product-page-container svelte-1qe2lqq"><div class="back-nav svelte-1qe2lqq"><a href="/" class="btn-back svelte-1qe2lqq"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><line x1="19" y1="12" x2="5" y2="12" class="svelte-1qe2lqq"></line><polyline points="12 19 5 12 12 5" class="svelte-1qe2lqq"></polyline></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.back_to_blog"))}</span></a></div> <div class="product-main-card svelte-1qe2lqq"><div class="product-grid svelte-1qe2lqq"><div class="product-media-column svelte-1qe2lqq">`);
    if (data.product.image_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", optimizeImageUrl(data.product.image_url, 600, 600))}${attr("alt", data.product.name)} class="product-main-image svelte-1qe2lqq"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="product-placeholder-gradient svelte-1qe2lqq"${attr_style(`background: ${stringify(getPlaceholderBackground(data.product.id))}`)}><div class="placeholder-icon-wrapper svelte-1qe2lqq">`);
      if (data.product.file_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1qe2lqq"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="svelte-1qe2lqq"></path><polyline points="14 2 14 8 20 8" class="svelte-1qe2lqq"></polyline></svg>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1qe2lqq"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" class="svelte-1qe2lqq"></path><polyline points="15 3 21 3 21 9" class="svelte-1qe2lqq"></polyline><line x1="10" y1="14" x2="21" y2="3" class="svelte-1qe2lqq"></line></svg>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="product-details-column svelte-1qe2lqq"><div class="product-badge svelte-1qe2lqq"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" class="svelte-1qe2lqq"></path></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.digital_resource"))}</span></div> <h1 class="product-title svelte-1qe2lqq">${escape_html(data.product.name)}</h1> `);
    if (data.reviewSummary) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="product-rating-summary-compact svelte-1qe2lqq">`);
      if (data.reviewSummary.totalCount > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="stars-gold-compact svelte-1qe2lqq"><!--[-->`);
        const each_array = ensure_array_like(Array(5));
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          each_array[i];
          $$renderer2.push(`<svg width="15" height="15" viewBox="0 0 24 24"${attr("fill", i < Math.round(data.reviewSummary.averageRating) ? "#fbbf24" : "none")} stroke="#fbbf24" stroke-width="2" class="svelte-1qe2lqq"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" class="svelte-1qe2lqq"></polygon></svg>`);
        }
        $$renderer2.push(`<!--]--></div> <span class="rating-value svelte-1qe2lqq">${escape_html(data.reviewSummary.averageRating)}</span> <span class="rating-count svelte-1qe2lqq">(${escape_html(data.reviewSummary.totalCount)} ${escape_html(data.reviewSummary.totalCount === 1 ? t(lang(), "reviews.count_badge_singular") : t(lang(), "reviews.count_badge_plural"))})</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="no-ratings-yet svelte-1qe2lqq">★ ${escape_html(t(lang(), "reviews.no_ratings"))}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.product.is_premium_included && data.product.is_premium_included >= 1 && !data.hasPurchased) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="premium-badge-banner svelte-1qe2lqq"><span class="sparkle-icon svelte-1qe2lqq">⭐</span> <div class="banner-content svelte-1qe2lqq"><h4 class="svelte-1qe2lqq">${escape_html(t(lang(), "product.included_in_premium"))}</h4> <p class="svelte-1qe2lqq">${escape_html(t(lang(), "product.premium_promo_desc"))}</p></div> <a href="/premium" class="btn-premium-link svelte-1qe2lqq">${escape_html(t(lang(), "product.subscribe_premium_btn"))}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="price-section svelte-1qe2lqq"><span class="price-label svelte-1qe2lqq">${escape_html(t(lang(), "product.value"))}:</span> <span${attr_class("price-tag svelte-1qe2lqq", void 0, { "free-price": data.product.price_cents <= 0 })}>${escape_html(formatPrice(currentTotalPriceCents()))}</span></div> <div class="action-card svelte-1qe2lqq">`);
    if (data.product.price_cents > 0 && !data.hasPurchased) {
      $$renderer2.push("<!--[0-->");
      if (data.product.has_extra_service === 1 && data.product.extra_service_title && data.user) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class("order-bump-box svelte-1qe2lqq", void 0, { "bump-active": includeExtraService })} style="background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 1.1rem; margin-bottom: 1.25rem; transition: all 0.2s ease;"><label style="display: flex; align-items: flex-start; gap: 0.85rem; cursor: pointer; user-select: none; margin: 0;" class="svelte-1qe2lqq"><input type="checkbox"${attr("checked", includeExtraService, true)} style="width: 20px; height: 20px; accent-color: #0284c7; margin-top: 2px; cursor: pointer; flex-shrink: 0;" class="svelte-1qe2lqq"/> <div style="display: flex; flex-direction: column; width: 100%;" class="svelte-1qe2lqq"><div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;" class="svelte-1qe2lqq"><span style="background: #0284c7; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; text-transform: uppercase;" class="svelte-1qe2lqq">⚡ SERVIÇO EXTRA OPIONAL</span> <span style="font-size: 0.95rem; font-weight: 800; color: #0284c7; margin-left: auto;" class="svelte-1qe2lqq">+ ${escape_html(formatPrice(data.product.extra_service_price_cents || 0))}</span></div> <span style="font-size: 0.95rem; font-weight: 700; color: #0369a1; line-height: 1.3;" class="svelte-1qe2lqq">Adicionar ${escape_html(data.product.extra_service_title)}</span> `);
        if (data.product.extra_service_description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p style="font-size: 0.825rem; color: #334155; line-height: 1.45; margin: 0.4rem 0 0 0;" class="svelte-1qe2lqq">${escape_html(data.product.extra_service_description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></label></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.settings?.enable_member_login !== "1") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn btn-full btn-disabled svelte-1qe2lqq" disabled="">${escape_html(t(lang(), "product.sales_suspended"))}</button>`);
      } else if (!data.user) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<a${attr("href", `/members/login?redirectTo=${stringify(encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)} class="btn btn-full btn-primary btn-cta svelte-1qe2lqq"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" class="svelte-1qe2lqq"></path><line x1="3" y1="6" x2="21" y2="6" class="svelte-1qe2lqq"></line><path d="M16 10a4 4 0 0 1-8 0" class="svelte-1qe2lqq"></path></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.login_to_buy"))}</span></a> <p class="login-hint svelte-1qe2lqq">${escape_html(t(lang(), "product.account_required"))}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        if (isManual()) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="manual-access-form svelte-1qe2lqq"><label for="buyer-access-id" class="manual-label svelte-1qe2lqq"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" class="svelte-1qe2lqq"></path><circle cx="12" cy="7" r="4" class="svelte-1qe2lqq"></circle></svg> ${escape_html(accessLabel())} <span class="required-mark svelte-1qe2lqq">*</span></label> <input id="buyer-access-id" type="text" class="manual-input svelte-1qe2lqq"${attr("value", buyerAccessId)}${attr("placeholder", t(lang(), "product.access_email_ph"))}/> <p class="manual-hint svelte-1qe2lqq">${escape_html(t(lang(), "product.manual_delivery_hint"))}</p> `);
          if (buyerIdValid()) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="payment-buttons-group svelte-1qe2lqq">`);
            if (store_get($$store_subs ??= {}, "$page", page).data.paymentGateway === "stripe") {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<a${attr("href", `/purchase/${stringify(data.product.id)}?buyer_id=${stringify(encodeURIComponent(buyerAccessId.trim()))}${extraQuery()}`)} class="btn btn-full btn-primary btn-cta svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" class="svelte-1qe2lqq"></rect><line x1="1" y1="10" x2="23" y2="10" class="svelte-1qe2lqq"></line></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.checkout_stripe"))}</span></a>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<a${attr("href", `/purchase/${stringify(data.product.id)}?method=pix&buyer_id=${stringify(encodeURIComponent(buyerAccessId.trim()))}${extraQuery()}`)} class="btn btn-full btn-primary btn-cta btn-pix svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1qe2lqq"><path d="M12 2L2 12l10 10 10-10L12 2z" class="svelte-1qe2lqq"></path><path d="M12 7l-5 5 5 5 5-5-5-5z" class="svelte-1qe2lqq"></path></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.pix_payment"))}</span></a> <a${attr("href", `/purchase/${stringify(data.product.id)}?method=credit_card&buyer_id=${stringify(encodeURIComponent(buyerAccessId.trim()))}${extraQuery()}`)} class="btn btn-full btn-secondary btn-cta svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" class="svelte-1qe2lqq"></rect><line x1="1" y1="10" x2="23" y2="10" class="svelte-1qe2lqq"></line></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.card_payment"))}</span></a>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<button class="btn btn-full btn-disabled svelte-1qe2lqq" disabled="">${escape_html(t(lang(), "product.fill_email"))}</button>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="payment-buttons-group svelte-1qe2lqq">`);
          if (store_get($$store_subs ??= {}, "$page", page).data.paymentGateway === "stripe") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", `/purchase/${stringify(data.product.id)}?${stringify(extraQuery().replace("&", ""))}`)} class="btn btn-full btn-primary btn-cta svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" class="svelte-1qe2lqq"></rect><line x1="1" y1="10" x2="23" y2="10" class="svelte-1qe2lqq"></line></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.checkout_stripe"))}</span></a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<a${attr("href", `/purchase/${stringify(data.product.id)}?method=pix${extraQuery()}`)} class="btn btn-full btn-primary btn-cta btn-pix svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1qe2lqq"><path d="M12 2L2 12l10 10 10-10L12 2z" class="svelte-1qe2lqq"></path><path d="M12 7l-5 5 5 5 5-5-5-5z" class="svelte-1qe2lqq"></path></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.pix_payment"))}</span></a> <a${attr("href", `/purchase/${stringify(data.product.id)}?method=credit_card${extraQuery()}`)} class="btn btn-full btn-secondary btn-cta svelte-1qe2lqq" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" class="svelte-1qe2lqq"></rect><line x1="1" y1="10" x2="23" y2="10" class="svelte-1qe2lqq"></line></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.card_payment"))}</span></a>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--> <p class="login-hint svelte-1qe2lqq">${escape_html(t(lang(), "product.login_hint"))}</p>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="download-container svelte-1qe2lqq">`);
      if (isManual() && data.purchaseStatus === "pending_delivery") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="pending-delivery-badge svelte-1qe2lqq"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" class="svelte-1qe2lqq"><circle cx="12" cy="12" r="10" class="svelte-1qe2lqq"></circle><polyline points="12 6 12 12 16 14" class="svelte-1qe2lqq"></polyline></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.waiting_share"))}</span></div> <p class="pending-delivery-msg svelte-1qe2lqq">${escape_html(t(lang(), "product.waiting_share_msg"))} `);
        if (data.product.delivery_deadline) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<strong class="svelte-1qe2lqq">${escape_html(t(lang(), "product.delivery_deadline"))} ${escape_html(data.product.delivery_deadline)}.</strong>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></p> `);
        if (data.product.drive_instructions) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="delivery-instructions svelte-1qe2lqq">${escape_html(data.product.drive_instructions)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else if (isManual() && data.purchaseStatus === "completed") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="success-purchase-badge svelte-1qe2lqq"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" class="svelte-1qe2lqq"></path><polyline points="22 4 12 14.01 9 11.01" class="svelte-1qe2lqq"></polyline></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.access_released"))}</span></div> `);
        if (data.product.drive_instructions) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="delivery-instructions delivered svelte-1qe2lqq">${escape_html(data.product.drive_instructions)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="success-purchase-badge svelte-1qe2lqq"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" class="svelte-1qe2lqq"></path><polyline points="22 4 12 14.01 9 11.01" class="svelte-1qe2lqq"></polyline></svg> <span class="svelte-1qe2lqq">${escape_html(t(lang(), "product.access_released"))}</span></div>  <a${attr("href", `/api/download/${stringify(data.product.id)}`)} rel="external"${attr_class("btn btn-full btn-cta svelte-1qe2lqq", void 0, { "btn-primary": !isDownloading, "btn-disabled": isDownloading })}>`);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" class="svelte-1qe2lqq"></path><polyline points="7 10 12 15 17 10" class="svelte-1qe2lqq"></polyline><line x1="12" y1="15" x2="12" y2="3" class="svelte-1qe2lqq"></line></svg> <span class="svelte-1qe2lqq">${escape_html(data.product.file_url ? t(lang(), "product.download_file") : t(lang(), "product.access_resource"))}</span>`);
        }
        $$renderer2.push(`<!--]--></a> `);
        if (data.isPremiumAccess) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div style="font-size: 0.8rem; color: #4f46e5; text-align: center; margin-top: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.25rem;" class="svelte-1qe2lqq"><span class="svelte-1qe2lqq">🌟</span> ${escape_html(t(lang(), "product.premium_granted_msg"))}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="trust-badges svelte-1qe2lqq"><div class="badge-item svelte-1qe2lqq"><span class="badge-icon svelte-1qe2lqq">🔒</span> <span class="badge-text svelte-1qe2lqq">${escape_html(securePaymentLabel())}</span></div> <div class="badge-item svelte-1qe2lqq"><span class="badge-icon svelte-1qe2lqq">⚡</span> <span class="badge-text svelte-1qe2lqq">${escape_html(t(lang(), "product.instant_download"))}</span></div> <div class="badge-item svelte-1qe2lqq">`);
    if (data.hasPurchased && data.isPremiumAccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="badge-icon svelte-1qe2lqq">🌟</span> <span class="badge-text svelte-1qe2lqq">${escape_html(t(lang(), "product.premium_access"))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="badge-icon svelte-1qe2lqq">♾️</span> <span class="badge-text svelte-1qe2lqq">${escape_html(t(lang(), "product.lifetime_access"))}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div> `);
    if (videoId()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("product-video-card-container svelte-1qe2lqq", void 0, { "expanded": videoExpanded })}><div class="product-video-card svelte-1qe2lqq"><div class="video-header svelte-1qe2lqq"><span class="video-badge svelte-1qe2lqq"><span class="pulse-dot svelte-1qe2lqq"></span> ${escape_html(t(lang(), "product.demo_video"))}</span> <h3 class="svelte-1qe2lqq">${escape_html(t(lang(), "product.demo_video_subtitle"))}</h3></div> <div class="video-wrapper svelte-1qe2lqq">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="video-thumbnail-placeholder svelte-1qe2lqq"><img${attr("src", `https://img.youtube.com/vi/${stringify(videoId())}/maxresdefault.jpg`)} alt="Miniatura do vídeo" class="svelte-1qe2lqq"/> <div class="play-button-placeholder svelte-1qe2lqq"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="svelte-1qe2lqq"><polygon points="5 3 19 12 5 21 5 3" class="svelte-1qe2lqq"></polygon></svg></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.product.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="product-description-section svelte-1qe2lqq"><h2 class="svelte-1qe2lqq">${escape_html(t(lang(), "product.description"))}</h2> <div class="description-container svelte-1qe2lqq"><div${attr_class("description-content svelte-1qe2lqq", void 0, { "expanded": isDescExpanded })}>${escape_html(data.product.description)}</div> `);
      if (data.product.description.length > 300) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="button" class="toggle-desc-btn svelte-1qe2lqq">${escape_html(t(lang(), "common.more"))}</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="product-reviews-section svelte-1qe2lqq"><div class="reviews-header svelte-1qe2lqq"><h2 class="svelte-1qe2lqq">${escape_html(t(lang(), "reviews.title"))}</h2> `);
    if (data.reviewSummary && data.reviewSummary.totalCount > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="reviews-count-badge svelte-1qe2lqq">${escape_html(data.reviewSummary.totalCount)} ${escape_html(data.reviewSummary.totalCount === 1 ? t(lang(), "reviews.count_badge_singular") : t(lang(), "reviews.count_badge_plural"))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="reviews-grid svelte-1qe2lqq"><div class="reviews-summary-panel svelte-1qe2lqq"><div class="rating-huge-box svelte-1qe2lqq"><span class="rating-huge-val svelte-1qe2lqq">${escape_html(data.reviewSummary?.averageRating || "0.0")}</span> <div class="stars-gold-huge svelte-1qe2lqq"><!--[-->`);
    const each_array_1 = ensure_array_like(Array(5));
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      each_array_1[i];
      $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24"${attr("fill", i < Math.round(data.reviewSummary?.averageRating || 0) ? "#fbbf24" : "none")} stroke="#fbbf24" stroke-width="2" class="svelte-1qe2lqq"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" class="svelte-1qe2lqq"></polygon></svg>`);
    }
    $$renderer2.push(`<!--]--></div> <span class="rating-subtitle svelte-1qe2lqq">${escape_html(t(lang(), "reviews.general_average"))}</span></div></div> <div class="reviews-form-panel svelte-1qe2lqq">`);
    if (!data.user) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="review-auth-prompt svelte-1qe2lqq"><p class="svelte-1qe2lqq">${escape_html(t(lang(), "reviews.login_prompt"))}</p> <a${attr("href", `/members/login?redirectTo=${stringify(encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)} class="btn btn-secondary btn-sm svelte-1qe2lqq">${escape_html(t(lang(), "product.login_review"))}</a></div>`);
    } else if (!data.hasPurchased) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="review-auth-prompt svelte-1qe2lqq"><p class="svelte-1qe2lqq">${escape_html(t(lang(), "product.only_buyers"))}</p></div>`);
    } else if (data.hasReviewed) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="review-success-panel svelte-1qe2lqq"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" class="svelte-1qe2lqq"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" class="svelte-1qe2lqq"></path><polyline points="22 4 12 14.01 9 11.01" class="svelte-1qe2lqq"></polyline></svg> <p class="svelte-1qe2lqq">${escape_html(t(lang(), "reviews.success_message"))}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form method="POST" action="?/addReview" class="add-review-form svelte-1qe2lqq"><h3 class="form-title svelte-1qe2lqq">${escape_html(t(lang(), "reviews.leave_review"))}</h3> <div class="form-group-rating svelte-1qe2lqq"><span class="rating-label svelte-1qe2lqq">${escape_html(t(lang(), "reviews.your_rating"))}</span> <div class="stars-selector svelte-1qe2lqq"><!--[-->`);
      const each_array_2 = ensure_array_like([1, 2, 3, 4, 5]);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let star = each_array_2[$$index_2];
        $$renderer2.push(`<button type="button" class="star-btn svelte-1qe2lqq"${attr("title", t(lang(), "product.star_titles", { n: star }))}><svg width="32" height="32" viewBox="0 0 24 24"${attr("fill", hoveredRating >= star || userRating >= star ? "#fbbf24" : "none")} stroke="#fbbf24" stroke-width="2" class="interactive-star svelte-1qe2lqq"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" class="svelte-1qe2lqq"></polygon></svg></button>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="form-group svelte-1qe2lqq"><label for="review-comment" class="svelte-1qe2lqq">${escape_html(t(lang(), "product.your_comment"))}</label> <textarea id="review-comment" name="comment" rows="3"${attr("placeholder", t(lang(), "reviews.comment_placeholder"))} class="svelte-1qe2lqq">`);
      const $$body = escape_html(reviewComment);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> `);
      if (form?.message) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`alert ${form.success ? "success" : "error"}`, "svelte-1qe2lqq")}>${escape_html(form.message)}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="btn btn-primary btn-submit-review svelte-1qe2lqq"${attr("disabled", isSubmittingReview, true)}>${escape_html(t(lang(), "reviews.submit"))}</button></form>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="reviews-list-container svelte-1qe2lqq"><h3 class="svelte-1qe2lqq">${escape_html(t(lang(), "reviews.buyer_opinion"))}</h3> `);
    if (data.reviews && data.reviews.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="reviews-list svelte-1qe2lqq"><!--[-->`);
      const each_array_3 = ensure_array_like(data.reviews);
      for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
        let review = each_array_3[$$index_4];
        $$renderer2.push(`<div class="review-card svelte-1qe2lqq"><div class="review-card-header svelte-1qe2lqq"><div class="reviewer-info svelte-1qe2lqq"><div class="reviewer-avatar svelte-1qe2lqq">${escape_html((review.user_name || review.username).substring(0, 2).toUpperCase())}</div> <div class="reviewer-meta svelte-1qe2lqq"><span class="reviewer-name svelte-1qe2lqq">${escape_html(review.user_name || review.username)}</span> <span class="review-date svelte-1qe2lqq">${escape_html(formatDate(review.created_at))}</span></div></div> <div class="stars-gold-compact svelte-1qe2lqq"><!--[-->`);
        const each_array_4 = ensure_array_like(Array(5));
        for (let i = 0, $$length2 = each_array_4.length; i < $$length2; i++) {
          each_array_4[i];
          $$renderer2.push(`<svg width="14" height="14" viewBox="0 0 24 24"${attr("fill", i < review.rating ? "#fbbf24" : "none")} stroke="#fbbf24" stroke-width="2" class="svelte-1qe2lqq"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" class="svelte-1qe2lqq"></polygon></svg>`);
        }
        $$renderer2.push(`<!--]--></div></div> `);
        if (review.comment) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="review-comment-text svelte-1qe2lqq">${escape_html(review.comment)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="review-comment-text no-text svelte-1qe2lqq">${escape_html(t(lang(), "product.star_titles", { n: review.rating }))}</p>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="reviews-empty svelte-1qe2lqq"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1qe2lqq"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" class="svelte-1qe2lqq"></path></svg> <p class="svelte-1qe2lqq">${escape_html(t(lang(), "reviews.no_reviews"))}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (data.relatedProducts && data.relatedProducts.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="related-products-section svelte-1qe2lqq"><h2 class="svelte-1qe2lqq">${escape_html(t(lang(), "product.recommended"))}</h2> <div class="related-products-grid svelte-1qe2lqq"><!--[-->`);
      const each_array_5 = ensure_array_like(data.relatedProducts);
      for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
        let prod = each_array_5[$$index_5];
        $$renderer2.push(`<a${attr("href", `/product/${stringify(prod.slug)}`)} class="related-product-card svelte-1qe2lqq">`);
        if (prod.image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(prod.image_url, 300, 300))}${attr("alt", prod.name)} class="related-product-image svelte-1qe2lqq"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="related-product-placeholder svelte-1qe2lqq"${attr_style(`background: ${stringify(getPlaceholderBackground(prod.id))}`)}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1qe2lqq"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" class="svelte-1qe2lqq"></path></svg></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="related-product-info svelte-1qe2lqq">`);
        if (prod.category) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="related-product-category svelte-1qe2lqq">${escape_html(prod.category)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <h3 class="related-product-title svelte-1qe2lqq">${escape_html(prod.name)}</h3> <span class="related-product-price svelte-1qe2lqq">${escape_html(formatPrice(prod.price_cents))}</span></div></a>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BUPM7CC-.js.map
