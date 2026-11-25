import { J as attr, Q as escape_html, R as ensure_array_like, I as attr_class, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';

/* empty css                                         */
function Pagination($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      currentPage = 1,
      totalPages = 1,
      maxButtons = 5,
      baseUrl = ""
    } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    let pages = derived(() => generatePages(currentPage, totalPages, maxButtons));
    function generatePages(current, total, max) {
      if (total <= max) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const half = Math.floor(max / 2);
      let start = Math.max(current - half, 1);
      let end = Math.min(start + max - 1, total);
      if (end - start < max - 1) {
        start = Math.max(end - max + 1, 1);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    function getUrl(page2) {
      if (!baseUrl) return `?page=${page2}`;
      try {
        const url = new URL(baseUrl);
        url.searchParams.set("page", page2.toString());
        return url.pathname + url.search;
      } catch {
        try {
          const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
          const url = new URL(baseUrl, base);
          url.searchParams.set("page", page2.toString());
          return url.pathname + url.search;
        } catch {
          return `?page=${page2}`;
        }
      }
    }
    if (totalPages > 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<nav class="pagination svelte-14nrfpk"${attr("aria-label", t(lang(), "pagination.aria"))}>`);
      if (currentPage > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", getUrl(currentPage - 1))} class="pagination-btn prev svelte-14nrfpk"${attr("aria-label", t(lang(), "pagination.prev_page"))}><svg viewBox="0 0 20 20" fill="currentColor" class="svelte-14nrfpk"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="svelte-14nrfpk">${escape_html(t(lang(), "pagination.prev"))}</span></a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="pagination-pages svelte-14nrfpk"><!--[-->`);
      const each_array = ensure_array_like(pages());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let page2 = each_array[$$index];
        if (page2 === 1 && !pages().includes(1)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", getUrl(1))}${attr_class("pagination-page svelte-14nrfpk", void 0, { "active": page2 === currentPage })}>1</a> <span class="pagination-ellipsis svelte-14nrfpk">...</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (page2 !== 1 && page2 !== totalPages) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", getUrl(page2))}${attr_class("pagination-page svelte-14nrfpk", void 0, {
            "active": page2 === currentPage,
            "current": page2 === currentPage
          })}>${escape_html(page2)}</a>`);
        } else if (page2 === totalPages && !pages().includes(totalPages)) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="pagination-ellipsis svelte-14nrfpk">...</span> <a${attr("href", getUrl(totalPages))}${attr_class("pagination-page svelte-14nrfpk", void 0, { "active": page2 === currentPage })}>${escape_html(totalPages)}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<a${attr("href", getUrl(page2))}${attr_class("pagination-page svelte-14nrfpk", void 0, { "active": page2 === currentPage })}>${escape_html(page2)}</a>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (currentPage < totalPages) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", getUrl(currentPage + 1))} class="pagination-btn next svelte-14nrfpk"${attr("aria-label", t(lang(), "pagination.next_page"))}><span class="svelte-14nrfpk">${escape_html(t(lang(), "pagination.next"))}</span> <svg viewBox="0 0 20 20" fill="currentColor" class="svelte-14nrfpk"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></nav> <div class="pagination-info svelte-14nrfpk">${escape_html(t(lang(), "common.page_of", { current: currentPage, total: totalPages }))}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { Pagination as P };
//# sourceMappingURL=Pagination-DH52TBvr.js.map
