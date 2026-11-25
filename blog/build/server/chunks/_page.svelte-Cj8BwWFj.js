import { G as head, Q as escape_html, I as attr_class, L as store_get, J as attr, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { data, form } = $$props;
    let loading = false;
    let activeTab = "general";
    let feedLoadingModeValue = "pagination";
    let enableRecommendationsValue = "1";
    let defaultThemeValue = "light";
    let siteLanguageValue = "pt";
    data.settings?.payment_gateway === "stripe" ? "stripe" : "asaas";
    head("1gjcsm", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.settings.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="settings-page svelte-1gjcsm"><div class="page-header svelte-1gjcsm"><h1 class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.heading"))}</h1> <p class="subtitle svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.subtitle"))}</p></div> <div class="settings-tabs svelte-1gjcsm"><button${attr_class("tab-btn svelte-1gjcsm", void 0, { "active": activeTab === "general" })}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg> ${escape_html(t(lang(), "admin.settings.tab_general"))}</button> <button${attr_class("tab-btn svelte-1gjcsm", void 0, { "active": activeTab === "seo" })}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> ${escape_html(t(lang(), "admin.settings.tab_seo"))}</button> <button${attr_class("tab-btn svelte-1gjcsm", void 0, { "active": activeTab === "api" })}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> ${escape_html(t(lang(), "admin.settings.tab_api"))}</button> <button${attr_class("tab-btn svelte-1gjcsm", void 0, { "active": activeTab === "security" })}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> ${escape_html(t(lang(), "admin.settings.tab_security"))}</button></div> `);
    if (form?.success || store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("success") === "true") {
      $$renderer2.push("<!--[0-->");
      const section = form?.section || store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("tab") || "general";
      $$renderer2.push(`<div class="alert success svelte-1gjcsm">${escape_html(section === "api" ? t(lang(), "admin.settings.saved_api") : section === "seo" ? t(lang(), "admin.settings.saved_seo") : section === "security" ? t(lang(), "admin.settings.saved_security") : t(lang(), "admin.settings.saved_general"))}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="alert error svelte-1gjcsm">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<form method="POST" action="?/general" enctype="multipart/form-data"><div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_site"))}</div> <div class="form-group svelte-1gjcsm"><label for="site_title" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.blog_title"))}</label> <input type="text" id="site_title" name="site_title"${attr("value", data.settings.site_title || "")} placeholder="Meu Blog Incrível" class="svelte-1gjcsm"/> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.blog_title_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="site_description" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.meta_desc"))}</label> <textarea id="site_description" name="site_description" rows="3" placeholder="Um blog sobre tecnologia e design..." class="svelte-1gjcsm">`);
      const $$body = escape_html(data.settings.site_description || "");
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="form-group svelte-1gjcsm"><label for="site_keywords" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.keywords_label"))}</label> <input type="text" id="site_keywords" name="site_keywords"${attr("value", data.settings.site_keywords || "")} placeholder="blog, tecnologia, svelte, design" class="svelte-1gjcsm"/></div> <div class="form-group svelte-1gjcsm"><label for="site_logo" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.site_logo"))}</label> <div class="image-input-group svelte-1gjcsm"><input type="text" id="site_logo" name="site_logo"${attr("value", data.settings.site_logo || "")} placeholder="https://exemplo.com/logo.png" class="svelte-1gjcsm"/> <div class="file-upload svelte-1gjcsm"><span class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.or_upload"))}</span> <input type="file" id="site_logo_file" name="site_logo_file" class="file-input-hidden svelte-1gjcsm" accept="image/*"/> <label for="site_logo_file" class="btn btn-small svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.choose_file"))}</label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (data.settings.site_logo) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="current-image svelte-1gjcsm"><img${attr("src", data.settings.site_logo)} alt="Logo" class="svelte-1gjcsm"/></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.logo_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="site_favicon" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.site_favicon"))}</label> <div class="image-input-group svelte-1gjcsm"><input type="text" id="site_favicon" name="site_favicon"${attr("value", data.settings.site_favicon || "")} placeholder="https://exemplo.com/favicon.png" class="svelte-1gjcsm"/> <div class="file-upload svelte-1gjcsm"><span class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.or_upload"))}</span> <input type="file" id="site_favicon_file" name="site_favicon_file" class="file-input-hidden svelte-1gjcsm" accept="image/*"/> <label for="site_favicon_file" class="btn btn-small svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.choose_file"))}</label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (data.settings.site_favicon) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="current-image svelte-1gjcsm"><img${attr("src", data.settings.site_favicon)} alt="Favicon" style="width: 32px; height: 32px; object-fit: contain;" class="svelte-1gjcsm"/></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.favicon_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_feed"))}</div> <div class="form-group svelte-1gjcsm"><label for="feed_loading_mode" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.feed_mode"))}</label> `);
      $$renderer2.select(
        {
          id: "feed_loading_mode",
          name: "feed_loading_mode",
          value: feedLoadingModeValue,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "pagination" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.feed_pagination"))}`);
          });
          $$renderer3.option({ value: "infinite" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.feed_infinite"))}`);
          });
        },
        "svelte-1gjcsm"
      );
      $$renderer2.push(` <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.feed_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_recs"))}</div> <div class="form-group svelte-1gjcsm"><label for="enable_recommendations" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.recs_label"))}</label> `);
      $$renderer2.select(
        {
          id: "enable_recommendations",
          name: "enable_recommendations",
          value: enableRecommendationsValue,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "1" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.recs_on"))}`);
          });
          $$renderer3.option({ value: "0" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.recs_off"))}`);
          });
        },
        "svelte-1gjcsm"
      );
      $$renderer2.push(` <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.recs_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_theme"))}</div> <div class="form-group svelte-1gjcsm"><label for="default_theme" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.theme_label"))}</label> `);
      $$renderer2.select(
        {
          id: "default_theme",
          name: "default_theme",
          value: defaultThemeValue,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "light" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.theme_light"))}`);
          });
          $$renderer3.option({ value: "dark" }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(t(lang(), "admin.settings.theme_dark"))}`);
          });
        },
        "svelte-1gjcsm"
      );
      $$renderer2.push(` <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.theme_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_lang"))}</div> <div class="form-group svelte-1gjcsm"><label for="site_language" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.site_language"))}</label> `);
      $$renderer2.select(
        {
          id: "site_language",
          name: "site_language",
          value: siteLanguageValue,
          class: ""
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "pt" }, ($$renderer4) => {
            $$renderer4.push(`Português (Brasil)`);
          });
          $$renderer3.option({ value: "en" }, ($$renderer4) => {
            $$renderer4.push(`English (Estados Unidos)`);
          });
          $$renderer3.option({ value: "es" }, ($$renderer4) => {
            $$renderer4.push(`Español (Espanha/América Latina)`);
          });
        },
        "svelte-1gjcsm"
      );
      $$renderer2.push(` <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.lang_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_og"))}</div> <div class="form-group svelte-1gjcsm"><label for="seo_image" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.og_image"))}</label> <div class="image-input-group svelte-1gjcsm"><input type="text" id="seo_image" name="seo_image"${attr("value", data.settings.seo_image || "")} placeholder="https://exemplo.com/og-image.jpg" class="svelte-1gjcsm"/> <div class="file-upload svelte-1gjcsm"><span class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.or_upload"))}</span> <input type="file" id="seo_image_file" name="seo_image_file" class="file-input-hidden svelte-1gjcsm" accept="image/*"/> <label for="seo_image_file" class="btn btn-small svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.choose_file"))}</label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (data.settings.seo_image) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="current-image svelte-1gjcsm"><img${attr("src", data.settings.seo_image)} alt="Preview" class="svelte-1gjcsm"/></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="form-row svelte-1gjcsm"><div class="form-group svelte-1gjcsm"><label for="twitter_handle" class="svelte-1gjcsm">Twitter Handle</label> <input type="text" id="twitter_handle" name="twitter_handle"${attr("value", data.settings.twitter_handle || "")} placeholder="@meublog" class="svelte-1gjcsm"/></div> <div class="form-group svelte-1gjcsm"><label for="og_app_id" class="svelte-1gjcsm">Facebook App ID</label> <input type="text" id="og_app_id" name="og_app_id"${attr("value", data.settings.og_app_id || "")} placeholder="123456789" class="svelte-1gjcsm"/></div></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_contact"))}</div> <div class="form-group svelte-1gjcsm"><label for="admin_email" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.admin_email"))}</label> <input type="email" id="admin_email" name="admin_email"${attr("value", data.settings.admin_email || "")} placeholder="admin@seusite.com" class="svelte-1gjcsm"/> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.admin_email_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="footer_text" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.footer_text"))}</label> <textarea id="footer_text" name="footer_text" rows="2" placeholder="© 2026 Blog. Minimalist Paper Theme." class="svelte-1gjcsm">`);
      const $$body_1 = escape_html(data.settings.footer_text || "");
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.section_scripts"))}</div> <p class="section-description svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.scripts_desc"))}</p> <div class="form-group svelte-1gjcsm"><label for="custom_head_script" class="svelte-1gjcsm">Script do <code>&lt;head></code></label> <textarea id="custom_head_script" name="custom_head_script" rows="5" placeholder="&lt;!-- Cole aqui scripts para o &lt;head>: Google Analytics, Meta Pixel, Tag Manager, etc. -->" class="code-textarea svelte-1gjcsm">`);
      const $$body_2 = escape_html(data.settings.custom_head_script || "");
      if ($$body_2) {
        $$renderer2.push(`${$$body_2}`);
      }
      $$renderer2.push(`</textarea> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.head_script_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="custom_body_script" class="svelte-1gjcsm">Script antes do <code>&lt;/body></code></label> <textarea id="custom_body_script" name="custom_body_script" rows="5" placeholder="&lt;!-- Cole aqui scripts para o final do &lt;body>: Autotag de redes de anúncio, chat widgets, etc. -->" class="code-textarea svelte-1gjcsm">`);
      const $$body_3 = escape_html(data.settings.custom_body_script || "");
      if ($$body_3) {
        $$renderer2.push(`${$$body_3}`);
      }
      $$renderer2.push(`</textarea> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.body_script_hint"))}</small></div></div> <div class="form-card svelte-1gjcsm"><div class="form-section-title svelte-1gjcsm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.25rem;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> ${escape_html(t(lang(), "admin.settings.section_whatsapp"))}</div> <div class="form-group checkbox-group svelte-1gjcsm" style="margin-top: 1.25rem;"><label class="checkbox-label svelte-1gjcsm" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; text-transform: none; font-weight: normal; letter-spacing: normal; color: var(--text-primary);"><input type="checkbox" id="whatsapp_enable" name="whatsapp_enable" value="1"${attr("checked", data.settings.whatsapp_enable === "1", true)} style="width: auto; margin: 0; cursor: pointer;" class="svelte-1gjcsm"/> <span>${escape_html(t(lang(), "admin.settings.wa_enable"))}</span></label> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.wa_enable_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="whatsapp_number" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.wa_number"))}</label> <input type="text" id="whatsapp_number" name="whatsapp_number"${attr("value", data.settings.whatsapp_number || "")} placeholder="Ex: 5511999999999" class="svelte-1gjcsm"/> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.wa_number_hint"))}</small></div> <div class="form-group svelte-1gjcsm"><label for="whatsapp_message" class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.wa_message"))}</label> <input type="text" id="whatsapp_message" name="whatsapp_message"${attr("value", data.settings.whatsapp_message || "")} placeholder="Olá, gostaria de saber mais informações!" class="svelte-1gjcsm"/> <small class="svelte-1gjcsm">${escape_html(t(lang(), "admin.settings.wa_message_hint"))}</small></div></div> <div class="form-actions svelte-1gjcsm"><button type="submit" class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html(t(lang(), "admin.settings.save"))}</button></div></form>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cj8BwWFj.js.map
