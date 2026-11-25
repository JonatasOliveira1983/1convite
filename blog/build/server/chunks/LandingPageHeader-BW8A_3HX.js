import { I as attr_class, X as attr_style, Q as escape_html, R as ensure_array_like, J as attr, Y as spread_props, O as stringify, Z as attributes, K as derived, _ as element } from './root-bZgTCCHH.js';
import { t } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';

function uid(prefix = "b") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
const baseStyles = () => ({
  marginTop: "0px",
  marginBottom: "12px",
  paddingTop: "0px",
  paddingBottom: "0px",
  textAlign: "left"
});
const LP_SVG = {
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  device: `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>`
};
function L(lang, key, vars) {
  return t(lang, `admin.landing_pages.builder.${key}`, vars);
}
function premiumCopy(lang, pt, en, es) {
  return lang === "en" ? en : lang === "es" ? es : pt;
}
function createBlock(type, lang = "pt") {
  const id = uid(type);
  const styles = baseStyles();
  switch (type) {
    case "section":
      return {
        id,
        type: "section",
        styles: {
          ...styles,
          paddingTop: "48px",
          paddingBottom: "48px",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          textAlign: "left"
        },
        properties: {},
        children: []
      };
    case "container":
      return {
        id,
        type: "container",
        styles: { ...styles, paddingTop: "8px", paddingBottom: "8px" },
        properties: {},
        children: []
      };
    case "columns":
    case "columns-2":
      return createColumns(2, lang);
    case "columns-3":
      return createColumns(3, lang);
    case "text":
      return {
        id,
        type: "text",
        content: `<p>${L(lang, "default_text_para")}</p>`,
        styles: { ...styles, fontSize: "1rem", textColor: "#111827" },
        properties: {}
      };
    case "image":
      return {
        id,
        type: "image",
        styles: { ...styles, borderRadius: "12px" },
        properties: {
          src: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          alt: L(lang, "default_image_alt")
        }
      };
    case "button":
      return {
        id,
        type: "button",
        content: L(lang, "default_button"),
        styles: {
          ...styles,
          backgroundColor: "#111827",
          textColor: "#ffffff",
          paddingTop: "12px",
          paddingBottom: "12px",
          borderRadius: "8px",
          fontSize: "0.875rem",
          textAlign: "center"
        },
        properties: { href: "#", productId: null, productSlug: null }
      };
    case "video":
      return {
        id,
        type: "video",
        styles: { ...styles },
        properties: { src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      };
    case "divider":
      return {
        id,
        type: "divider",
        styles: {
          ...styles,
          paddingTop: "10px",
          paddingBottom: "10px",
          borderColor: "#e5e7eb",
          borderWidth: "1px",
          borderStyle: "solid"
        },
        properties: {}
      };
    case "spacer":
      return {
        id,
        type: "spacer",
        styles: { ...styles, paddingTop: "32px" },
        properties: {}
      };
    case "html":
      return {
        id,
        type: "html",
        content: `<div style="padding:1rem;border:1px dashed #d1d5db;border-radius:8px;"><strong>${L(lang, "default_html")}</strong></div>`,
        styles: { ...styles },
        properties: {}
      };
    case "cta":
      return createCtaBlock(lang);
    case "testimonial":
      return createTestimonialBlock(lang);
    case "pricing":
      return createPricingBlock(false, lang);
    case "faq":
      return createFaqBlock(lang);
    case "hero":
      return createHeroBlock(lang);
    case "product-showcase":
      return createProductShowcaseBlock(lang);
    case "posts-grid":
      return createPostsGridBlock(lang);
    case "trust-bar":
      return createTrustBarBlock(lang);
    default:
      return {
        id,
        type: "text",
        content: `<p>${L(lang, "default_block_type", { type })}</p>`,
        styles: { ...styles },
        properties: {}
      };
  }
}
function createHeroBlock(lang = "pt") {
  return {
    id: uid("hero"),
    type: "hero",
    styles: { paddingTop: "72px", paddingBottom: "72px", backgroundColor: "#0b1220", textColor: "#ffffff", borderRadius: "24px", marginBottom: "24px" },
    properties: {
      eyebrow: premiumCopy(lang, "CONTEÚDO PREMIUM", "PREMIUM CONTENT", "CONTENIDO PREMIUM"),
      title: premiumCopy(lang, "Transforme conhecimento em resultado", "Turn knowledge into results", "Convierte conocimiento en resultados"),
      subtitle: premiumCopy(lang, "Uma experiência direta, visual e criada para converter.", "A focused visual experience built to convert.", "Una experiencia visual creada para convertir."),
      subtitleColor: "#cbd5e1",
      primaryText: premiumCopy(lang, "Quero começar", "Get started", "Quiero empezar"),
      primaryHref: "#oferta",
      secondaryText: premiumCopy(lang, "Ver conteúdo", "Explore content", "Ver contenido"),
      secondaryHref: "#conteudo",
      image: "",
      imageAlt: "",
      badge: premiumCopy(lang, "Novo", "New", "Nuevo")
    }
  };
}
function createProductShowcaseBlock(lang = "pt") {
  return {
    id: uid("product"),
    type: "product-showcase",
    styles: { paddingTop: "32px", paddingBottom: "32px", backgroundColor: "#ffffff", textColor: "#111827", borderRadius: "24px", marginBottom: "24px" },
    properties: {
      productId: null,
      productSlug: null,
      name: premiumCopy(lang, "Selecione um produto", "Select a product", "Selecciona un producto"),
      description: premiumCopy(lang, "Uma oferta clara, visual e conectada diretamente ao seu catálogo.", "A clear visual offer connected directly to your catalog.", "Una oferta visual conectada directamente con tu catálogo."),
      bullets: [
        premiumCopy(lang, "Acesso simples e imediato", "Simple, instant access", "Acceso simple e inmediato"),
        premiumCopy(lang, "Conteúdo prático e atualizado", "Practical, up-to-date content", "Contenido práctico y actualizado"),
        premiumCopy(lang, "Compra segura", "Secure checkout", "Compra segura")
      ],
      price: "",
      image: "",
      imageAlt: "",
      buttonText: premiumCopy(lang, "Ver oferta", "View offer", "Ver oferta"),
      buttonHref: "/products",
      eyebrow: premiumCopy(lang, "Oferta em destaque", "Featured offer", "Oferta destacada")
    }
  };
}
function createPostsGridBlock(lang = "pt") {
  return {
    id: uid("posts"),
    type: "posts-grid",
    styles: { paddingTop: "40px", paddingBottom: "40px", backgroundColor: "#f8fafc", textColor: "#111827", borderRadius: "24px", marginBottom: "24px" },
    properties: {
      title: premiumCopy(lang, "Conteúdos para continuar aprendendo", "Keep learning", "Sigue aprendiendo"),
      subtitle: premiumCopy(lang, "Selecione até seis posts publicados.", "Select up to six published posts.", "Selecciona hasta seis posts publicados."),
      posts: []
    }
  };
}
function createTrustBarBlock(lang = "pt") {
  return {
    id: uid("trust"),
    type: "trust-bar",
    styles: { paddingTop: "20px", paddingBottom: "20px", backgroundColor: "#eff6ff", textColor: "#1e3a8a", borderRadius: "18px", marginBottom: "24px" },
    properties: {
      items: [
        premiumCopy(lang, "Acesso imediato", "Instant access", "Acceso inmediato"),
        premiumCopy(lang, "Pagamento seguro", "Secure payment", "Pago seguro"),
        premiumCopy(lang, "Conteúdo atualizado", "Fresh content", "Contenido actualizado")
      ]
    }
  };
}
function createColumns(count = 2, lang = "pt") {
  const cols = [];
  for (let i = 0; i < count; i++) {
    cols.push({
      id: uid("col"),
      type: "column",
      styles: { paddingTop: "8px", paddingBottom: "8px" },
      properties: {},
      children: [
        {
          id: uid("text"),
          type: "text",
          content: `<p style="color:#6b7280;">${L(lang, "column_placeholder", { n: i + 1 })}</p>`,
          styles: { fontSize: "0.95rem", textColor: "#6b7280", marginBottom: "0px" },
          properties: {}
        }
      ]
    });
  }
  return {
    id: uid("columns"),
    type: "columns",
    styles: {
      marginTop: "0px",
      marginBottom: "16px",
      paddingTop: "0px",
      paddingBottom: "0px"
    },
    properties: { cols: count, gap: "1.5rem" },
    children: cols
  };
}
function createCtaBlock(lang = "pt") {
  return {
    id: uid("cta"),
    type: "cta",
    content: L(lang, "cta_title"),
    styles: {
      paddingTop: "48px",
      paddingBottom: "48px",
      backgroundColor: "#111827",
      textColor: "#ffffff",
      textAlign: "center",
      borderRadius: "16px",
      marginBottom: "16px"
    },
    properties: {
      subtitle: L(lang, "cta_subtitle"),
      buttonText: L(lang, "cta_button"),
      buttonHref: "#",
      buttonBg: "#22c55e",
      buttonColor: "#052e16",
      productId: null,
      productSlug: null
    }
  };
}
function createTestimonialBlock(lang = "pt") {
  return {
    id: uid("testimonial"),
    type: "testimonial",
    styles: {
      paddingTop: "24px",
      paddingBottom: "24px",
      backgroundColor: "#f9fafb",
      textColor: "#111827",
      textAlign: "left",
      borderRadius: "16px",
      marginBottom: "16px"
    },
    properties: {
      quote: L(lang, "testimonial_quote"),
      author: L(lang, "testimonial_author"),
      role: L(lang, "testimonial_role"),
      avatar: "",
      rating: 5
    }
  };
}
function createPricingBlock(featured = false, lang = "pt") {
  return {
    id: uid("pricing"),
    type: "pricing",
    styles: {
      paddingTop: "24px",
      paddingBottom: "24px",
      backgroundColor: featured ? "#111827" : "#ffffff",
      textColor: featured ? "#ffffff" : "#111827",
      borderRadius: "16px",
      marginBottom: "16px",
      textAlign: "center"
    },
    properties: {
      name: featured ? L(lang, "plan_pro") : L(lang, "plan_essential"),
      price: featured ? L(lang, "plan_pro_price") : L(lang, "plan_essential_price"),
      period: L(lang, "plan_period"),
      features: featured ? [L(lang, "plan_pro_f1"), L(lang, "plan_pro_f2"), L(lang, "plan_pro_f3"), L(lang, "plan_pro_f4")] : [L(lang, "plan_ess_f1"), L(lang, "plan_ess_f2"), L(lang, "plan_ess_f3")],
      buttonText: L(lang, "plan_subscribe"),
      buttonHref: "#",
      featured,
      productId: null,
      productSlug: null
    }
  };
}
function createFaqBlock(lang = "pt") {
  return {
    id: uid("faq"),
    type: "faq",
    styles: {
      paddingTop: "16px",
      paddingBottom: "16px",
      marginBottom: "16px",
      textAlign: "left"
    },
    properties: {
      title: L(lang, "faq_title"),
      items: [
        { q: L(lang, "faq_q1"), a: L(lang, "faq_a1") },
        { q: L(lang, "faq_q2"), a: L(lang, "faq_a2") },
        { q: L(lang, "faq_q3"), a: L(lang, "faq_a3") }
      ]
    }
  };
}
function getDefaultLandingBlocks(lang = "pt") {
  const card = (svg, title, body) => `<div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-radius: 12px; display: inline-block; width: 100%; max-width: 280px; margin: 10px; text-align: left; box-shadow: 0 1px 3px rgba(0,0,0,0.02); box-sizing: border-box; vertical-align: top;"><span style="display: block; margin-bottom: 1rem;">${svg}</span><h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">${title}</h3><p style="font-size: 0.875rem; color: #6b7280; line-height: 1.5; margin: 0;">${body}</p></div>`;
  return [
    {
      id: "sec-hero",
      type: "section",
      styles: {
        paddingTop: "80px",
        paddingBottom: "80px",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        textAlign: "left"
      },
      properties: {},
      children: [
        {
          id: "hero-grid",
          type: "container",
          styles: {
            marginTop: "0px",
            marginBottom: "0px",
            paddingTop: "0px",
            paddingBottom: "0px"
          },
          properties: {},
          children: [
            {
              id: "hero-title",
              type: "text",
              content: `<h1 style="font-size: 3.25rem; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1.5rem;">${L(lang, "starter_hero_title")}</h1>`,
              styles: { fontSize: "3rem", marginBottom: "24px", textColor: "#111827" },
              properties: {}
            },
            {
              id: "hero-desc",
              type: "text",
              content: `<p style="font-size: 1.125rem; color: #4b5563; line-height: 1.6; margin-bottom: 2rem; max-width: 550px;">${L(lang, "starter_hero_desc")}</p>`,
              styles: { fontSize: "1.125rem", marginBottom: "32px", textColor: "#4b5563" },
              properties: {}
            },
            {
              id: "hero-buttons-container",
              type: "container",
              styles: {
                marginTop: "0px",
                marginBottom: "0px",
                paddingTop: "0px",
                paddingBottom: "0px"
              },
              properties: {},
              children: [
                {
                  id: "hero-btn-1",
                  type: "button",
                  content: L(lang, "starter_btn_primary"),
                  styles: {
                    backgroundColor: "#111827",
                    textColor: "#ffffff",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "8px",
                    fontSize: "0.875rem"
                  },
                  properties: { href: "#" }
                },
                {
                  id: "hero-btn-2",
                  type: "button",
                  content: L(lang, "starter_btn_secondary"),
                  styles: {
                    backgroundColor: "#ffffff",
                    textColor: "#111827",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#e5e7eb",
                    marginLeft: "12px"
                  },
                  properties: { href: "#" }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "sec-features",
      type: "section",
      styles: {
        paddingTop: "60px",
        paddingBottom: "60px",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        textAlign: "center"
      },
      properties: {},
      children: [
        {
          id: "feat-title",
          type: "text",
          content: `<h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${L(lang, "starter_feat_title")}</h2>`,
          styles: { fontSize: "2rem", marginBottom: "8px", textColor: "#111827", textAlign: "center" },
          properties: {}
        },
        {
          id: "feat-desc",
          type: "text",
          content: `<p style="color: #6b7280; margin-bottom: 3rem;">${L(lang, "starter_feat_desc")}</p>`,
          styles: { fontSize: "1rem", marginBottom: "40px", textColor: "#6b7280", textAlign: "center" },
          properties: {}
        },
        {
          id: "feat-cards-container",
          type: "container",
          styles: {
            marginTop: "0px",
            marginBottom: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
            textAlign: "center"
          },
          properties: {},
          children: [
            {
              id: "feat-card-1",
              type: "text",
              content: card(LP_SVG.edit, L(lang, "starter_card1_title"), L(lang, "starter_card1_body")) + card(LP_SVG.device, L(lang, "starter_card2_title"), L(lang, "starter_card2_body")) + card(LP_SVG.chart, L(lang, "starter_card3_title"), L(lang, "starter_card3_body")),
              styles: { fontSize: "1rem", textColor: "#111827", textAlign: "center" },
              properties: {}
            }
          ]
        }
      ]
    }
  ];
}
function youtubeId(url) {
  if (!url) return null;
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/v\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}
function LpEditableShell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      tag = "div",
      blockId,
      blockType,
      editable = false,
      selected = false,
      lang = "pt",
      dropTargetId = null,
      dropPosition = null,
      className = "",
      style = void 0,
      onSelect = void 0,
      onDrop = void 0,
      onDragOverTarget = void 0,
      onBlockDragStart = void 0,
      onDragEnd = void 0,
      onMoveBlock = void 0,
      onDuplicateBlock = void 0,
      onDeleteBlock = void 0,
      children
    } = $$props;
    const dropClass = derived(() => editable && dropTargetId === blockId && dropPosition ? `lp-drop-${dropPosition}` : "");
    const blockLabel = derived(() => ({
      section: t(lang, "admin.landing_pages.builder.block_section"),
      container: t(lang, "admin.landing_pages.builder.block_container"),
      columns: t(lang, "admin.landing_pages.builder.type_columns"),
      column: t(lang, "admin.landing_pages.builder.type_column"),
      text: t(lang, "admin.landing_pages.builder.block_text"),
      image: t(lang, "admin.landing_pages.builder.block_image"),
      button: t(lang, "admin.landing_pages.builder.block_button"),
      video: t(lang, "admin.landing_pages.builder.block_video"),
      divider: t(lang, "admin.landing_pages.builder.block_divider"),
      spacer: t(lang, "admin.landing_pages.builder.type_spacer"),
      html: "HTML",
      cta: "CTA",
      testimonial: t(lang, "admin.landing_pages.builder.block_testimonial"),
      pricing: t(lang, "admin.landing_pages.builder.block_pricing"),
      faq: "FAQ",
      hero: "Hero premium",
      "product-showcase": "Produto em destaque",
      "posts-grid": "Grade de posts",
      "trust-bar": "Barra de confiança"
    })[blockType] || blockType);
    const dragTitle = derived(() => t(lang, "admin.landing_pages.builder.drag_to_reorder"));
    element(
      $$renderer2,
      tag,
      () => {
        $$renderer2.push(`${attr_class(`lp-shell ${stringify(className)} ${dropClass()}`, "svelte-mau39q", { "lp-selected": editable && selected, "lp-editable": editable })}${attr_style(style)}${attr("role", editable ? "group" : void 0)}${attr("data-block-id", blockId)}${attr("data-block-type", blockType)}`);
      },
      () => {
        if (editable) {
          $$renderer2.push("<!--[0-->");
          if (selected) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="lp-block-toolbar svelte-mau39q" role="toolbar" tabindex="-1" aria-label="Ações do bloco"><button type="button" class="lp-toolbar-drag svelte-mau39q" draggable="true"${attr("title", `${stringify(dragTitle())}: ${stringify(blockLabel())}`)}${attr("aria-label", dragTitle())}><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="margin-right: 3px; display: inline-block; vertical-align: middle;"><circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle><circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle><circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg> <span class="lp-toolbar-label svelte-mau39q">${escape_html(blockLabel())}</span></button> `);
            if (onMoveBlock) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<button type="button" class="lp-tb-btn svelte-mau39q"${attr("title", t(lang, "admin.landing_pages.builder.move_up"))}>▲</button> <button type="button" class="lp-tb-btn svelte-mau39q"${attr("title", t(lang, "admin.landing_pages.builder.move_down"))}>▼</button>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--> `);
            if (onDuplicateBlock) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<button type="button" class="lp-tb-btn duplicate-btn svelte-mau39q"${attr("title", t(lang, "admin.landing_pages.builder.duplicate") || "Duplicar")}>❐</button>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--> `);
            if (onDeleteBlock) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<button type="button" class="lp-tb-btn delete-btn svelte-mau39q"${attr("title", t(lang, "admin.landing_pages.builder.delete"))}>✕</button>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <span class="lp-drop-indicator svelte-mau39q" aria-hidden="true"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      }
    );
  });
}
function LandingBlockTree($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      blocks = [],
      containerWidth = "1200px",
      editable = false,
      lang = "pt",
      selectedId = null,
      dropTargetId = null,
      dropPosition = null,
      onSelect = void 0,
      onDrop = void 0,
      onDragOverTarget = void 0,
      onBlockDragStart = void 0,
      onDragEnd = void 0,
      onMoveBlock = void 0,
      onDuplicateBlock = void 0,
      onDeleteBlock = void 0
    } = $$props;
    function stars(n) {
      const c = Math.max(0, Math.min(5, Number(n) || 0));
      return "★".repeat(c) + "☆".repeat(5 - c);
    }
    const lb = (key) => t(lang, `admin.landing_pages.builder.${key}`);
    const treeProps = derived(() => ({
      containerWidth,
      editable,
      lang,
      selectedId,
      dropTargetId,
      dropPosition,
      onSelect,
      onDrop,
      onDragOverTarget,
      onBlockDragStart,
      onDragEnd,
      onMoveBlock,
      onDuplicateBlock,
      onDeleteBlock
    }));
    const shellHandlers = derived(() => ({
      editable,
      lang,
      dropTargetId,
      dropPosition,
      onSelect,
      onDrop,
      onDragOverTarget,
      onBlockDragStart,
      onDragEnd,
      onMoveBlock,
      onDuplicateBlock,
      onDeleteBlock
    }));
    function replaceEmojisWithSvgs(content) {
      if (!content) return "";
      let processed = content.replace(/width:\s*260px;\s*margin:\s*0\s+10px;/g, "width: 100%; max-width: 280px; margin: 15px 10px; box-sizing: border-box; vertical-align: top;");
      processed = processed.replace(/<svg[^>]*viewBox="0 0 20 20"[^>]*>.*?M13\.586\s+3\.586a2\s+2.*?<\/svg>/gs, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`);
      processed = processed.replace(/<svg[^>]*viewBox="0 0 20 20"[^>]*>.*?M3\s+5a2\s+2\s+0\s+012-2h10a2.*?<\/svg>/gs, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`);
      processed = processed.replace(/<svg[^>]*viewBox="0 0 20 20"[^>]*>.*?M2\s+10a8\s+8\s+0\s+1116.*?<\/svg>/gs, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>`);
      processed = processed.replace(/<span[^>]*>\s*(?:🖌️|✏️|🎨)\s*<\/span>/g, `<span style="display: block; margin-bottom: 1rem;"><svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span>`);
      processed = processed.replace(/<span[^>]*>\s*(?:📱)\s*<\/span>/g, `<span style="display: block; margin-bottom: 1rem;"><svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></span>`);
      processed = processed.replace(/<span[^>]*>\s*(?:📈)\s*<\/span>/g, `<span style="display: block; margin-bottom: 1rem;"><svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle;"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg></span>`);
      processed = processed.replace(/🖌️|✏️|🎨/g, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`);
      processed = processed.replace(/📱/g, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle; margin-right: 4px;"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`);
      processed = processed.replace(/📈/g, `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>`);
      return processed;
    }
    function emptyDropHandlers(parentId) {
      return {
        ondragover: (e) => {
          if (!editable) return;
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
          onDragOverTarget?.(parentId, "inside", e);
        },
        ondrop: (e) => {
          if (!editable || !onDrop) return;
          e.preventDefault();
          e.stopPropagation();
          onDrop(parentId, "inside", e);
        }
      };
    }
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(blocks);
    for (let $$index_6 = 0, $$length = each_array.length; $$index_6 < $$length; $$index_6++) {
      let block = each_array[$$index_6];
      if (block.type === "section") {
        $$renderer2.push("<!--[0-->");
        LpEditableShell($$renderer2, spread_props([
          {
            tag: "section",
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-section",
            style: `padding-top:${stringify(block.styles?.paddingTop || "40px")};padding-bottom:${stringify(block.styles?.paddingBottom || "40px")};margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "0px")};background-color:${stringify(block.styles?.backgroundColor || "transparent")};color:${stringify(block.styles?.textColor || "inherit")};text-align:${stringify(block.styles?.textAlign || "left")};border-radius:${stringify(block.styles?.borderRadius || "0px")};width:100%;`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="lp-container svelte-1jvblr0"${attr_style("", { "max-width": containerWidth })}>`);
              if (block.children?.length) {
                $$renderer3.push("<!--[0-->");
                LandingBlockTree($$renderer3, spread_props([{ blocks: block.children }, treeProps()]));
                $$renderer3.push(`<!---->`);
              } else if (editable) {
                $$renderer3.push("<!--[1-->");
                $$renderer3.push(`<div${attributes({ class: "lp-empty-drop", ...emptyDropHandlers(block.id) }, "svelte-1jvblr0")}></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "container" || block.type === "column") {
        $$renderer2.push("<!--[1-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-container-block",
            style: `padding-top:${stringify(block.styles?.paddingTop || "0px")};padding-bottom:${stringify(block.styles?.paddingBottom || "0px")};margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "0px")};text-align:${stringify(block.styles?.textAlign || "inherit")};background:${stringify(block.styles?.backgroundColor || "transparent")};color:${stringify(block.styles?.textColor || "inherit")};border-radius:${stringify(block.styles?.borderRadius || "0px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              if (block.children?.length) {
                $$renderer3.push("<!--[0-->");
                LandingBlockTree($$renderer3, spread_props([{ blocks: block.children }, treeProps()]));
                $$renderer3.push(`<!---->`);
              } else if (editable) {
                $$renderer3.push("<!--[1-->");
                $$renderer3.push(`<div${attributes({ class: "lp-empty-drop", ...emptyDropHandlers(block.id) }, "svelte-1jvblr0")}></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "columns") {
        $$renderer2.push("<!--[2-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-columns",
            style: `--lp-cols:${String(block.properties?.cols || block.children?.length || 2)};--lp-gap:${stringify(block.properties?.gap || "1.5rem")};margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "16px")};padding-top:${stringify(block.styles?.paddingTop || "0px")};padding-bottom:${stringify(block.styles?.paddingBottom || "0px")};background:${stringify(block.styles?.backgroundColor || "transparent")};color:${stringify(block.styles?.textColor || "inherit")};border-radius:${stringify(block.styles?.borderRadius || "0px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              if (block.children?.length) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(block.children);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let col = each_array_1[$$index];
                  LpEditableShell($$renderer3, spread_props([
                    {
                      blockId: col.id,
                      blockType: col.type || "column",
                      selected: selectedId === col.id,
                      className: "lp-col"
                    },
                    shellHandlers(),
                    {
                      children: ($$renderer4) => {
                        if (col.children?.length) {
                          $$renderer4.push("<!--[0-->");
                          LandingBlockTree($$renderer4, spread_props([{ blocks: col.children }, treeProps()]));
                          $$renderer4.push(`<!---->`);
                        } else if (editable) {
                          $$renderer4.push("<!--[1-->");
                          $$renderer4.push(`<div${attributes({ class: "lp-empty-drop", ...emptyDropHandlers(col.id) }, "svelte-1jvblr0")}></div>`);
                        } else {
                          $$renderer4.push("<!--[-1-->");
                        }
                        $$renderer4.push(`<!--]-->`);
                      },
                      $$slots: { default: true }
                    }
                  ]));
                }
                $$renderer3.push(`<!--]-->`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "hero") {
        $$renderer2.push("<!--[3-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: `lp-premium-hero ${block.properties?.image ? "has-media" : "no-media"}`,
            style: `padding-top:${stringify(block.styles?.paddingTop || "72px")};padding-bottom:${stringify(block.styles?.paddingBottom || "72px")};background:${stringify(block.styles?.backgroundColor || "#0b1220")};color:${stringify(block.styles?.textColor || "#fff")};border-radius:${stringify(block.styles?.borderRadius || "24px")};margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "24px")};text-align:${stringify(block.styles?.textAlign || "left")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="lp-hero-copy svelte-1jvblr0">`);
              if (block.properties?.eyebrow) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span class="lp-eyebrow svelte-1jvblr0">${escape_html(block.properties.eyebrow)}</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <h1 class="svelte-1jvblr0"${attr_style("", { color: block.styles?.textColor || "#ffffff" })}>${escape_html(block.properties?.title || "Landing page premium")}</h1> <p class="svelte-1jvblr0"${attr_style("", { color: block.properties?.subtitleColor || "#cbd5e1" })}>${escape_html(block.properties?.subtitle || "")}</p> <div class="lp-hero-actions svelte-1jvblr0"><a class="lp-btn lp-btn-primary svelte-1jvblr0"${attr("href", block.properties?.primaryHref || "#")}>${escape_html(block.properties?.primaryText || "Começar")}</a> `);
              if (block.properties?.secondaryText) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<a class="lp-btn lp-btn-secondary svelte-1jvblr0"${attr("href", block.properties?.secondaryHref || "#")}>${escape_html(block.properties.secondaryText)}</a>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></div> `);
              if (block.properties?.image) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="lp-hero-media svelte-1jvblr0"><img${attr("src", block.properties.image)}${attr("alt", block.properties?.imageAlt || "")} draggable="false" class="svelte-1jvblr0"/></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "product-showcase") {
        $$renderer2.push("<!--[4-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: `lp-product-showcase ${block.properties?.image ? "has-product-image" : "no-product-image"}`,
            style: `padding-top:${stringify(block.styles?.paddingTop || "32px")};padding-bottom:${stringify(block.styles?.paddingBottom || "32px")};background:${stringify(block.styles?.backgroundColor || "#fff")};color:${stringify(block.styles?.textColor || "#111827")};border-radius:${stringify(block.styles?.borderRadius || "24px")};margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "24px")};text-align:${stringify(block.styles?.textAlign || "left")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="lp-product-media svelte-1jvblr0">`);
              if (block.properties?.image) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<img${attr("src", block.properties.image)}${attr("alt", block.properties?.imageAlt || block.properties?.name || "")} draggable="false" class="svelte-1jvblr0"/>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="lp-media-placeholder svelte-1jvblr0"><span class="svelte-1jvblr0">OFERTA DIGITAL</span><strong class="svelte-1jvblr0">Seu produto<br class="svelte-1jvblr0"/>em destaque</strong><i class="svelte-1jvblr0">Imagem 1200 × 900</i></div>`);
              }
              $$renderer3.push(`<!--]--></div> <div class="lp-product-copy svelte-1jvblr0"><span class="lp-eyebrow svelte-1jvblr0">${escape_html(block.properties?.eyebrow || "Oferta em destaque")}</span> <h2 class="svelte-1jvblr0"${attr_style("", { color: block.styles?.textColor || "#111827" })}>${escape_html(block.properties?.name || "Selecione um produto")}</h2> <p class="svelte-1jvblr0">${escape_html(block.properties?.description || "")}</p> `);
              if (block.properties?.bullets?.length) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<ul class="lp-product-bullets svelte-1jvblr0"><!--[-->`);
                const each_array_2 = ensure_array_like(block.properties.bullets);
                for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                  let bullet = each_array_2[$$index_1];
                  $$renderer3.push(`<li class="svelte-1jvblr0"><span class="svelte-1jvblr0">✓</span>${escape_html(bullet)}</li>`);
                }
                $$renderer3.push(`<!--]--></ul>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> `);
              if (block.properties?.price) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="lp-product-price svelte-1jvblr0">${escape_html(block.properties.price)}</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <a class="lp-btn lp-btn-dark svelte-1jvblr0"${attr("href", block.properties?.buttonHref || "/products")}>${escape_html(block.properties?.buttonText || "Ver oferta")}</a></div>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "posts-grid") {
        $$renderer2.push("<!--[5-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-posts-section",
            style: `padding-top:${stringify(block.styles?.paddingTop || "40px")};padding-bottom:${stringify(block.styles?.paddingBottom || "40px")};background:${stringify(block.styles?.backgroundColor || "#f8fafc")};color:${stringify(block.styles?.textColor || "#111827")};border-radius:${stringify(block.styles?.borderRadius || "24px")};margin-bottom:${stringify(block.styles?.marginBottom || "24px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="lp-section-heading svelte-1jvblr0"><h2 class="svelte-1jvblr0">${escape_html(block.properties?.title || "Conteúdos recomendados")}</h2><p class="svelte-1jvblr0">${escape_html(block.properties?.subtitle || "")}</p></div> <div class="lp-posts-grid svelte-1jvblr0"><!--[-->`);
              const each_array_3 = ensure_array_like(block.properties?.posts || []);
              for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                let post = each_array_3[$$index_2];
                $$renderer3.push(`<a class="lp-post-card svelte-1jvblr0"${attr("href", post.href || `/post/${post.slug}`)}>`);
                if (post.cover_image) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", post.cover_image)} alt="" loading="lazy" draggable="false" class="svelte-1jvblr0"/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<div class="lp-post-placeholder svelte-1jvblr0">POST</div>`);
                }
                $$renderer3.push(`<!--]--> <div class="svelte-1jvblr0"><h3 class="svelte-1jvblr0">${escape_html(post.title)}</h3>`);
                if (post.excerpt) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<p class="svelte-1jvblr0">${escape_html(post.excerpt)}</p>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--><span class="svelte-1jvblr0">Ler artigo →</span></div></a>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (!block.properties?.posts?.length) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="lp-empty-content svelte-1jvblr0">Selecione posts no painel do bloco.</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "trust-bar") {
        $$renderer2.push("<!--[6-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-trust-bar",
            style: `padding-top:${stringify(block.styles?.paddingTop || "20px")};padding-bottom:${stringify(block.styles?.paddingBottom || "20px")};background:${stringify(block.styles?.backgroundColor || "#eff6ff")};color:${stringify(block.styles?.textColor || "#1e3a8a")};border-radius:${stringify(block.styles?.borderRadius || "18px")};margin-bottom:${stringify(block.styles?.marginBottom || "24px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              const each_array_4 = ensure_array_like(block.properties?.items || []);
              for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
                let item = each_array_4[$$index_3];
                $$renderer3.push(`<div class="svelte-1jvblr0"><span class="svelte-1jvblr0">✓</span>${escape_html(item)}</div>`);
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "cta") {
        $$renderer2.push("<!--[7-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-cta",
            style: `padding-top:${stringify(block.styles?.paddingTop || "48px")};padding-bottom:${stringify(block.styles?.paddingBottom || "48px")};background-color:${stringify(block.styles?.backgroundColor || "#111827")};color:${stringify(block.styles?.textColor || "#ffffff")};text-align:${stringify(block.styles?.textAlign || "center")};border-radius:${stringify(block.styles?.borderRadius || "16px")};margin-bottom:${stringify(block.styles?.marginBottom || "16px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<h2 class="lp-cta-title svelte-1jvblr0">${escape_html(block.content || lb("fallback_cta"))}</h2> `);
              if (block.properties?.subtitle) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<p class="lp-cta-sub svelte-1jvblr0">${escape_html(block.properties.subtitle)}</p>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <a class="lp-btn svelte-1jvblr0"${attr("href", block.properties?.buttonHref || "#")}${attr("target", block.properties?.buttonHref?.startsWith("http") ? "_blank" : void 0)}${attr("rel", block.properties?.buttonHref?.startsWith("http") ? "noopener noreferrer" : void 0)} draggable="false"${attr_style("", {
                "background-color": block.properties?.buttonBg || "#22c55e",
                color: block.properties?.buttonColor || "#052e16"
              })}>${escape_html(block.properties?.buttonText || lb("fallback_start"))}</a>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "testimonial") {
        $$renderer2.push("<!--[8-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-testimonial",
            style: `padding-top:${stringify(block.styles?.paddingTop || "24px")};padding-bottom:${stringify(block.styles?.paddingBottom || "24px")};background-color:${stringify(block.styles?.backgroundColor || "#f9fafb")};color:${stringify(block.styles?.textColor || "#111827")};border-radius:${stringify(block.styles?.borderRadius || "16px")};margin-bottom:${stringify(block.styles?.marginBottom || "16px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              $$renderer3.push(`<div class="lp-stars svelte-1jvblr0"${attr("aria-label", `${stringify(block.properties?.rating || 5)} stars`)}>${escape_html(stars(block.properties?.rating ?? 5))}</div> <blockquote class="lp-quote svelte-1jvblr0">“${escape_html(block.properties?.quote || "")}”</blockquote> <div class="lp-author-row svelte-1jvblr0">`);
              if (block.properties?.avatar) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<img class="lp-avatar svelte-1jvblr0"${attr("src", block.properties.avatar)} alt="" draggable="false"/>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="lp-avatar placeholder svelte-1jvblr0">${escape_html((block.properties?.author || "A").slice(0, 1).toUpperCase())}</div>`);
              }
              $$renderer3.push(`<!--]--> <div class="svelte-1jvblr0"><div class="lp-author svelte-1jvblr0">${escape_html(block.properties?.author || lb("fallback_customer"))}</div> `);
              if (block.properties?.role) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="lp-role svelte-1jvblr0">${escape_html(block.properties.role)}</div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div></div>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "pricing") {
        $$renderer2.push("<!--[9-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: `lp-pricing ${block.properties?.featured ? "featured" : ""}`,
            style: `padding-top:${stringify(block.styles?.paddingTop || "28px")};padding-bottom:${stringify(block.styles?.paddingBottom || "28px")};background-color:${stringify(block.styles?.backgroundColor || "#ffffff")};color:${stringify(block.styles?.textColor || "#111827")};border-radius:${stringify(block.styles?.borderRadius || "16px")};margin-bottom:${stringify(block.styles?.marginBottom || "16px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              if (block.properties?.featured) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span class="lp-badge svelte-1jvblr0">${escape_html(lb("fallback_popular"))}</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <div class="lp-plan-name svelte-1jvblr0">${escape_html(block.properties?.name || lb("fallback_plan"))}</div> <div class="lp-price svelte-1jvblr0"><span class="lp-price-value svelte-1jvblr0">${escape_html(block.properties?.price || "R$ 0")}</span> <span class="lp-price-period svelte-1jvblr0">${escape_html(block.properties?.period || "")}</span></div> <ul class="lp-features svelte-1jvblr0"><!--[-->`);
              const each_array_5 = ensure_array_like(block.properties?.features || []);
              for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
                let feat = each_array_5[$$index_4];
                $$renderer3.push(`<li class="svelte-1jvblr0">✓ ${escape_html(feat)}</li>`);
              }
              $$renderer3.push(`<!--]--></ul> <a class="lp-btn svelte-1jvblr0"${attr("href", block.properties?.buttonHref || "#")} draggable="false"${attr_style("", {
                "background-color": block.properties?.featured ? "#22c55e" : "#111827",
                color: block.properties?.featured ? "#052e16" : "#ffffff"
              })}>${escape_html(block.properties?.buttonText || lb("fallback_subscribe"))}</a>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else if (block.type === "faq") {
        $$renderer2.push("<!--[10-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-faq",
            style: `padding-top:${stringify(block.styles?.paddingTop || "16px")};padding-bottom:${stringify(block.styles?.paddingBottom || "16px")};margin-bottom:${stringify(block.styles?.marginBottom || "16px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              if (block.properties?.title) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<h2 class="lp-faq-title svelte-1jvblr0">${escape_html(block.properties.title)}</h2>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--> <div class="lp-faq-list svelte-1jvblr0"><!--[-->`);
              const each_array_6 = ensure_array_like(block.properties?.items || []);
              for (let i = 0, $$length2 = each_array_6.length; i < $$length2; i++) {
                let item = each_array_6[i];
                $$renderer3.push(`<details class="lp-faq-item svelte-1jvblr0"${attr("open", i === 0 && !editable, true)}><summary class="svelte-1jvblr0">${escape_html(item.q)}</summary> <p class="svelte-1jvblr0">${escape_html(item.a)}</p></details>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            },
            $$slots: { default: true }
          }
        ]));
      } else {
        $$renderer2.push("<!--[-1-->");
        LpEditableShell($$renderer2, spread_props([
          {
            blockId: block.id,
            blockType: block.type,
            selected: selectedId === block.id,
            className: "lp-element",
            style: `margin-top:${stringify(block.styles?.marginTop || "0px")};margin-bottom:${stringify(block.styles?.marginBottom || "12px")};padding-top:${stringify(block.styles?.paddingTop || "0px")};padding-bottom:${stringify(block.styles?.paddingBottom || "0px")};text-align:${stringify(block.styles?.textAlign || "inherit")};background:${stringify(block.styles?.backgroundColor || "transparent")};color:${stringify(block.styles?.textColor || "inherit")};border-radius:${stringify(block.styles?.borderRadius || "0px")};`
          },
          shellHandlers(),
          {
            children: ($$renderer3) => {
              if (block.type === "text" || block.type === "html") {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="lp-text svelte-1jvblr0"${attr_style("", {
                  "font-size": block.styles?.fontSize || "1rem",
                  color: block.styles?.textColor || "inherit"
                })}>${html(replaceEmojisWithSvgs(block.content))}</div>`);
              } else if (block.type === "image") {
                $$renderer3.push("<!--[1-->");
                if (block.properties?.src) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<img${attr("src", block.properties.src)}${attr("alt", block.properties.alt || "")} loading="lazy" draggable="false" class="svelte-1jvblr0"${attr_style("", {
                    "max-width": "100%",
                    height: "auto",
                    "border-radius": block.styles?.borderRadius || "0px",
                    display: "inline-block"
                  })}/>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]-->`);
              } else if (block.type === "button") {
                $$renderer3.push("<!--[2-->");
                $$renderer3.push(`<a${attr("href", block.properties?.href || "#")} class="lp-btn svelte-1jvblr0"${attr("target", block.properties?.href?.startsWith("http") ? "_blank" : void 0)}${attr("rel", block.properties?.href?.startsWith("http") ? "noopener noreferrer" : void 0)} draggable="false"${attr_style("", {
                  "background-color": block.styles?.backgroundColor || "#111827",
                  color: block.styles?.textColor || "#ffffff",
                  "padding-top": block.styles?.paddingTop || "12px",
                  "padding-bottom": block.styles?.paddingBottom || "12px",
                  "border-radius": block.styles?.borderRadius || "8px",
                  "font-size": block.styles?.fontSize || "0.875rem",
                  "margin-left": block.styles?.marginLeft || "0",
                  "border-width": block.styles?.borderWidth || "0",
                  "border-style": block.styles?.borderStyle || "none",
                  "border-color": block.styles?.borderColor || "transparent"
                })}>${escape_html(block.content || lb("fallback_button"))}</a>`);
              } else if (block.type === "video") {
                $$renderer3.push("<!--[3-->");
                const vid = youtubeId(block.properties?.src);
                if (vid) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="lp-video-card svelte-1jvblr0"><div class="video-header svelte-1jvblr0"><span class="video-pulse-container svelte-1jvblr0"><span class="pulse-dot svelte-1jvblr0"></span> <span class="pulse-label svelte-1jvblr0">Vídeo</span></span></div> <div class="video-wrapper svelte-1jvblr0"><iframe title="YouTube video"${attr("src", `https://www.youtube.com/embed/${stringify(vid)}`)} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""${attr_class("svelte-1jvblr0", void 0, { "lp-iframe-editable": editable })}></iframe></div></div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]-->`);
              } else if (block.type === "divider") {
                $$renderer3.push("<!--[4-->");
                $$renderer3.push(`<hr class="lp-divider svelte-1jvblr0"${attr_style("", {
                  "border-top-width": block.styles?.borderWidth || "1px",
                  "border-top-style": block.styles?.borderStyle || "solid",
                  "border-top-color": block.styles?.borderColor || "#e5e7eb"
                })}/>`);
              } else if (block.type === "spacer") {
                $$renderer3.push("<!--[5-->");
                $$renderer3.push(`<div aria-hidden="true" class="svelte-1jvblr0"${attr_style("", { height: block.styles?.paddingTop || "24px" })}></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]-->`);
            },
            $$slots: { default: true }
          }
        ]));
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function LandingPageHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      logo = "",
      links = [],
      ctaText = "",
      ctaHref = "#",
      showCta = true,
      maxWidth = "1200px",
      sticky = false
    } = $$props;
    const visibleLinks = derived(() => (links || []).filter((l) => (l?.label || "").trim()));
    $$renderer2.push(`<header${attr_class("lp-page-header svelte-wenumx", void 0, { "sticky": sticky })}><div class="lp-page-header-inner svelte-wenumx"${attr_style("", { "max-width": maxWidth })}>`);
    if (logo) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="lp-logo svelte-wenumx"><span class="lp-logo-dot svelte-wenumx" aria-hidden="true">●</span> <span class="lp-logo-text svelte-wenumx">${escape_html(logo)}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="lp-logo placeholder svelte-wenumx"></div>`);
    }
    $$renderer2.push(`<!--]--> <nav class="lp-nav svelte-wenumx" aria-label="Landing navigation"><!--[-->`);
    const each_array = ensure_array_like(visibleLinks());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr("href", link.href || "#")} class="lp-nav-link svelte-wenumx">${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (showCta && ctaText) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", ctaHref || "#")} class="lp-nav-cta svelte-wenumx">${escape_html(ctaText)}</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></nav></div></header>`);
  });
}

export { LandingPageHeader as L, LandingBlockTree as a, createBlock as c, getDefaultLandingBlocks as g, uid as u };
//# sourceMappingURL=LandingPageHeader-BW8A_3HX.js.map
