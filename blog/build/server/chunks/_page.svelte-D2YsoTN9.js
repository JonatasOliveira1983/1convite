import { G as head, Q as escape_html, R as ensure_array_like, J as attr, X as attr_style, O as stringify, K as derived, L as store_get, I as attr_class, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { B as Breadcrumb } from './ToastContainer.svelte_svelte_type_style_lang-CZx3uIFq.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './server-B3psWENk.js';
import './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

/* empty css                                                             */
/* empty css                                                       */
function ContactForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { variant = "page", showPhone = true, showSubject = true } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let name = "";
    let email = "";
    let phone = "";
    let subject = "";
    let message = "";
    let submitting = false;
    const subjects = derived(() => [
      t(lang(), "contact.subject_general"),
      t(lang(), "contact.subject_support"),
      t(lang(), "contact.subject_partners"),
      t(lang(), "contact.subject_suggestions"),
      t(lang(), "contact.subject_bug"),
      t(lang(), "contact.subject_other")
    ]);
    $$renderer2.push(`<div${attr_class(`contact-form variant-${stringify(variant)}`, "svelte-fq8g2m")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <form><div class="form-row svelte-fq8g2m"><div class="form-group svelte-fq8g2m"><label for="name" class="form-label svelte-fq8g2m">${escape_html(t(lang(), "contact.label_name"))}</label> <input type="text" id="name"${attr("value", name)} required="" class="form-input svelte-fq8g2m"${attr("placeholder", t(lang(), "contact.ph_name"))}/></div> <div class="form-group svelte-fq8g2m"><label for="email" class="form-label svelte-fq8g2m">${escape_html(t(lang(), "contact.label_email"))}</label> <input type="email" id="email"${attr("value", email)} required="" class="form-input svelte-fq8g2m"${attr("placeholder", t(lang(), "contact.ph_email"))}/></div></div> `);
      if (showPhone) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-fq8g2m"><label for="phone" class="form-label svelte-fq8g2m">${escape_html(t(lang(), "contact.label_phone"))}</label> <input type="tel" id="phone"${attr("value", phone)} class="form-input svelte-fq8g2m"${attr("placeholder", t(lang(), "contact.ph_phone"))}/></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showSubject) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-fq8g2m"><label for="subject" class="form-label svelte-fq8g2m">${escape_html(t(lang(), "contact.label_subject"))}</label> `);
        $$renderer2.select(
          {
            id: "subject",
            value: subject,
            required: true,
            class: "form-select"
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(t(lang(), "contact.ph_subject"))}`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array = ensure_array_like(subjects());
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let s = each_array[$$index];
              $$renderer3.option({ value: s }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(s)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-fq8g2m"
        );
        $$renderer2.push(`</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="form-group svelte-fq8g2m"><label for="message" class="form-label svelte-fq8g2m">${escape_html(t(lang(), "contact.label_message"))}</label> <textarea id="message" required="" class="form-textarea svelte-fq8g2m" rows="5"${attr("placeholder", t(lang(), "contact.ph_message"))}>`);
      const $$body = escape_html(message);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <button type="submit" class="form-submit svelte-fq8g2m"${attr("disabled", submitting, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-fq8g2m"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9"></polygon></svg>${escape_html(t(lang(), "contact.submit"))}`);
      }
      $$renderer2.push(`<!--]--></button></form>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const contactMethods = derived(() => [
      {
        icon: "mail",
        title: t(lang(), "contact.method_email"),
        value: data.settings?.admin_email || "contato@blog.com",
        description: t(lang(), "contact.method_email_desc")
      },
      {
        icon: "phone",
        title: t(lang(), "contact.method_phone"),
        value: data.settings?.contact_phone || "",
        description: ""
      },
      {
        icon: "location",
        title: t(lang(), "contact.method_location"),
        value: data.settings?.contact_location || t(lang(), "footer.default_location"),
        description: ""
      }
    ].filter((m) => m.value));
    const socialLinks = [
      { name: "Twitter", href: "#", color: "#1da1f2" },
      { name: "GitHub", href: "#", color: "#333" },
      { name: "LinkedIn", href: "#", color: "#0a66c2" },
      { name: "YouTube", href: "#", color: "#ff0000" }
    ];
    head("1bv7ezn", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.settings?.site_title || "Blog")} | ${escape_html(t(lang(), "contact.meta_title"))}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", t(lang(), "contact.meta_desc"))}/>`);
    });
    $$renderer2.push(`<div class="contact-page svelte-1bv7ezn"><div class="container svelte-1bv7ezn"><header class="page-header svelte-1bv7ezn">`);
    Breadcrumb($$renderer2, {
      items: [
        {
          label: t(lang(), "contact.meta_title"),
          icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
        }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="page-title svelte-1bv7ezn">${escape_html(t(lang(), "contact.page_title"))}</h1> <p class="page-subtitle svelte-1bv7ezn">${escape_html(t(lang(), "contact.page_subtitle"))}</p></header> <div class="contact-methods svelte-1bv7ezn"><!--[-->`);
    const each_array = ensure_array_like(contactMethods());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let method = each_array[$$index];
      $$renderer2.push(`<div class="method-card svelte-1bv7ezn"><div class="method-icon svelte-1bv7ezn">`);
      if (method.icon === "mail") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bv7ezn"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`);
      } else if (method.icon === "phone") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bv7ezn"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>`);
      } else if (method.icon === "location") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bv7ezn"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="method-info svelte-1bv7ezn"><h3 class="method-title svelte-1bv7ezn">${escape_html(method.title)}</h3> <span class="method-value svelte-1bv7ezn">${escape_html(method.value)}</span> <span class="method-description svelte-1bv7ezn">${escape_html(method.description)}</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="contact-grid svelte-1bv7ezn"><div class="form-section svelte-1bv7ezn">`);
    ContactForm($$renderer2, {});
    $$renderer2.push(`<!----></div> <div class="info-section svelte-1bv7ezn"><div class="faq-card svelte-1bv7ezn"><h3 class="faq-title svelte-1bv7ezn">Perguntas Frequentes</h3> <div class="faq-list svelte-1bv7ezn"><div class="faq-item svelte-1bv7ezn"><h4 class="svelte-1bv7ezn">Como posso contribuir com o blog?</h4> <p class="svelte-1bv7ezn">Envie sua proposta de artigo pelo formulário acima.</p></div> <div class="faq-item svelte-1bv7ezn"><h4 class="svelte-1bv7ezn">Vocês oferecem suporte técnico?</h4> <p class="svelte-1bv7ezn">Sim, respondemos dúvidas nos comentários dos posts.</p></div> <div class="faq-item svelte-1bv7ezn"><h4 class="svelte-1bv7ezn">Posso fazer guest posts?</h4> <p class="svelte-1bv7ezn">Aceitamos colaboradores! Entre em contato.</p></div></div></div> <div class="social-card svelte-1bv7ezn"><h3 class="social-title svelte-1bv7ezn">${escape_html(t(lang(), "contact.follow_us"))}</h3> <div class="social-links svelte-1bv7ezn"><!--[-->`);
    const each_array_1 = ensure_array_like(socialLinks);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let social = each_array_1[$$index_1];
      $$renderer2.push(`<a${attr("href", social.href)} class="social-link svelte-1bv7ezn"${attr_style(`--social-color: ${stringify(social.color)}`)}${attr("aria-label", social.name)}>`);
      if (social.name === "Twitter") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="currentColor" class="svelte-1bv7ezn"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`);
      } else if (social.name === "GitHub") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="currentColor" class="svelte-1bv7ezn"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>`);
      } else if (social.name === "LinkedIn") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="currentColor" class="svelte-1bv7ezn"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>`);
      } else if (social.name === "YouTube") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<svg viewBox="0 0 24 24" fill="currentColor" class="svelte-1bv7ezn"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"></path></svg>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span>${escape_html(social.name)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="response-time svelte-1bv7ezn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1bv7ezn"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg> <span>Tempo médio de resposta: <strong class="svelte-1bv7ezn">24 horas</strong></span></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D2YsoTN9.js.map
