import { G as head, Q as escape_html, J as attr, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, b as adminErrorMessage } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let { form } = $$props;
    let loading = false;
    let videoUrlInput = "";
    const formError = derived(() => {
      if (!form?.error) return "";
      if (form.error === "YT_GEMINI_API") {
        return t(lang(), "admin.posts.errors.yt_gemini_api", { status: form.status || "", detail: form.detail || "" });
      }
      return adminErrorMessage(lang(), form.error);
    });
    head("276cym", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.posts.import_youtube"))} - Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="import-page svelte-276cym"><div class="import-header svelte-276cym"><h1 class="import-title svelte-276cym">${escape_html(t(lang(), "admin.posts.import_page_title"))}</h1> <p class="subtitle svelte-276cym">${escape_html(t(lang(), "admin.posts.import_page_subtitle"))}</p></div> <div class="import-card svelte-276cym">`);
    if (formError()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="message error svelte-276cym"><span class="icon">⚠️</span> <p class="svelte-276cym">${escape_html(formError())}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <form method="POST"><div class="form-group svelte-276cym"><label for="videoUrl" class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_video_label"))}</label> <div class="input-wrapper svelte-276cym"><span class="input-icon svelte-276cym"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg></span> <input type="url" id="videoUrl" name="videoUrl"${attr("value", videoUrlInput)} placeholder="https://www.youtube.com/watch?v=..." required=""${attr("disabled", loading, true)} class="svelte-276cym"/></div> <p class="hint svelte-276cym">${escape_html(t(lang(), "admin.posts.import_hint"))}</p></div> <button type="submit" class="generate-btn svelte-276cym"${attr("disabled", loading, true)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(t(lang(), "admin.posts.generate_gemini"))}`);
    }
    $$renderer2.push(`<!--]--></button></form></div> <div class="info-grid svelte-276cym"><div class="info-item svelte-276cym"><span class="info-icon svelte-276cym"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span> <h3 class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_transcript_title"))}</h3> <p class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_transcript_desc"))}</p></div> <div class="info-item svelte-276cym"><span class="info-icon svelte-276cym"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></span> <h3 class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_seo_title"))}</h3> <p class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_seo_desc"))}</p></div> <div class="info-item svelte-276cym"><span class="info-icon svelte-276cym"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></span> <h3 class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_thumb_title"))}</h3> <p class="svelte-276cym">${escape_html(t(lang(), "admin.posts.import_feature_thumb_desc"))}</p></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DnTg9s7P.js.map
