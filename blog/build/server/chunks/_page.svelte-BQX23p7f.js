import { G as head, X as attr_style, Q as escape_html, J as attr, O as stringify, R as ensure_array_like, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t, f as formatMoney } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const displayCurrency = derived(() => store_get($$store_subs ??= {}, "$page", page).data.displayCurrency || "BRL");
    let activeLesson = data.selectedLesson;
    let sidebarOpen = false;
    const groupedLessons = derived(() => () => {
      const groups = [];
      for (const lesson of data.lessons) {
        const topic = lesson.topic || null;
        const last = groups[groups.length - 1];
        if (last && last.topic === topic) {
          last.lessons.push(lesson);
        } else {
          groups.push({ topic, lessons: [lesson] });
        }
      }
      return groups;
    });
    const lessonIndex = derived(() => data.lessons.findIndex((l) => l.id === activeLesson?.id));
    const prevLesson = derived(() => lessonIndex() > 0 ? data.lessons[lessonIndex() - 1] : null);
    const nextLesson = derived(() => lessonIndex() < data.lessons.length - 1 ? data.lessons[lessonIndex() + 1] : null);
    function formatPrice(cents) {
      return formatMoney(lang(), cents, displayCurrency());
    }
    head("lg0zo0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.course.title)} | ${escape_html(t(lang(), "members.area_title"))}</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex"/>`);
    });
    $$renderer2.push(`<div class="course-page svelte-lg0zo0"><div class="course-hero svelte-lg0zo0"${attr_style(data.course.cover_image ? `--hero-bg: url('${data.course.cover_image}')` : "")}><div class="hero-overlay svelte-lg0zo0"><div class="hero-content svelte-lg0zo0"><a href="/members/area" class="back-pill svelte-lg0zo0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> ${escape_html(t(lang(), "members.area_title"))}</a> <h1 class="svelte-lg0zo0">${escape_html(data.course.title)}</h1> `);
    if (data.course.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="hero-desc svelte-lg0zo0">${escape_html(data.course.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="hero-stats svelte-lg0zo0"><span class="stat svelte-lg0zo0"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> ${escape_html(t(lang(), "members.lessons_n", { n: String(data.lessons.length) }))}</span> `);
    if (data.materials.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="stat svelte-lg0zo0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg> ${escape_html(t(lang(), "members.materials_n", { n: String(data.materials.length) }))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.hasAccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="stat access-badge svelte-lg0zo0"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(t(lang(), "members.full_access"))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></div> `);
    if (!data.hasAccess) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="paywall-wrap svelte-lg0zo0"><div class="paywall-card svelte-lg0zo0"><div class="paywall-lock svelte-lg0zo0"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg></div> <h2 class="svelte-lg0zo0">${escape_html(t(lang(), "members.exclusive"))}</h2> `);
      if (data.course.access_type === "paid") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="svelte-lg0zo0">${html(t(lang(), "members.course_paid_desc", { price: formatPrice(data.course.price_cents) }))}</p> <div class="paywall-actions svelte-lg0zo0"><a${attr("href", `/api/members/course/${stringify(data.course.id)}/purchase`)} class="btn-buy svelte-lg0zo0" target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> ${escape_html(t(lang(), "members.buy_for", { price: formatPrice(data.course.price_cents) }))}</a> <a href="/premium" class="btn-premium svelte-lg0zo0">${escape_html(t(lang(), "members.view_plans"))}</a></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="svelte-lg0zo0">${escape_html(t(lang(), "members.course_premium_only"))}</p> <a href="/premium" class="btn-buy svelte-lg0zo0"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ${escape_html(t(lang(), "members.view_plans"))}</a>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.lessons.some((l) => l.is_preview)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="preview-block svelte-lg0zo0"><h3 class="svelte-lg0zo0">${escape_html(t(lang(), "members.free_previews_title"))}</h3> <div class="preview-list svelte-lg0zo0"><!--[-->`);
        const each_array = ensure_array_like(data.lessons.filter((l) => l.is_preview));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let lesson = each_array[$$index];
          $$renderer2.push(`<button class="preview-lesson-btn svelte-lg0zo0"><span class="plb-icon svelte-lg0zo0"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span> <span class="plb-title svelte-lg0zo0">${escape_html(lesson.title)}</span> <span class="plb-tag svelte-lg0zo0">Preview</span></button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="main-layout svelte-lg0zo0"><button class="mobile-toggle svelte-lg0zo0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg> ${escape_html(t(lang(), "members.course_content"))}</button> <aside${attr_class("course-sidebar svelte-lg0zo0", void 0, { "open": sidebarOpen })}><div class="sidebar-top svelte-lg0zo0"><div class="sidebar-title svelte-lg0zo0">Conteúdo</div> <span class="sidebar-count svelte-lg0zo0">${escape_html(data.lessons.length)} aulas</span></div> <div class="timeline svelte-lg0zo0"><!--[-->`);
      const each_array_1 = ensure_array_like(groupedLessons()());
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let group = each_array_1[$$index_2];
        if (group.topic) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="timeline-module svelte-lg0zo0"><span class="module-line svelte-lg0zo0"></span> <span class="module-label svelte-lg0zo0">${escape_html(group.topic)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_2 = ensure_array_like(group.lessons);
        for (let li = 0, $$length2 = each_array_2.length; li < $$length2; li++) {
          let lesson = each_array_2[li];
          const isActive = activeLesson?.id === lesson.id;
          const isLocked = !lesson.is_preview && !data.hasAccess;
          $$renderer2.push(`<button${attr_class("timeline-lesson svelte-lg0zo0", void 0, { "active": isActive, "locked": isLocked })}><div class="tl-dot-col svelte-lg0zo0"><div${attr_class("tl-line top svelte-lg0zo0", void 0, {
            "invisible": group.topic === null && li === 0 && groupedLessons()().indexOf(group) === 0
          })}></div> <div${attr_class("tl-dot svelte-lg0zo0", void 0, { "active": isActive })}>`);
          if (isActive) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`);
          } else if (isLocked) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="currentColor" stroke-width="2"></path></svg>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="tl-num svelte-lg0zo0">${escape_html(data.lessons.indexOf(lesson) + 1)}</span>`);
          }
          $$renderer2.push(`<!--]--></div> <div class="tl-line bottom svelte-lg0zo0"></div></div> <div class="tl-info svelte-lg0zo0"><span class="tl-title svelte-lg0zo0">${escape_html(lesson.title)}</span> <div class="tl-badges svelte-lg0zo0">`);
          if (lesson.has_video) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="tl-badge video svelte-lg0zo0"><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Vídeo</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (lesson.is_preview) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="tl-badge preview svelte-lg0zo0">Free</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></div></button>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.materials.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="sidebar-materials svelte-lg0zo0"><div class="mat-header svelte-lg0zo0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg> ${escape_html(t(lang(), "members.course_materials"))}</div> <!--[-->`);
        const each_array_3 = ensure_array_like(data.materials);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let mat = each_array_3[$$index_3];
          $$renderer2.push(`<a${attr("href", mat.file_url)} target="_blank" rel="noopener" class="mat-link svelte-lg0zo0" download=""><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> ${escape_html(mat.title)} `);
          if (mat.file_type) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="mat-ext svelte-lg0zo0">.${escape_html(mat.file_type)}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></a>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></aside> <main class="lesson-main svelte-lg0zo0">`);
      if (activeLesson) {
        $$renderer2.push("<!--[0-->");
        if (activeLesson.has_video) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="video-player svelte-lg0zo0">`);
          {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="lesson-header svelte-lg0zo0"><div class="lesson-header-top svelte-lg0zo0"><h2 class="svelte-lg0zo0">${escape_html(activeLesson.title)}</h2> `);
        if (activeLesson.is_preview && !data.hasAccess) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-preview-inline svelte-lg0zo0">${escape_html(t(lang(), "members.free_preview"))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        if (activeLesson.topic) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="lesson-topic-label svelte-lg0zo0">${escape_html(activeLesson.topic)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        if (activeLesson.content) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="lesson-body svelte-lg0zo0">${html(activeLesson.content)}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="lesson-nav svelte-lg0zo0">`);
        if (prevLesson()) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="nav-btn prev svelte-lg0zo0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg> <div class="nav-text svelte-lg0zo0"><span class="nav-label svelte-lg0zo0">${escape_html(t(lang(), "common.previous"))}</span> <span class="nav-title svelte-lg0zo0">${escape_html(prevLesson().title)}</span></div></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div></div>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (nextLesson()) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="nav-btn next svelte-lg0zo0"><div class="nav-text svelte-lg0zo0"><span class="nav-label svelte-lg0zo0">${escape_html(t(lang(), "common.next"))}</span> <span class="nav-title svelte-lg0zo0">${escape_html(nextLesson().title)}</span></div> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="course-completed svelte-lg0zo0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ${escape_html(t(lang(), "members.course_done"))}</div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="empty-state svelte-lg0zo0"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" class="svelte-lg0zo0"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <p class="svelte-lg0zo0">${escape_html(t(lang(), "members.select_lesson"))}</p></div>`);
      }
      $$renderer2.push(`<!--]--></main></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BQX23p7f.js.map
