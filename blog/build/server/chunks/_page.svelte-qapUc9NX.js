import { G as head, Q as escape_html, X as attr_style, K as derived, L as store_get, J as attr, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { L as LandingPageHeader, a as LandingBlockTree } from './LandingPageHeader-BW8A_3HX.js';
import './state.svelte-BCGVlO8d.js';
import './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const blocks = derived(() => {
      try {
        return data.landingPage.content ? JSON.parse(data.landingPage.content) : [];
      } catch {
        return [];
      }
    });
    const settings = derived(() => {
      try {
        return data.landingPage.settings ? JSON.parse(data.landingPage.settings) : {};
      } catch {
        return {};
      }
    });
    const seoTitle = derived(() => settings().seoTitle || data.landingPage.title);
    const seoDesc = derived(() => settings().seoDesc || data.landingPage.title);
    const socialImage = derived(() => settings().socialImage || "");
    const containerWidth = derived(() => settings().containerWidth || "1200px");
    const backgroundColor = derived(() => settings().backgroundColor || "#ffffff");
    const textColor = derived(() => settings().textColor || "#111827");
    const isDraft = derived(() => data.landingPage.status === "draft");
    const showHeader = derived(() => settings().showHeader === true || settings().showHeader === 1);
    const headerLogo = derived(() => settings().headerLogo || "");
    const headerLinks = derived(() => Array.isArray(settings().headerLinks) ? settings().headerLinks : []);
    const headerCtaEnabled = derived(() => settings().headerCtaEnabled !== false && settings().headerCtaEnabled !== 0);
    const headerCtaText = derived(() => settings().headerCtaText || "");
    const headerCtaHref = derived(() => settings().headerCtaHref || "#");
    const absoluteOgImage = derived(() => {
      if (!socialImage()) return "";
      if (socialImage().startsWith("http")) return socialImage();
      const origin = store_get($$store_subs ??= {}, "$page", page).url.origin;
      return `${origin}${socialImage().startsWith("/") ? "" : "/"}${socialImage()}`;
    });
    head("xod7dh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(seoTitle())}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", seoDesc())}/> `);
      if (isDraft()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="robots" content="noindex, nofollow"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta property="og:title"${attr("content", seoTitle())}/> <meta property="og:description"${attr("content", seoDesc())}/> <meta property="og:type" content="website"/> <meta property="og:url"${attr("content", store_get($$store_subs ??= {}, "$page", page).url.href)}/> `);
      if (absoluteOgImage()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta property="og:image"${attr("content", absoluteOgImage())}/> <meta name="twitter:image"${attr("content", absoluteOgImage())}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", seoTitle())}/> <meta name="twitter:description"${attr("content", seoDesc())}/>`);
    });
    if (isDraft()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="draft-banner svelte-xod7dh" role="status"><span>${escape_html(t(lang(), "admin.landing_pages.builder.draft_preview"))}</span> <span class="dot svelte-xod7dh">·</span> <span>${escape_html(t(lang(), "admin.landing_pages.builder.draft_admin_only"))}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="landing-page-public-root svelte-xod7dh"${attr_style("", { "background-color": backgroundColor(), color: textColor() })}>`);
    if (showHeader() && (headerLogo() || headerLinks().length || headerCtaEnabled() && headerCtaText())) {
      $$renderer2.push("<!--[0-->");
      LandingPageHeader($$renderer2, {
        logo: headerLogo(),
        links: headerLinks(),
        ctaText: headerCtaText(),
        ctaHref: headerCtaHref(),
        showCta: headerCtaEnabled(),
        maxWidth: containerWidth(),
        sticky: true
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    LandingBlockTree($$renderer2, {
      blocks: blocks(),
      containerWidth: containerWidth(),
      lang: lang()
    });
    $$renderer2.push(`<!----></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-qapUc9NX.js.map
