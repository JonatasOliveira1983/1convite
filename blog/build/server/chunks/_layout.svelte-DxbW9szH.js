import { G as head, I as attr_class, J as attr, K as derived, L as store_get, O as stringify, Q as escape_html, R as ensure_array_like, T as unsubscribe_stores, V as bind_props } from './root-bZgTCCHH.js';
import { b as base } from './server-B3psWENk.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { o as optimizeImageUrl } from './image-optimizer-CgaByzvi.js';
import { h as html } from './html-FW6Ia4bL.js';

function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      logo = "",
      siteName = "1Convite Blog",
      showSearch = true,
      showThemeToggle = true,
      user = null,
      enableMemberLogin = false,
      language = ""
    } = $$props;
    const lang = derived(() => language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const links = derived(() => [
      { label: t(lang(), "nav.home"), href: `${base}/` },
      {
        label: t(lang(), "nav.categories"),
        href: `${base}/categories`
      },
      {
        label: "Planos & Convites",
        href: "https://1convite.com.br/#planos"
      },
      { label: "Acessar App", href: "https://1convite.com.br/" },
      ...user ? [
        {
          label: t(lang(), "nav.my_account"),
          href: `${base}/members/dashboard`
        }
      ] : enableMemberLogin ? [
        { label: t(lang(), "nav.premium"), href: `${base}/premium` },
        { label: t(lang(), "nav.login"), href: `${base}/members/login` }
      ] : []
    ]);
    $$renderer2.push(`<header class="header svelte-1elxaub"><div class="header-container svelte-1elxaub"><a${attr("href", `${stringify(base)}/`)} class="logo svelte-1elxaub">`);
    if (logo) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", logo)}${attr("alt", siteName)} class="logo-img svelte-1elxaub"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="logo-icon svelte-1elxaub" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--> <span class="logo-text svelte-1elxaub">${escape_html(siteName)}</span></a> <nav class="nav-desktop svelte-1elxaub"><!--[-->`);
    const each_array = ensure_array_like(links());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<a${attr("href", link.href)}${attr_class("nav-link svelte-1elxaub", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === link.href
      })}>${escape_html(link.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="header-actions svelte-1elxaub">`);
    if (showSearch) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="action-btn svelte-1elxaub"${attr("aria-label", t(lang(), "nav.search_aria"))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1elxaub"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showThemeToggle) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="action-btn svelte-1elxaub"${attr(
        "aria-label",
        t(lang(), "nav.theme_light")
      )}>`);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1elxaub"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`);
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="action-btn mobile-menu-btn svelte-1elxaub"${attr("aria-label", t(lang(), "nav.menu"))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1elxaub">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`);
    }
    $$renderer2.push(`<!--]--></svg></button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      logo = "",
      siteName = "1Convite Blog",
      description = "",
      copyright = "",
      adminEmail = "",
      location = "",
      showSocial = true,
      showContact = true,
      language = ""
    } = $$props;
    const lang = derived(() => language || store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const email = derived(() => adminEmail || "contato@1convite.com.br");
    const displayLocation = derived(() => location || t(lang(), "footer.default_location"));
    const links = derived(() => ({
      explore: [
        { label: t(lang(), "nav.home"), href: `${base}/` },
        {
          label: t(lang(), "nav.categories"),
          href: `${base}/categories`
        },
        { label: t(lang(), "nav.products"), href: `${base}/products` },
        { label: "Comunidade VIP", href: `${base}/members/area` },
        { label: t(lang(), "nav.premium"), href: `${base}/premium` },
        { label: t(lang(), "footer.rss"), href: `${base}/rss.xml` },
        {
          label: t(lang(), "footer.sitemap"),
          href: `${base}/sitemap.xml`
        }
      ],
      legal: [
        { label: t(lang(), "footer.privacy"), href: `${base}/privacy` },
        { label: t(lang(), "footer.terms"), href: `${base}/terms` },
        { label: t(lang(), "footer.cookies"), href: `${base}/cookies` }
      ],
      social: [
        { name: "Twitter", href: "", icon: "twitter" },
        { name: "Facebook", href: "", icon: "facebook" },
        { name: "Instagram", href: "", icon: "instagram" },
        { name: "YouTube", href: "", icon: "youtube" }
      ]
    }));
    const socialIcons = {
      twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
      instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      youtube: "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"
    };
    $$renderer2.push(`<footer class="footer svelte-jz8lnl"><div class="footer-container svelte-jz8lnl"><div class="footer-main svelte-jz8lnl"><div class="footer-brand svelte-jz8lnl"><a${attr("href", `${stringify(base)}/`)} class="footer-logo svelte-jz8lnl">`);
    if (logo) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", logo)}${attr("alt", siteName)} class="logo-img svelte-jz8lnl"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="logo-icon svelte-jz8lnl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`);
    }
    $$renderer2.push(`<!--]--> <span>${escape_html(siteName)}</span></a> `);
    if (description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="footer-description svelte-jz8lnl">${escape_html(description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showSocial && links().social.some((s) => Boolean(s.href))) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="footer-social svelte-jz8lnl"><!--[-->`);
      const each_array = ensure_array_like(links().social.filter((s) => Boolean(s.href)));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let social = each_array[$$index];
        $$renderer2.push(`<a${attr("href", social.href)} class="social-link svelte-jz8lnl"${attr("aria-label", social.name)}${attr("title", social.name)}><svg viewBox="0 0 24 24" fill="currentColor" class="svelte-jz8lnl"><path${attr("d", socialIcons[social.icon] || "")}></path></svg></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="footer-links svelte-jz8lnl"><div class="footer-col"><h4 class="footer-heading svelte-jz8lnl">${escape_html(t(lang(), "footer.explore"))}</h4> <ul class="footer-list svelte-jz8lnl"><!--[-->`);
    const each_array_1 = ensure_array_like(links().explore);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let link = each_array_1[$$index_1];
      $$renderer2.push(`<li><a${attr("href", link.href)} class="footer-link svelte-jz8lnl">${escape_html(link.label)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="footer-col"><h4 class="footer-heading svelte-jz8lnl">${escape_html(t(lang(), "footer.legal"))}</h4> <ul class="footer-list svelte-jz8lnl"><!--[-->`);
    const each_array_2 = ensure_array_like(links().legal);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let link = each_array_2[$$index_2];
      $$renderer2.push(`<li><a${attr("href", link.href)} class="footer-link svelte-jz8lnl">${escape_html(link.label)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> `);
    if (showContact) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="footer-col"><h4 class="footer-heading svelte-jz8lnl">${escape_html(t(lang(), "footer.contact"))}</h4> <ul class="footer-list contact-list svelte-jz8lnl"><li class="svelte-jz8lnl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-jz8lnl"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> <a class="footer-link svelte-jz8lnl"${attr("href", `mailto:${email()}`)}>${escape_html(email())}</a></li> <li class="svelte-jz8lnl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-jz8lnl"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span>${escape_html(displayLocation())}</span></li></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="footer-bottom svelte-jz8lnl"><p class="copyright svelte-jz8lnl">© ${escape_html(currentYear)} ${escape_html(siteName)}. ${escape_html(copyright || t(lang(), "common.all_rights"))}</p> <div class="footer-badges"><span class="badge svelte-jz8lnl">${escape_html(t(lang(), "common.made_with_svelte"))}</span></div></div></div></footer>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CookieConsent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let toasts = [];
    function showToast(message, type = "info", duration = 3e3) {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      toasts = [...toasts, { id, type, message, duration }];
      if (duration > 0) {
        setTimeout(
          () => {
            removeToast(id);
          },
          duration
        );
      }
    }
    function removeToast(id) {
      toasts = toasts.filter((t2) => t2.id !== id);
    }
    function getIcon(type) {
      switch (type) {
        case "success":
          return "✓";
        case "warning":
          return "⚠";
        case "error":
          return "✕";
        default:
          return "ℹ";
      }
    }
    $$renderer2.push(`<div class="toast-container svelte-1cpok13" aria-live="polite"><!--[-->`);
    const each_array = ensure_array_like(toasts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`toast toast-${stringify(toast.type)}`, "svelte-1cpok13")} role="alert"><span class="toast-icon svelte-1cpok13">${escape_html(getIcon(toast.type))}</span> <span class="toast-message svelte-1cpok13">${escape_html(toast.message)}</span> <button class="toast-close svelte-1cpok13" aria-label="Fechar">✕</button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { showToast });
  });
}
function StoriesBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { stories = [], language = "pt" } = $$props;
    function thumb(story) {
      return story.poster_portrait || story.cover_image || "";
    }
    function initial(title) {
      return (title || "?").trim().charAt(0).toUpperCase();
    }
    if (stories && stories.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="stories-bar svelte-e8e2yu"${attr("aria-label", t(language, "stories.bar_label"))}><div class="stories-track svelte-e8e2yu"><!--[-->`);
      const each_array = ensure_array_like(stories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let story = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/stories/${stringify(story.slug)}`)} class="story-bubble svelte-e8e2yu"${attr("title", story.title)} data-sveltekit-reload=""><span class="ring svelte-e8e2yu">`);
        if (thumb(story)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", optimizeImageUrl(thumb(story), 160))} alt="" class="avatar svelte-e8e2yu" width="64" height="64" loading="lazy"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="avatar placeholder svelte-e8e2yu">${escape_html(initial(story.title))}</span>`);
        }
        $$renderer2.push(`<!--]--></span> <span class="label svelte-e8e2yu">${escape_html(story.title)}</span></a>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, children } = $$props;
    const siteFavicon = derived(() => data?.settings?.site_favicon || data?.settings?.site_logo || "/favicon.svg");
    const language = derived(() => data?.language || "pt");
    const isAdmin = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin"));
    const isLandingPage = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/p/"));
    const whatsappEnable = derived(() => data?.settings?.whatsapp_enable === "1");
    const whatsappNumber = derived(() => data?.settings?.whatsapp_number || "");
    const whatsappMessage = derived(() => data?.settings?.whatsapp_message || "");
    const whatsappUrl = derived(() => whatsappNumber() ? `https://wa.me/${whatsappNumber().replace(/\D/g, "")}${whatsappMessage() ? `?text=${encodeURIComponent(whatsappMessage())}` : ""}` : "");
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com" class="svelte-12qhfyh"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" class="svelte-12qhfyh"/> <link rel="icon"${attr("href", siteFavicon())} class="svelte-12qhfyh"/> <link rel="apple-touch-icon"${attr("href", siteFavicon())} class="svelte-12qhfyh"/> `);
      if (!isAdmin() && data?.settings?.custom_head_script) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`${html(data.settings.custom_head_script)}`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    if (isAdmin() || isLandingPage()) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="app-layout svelte-12qhfyh">`);
      Header($$renderer2, {
        logo: data?.settings?.site_logo || "",
        siteName: data?.settings?.site_title || "Blog",
        user: data?.user,
        enableMemberLogin: data?.settings?.enable_member_login === "1",
        defaultTheme: data?.settings?.default_theme || "light",
        language: data?.language
      });
      $$renderer2.push(`<!----> `);
      if (data?.settings?.enable_web_stories_bar === "1" && data?.webStories?.length > 0) {
        $$renderer2.push("<!--[0-->");
        StoriesBar($$renderer2, { stories: data.webStories, language: language() });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <main${attr_class("main-content svelte-12qhfyh", void 0, {
        "has-stories": data?.settings?.enable_web_stories_bar === "1" && data?.webStories?.length > 0
      })}>`);
      children($$renderer2);
      $$renderer2.push(`<!----></main> `);
      Footer($$renderer2, {
        logo: data?.settings?.site_logo || "",
        siteName: data?.settings?.site_title || "Blog",
        description: data?.settings?.site_description || "",
        copyright: data?.settings?.footer_text || "",
        adminEmail: data?.settings?.admin_email || "",
        language: language()
      });
      $$renderer2.push(`<!----> `);
      CookieConsent($$renderer2);
      $$renderer2.push(`<!----> `);
      Toast($$renderer2, {});
      $$renderer2.push(`<!----> `);
      if (whatsappEnable() && whatsappUrl()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", whatsappUrl())} target="_blank" rel="noopener noreferrer" class="whatsapp-float-btn svelte-12qhfyh" aria-label="Fale conosco pelo WhatsApp"><span class="whatsapp-pulse-ring svelte-12qhfyh"></span> <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="svelte-12qhfyh"><path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.456 3.48 1.332 5.004L2 22l5.124-1.344c1.476.804 3.144 1.236 4.884 1.236 5.532 0 10.012-4.48 10.012-10.012C22.02 6.48 17.54 2 12.012 2zm6.204 14.352c-.252.708-1.464 1.38-2.004 1.44-.48.06-.96.276-3.084-.552-2.7-1.056-4.428-3.792-4.56-3.972-.132-.18-.996-1.32-.996-2.52 0-1.2.624-1.788.852-2.04.228-.252.492-.312.66-.312.168 0 .336.006.48.012.156.006.366-.06.576.444.216.528.744 1.812.81 1.944.066.132.108.288.018.468-.09.18-.132.288-.264.444-.132.156-.276.348-.396.468-.132.132-.27.276-.114.54.156.264.696 1.152 1.488 1.86 1.02.912 1.872 1.188 2.136 1.32.264.132.42.108.576-.072.156-.18.672-.78.852-1.044.18-.264.36-.216.612-.12.252.096 1.608.756 1.884.888.276.132.456.198.522.312.066.114.066.66-.186 1.368z" class="svelte-12qhfyh"></path></svg></a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data?.settings?.custom_body_script) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`${html(data.settings.custom_body_script)}`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DxbW9szH.js.map
