import { G as head, I as attr_class, Q as escape_html, R as ensure_array_like, J as attr, L as store_get, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let sidebarOpen = false;
    let toolsMenuOpen = false;
    const isLoginPage = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname === "/admin/login");
    const navItems = derived(() => [
      {
        href: "/admin",
        label: t(lang(), "admin.menu.dashboard"),
        exact: true,
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-3a1 1 0 00-.867.5L7.414 10H6a1 1 0 000 2h2a1 1 0 00.867-.5L10 9.732l1.133 1.768A1 1 0 0012 12h2a1 1 0 000-2h-1.414l-1.719-2.5A1 1 0 0010 7z"/></svg>`
      },
      {
        href: "/admin/sales",
        label: t(lang(), "admin.menu.sales"),
        exact: false,
        prefix: "/admin/sales",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v.177c-1.383.17-2.5 1.213-2.5 2.573 0 1.36 1.117 2.403 2.5 2.573V14a1 1 0 102 0v-.177c1.383-.17 2.5-1.213 2.5-2.573 0-1.36-1.117-2.403-2.5-2.573V7zm-2.5 3.323c0-.448.337-.823.75-.893v1.786c-.413-.07-.75-.445-.75-.893zm2.5 2.247v-1.786c.413.07.75.445.75.893 0 .448-.337.823-.75.893z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/posts/new",
        label: t(lang(), "admin.menu.new_post"),
        exact: false,
        prefix: "/admin/posts/new",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>`
      },
      {
        href: "/admin/posts",
        label: t(lang(), "admin.menu.posts"),
        exact: false,
        prefix: "/admin/posts",
        excludePrefixes: ["/admin/posts/new", "/admin/posts/import-youtube"],
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/posts/import-youtube",
        label: t(lang(), "admin.menu.youtube_import"),
        exact: false,
        prefix: "/admin/posts/import-youtube",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/categories",
        label: t(lang(), "admin.menu.categories"),
        exact: false,
        prefix: "/admin/categories",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/><path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"/></svg>`
      },
      {
        href: "/admin/ads",
        label: t(lang(), "admin.menu.ads"),
        exact: false,
        prefix: "/admin/ads",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/premium/plans",
        label: t(lang(), "admin.menu.premium"),
        exact: false,
        prefix: "/admin/premium",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
      },
      {
        href: "/admin/newsletter",
        label: t(lang(), "admin.menu.newsletter"),
        exact: false,
        prefix: "/admin/newsletter",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>`
      },
      {
        href: "/admin/products",
        label: t(lang(), "admin.menu.products"),
        exact: false,
        prefix: "/admin/products",
        excludePrefixes: ["/admin/products/categories"],
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/products/categories",
        label: t(lang(), "admin.menu.product_categories"),
        exact: false,
        prefix: "/admin/products/categories",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/courses",
        label: t(lang(), "admin.menu.courses"),
        exact: false,
        prefix: "/admin/courses",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>`
      },
      {
        href: "/admin/community",
        label: "Comunidade VIP",
        exact: false,
        prefix: "/admin/community",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/users",
        label: t(lang(), "admin.menu.users"),
        exact: false,
        prefix: "/admin/users",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`
      },
      {
        href: "/admin/cli",
        label: t(lang(), "admin.menu.cli_api"),
        exact: false,
        prefix: "/admin/cli",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>`
      },
      {
        href: "/admin/settings",
        label: t(lang(), "admin.menu.settings"),
        exact: false,
        prefix: "/admin/settings",
        icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`
      }
    ]);
    function isActive(item) {
      const path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
      if (item.exact) return path === item.href;
      if (item.excludePrefixes?.some((ex) => path.startsWith(ex))) return false;
      return item.prefix ? path.startsWith(item.prefix) : false;
    }
    head("1qg5d05", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin</title>`);
      });
    });
    if (isLoginPage()) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="admin-layout svelte-1qg5d05"><header class="topbar svelte-1qg5d05"><button class="menu-toggle svelte-1qg5d05" aria-label="Menu"><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>`);
      }
      $$renderer2.push(`<!--]--></svg></button> <a href="/admin" class="topbar-brand svelte-1qg5d05">Admin</a> <a href="/" class="topbar-blog-link svelte-1qg5d05" target="_blank" aria-label="Ver blog"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg></a></header> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <aside${attr_class("sidebar svelte-1qg5d05", void 0, { "open": sidebarOpen })}><div class="sidebar-brand svelte-1qg5d05"><a href="/admin" class="svelte-1qg5d05">Admin</a></div> <nav class="sidebar-nav svelte-1qg5d05"><div class="nav-group svelte-1qg5d05"><span class="nav-group-label svelte-1qg5d05">${escape_html(t(lang(), "admin.group_content"))}</span> <!--[-->`);
      const each_array = ensure_array_like(navItems().slice(0, 4));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class("nav-item svelte-1qg5d05", void 0, { "active": isActive(item) })}><span class="nav-icon svelte-1qg5d05">${html(item.icon)}</span> <span class="nav-label svelte-1qg5d05">${escape_html(item.label)}</span> `);
        if (isActive(item)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="nav-dot svelte-1qg5d05"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></a>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="nav-group svelte-1qg5d05"><span class="nav-group-label svelte-1qg5d05">${escape_html(t(lang(), "admin.group_management"))}</span> <!--[-->`);
      const each_array_1 = ensure_array_like(navItems().slice(4, 10));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class("nav-item svelte-1qg5d05", void 0, { "active": isActive(item) })}><span class="nav-icon svelte-1qg5d05">${html(item.icon)}</span> <span class="nav-label svelte-1qg5d05">${escape_html(item.label)}</span> `);
        if (isActive(item)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="nav-dot svelte-1qg5d05"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></a>`);
      }
      $$renderer2.push(`<!--]--> <details class="tools-dropdown svelte-1qg5d05"${attr("open", toolsMenuOpen, true)}><summary${attr_class("nav-item nav-dropdown-btn svelte-1qg5d05", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/shortlinks") || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/landing-pages") || store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/web-stories")
      })}><span class="nav-icon svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clip-rule="evenodd"></path></svg></span> <span class="nav-label svelte-1qg5d05">${escape_html(t(lang(), "admin.group_tools"))}</span> <span class="nav-arrow svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></span></summary> <div class="submenu svelte-1qg5d05"><a href="/admin/shortlinks"${attr_class("nav-item submenu-item svelte-1qg5d05", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/shortlinks")
      })}><span class="nav-icon svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path></svg></span> <span class="nav-label svelte-1qg5d05">${escape_html(t(lang(), "admin.menu.shortlinks"))}</span></a> <a href="/admin/landing-pages"${attr_class("nav-item submenu-item svelte-1qg5d05", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/landing-pages")
      })}><span class="nav-icon svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 12h8V4H6v12zm2-8a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg></span> <span class="nav-label svelte-1qg5d05">${escape_html(t(lang(), "admin.menu.landing_pages"))}</span> <span class="nav-badge svelte-1qg5d05">${escape_html(t(lang(), "admin.menu.badge_new"))}</span></a> <a href="/admin/web-stories"${attr_class("nav-item submenu-item svelte-1qg5d05", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/admin/web-stories")
      })}><span class="nav-icon svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h4V3H4zm6 0v14h6a2 2 0 002-2V5a2 2 0 00-2-2h-6z"></path></svg></span> <span class="nav-label svelte-1qg5d05">${escape_html(t(lang(), "admin.menu.web_stories"))}</span> <span class="nav-badge svelte-1qg5d05">${escape_html(t(lang(), "admin.menu.badge_new"))}</span></a></div></details></div> <div class="nav-group svelte-1qg5d05"><span class="nav-group-label svelte-1qg5d05">${escape_html(t(lang(), "admin.group_system"))}</span> <!--[-->`);
      const each_array_2 = ensure_array_like(navItems().slice(10));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let item = each_array_2[$$index_2];
        $$renderer2.push(`<a${attr("href", item.href)}${attr_class("nav-item svelte-1qg5d05", void 0, { "active": isActive(item) })}><span class="nav-icon svelte-1qg5d05">${html(item.icon)}</span> <span class="nav-label svelte-1qg5d05">${escape_html(item.label)}</span> `);
        if (isActive(item)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="nav-dot svelte-1qg5d05"></span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></a>`);
      }
      $$renderer2.push(`<!--]--></div></nav> <div class="sidebar-footer svelte-1qg5d05"><a href="/" class="footer-link svelte-1qg5d05" target="_blank"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg> ${escape_html(t(lang(), "admin.view_blog"))}</a> <form action="/admin/logout" method="POST"><button type="submit" class="footer-link footer-logout svelte-1qg5d05"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg> ${escape_html(t(lang(), "admin.logout"))}</button></form></div></aside> <main class="main-content svelte-1qg5d05">`);
      children($$renderer2);
      $$renderer2.push(`<!----></main></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DLoNnAmO.js.map
