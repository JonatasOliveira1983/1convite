import { G as head, J as attr, Q as escape_html, I as attr_class, O as stringify, R as ensure_array_like, L as store_get, X as attr_style, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { A as AdRenderer } from './AdRenderer-Ccc4IUSO.js';
import { N as NewsletterSignup } from './NewsletterSignup-DnH6c8tG.js';
import { t, f as formatMoney, a as formatDate } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';

function AgeVerification($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || data.settings?.site_language || "pt");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    let searchInput = "";
    let showScrollTop = false;
    let videoExpanded = false;
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
    const videoId = derived(() => getYouTubeId(data.post.youtube_video_url));
    const processedContent = derived(() => {
      let html2 = data.post.content || "";
      if (videoId()) {
        html2 = html2.replace(/<div class="video-container"[^>]*>\s*<\/div>/gi, `<div class="video-container" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin-bottom:2rem;border-radius:12px;">
          <iframe src="https://www.youtube.com/embed/${videoId()}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="Vídeo do Artigo"></iframe>
        </div>`);
      }
      return html2;
    });
    function formatDate$1(dateString) {
      return formatDate(lang(), dateString, { year: "numeric", month: "long", day: "numeric" });
    }
    function getPostImage(post) {
      if (post.cover_image) return post.cover_image;
      const match = post.content?.match(/<img[^>]+src="([^">]+)"/);
      if (match) return match[1];
      return `https://picsum.photos/seed/${post.id}/800/600`;
    }
    function hasNoImage(post) {
      if (post.cover_image && post.cover_image.trim().length > 0) return false;
      if (post.content && post.content.includes("<img")) {
        const match = post.content.match(/<img[^>]+src="([^">]+)"/);
        if (match && match[1]) return false;
      }
      return true;
    }
    function getPlaceholderBackground(post) {
      const gradients = [
        "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        // Blue
        "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        // Emerald
        "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
        // Yellow
        "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
        // Pink
        "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
        // Purple
        "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
        // Orange
        "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)",
        // Teal
        "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
        // Rose
        "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
        // Indigo
        "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
        // Amber
      ];
      const idStr = String(post.id || post.slug || "0");
      let hash = 0;
      for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % gradients.length;
      return gradients[index];
    }
    const readingTime = derived(() => () => {
      const text = data.post.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      const wordCount = text.split(/\s+/).length;
      const minutes = Math.ceil(wordCount / 200);
      return minutes;
    });
    const jsonLd = derived(() => () => {
      const siteTitle2 = data.settings?.site_title || "Blog";
      const baseUrl = store_get($$store_subs ??= {}, "$page", page).url.origin;
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.post.title,
        description: data.post.excerpt || data.post.title,
        image: data.post.cover_image ? [data.post.cover_image] : [],
        datePublished: data.post.created_at,
        dateModified: data.post.updated_at || data.post.created_at,
        author: { "@type": "Person", name: "Admin" },
        publisher: {
          "@type": "Organization",
          name: siteTitle2,
          logo: {
            "@type": "ImageObject",
            url: data.settings?.seo_image || `${baseUrl}/logo.png`
          }
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/post/${data.post.slug}`
        }
      };
      if (data.post.categories) {
        const categoryList = data.post.categories.split(",");
        schema.articleSection = categoryList[0].trim();
      }
      return JSON.stringify(schema);
    });
    const breadcrumbJsonLd = derived(() => () => {
      const baseUrl = store_get($$store_subs ??= {}, "$page", page).url.origin;
      const category = data.post.categories ? data.post.categories.split(",")[0].trim() : null;
      const categorySlug = category ? category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : null;
      const itemList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl
          }
        ]
      };
      if (category && categorySlug) {
        itemList.itemListElement.push({
          "@type": "ListItem",
          position: 2,
          name: category,
          item: `${baseUrl}/category/${categorySlug}`
        });
      }
      itemList.itemListElement.push({
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: data.post.title,
        item: `${baseUrl}/post/${data.post.slug}`
      });
      return JSON.stringify(itemList);
    });
    const newsSchemaLd = derived(() => () => {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": data.post.title,
        "description": data.post.excerpt || data.post.title,
        "image": data.post.cover_image ? [data.post.cover_image] : [],
        "datePublished": data.post.created_at,
        "dateModified": data.post.updated_at || data.post.created_at,
        "author": { "@type": "Person", "name": "Admin" },
        "publisher": {
          "@type": "Organization",
          "name": (
            // FAQPage JSON-LD (AEO - Answer Engine Optimization)
            // Parse h2/h3 questions and the following paragraph as answers
            siteTitle()
          ),
          "logo": {
            "@type": "ImageObject",
            "url": data.settings?.seo_image || `${store_get($$store_subs ??= {}, "$page", page).url.origin}/logo.png`
          }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": currentUrl() },
        "articleSection": data.post.categories ? data.post.categories.split(",")[0].trim() : "Artigo",
        "keywords": data.post.categories || "noticia, artigo",
        "inLanguage": lang() === "en" ? "en" : lang() === "es" ? "es" : "pt-BR",
        "isAccessibleForFree": true
      });
    });
    const faqSchemaLd = derived(() => () => {
      if (!data.post.content) return null;
      const faqs = [];
      const regex = /<h[23][^>]*>(.*?)\?<\/h[23]>\s*<p[^>]*>(.*?)<\/p>/gi;
      let match;
      while ((match = regex.exec(data.post.content)) !== null) {
        faqs.push({
          "@type": "Question",
          "name": match[1].replace(/<[^>]*>/g, "").trim() + "?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": match[2].replace(/<[^>]*>/g, "").trim()
          }
        });
      }
      if (faqs.length === 0) return null;
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs
      });
    });
    const siteTitle = derived(() => data.settings?.site_title || "Blog");
    const siteUrl = derived(() => store_get($$store_subs ??= {}, "$page", page).url.origin);
    const twitterHandle = derived(() => data.settings?.twitter_handle || "");
    const currentUrl = derived(() => `${siteUrl()}/post/${data.post.slug}`);
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        showScrollTop = window.scrollY > 500;
      });
    }
    function getAbsoluteImageUrl(url) {
      if (!url) return null;
      if (url.startsWith("http")) return url;
      const cleanUrl = url.startsWith("/") ? url : `/${url}`;
      return `${siteUrl()}${cleanUrl}`;
    }
    const absoluteCoverImage = derived(() => getAbsoluteImageUrl(data.post.cover_image));
    const absoluteSeoImage = derived(() => getAbsoluteImageUrl(data.settings?.seo_image || null));
    head("w0ekn9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(siteTitle())} | ${escape_html(data.post.title)}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", data.post.excerpt || data.post.title)} class="svelte-w0ekn9"/> `);
      if (data.post.categories) {
        $$renderer3.push("<!--[0-->");
        const firstCategory = data.post.categories.split(",")[0].trim();
        $$renderer3.push(`<meta property="article:section"${attr("content", firstCategory)} class="svelte-w0ekn9"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> ${html(`<script type="application/ld+json">${jsonLd()()}<\/script>`)} ${html(`<script type="application/ld+json">${newsSchemaLd()()}<\/script>`)} ${html(`<script type="application/ld+json">${breadcrumbJsonLd()()}<\/script>`)} `);
      if (faqSchemaLd()()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`${html(`<script type="application/ld+json">${faqSchemaLd()()}<\/script>`)}`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta property="og:type" content="article" class="svelte-w0ekn9"/> <meta property="og:url"${attr("content", currentUrl())} class="svelte-w0ekn9"/> <meta property="og:title"${attr("content", data.post.title)} class="svelte-w0ekn9"/> <meta property="og:description"${attr("content", data.post.excerpt || data.post.title)} class="svelte-w0ekn9"/> `);
      if (absoluteCoverImage()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta property="og:image"${attr("content", absoluteCoverImage())} class="svelte-w0ekn9"/>`);
      } else if (absoluteSeoImage()) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<meta property="og:image"${attr("content", absoluteSeoImage())} class="svelte-w0ekn9"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta property="og:site_name"${attr("content", siteTitle())} class="svelte-w0ekn9"/> <meta property="article:published_time"${attr("content", data.post.created_at)} class="svelte-w0ekn9"/> `);
      if (data.post.updated_at) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta property="article:modified_time"${attr("content", data.post.updated_at)} class="svelte-w0ekn9"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta name="twitter:card" content="summary_large_image" class="svelte-w0ekn9"/> <meta name="twitter:title"${attr("content", data.post.title)} class="svelte-w0ekn9"/> <meta name="twitter:description"${attr("content", data.post.excerpt || data.post.title)} class="svelte-w0ekn9"/> `);
      if (absoluteCoverImage()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="twitter:image"${attr("content", absoluteCoverImage())} class="svelte-w0ekn9"/>`);
      } else if (absoluteSeoImage()) {
        $$renderer3.push("<!--[1-->");
        $$renderer3.push(`<meta name="twitter:image"${attr("content", absoluteSeoImage())} class="svelte-w0ekn9"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (twitterHandle()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="twitter:site"${attr("content", twitterHandle())} class="svelte-w0ekn9"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <link rel="canonical"${attr("href", currentUrl())} class="svelte-w0ekn9"/>`);
    });
    AgeVerification($$renderer2, { is18Plus: data.post.is_18_plus === 1 });
    $$renderer2.push(`<!----> <div class="post-layout-wrapper container svelte-w0ekn9"><div class="main-layout svelte-w0ekn9"><div class="content-area svelte-w0ekn9"><article class="article svelte-w0ekn9">`);
    if (data.post.cover_image) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="article-cover svelte-w0ekn9" role="button" tabindex="0"${attr("aria-label", t(lang(), "post.expand_cover"))}><img${attr("src", optimizeImageUrl(data.post.cover_image, 1200))}${attr("alt", data.post.title)} loading="eager" fetchpriority="high" width="1200" height="630" class="svelte-w0ekn9"/> <button class="pinterest-save-btn svelte-w0ekn9"${attr("aria-label", t(lang(), "home.save_pinterest"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="svelte-w0ekn9"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.605 0 12.017 0z" class="svelte-w0ekn9"></path></svg> Salvar</button> <div class="expand-hint svelte-w0ekn9"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><circle cx="11" cy="11" r="8" class="svelte-w0ekn9"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" class="svelte-w0ekn9"></line><line x1="11" y1="8" x2="11" y2="14" class="svelte-w0ekn9"></line><line x1="8" y1="11" x2="14" y2="11" class="svelte-w0ekn9"></line></svg></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <header class="article-header svelte-w0ekn9"><div class="article-meta-top svelte-w0ekn9"><span class="article-category svelte-w0ekn9">${escape_html(data.post.categories ? data.post.categories.split(",")[0] : "Post")}</span> <span class="article-date svelte-w0ekn9">${escape_html(formatDate$1(data.post.created_at))}</span></div> <h1 class="article-title svelte-w0ekn9">${escape_html(data.post.title)}</h1> `);
    if (data.post.excerpt) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="ai-summary svelte-w0ekn9" aria-label="Resumo do Artigo" role="doc-abstract"><strong class="svelte-w0ekn9">💡 ${escape_html(t(lang(), "post.quick_summary"))}</strong> ${escape_html(data.post.excerpt)}</section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="article-meta svelte-w0ekn9"><span class="meta-item svelte-w0ekn9"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><circle cx="12" cy="12" r="10" class="svelte-w0ekn9"></circle><polyline points="12 6 12 12 16 14" class="svelte-w0ekn9"></polyline></svg> ${escape_html(readingTime()())} ${escape_html(t(lang(), "post.min_read"))}</span></div></header> `);
    if (videoId()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("post-video-card-container svelte-w0ekn9", void 0, { "expanded": videoExpanded })}><div class="post-video-card svelte-w0ekn9"><div class="video-header svelte-w0ekn9"><span class="video-pulse-container svelte-w0ekn9"><span class="pulse-dot svelte-w0ekn9"></span></span></div> <div class="video-wrapper svelte-w0ekn9">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<button class="video-thumbnail-placeholder svelte-w0ekn9"><img${attr("src", `https://img.youtube.com/vi/${stringify(videoId())}/maxresdefault.jpg`)}${attr("alt", t(lang(), "post.video_thumb"))} class="svelte-w0ekn9" onerror="this.__e=event"/> <div class="play-button-placeholder svelte-w0ekn9"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="svelte-w0ekn9"><polygon points="5 3 19 12 5 21 5 3" class="svelte-w0ekn9"></polygon></svg></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="article-content-wrapper svelte-w0ekn9"><div${attr_class("article-content svelte-w0ekn9", void 0, { "premium-blur": !data.hasAccess })}>`);
    if (data.postInlineAds && data.postInlineAds.length > 0 && data.hasAccess) {
      $$renderer2.push("<!--[0-->");
      const paragraphs = processedContent().split("</p>");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(paragraphs);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let p = each_array[i];
        if (p.trim()) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`${html(p + "</p>")}`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (i === Math.floor(paragraphs.length / 2) - 1) {
          $$renderer2.push("<!--[0-->");
          AdRenderer($$renderer2, { ads: data.postInlineAds, placement: "post_inline" });
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${html(processedContent())}`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!data.hasAccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="premium-paywall svelte-w0ekn9"><div class="paywall-overlay svelte-w0ekn9"></div> <div class="paywall-card svelte-w0ekn9"><div class="paywall-icon svelte-w0ekn9"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="svelte-w0ekn9"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" class="svelte-w0ekn9"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" class="svelte-w0ekn9"></path></svg></div> <h2 class="svelte-w0ekn9">${escape_html(t(lang(), "post.premium_title"))}</h2> `);
      if (!data.user) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="svelte-w0ekn9">Este artigo é exclusivo para membros do blog. Cadastre-se ou entre em sua conta para assinar um plano e continuar lendo.</p> <div class="paywall-actions svelte-w0ekn9"><a${attr("href", `${stringify(base)}/members/login`)} class="btn btn-primary svelte-w0ekn9">${escape_html(t(lang(), "common.login"))}</a> <a${attr("href", `${stringify(base)}/members/register`)} class="btn btn-secondary svelte-w0ekn9">${escape_html(t(lang(), "common.register"))}</a></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="svelte-w0ekn9">Este artigo é exclusivo para membros Premium. Adquira uma assinatura premium para ter acesso imediato a todos os posts exclusivos.</p> <div class="paywall-actions svelte-w0ekn9"><a${attr("href", `${stringify(base)}/premium`)} class="btn btn-primary svelte-w0ekn9">${escape_html(t(lang(), "post.view_plans"))}</a></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (data.products && data.products.length > 0 && data.hasAccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="product-attachments-box svelte-w0ekn9"><h2 class="svelte-w0ekn9">📎 ${escape_html(t(lang(), "post.attachments"))}</h2> <p class="svelte-w0ekn9">Este post contém arquivos digitais para download ou links adicionais:</p> <div class="products-attachments-list svelte-w0ekn9"><!--[-->`);
      const each_array_1 = ensure_array_like(data.products);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let product = each_array_1[$$index_1];
        $$renderer2.push(`<div class="product-attachment-item svelte-w0ekn9"><div class="product-attachment-left svelte-w0ekn9">`);
        if (product.image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", `${stringify(base)}/product/${stringify(product.slug)}`)} class="svelte-w0ekn9"><img${attr("src", product.image_url)}${attr("alt", product.name)} class="product-attachment-thumb svelte-w0ekn9"/></a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="product-attachment-thumb-placeholder svelte-w0ekn9">`);
          if (product.file_url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="svelte-w0ekn9"></path><polyline points="14 2 14 8 20 8" class="svelte-w0ekn9"></polyline></svg>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" class="svelte-w0ekn9"></path><polyline points="15 3 21 3 21 9" class="svelte-w0ekn9"></polyline><line x1="10" y1="14" x2="21" y2="3" class="svelte-w0ekn9"></line></svg>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="product-attachment-info svelte-w0ekn9"><a${attr("href", `${stringify(base)}/product/${stringify(product.slug)}`)} class="product-attachment-name-link svelte-w0ekn9"><span class="product-attachment-name svelte-w0ekn9">${escape_html(product.name)}</span></a> `);
        if (product.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="product-attachment-desc-container svelte-w0ekn9"><div class="product-attachment-desc-wrapper svelte-w0ekn9"><span class="product-attachment-desc svelte-w0ekn9">${escape_html(product.description)}</span> `);
          if (product.description.length > 200) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="desc-fade-overlay svelte-w0ekn9"></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> `);
          if (product.description.length > 200) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", `${stringify(base)}/product/${stringify(product.slug)}`)} class="toggle-desc-btn svelte-w0ekn9">Ver detalhes do produto <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 4px;" class="svelte-w0ekn9"><line x1="5" y1="12" x2="19" y2="12" class="svelte-w0ekn9"></line><polyline points="12 5 19 12 12 19" class="svelte-w0ekn9"></polyline></svg></a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="product-attachment-action svelte-w0ekn9">`);
        if (product.price_cents > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="product-price svelte-w0ekn9">${escape_html(formatMoney(lang(), product.price_cents, displayCurrency()))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (product.price_cents > 0 && !product.hasPurchased) {
          $$renderer2.push("<!--[0-->");
          if (data.settings?.enable_member_login !== "1") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button class="btn btn-small btn-secondary svelte-w0ekn9" disabled="" style="opacity: 0.6; cursor: not-allowed;">${escape_html(t(lang(), "post.not_available"))}</button>`);
          } else if (!data.user) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<a${attr("href", `${stringify(base)}/members/login?redirectTo=${stringify(encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)} class="btn btn-small btn-primary buy-btn svelte-w0ekn9">${escape_html(t(lang(), "common.buy"))}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<a${attr("href", `${stringify(base)}/purchase/${stringify(product.id)}`)} class="btn btn-small btn-primary buy-btn svelte-w0ekn9" data-sveltekit-reload="" target="_blank" rel="noopener noreferrer">${escape_html(t(lang(), "common.buy"))}</a>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          if (product.file_url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", `${stringify(base)}/api/download/${stringify(product.id)}`)} rel="external" class="btn btn-small btn-primary svelte-w0ekn9"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" class="svelte-w0ekn9"></path><polyline points="17 8 12 3 7 8" class="svelte-w0ekn9"></polyline><line x1="12" y1="3" x2="12" y2="15" class="svelte-w0ekn9"></line></svg> ${escape_html(t(lang(), "post.download_file"))}</a>`);
          } else if (product.external_link) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<a${attr("href", product.external_link)} target="_blank" class="btn btn-small btn-secondary svelte-w0ekn9"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" class="svelte-w0ekn9"></path><polyline points="15 3 21 3 21 9" class="svelte-w0ekn9"></polyline><line x1="10" y1="14" x2="21" y2="3" class="svelte-w0ekn9"></line></svg> ${escape_html(t(lang(), "post.access_link"))}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <footer class="article-footer svelte-w0ekn9"><div class="author-box svelte-w0ekn9"><div class="author-avatar svelte-w0ekn9"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" class="svelte-w0ekn9"></path><circle cx="12" cy="7" r="4" class="svelte-w0ekn9"></circle></svg></div> <div class="author-info svelte-w0ekn9"><span class="author-name svelte-w0ekn9">Admin</span> <span class="author-date svelte-w0ekn9">${escape_html(t(lang(), "post.published_on"))} ${escape_html(formatDate$1(data.post.created_at))}</span></div></div> <div class="sharing-buttons svelte-w0ekn9"><button class="share-btn svelte-w0ekn9" aria-label="Compartilhar no Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-w0ekn9"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" class="svelte-w0ekn9"></path></svg> Facebook</button> <button class="share-btn svelte-w0ekn9" aria-label="Compartilhar no Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-w0ekn9"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" class="svelte-w0ekn9"></path></svg> Twitter</button> <button class="share-btn svelte-w0ekn9"${attr("aria-label", t(lang(), "post.copy_link"))}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" class="svelte-w0ekn9"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" class="svelte-w0ekn9"></path></svg> ${escape_html(t(lang(), "post.copy_link"))}</button></div></footer> <section style="margin: 28px 0; border-radius: 18px; overflow: hidden; background: #121215; border: 1px solid rgba(249, 115, 22, 0.35); color: #ffffff;" class="svelte-w0ekn9"><a href="https://1convite.com.br/#planos" style="display: block; text-decoration: none; color: inherit;" class="svelte-w0ekn9"><img${attr("src", `${stringify(base)}/banner-1convite.jpg`)} alt="1Convite — O Reino no seu bolso" style="width: 100%; height: auto; display: block; max-height: 220px; object-fit: cover;" class="svelte-w0ekn9"/> <div style="padding: 20px; text-align: center;" class="svelte-w0ekn9"><span style="display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #fb923c; margin-bottom: 6px;" class="svelte-w0ekn9">1CONVITE • O REINO NO SEU BOLSO</span> <h3 style="margin: 0 0 8px; font-size: 1.2rem; font-weight: 800; color: #ffffff;" class="svelte-w0ekn9">Viva a Palavra Todos os Dias</h3> <p style="margin: 0 0 16px; font-size: 0.9rem; color: #d4d4d8; line-height: 1.5;" class="svelte-w0ekn9">Bíblia ACF narrada em áudio, meditações diárias, Treino Templo, Mentores Bíblicos e vales-presente para abençoar quem você ama.</p> <span style="display: inline-block; padding: 12px 24px; border-radius: 999px; background: #10b981; color: #052e16; font-weight: 800; font-size: 0.92rem;" class="svelte-w0ekn9">Conhecer Planos do 1Convite →</span></div></a></section> `);
    if (data.relatedPosts && data.relatedPosts.length > 0) {
      $$renderer2.push("<!--[0-->");
      const hasCollaborative = data.relatedPosts.some((p) => p.isCollaborative);
      $$renderer2.push(`<section class="organic-related svelte-w0ekn9"><h2 class="related-title svelte-w0ekn9">${escape_html(hasCollaborative ? t(lang(), "post.related_title") : t(lang(), "post.continue_reading"))}</h2> <div class="related-feed svelte-w0ekn9"><!--[-->`);
      const each_array_2 = ensure_array_like(data.relatedPosts);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let relatedPost = each_array_2[$$index_2];
        $$renderer2.push(`<a${attr("href", `${stringify(base)}/post/${stringify(relatedPost.slug)}`)} class="related-item svelte-w0ekn9"><div class="related-image-wrapper svelte-w0ekn9">`);
        if (hasNoImage(relatedPost)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="no-image-placeholder svelte-w0ekn9"${attr_style(`background: ${stringify(getPlaceholderBackground(relatedPost))}`)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="placeholder-icon svelte-w0ekn9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="svelte-w0ekn9"></path><polyline points="14 2 14 8 20 8" class="svelte-w0ekn9"></polyline><line x1="16" y1="13" x2="8" y2="13" class="svelte-w0ekn9"></line><line x1="16" y1="17" x2="8" y2="17" class="svelte-w0ekn9"></line><polyline points="10 9 9 9 8 9" class="svelte-w0ekn9"></polyline></svg> <div class="no-image-placeholder-title svelte-w0ekn9">${escape_html(relatedPost.title)}</div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(getPostImage(relatedPost), 400))}${attr("alt", relatedPost.title)} loading="lazy" width="400" height="250"${attr_class("svelte-w0ekn9", void 0, { "blurred": relatedPost.is_18_plus && true })}/>`);
        }
        $$renderer2.push(`<!--]--> <button class="pinterest-save-btn svelte-w0ekn9"${attr("aria-label", t(lang(), "home.save_pinterest"))}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="svelte-w0ekn9"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.605 0 12.017 0z" class="svelte-w0ekn9"></path></svg> Salvar</button></div> <div class="related-content svelte-w0ekn9"><div class="related-meta-row svelte-w0ekn9"><span class="related-category svelte-w0ekn9">${escape_html(relatedPost.categories ? relatedPost.categories.split(",")[0] : "Post")}</span> `);
        if (relatedPost.recommendationReason) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="related-rec-badge svelte-w0ekn9">${escape_html(relatedPost.recommendationReason)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <h3 class="related-post-title svelte-w0ekn9">${escape_html(relatedPost.title)}</h3> <span class="related-post-date svelte-w0ekn9">${escape_html(formatDate$1(relatedPost.created_at))}</span></div></a>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></article></div> <aside class="sidebar svelte-w0ekn9"><div class="widget search-widget svelte-w0ekn9"><form class="search-form svelte-w0ekn9"><input type="text"${attr("value", searchInput)}${attr("placeholder", t(lang(), "home.search_placeholder"))} class="search-input svelte-w0ekn9"/> <button type="submit" class="search-btn svelte-w0ekn9" aria-label="Buscar posts"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><circle cx="11" cy="11" r="8" class="svelte-w0ekn9"></circle><path d="M21 21l-4.35-4.35" class="svelte-w0ekn9"></path></svg></button></form></div> `);
    if (data.sidebarAds && data.sidebarAds.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="widget ad-widget svelte-w0ekn9">`);
      AdRenderer($$renderer2, { ads: data.sidebarAds, placement: "sidebar" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="widget categories-widget svelte-w0ekn9"><h2 class="widget-title svelte-w0ekn9">${escape_html(t(lang(), "common.categories"))}</h2> <ul class="categories-list svelte-w0ekn9"><!--[-->`);
    const each_array_3 = ensure_array_like(data.categories);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let cat = each_array_3[$$index_3];
      $$renderer2.push(`<li class="svelte-w0ekn9"><a${attr("href", `${stringify(base)}/category/${stringify(cat.slug)}`)} class="category-link svelte-w0ekn9"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" class="svelte-w0ekn9"></path></svg> ${escape_html(cat.name)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="widget newsletter-widget svelte-w0ekn9">`);
    NewsletterSignup($$renderer2, {});
    $$renderer2.push(`<!----></div></aside></div> `);
    if (showScrollTop) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="scroll-to-top svelte-w0ekn9"${attr("aria-label", t(lang(), "post.back_to_top"))}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-w0ekn9"><path d="M18 15l-6-6-6 6" class="svelte-w0ekn9"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
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
//# sourceMappingURL=_page.svelte-DYgbmzlO.js.map
