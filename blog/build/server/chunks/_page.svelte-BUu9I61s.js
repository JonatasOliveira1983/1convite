import { G as head, Q as escape_html, R as ensure_array_like, J as attr, O as stringify, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import './state.svelte-BCGVlO8d.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang() === "en" ? "en-US" : lang() === "es" ? "es-ES" : "pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    function getStatusText(published) {
      return published ? t(lang(), "admin.ui.published") : t(lang(), "admin.ui.draft");
    }
    function formatChartDate(dateString) {
      const parts = dateString.split("-");
      if (parts.length < 3) return dateString;
      return `${parts[2]}/${parts[1]}`;
    }
    let chartWidth = 600;
    let chartHeight = 150;
    let paddingX = 30;
    let paddingY = 20;
    let points = derived(() => {
      const list = data.analytics?.viewsByDay || [];
      if (list.length === 0) return [];
      const maxVal = Math.max(...list.map((d) => d.count), 5);
      return list.map((d, i) => {
        const x = paddingX + i * (chartWidth - paddingX * 2) / (list.length - 1 || 1);
        const y = chartHeight - paddingY - d.count * (chartHeight - paddingY * 2) / maxVal;
        return { x, y, count: d.count, date: d.date };
      });
    });
    let pathD = derived(() => {
      if (points().length === 0) return "";
      return points().map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    });
    let areaD = derived(() => {
      if (points().length === 0) return "";
      const first = points()[0];
      const last = points()[points().length - 1];
      return `${pathD()} L ${last.x} ${chartHeight - paddingY} L ${first.x} ${chartHeight - paddingY} Z`;
    });
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(t(lang(), "admin.dash.title"))}</title>`);
      });
    });
    $$renderer2.push(`<div class="dashboard svelte-1jef3w8"><div class="dashboard-header svelte-1jef3w8"><h1 class="svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.heading"))}</h1> <a href="/admin/posts/new" class="btn btn-primary">${escape_html(t(lang(), "admin.dash.new_post"))}</a></div> <div class="stats-grid svelte-1jef3w8"><div class="stat-card svelte-1jef3w8"><div class="stat-icon svelte-1jef3w8"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1jef3w8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div> <div class="stat-info svelte-1jef3w8"><span class="stat-number svelte-1jef3w8">${escape_html(data.analytics?.viewsToday ?? 0)}</span> <span class="stat-label svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.views_today"))}</span></div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-icon svelte-1jef3w8"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1jef3w8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div> <div class="stat-info svelte-1jef3w8"><span class="stat-number svelte-1jef3w8">${escape_html(data.analytics?.viewsWeek ?? 0)}</span> <span class="stat-label svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.views_week"))}</span></div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-icon svelte-1jef3w8"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1jef3w8"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div> <div class="stat-info svelte-1jef3w8"><span class="stat-number svelte-1jef3w8">${escape_html(data.analytics?.totalViews ?? 0)}</span> <span class="stat-label svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.views_total"))}</span></div></div> <div class="stat-card svelte-1jef3w8"><div class="stat-icon svelte-1jef3w8"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1jef3w8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div> <div class="stat-info svelte-1jef3w8"><span class="stat-number svelte-1jef3w8">${escape_html(data.posts?.length ?? 0)}</span> <span class="stat-label svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.posts"))}</span></div></div> <div class="stat-card sitemap-card svelte-1jef3w8"><div class="stat-icon svelte-1jef3w8"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" class="svelte-1jef3w8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg></div> <div class="stat-info svelte-1jef3w8"><span class="stat-label svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.sitemap"))}</span> <div class="sitemap-url-wrapper svelte-1jef3w8"><input type="text" readonly="" value="/sitemap.xml" class="sitemap-input svelte-1jef3w8" id="sitemap-url"/> <button class="btn btn-small btn-copy svelte-1jef3w8">${escape_html(t(lang(), "admin.ui.copy"))}</button></div></div></div></div> <div class="chart-section svelte-1jef3w8"><div class="section-title-row svelte-1jef3w8"><div><h2 class="section-title svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.traffic"))}</h2> <p class="section-subtitle svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.last_7"))}</p></div></div> <div class="card chart-card svelte-1jef3w8">`);
    if (!data.analytics || data.analytics.viewsWeek === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-1jef3w8"><svg class="empty-icon svelte-1jef3w8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> <p class="svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.no_views"))}</p> <span class="empty-hint svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.no_views_hint"))}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="svg-wrapper svelte-1jef3w8"><svg viewBox="0 0 600 150" class="trend-chart svelte-1jef3w8" preserveAspectRatio="none"><defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"></stop><stop offset="100%" stop-color="#3b82f6" stop-opacity="0"></stop></linearGradient></defs><!--[-->`);
      const each_array = ensure_array_like([0, 0.25, 0.5, 0.75, 1]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let ratio = each_array[$$index];
        $$renderer2.push(`<line${attr("x1", paddingX)}${attr("y1", paddingY + ratio * (chartHeight - paddingY * 2))}${attr("x2", chartWidth - paddingX)}${attr("y2", paddingY + ratio * (chartHeight - paddingY * 2))} stroke="var(--border-light, rgba(0,0,0,0.06))" stroke-width="1" stroke-dasharray="4,4"></line>`);
      }
      $$renderer2.push(`<!--]--><path${attr("d", areaD())} fill="url(#chartGrad)"></path><path${attr("d", pathD())} fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><!--[-->`);
      const each_array_1 = ensure_array_like(points());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let pt = each_array_1[$$index_1];
        $$renderer2.push(`<g class="chart-point-group svelte-1jef3w8"><circle${attr("cx", pt.x)}${attr("cy", pt.y)} r="4" class="chart-point svelte-1jef3w8" fill="#3b82f6" stroke="white" stroke-width="2"></circle><circle${attr("cx", pt.x)}${attr("cy", pt.y)} r="12" fill="transparent" style="cursor:pointer"><title>${escape_html(formatChartDate(pt.date))}: ${escape_html(pt.count)} visitas</title></circle></g>`);
      }
      $$renderer2.push(`<!--]--></svg></div> <div class="chart-labels svelte-1jef3w8"><!--[-->`);
      const each_array_2 = ensure_array_like(points());
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let pt = each_array_2[$$index_2];
        $$renderer2.push(`<span class="chart-label-item svelte-1jef3w8"><span class="date svelte-1jef3w8">${escape_html(formatChartDate(pt.date))}</span> <span class="val svelte-1jef3w8">${escape_html(pt.count)}</span></span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="lists-grid svelte-1jef3w8"><div class="card list-card svelte-1jef3w8"><div class="list-header svelte-1jef3w8"><h2 class="list-title svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.recent_posts"))}</h2> <a href="/admin/posts" class="list-link svelte-1jef3w8">${escape_html(t(lang(), "admin.ui.view_all"))}</a></div> `);
    if (!data.posts || data.posts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-1jef3w8"><svg class="empty-icon svelte-1jef3w8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <p class="svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.no_posts"))}</p> <a href="/admin/posts/new" class="btn btn-primary">${escape_html(t(lang(), "admin.dash.create_first"))}</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="posts-list svelte-1jef3w8"><!--[-->`);
      const each_array_3 = ensure_array_like(data.posts.slice(0, 5));
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let post = each_array_3[$$index_3];
        $$renderer2.push(`<a${attr("href", `/admin/posts/${stringify(post.id)}`)} class="post-row svelte-1jef3w8"><div class="post-info svelte-1jef3w8"><span class="post-title svelte-1jef3w8">${escape_html(post.title)}</span> <span class="post-meta svelte-1jef3w8">${escape_html(formatDate(post.created_at))}</span></div> <span${attr_class("status svelte-1jef3w8", void 0, { "published": post.published, "draft": !post.published })}>${escape_html(getStatusText(post.published))}</span></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="card list-card svelte-1jef3w8"><div class="list-header svelte-1jef3w8"><h2 class="list-title svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.top_read"))}</h2> <span class="list-link-muted svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.top5"))}</span></div> `);
    if (!data.analytics?.topPosts || data.analytics.topPosts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state svelte-1jef3w8"><svg class="empty-icon svelte-1jef3w8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> <p class="svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.no_read_data"))}</p> <span class="empty-hint svelte-1jef3w8">${escape_html(t(lang(), "admin.dash.no_read_hint"))}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="posts-list svelte-1jef3w8"><!--[-->`);
      const each_array_4 = ensure_array_like(data.analytics.topPosts);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let post = each_array_4[$$index_4];
        $$renderer2.push(`<a${attr("href", `/admin/posts/${stringify(post.id)}`)} class="post-row svelte-1jef3w8"><div class="post-info svelte-1jef3w8"><span class="post-title svelte-1jef3w8">${escape_html(post.title)}</span> <span class="post-meta svelte-1jef3w8">/${escape_html(post.slug)}</span></div> <div class="views-badge svelte-1jef3w8"><span class="views-count svelte-1jef3w8">${escape_html(post.views)}</span> <span class="views-lbl svelte-1jef3w8">views</span></div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BUu9I61s.js.map
