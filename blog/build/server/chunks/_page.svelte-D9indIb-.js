import { G as head, I as attr_class, Q as escape_html, J as attr, R as ensure_array_like, O as stringify, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import './state.svelte-BCGVlO8d.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data, form } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const isEditor = derived(() => !!data.editing || store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("new") === "1");
    const isNew = derived(() => !data.editing && store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("new") === "1");
    let titleValue = "";
    let slugValue = "";
    let coverImage = "";
    let posterImage = "";
    let ctaUrl = "";
    let ctaText = "";
    let sourcePostId = "";
    let published = false;
    let slides = [];
    let barEnabled = !!data.enableStoriesBar;
    let filter = "all";
    let previewSlide = 0;
    let uploadingKey = null;
    let openSlide = 0;
    let publishMap = {};
    const publishedCount = derived(() => (data.stories || []).filter((s) => (publishMap[s.id] ?? s.published) === 1).length);
    const draftCount = derived(() => (data.stories || []).length - publishedCount());
    const filteredStories = derived(() => {
      const list = data.stories || [];
      return list;
    });
    const preview = derived(() => {
      const s = slides[previewSlide] || slides[0];
      const bg = s?.background_image || posterImage || coverImage || "";
      return {
        bg,
        title: s?.title || titleValue || t(lang(), "admin.web_stories.preview_title"),
        body: s?.body || "",
        cta: s?.cta_text || ctaText || t(lang(), "admin.web_stories.cta_ph")
      };
    });
    const bubbleSrc = derived(() => slides[0]?.background_image || "");
    const flash = derived(() => {
      const u = store_get($$store_subs ??= {}, "$page", page).url;
      if (u.searchParams.get("created")) return t(lang(), "admin.web_stories.created");
      if (u.searchParams.get("updated")) return t(lang(), "admin.web_stories.updated");
      if (u.searchParams.get("deleted")) return t(lang(), "admin.web_stories.deleted");
      if (u.searchParams.get("from_post")) return t(lang(), "admin.web_stories.from_post_ok");
      return "";
    });
    head("b79hax", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.web_stories.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div${attr_class("ws svelte-b79hax", void 0, { "editor-mode": isEditor() })}>`);
    if (flash()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="toast ok svelte-b79hax">${escape_html(flash())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.message) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="toast err svelte-b79hax">${escape_html(form.message)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!isEditor()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<header class="top svelte-b79hax"><h1 class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.heading"))}</h1> <div class="top-actions svelte-b79hax"><form method="POST" action="?/saveBarSetting" class="bar-mini svelte-b79hax"><label class="mini-switch svelte-b79hax"${attr("title", t(lang(), "admin.web_stories.bar_enable"))}><input type="checkbox" name="enable_web_stories_bar" value="1"${attr("checked", barEnabled, true)} class="svelte-b79hax"/> <span class="knob svelte-b79hax"></span></label> <span class="mini-label svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.bar_short"))}</span></form> <button type="button" class="btn ghost svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.from_post_short"))}</button> <a href="/admin/web-stories?new=1" class="btn primary svelte-b79hax">+ ${escape_html(t(lang(), "admin.web_stories.create_btn"))}</a></div></header> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="stats svelte-b79hax"><button type="button"${attr_class("stat svelte-b79hax", void 0, { "on": filter === "all" })}><b class="svelte-b79hax">${escape_html(data.stories.length)}</b><span class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.filter_all"))}</span></button> <button type="button"${attr_class("stat svelte-b79hax", void 0, { "on": filter === "live" })}><b class="live svelte-b79hax">${escape_html(publishedCount())}</b><span class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.filter_live"))}</span></button> <button type="button"${attr_class("stat svelte-b79hax", void 0, { "on": filter === "draft" })}><b class="svelte-b79hax">${escape_html(draftCount())}</b><span class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.filter_draft"))}</span></button></div> `);
      if (filteredStories().length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="empty svelte-b79hax"><div class="empty-visual svelte-b79hax"><span class="empty-ring svelte-b79hax"></span> <span class="empty-ring mid svelte-b79hax"></span> <span class="empty-ring sm svelte-b79hax"></span></div> <p>${escape_html(t(lang(), "admin.web_stories.empty_short"))}</p> <a href="/admin/web-stories?new=1" class="btn primary svelte-b79hax">+ ${escape_html(t(lang(), "admin.web_stories.create_btn"))}</a></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="grid svelte-b79hax"><!--[-->`);
        const each_array_1 = ensure_array_like(filteredStories());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let story = each_array_1[$$index_1];
          const isLive = (publishMap[story.id] ?? story.published) === 1;
          $$renderer2.push(`<article${attr_class("card svelte-b79hax", void 0, { "off": !isLive })}><a${attr("href", `/admin/web-stories?edit=${stringify(story.id)}`)} class="thumb svelte-b79hax">`);
          if (story.poster_portrait || story.cover_image) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<img${attr("src", story.poster_portrait || story.cover_image)} alt="" class="svelte-b79hax"/>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="ph svelte-b79hax">${escape_html((story.title || "?").charAt(0))}</span>`);
          }
          $$renderer2.push(`<!--]--> <span class="slide-n svelte-b79hax">${escape_html(story.slide_count ?? 0)}</span></a> <div class="card-body svelte-b79hax"><a${attr("href", `/admin/web-stories?edit=${stringify(story.id)}`)} class="name svelte-b79hax">${escape_html(story.title)}</a> <span class="slug svelte-b79hax">/stories/${escape_html(story.slug)}</span> <div class="card-foot svelte-b79hax"><form method="POST" action="?/togglePublish"><input type="hidden" name="id"${attr("value", story.id)} class="svelte-b79hax"/> <button type="submit"${attr_class("status svelte-b79hax", void 0, { "live": isLive })}><span class="dot svelte-b79hax"></span> ${escape_html(isLive ? t(lang(), "admin.web_stories.filter_live") : t(lang(), "admin.web_stories.filter_draft"))}</button></form> <div class="acts svelte-b79hax"><a${attr("href", `/admin/web-stories?edit=${stringify(story.id)}`)} class="ico svelte-b79hax"${attr("title", t(lang(), "admin.web_stories.edit_btn"))}>✎</a> <a${attr("href", `/stories/${stringify(story.slug)}`)} class="ico svelte-b79hax" target="_blank" rel="noopener" data-sveltekit-reload="">↗</a> <form method="POST" action="?/delete"><input type="hidden" name="id"${attr("value", story.id)} class="svelte-b79hax"/> <button type="submit" class="ico danger svelte-b79hax">🗑</button></form></div></div></div></article>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form method="POST"${attr("action", data.editing ? "?/update" : "?/create")} class="editor svelte-b79hax">`);
      if (data.editing) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<input type="hidden" name="id"${attr("value", data.editing.id)} class="svelte-b79hax"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <input type="hidden" name="cover_image"${attr("value", coverImage)} class="svelte-b79hax"/> <input type="hidden" name="poster_portrait"${attr("value", coverImage)} class="svelte-b79hax"/> <input type="hidden" name="cta_text"${attr("value", ctaText)} class="svelte-b79hax"/> <input type="hidden" name="source_post_id"${attr("value", sourcePostId)} class="svelte-b79hax"/> <div class="ed-bar svelte-b79hax"><div class="ed-bar-left svelte-b79hax"><a href="/admin/web-stories" class="back-link svelte-b79hax"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg> ${escape_html(t(lang(), "admin.web_stories.heading"))}</a> <span class="ed-title-sep svelte-b79hax">/</span> <span class="ed-title svelte-b79hax">${escape_html(isNew() ? t(lang(), "admin.web_stories.create") : t(lang(), "admin.web_stories.edit"))}</span></div> <div class="ed-bar-right svelte-b79hax"><label class="status-toggle svelte-b79hax"><input type="checkbox" name="published" value="1"${attr("checked", published, true)} class="svelte-b79hax"/> <span${attr_class("status-ui svelte-b79hax", void 0, { "live": published })}><span class="dot svelte-b79hax"></span> ${escape_html(t(lang(), "admin.web_stories.filter_draft"))}</span></label> `);
      if (data.editing) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `/stories/${stringify(data.editing.slug)}`)} class="btn ghost svelte-b79hax" target="_blank" rel="noopener" data-sveltekit-reload="">${escape_html(t(lang(), "admin.web_stories.preview"))}</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="btn primary svelte-b79hax"${attr("disabled", false, true)}>${escape_html(t(lang(), "admin.web_stories.save"))}</button></div></div> <div class="ed-layout svelte-b79hax"><div class="ed-main svelte-b79hax"><section class="panel svelte-b79hax"><div class="panel-label svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.section_basic"))}</div> <label class="field svelte-b79hax"><span class="lbl svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.field_title"))}</span> <input name="title" required=""${attr("value", titleValue)}${attr("placeholder", t(lang(), "admin.web_stories.title_ph"))} class="input-lg svelte-b79hax" autocomplete="off"/></label> <div class="fields-2 svelte-b79hax"><label class="field svelte-b79hax"><span class="lbl svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.field_slug"))}</span> <div class="prefix-input svelte-b79hax"><span class="svelte-b79hax">/stories/</span> <input name="slug"${attr("value", slugValue)} pattern="[a-z0-9\\-_]*" placeholder="auto" autocomplete="off" class="svelte-b79hax"/></div></label> <label class="field svelte-b79hax"><span class="lbl svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.field_cta_url"))}</span> <input name="cta_url"${attr("value", ctaUrl)} placeholder="/post/slug" class="svelte-b79hax"/></label></div></section> <section class="panel svelte-b79hax"><div class="panel-label svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.section_images"))}</div> <div class="media-row svelte-b79hax"><div${attr_class("drop svelte-b79hax", void 0, { "has": false })}><div class="drop-preview portrait svelte-b79hax">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="drop-empty svelte-b79hax"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg> <span>9:16</span></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="drop-meta svelte-b79hax"><strong class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.field_poster_short"))}</strong> <label class="btn ghost sm file svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.upload_btn"))} <input type="file" accept="image/*" hidden=""${attr("disabled", false, true)} class="svelte-b79hax"/></label></div></div> <div${attr_class("drop svelte-b79hax", void 0, { "has": false })}><div class="drop-preview bubble svelte-b79hax">`);
      if (bubbleSrc()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", bubbleSrc())} alt="" class="svelte-b79hax"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="drop-empty svelte-b79hax"><span>○</span></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="drop-meta svelte-b79hax"><strong class="svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.field_cover_short"))}</strong> <label class="btn ghost sm file svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.upload_btn"))} <input type="file" accept="image/*" hidden=""${attr("disabled", false, true)} class="svelte-b79hax"/></label></div></div></div> <button type="button" class="linkish svelte-b79hax">${escape_html("▸")} ${escape_html(t(lang(), "admin.web_stories.advanced"))}</button> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></section> <section class="panel svelte-b79hax"><div class="panel-head svelte-b79hax"><div class="panel-label svelte-b79hax" style="margin:0">${escape_html(t(lang(), "admin.web_stories.slides"))} · ${escape_html(slides.length)}</div> <button type="button" class="btn ghost sm svelte-b79hax"${attr("disabled", slides.length >= 12, true)}>+ ${escape_html(t(lang(), "admin.web_stories.add_slide"))}</button></div> <div class="slide-list svelte-b79hax"><!--[-->`);
      const each_array_3 = ensure_array_like(slides);
      for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
        let slide = each_array_3[i];
        $$renderer2.push(`<div${attr_class("slide svelte-b79hax", void 0, { "open": openSlide === i, "previewing": previewSlide === i })}><button type="button" class="slide-summary svelte-b79hax"><span class="slide-idx svelte-b79hax">${escape_html(i + 1)}</span> <span class="slide-thumb svelte-b79hax">`);
        if (slide.background_image || posterImage || coverImage) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<img${attr("src", slide.background_image || posterImage || coverImage)} alt="" class="svelte-b79hax"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="st-empty svelte-b79hax"></span>`);
        }
        $$renderer2.push(`<!--]--></span> <span class="slide-sum-text svelte-b79hax"><strong class="svelte-b79hax">${escape_html(slide.title || t(lang(), "admin.web_stories.slide_n", { n: String(i + 1) }))}</strong> `);
        if (slide.body) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<em class="svelte-b79hax">${escape_html(slide.body)}</em>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></span> <span class="chev svelte-b79hax">${escape_html(openSlide === i ? "▾" : "▸")}</span></button> `);
        if (openSlide === i) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="slide-body svelte-b79hax"><div class="slide-media-col svelte-b79hax"><div class="slide-media-preview svelte-b79hax">`);
          if (slide.background_image) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<img${attr("src", slide.background_image)} alt="" class="svelte-b79hax"/>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span>+</span>`);
          }
          $$renderer2.push(`<!--]--> `);
          if (uploadingKey === `slide-${i}`) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="drop-loading svelte-b79hax">…</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> <label class="btn ghost sm file full svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.upload_btn"))} <input type="file" accept="image/*" hidden=""${attr("disabled", false, true)} class="svelte-b79hax"/></label> <input type="hidden" name="slide_image"${attr("value", slide.background_image)} class="svelte-b79hax"/></div> <div class="slide-fields svelte-b79hax"><input name="slide_title"${attr("value", slide.title)}${attr("placeholder", t(lang(), "admin.web_stories.slide_title"))} maxlength="80" class="svelte-b79hax"/> <textarea name="slide_body" rows="3" maxlength="200"${attr("placeholder", t(lang(), "admin.web_stories.slide_body"))} class="svelte-b79hax">`);
          const $$body = escape_html(slide.body);
          if ($$body) {
            $$renderer2.push(`${$$body}`);
          }
          $$renderer2.push(`</textarea> <div class="fields-2 svelte-b79hax"><input name="slide_cta_url"${attr("value", slide.cta_url)} placeholder="CTA URL" class="svelte-b79hax"/> <input name="slide_cta_text"${attr("value", slide.cta_text)} placeholder="CTA" class="svelte-b79hax"/></div> <input type="url"${attr("value", slide.background_image)} placeholder="URL imagem" class="svelte-b79hax"/> <div class="slide-actions svelte-b79hax"><button type="button" class="ico svelte-b79hax"${attr("disabled", i === 0, true)} title="↑">↑</button> <button type="button" class="ico svelte-b79hax"${attr("disabled", i === slides.length - 1, true)} title="↓">↓</button> <button type="button" class="ico danger svelte-b79hax"${attr("disabled", slides.length <= 1, true)}${attr("title", t(lang(), "admin.web_stories.remove_slide"))}>🗑</button></div></div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="sr-only svelte-b79hax" aria-hidden="true"><input name="slide_title"${attr("value", slide.title)} class="svelte-b79hax"/> <textarea name="slide_body" class="svelte-b79hax">`);
          const $$body_1 = escape_html(slide.body);
          if ($$body_1) {
            $$renderer2.push(`${$$body_1}`);
          }
          $$renderer2.push(`</textarea> <input name="slide_image"${attr("value", slide.background_image)} class="svelte-b79hax"/> <input name="slide_cta_url"${attr("value", slide.cta_url)} class="svelte-b79hax"/> <input name="slide_cta_text"${attr("value", slide.cta_text)} class="svelte-b79hax"/></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></section> <div class="ed-footer svelte-b79hax"><a href="/admin/web-stories" class="btn ghost svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.cancel"))}</a> <button type="submit" class="btn primary svelte-b79hax"${attr("disabled", false, true)}>${escape_html(t(lang(), "admin.web_stories.save"))}</button></div></div> <aside class="ed-preview svelte-b79hax"><div class="phone svelte-b79hax"><div class="phone-notch svelte-b79hax"></div> <div class="phone-screen svelte-b79hax">`);
      if (preview().bg) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img class="phone-bg svelte-b79hax"${attr("src", preview().bg)} alt=""/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="phone-bg empty-bg svelte-b79hax"></div>`);
      }
      $$renderer2.push(`<!--]--> <div class="phone-grad svelte-b79hax"></div> <div class="phone-progress svelte-b79hax"><!--[-->`);
      const each_array_4 = ensure_array_like(slides);
      for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
        each_array_4[i];
        $$renderer2.push(`<button type="button"${attr_class("seg svelte-b79hax", void 0, { "on": i === previewSlide, "done": i < previewSlide })}></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="phone-content svelte-b79hax"><h3 class="svelte-b79hax">${escape_html(preview().title)}</h3> `);
      if (preview().body) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="svelte-b79hax">${escape_html(preview().body)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (preview().cta) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="phone-cta svelte-b79hax">${escape_html(preview().cta)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <p class="preview-hint svelte-b79hax">${escape_html(t(lang(), "admin.web_stories.preview_hint"))}</p> `);
      if (bubbleSrc()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bubble-preview svelte-b79hax"><span class="bp-ring svelte-b79hax"><img${attr("src", bubbleSrc())} alt="" class="svelte-b79hax"/></span> <span class="bp-label svelte-b79hax">${escape_html("Story")}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></aside></div></form>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D9indIb-.js.map
