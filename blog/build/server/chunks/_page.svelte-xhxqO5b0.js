import { L as store_get, G as head, J as attr, Q as escape_html, I as attr_class, O as stringify, X as attr_style, R as ensure_array_like, T as unsubscribe_stores, K as derived } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { g as getDefaultLandingBlocks, L as LandingPageHeader, a as LandingBlockTree, u as uid, c as createBlock } from './LandingPageHeader-BW8A_3HX.js';
import './state.svelte-BCGVlO8d.js';
import './html-FW6Ia4bL.js';

function acceptsLandingChildren(type) {
  return type === "section" || type === "container" || type === "column";
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    const products = derived(() => data.products || []);
    const posts = derived(() => data.posts || []);
    function tr(key, fallback) {
      const path = `admin.landing_pages.builder.${key}`;
      const value = t(lang(), path);
      return !value || value === path ? fallback : value;
    }
    let pageTitle = data.landingPage.title;
    let pageSlug = data.landingPage.slug;
    let pageStatus = data.landingPage.status || "draft";
    function normalizeHeaderSettings(raw = {}) {
      const links = Array.isArray(raw.headerLinks) ? raw.headerLinks.map((l) => ({
        id: l.id || uid("nav"),
        label: l.label || "",
        href: l.href || "#"
      })) : [];
      return {
        showHeader: raw.showHeader === true || raw.showHeader === 1,
        headerLogo: raw.headerLogo || "",
        headerLinks: links,
        headerCtaEnabled: raw.headerCtaEnabled !== false && raw.headerCtaEnabled !== 0,
        headerCtaText: raw.headerCtaText || "",
        headerCtaHref: raw.headerCtaHref || "#"
      };
    }
    const savedSettings = (() => {
      try {
        return data.landingPage.settings ? JSON.parse(data.landingPage.settings) : {};
      } catch {
        return {};
      }
    })();
    let pageSettings = {
      seoTitle: "",
      seoDesc: "",
      socialImage: "",
      containerWidth: "1200px",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      ...savedSettings,
      ...normalizeHeaderSettings(savedSettings)
    };
    const initialLang = store_get($$store_subs ??= {}, "$page", page).data.language || "pt";
    let blocks = data.landingPage.content && data.landingPage.content !== "[]" ? JSON.parse(data.landingPage.content) : getDefaultLandingBlocks(initialLang);
    let history = [JSON.stringify(blocks)];
    let historyIndex = 0;
    function pushHistory() {
      const currentState = JSON.stringify(blocks);
      if (history[historyIndex] === currentState) return;
      history = history.slice(0, historyIndex + 1);
      history.push(currentState);
      historyIndex = history.length - 1;
    }
    let selectedBlockId = null;
    let selectedBlock = derived(() => findBlockById(blocks, selectedBlockId));
    function findBlockById(arr, id) {
      if (!id) return null;
      for (const item of arr) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findBlockById(item.children, id);
          if (found) return found;
        }
      }
      return null;
    }
    let leftSubTab = "blocks";
    let rightTab = "page";
    let deviceMode = "desktop";
    let saving = false;
    let isEditingVisual = true;
    let rightSidebarWidth = 340;
    let isResizing = false;
    let dragSession = null;
    let dropTargetId = null;
    let dropPosition = null;
    let canvasDragOver = false;
    function acceptsChildren(type) {
      return acceptsLandingChildren(type);
    }
    function isRootSectionType(type) {
      return type === "section" || type === "cta_section" || type === "testimonials" || type === "pricing" || type === "faq_section" || type === "product_cta";
    }
    function isDescendantOf(ancestorId, nodeId) {
      const ancestor = findBlockById(blocks, ancestorId);
      if (!ancestor?.children) return false;
      if (findBlockById(ancestor.children, nodeId)) return true;
      return false;
    }
    function findParentList(arr, id, parent = null) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return { list: arr, index: i, parent };
        if (arr[i].children) {
          const found = findParentList(arr[i].children, id, arr[i]);
          if (found) return found;
        }
      }
      return null;
    }
    function extractBlockById(arr, id) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          const [removed] = arr.splice(i, 1);
          return removed;
        }
        if (arr[i].children) {
          const removed = extractBlockById(arr[i].children, id);
          if (removed) return removed;
        }
      }
      return null;
    }
    function insertRelative(targetId, position, block) {
      if (!targetId || position === "inside") {
        if (targetId) {
          const parent = findBlockById(blocks, targetId);
          if (parent && acceptsChildren(parent.type)) {
            if (!parent.children) parent.children = [];
            if (block.type === "section" && parent.type !== "section") ;
            if (block.type === "section" && parent.type === "section") {
              blocks.push(block);
              return;
            }
            parent.children.push(block);
            return;
          }
        }
        blocks.push(block);
        return;
      }
      const loc = findParentList(blocks, targetId);
      if (!loc) {
        blocks.push(block);
        return;
      }
      const insertAt = position === "before" ? loc.index : loc.index + 1;
      loc.list.splice(insertAt, 0, block);
    }
    function clearDropMarkers() {
      if (typeof document === "undefined") return;
      document.querySelectorAll(".lp-shell.lp-drop-before, .lp-shell.lp-drop-after, .lp-shell.lp-drop-inside").forEach((el) => {
        el.classList.remove("lp-drop-before", "lp-drop-after", "lp-drop-inside");
      });
      document.querySelectorAll(".builder-canvas-wrapper.is-drag-over, .canvas-tree-wrap.drop-active").forEach((el) => {
        el.classList.remove("is-drag-over", "drop-active");
      });
      document.querySelectorAll(".canvas-drop-banner").forEach((el) => el.remove());
    }
    function clearDragState() {
      dragSession = null;
      dropTargetId = null;
      dropPosition = null;
      canvasDragOver = false;
      clearDropMarkers();
      if (typeof document !== "undefined") {
        document.body.classList.remove("lp-dnd-active");
        document.querySelectorAll(".lp-is-dragging").forEach((n) => n.classList.remove("lp-is-dragging"));
        document.querySelectorAll(".is-palette-dragging").forEach((n) => n.classList.remove("is-palette-dragging"));
      }
    }
    function setDropMarker(targetId, position) {
      if (dropTargetId === targetId && dropPosition === position) return;
      dropTargetId = targetId;
      dropPosition = position;
      clearDropMarkers();
      if (!targetId || !position || typeof document === "undefined") return;
      const el = document.querySelector(`[data-block-id="${CSS.escape(String(targetId))}"]`);
      if (el) el.classList.add(`lp-drop-${position}`);
    }
    function setCanvasDropActive(active) {
      canvasDragOver = active;
      if (typeof document === "undefined") return;
      document.querySelectorAll(".builder-canvas-wrapper").forEach((el) => {
        el.classList.toggle("is-drag-over", active);
      });
      document.querySelectorAll(".canvas-tree-wrap").forEach((el) => {
        el.classList.toggle("drop-active", active);
      });
      {
        document.querySelectorAll(".canvas-drop-banner").forEach((el) => el.remove());
      }
    }
    function readDragSession(e) {
      if (dragSession) return dragSession;
      try {
        const raw = e?.dataTransfer?.getData("application/x-lp-drag");
        if (raw) return JSON.parse(raw);
        const plain = e?.dataTransfer?.getData("text/plain") || "";
        if (plain.startsWith("palette:")) return { kind: "palette", type: plain.slice(8) };
        if (plain.startsWith("block:")) return { kind: "block", id: plain.slice(6) };
      } catch {
      }
      return null;
    }
    function handleBlockDragStart(id, e) {
      dragSession = { kind: "block", id };
      if (typeof document !== "undefined") document.body.classList.add("lp-dnd-active");
      if (e?.dataTransfer) {
        try {
          e.dataTransfer.setData("text/plain", `block:${id}`);
          e.dataTransfer.setData("application/x-lp-drag", JSON.stringify(dragSession));
        } catch {
        }
        e.dataTransfer.effectAllowed = "move";
      }
    }
    function handleDragOverTarget(targetId, position, e) {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setDropMarker(targetId, position);
      if (canvasDragOver) setCanvasDropActive(false);
      if (e?.dataTransfer) {
        e.dataTransfer.dropEffect = dragSession?.kind === "block" ? "move" : "copy";
      }
    }
    function handleTreeDrop(targetId, position, e) {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      applyDrop(targetId, position, e);
    }
    function applyDrop(targetId, position, e = null) {
      const payload = readDragSession(e);
      if (!payload) {
        clearDragState();
        return;
      }
      if (payload.kind === "palette") {
        const type = payload.type;
        const newElem = createBlock(type, lang());
        if (isRootSectionType(type) || newElem.type === "section") {
          if (targetId && (position === "before" || position === "after")) {
            insertRelative(targetId, position, newElem);
          } else {
            blocks = [...blocks, newElem];
          }
        } else if (targetId && position === "inside") {
          const parent = findBlockById(blocks, targetId);
          if (parent && acceptsChildren(parent.type)) {
            if (!parent.children) parent.children = [];
            parent.children.push(newElem);
            blocks = [...blocks];
          } else {
            insertRelative(targetId, position === "before" ? "before" : "after", newElem);
          }
        } else if (targetId) {
          insertRelative(targetId, position, newElem);
        } else {
          const lastSection = [...blocks].reverse().find((b) => b.type === "section");
          if (lastSection) {
            if (!lastSection.children) lastSection.children = [];
            lastSection.children.push(newElem);
            blocks = [...blocks];
          } else {
            const sec = createBlock("section", lang());
            sec.children = [newElem];
            blocks = [...blocks, sec];
          }
        }
        blocks = [...blocks];
        selectedBlockId = newElem.id;
        rightTab = "block";
        pushHistory();
        clearDragState();
        return;
      }
      const movingId = payload.id;
      if (!movingId || movingId === targetId) {
        clearDragState();
        return;
      }
      if (targetId && isDescendantOf(movingId, targetId)) {
        clearDragState();
        return;
      }
      const moved = extractBlockById(blocks, movingId);
      if (!moved) {
        clearDragState();
        return;
      }
      if (!targetId) {
        blocks = [...blocks, moved];
      } else if (position === "inside") {
        const parent = findBlockById(blocks, targetId);
        if (parent && acceptsChildren(parent.type) && moved.type !== "section") {
          if (!parent.children) parent.children = [];
          parent.children.push(moved);
        } else {
          insertRelative(targetId, "after", moved);
        }
      } else {
        insertRelative(targetId, position, moved);
      }
      blocks = [...blocks];
      selectedBlockId = movingId;
      rightTab = "block";
      pushHistory();
      clearDragState();
    }
    function handleDragEnd() {
      setTimeout(
        () => {
          clearDragState();
          setTimeout(
            () => {
            },
            80
          );
        },
        0
      );
    }
    function linkProductToSelected(productId) {
      if (!selectedBlock()) return;
      const id = productId ? parseInt(productId) : null;
      const prod = products().find((p) => p.id === id);
      if (!selectedBlock().properties) selectedBlock().properties = {};
      if (prod) {
        selectedBlock().properties.productId = prod.id;
        selectedBlock().properties.productSlug = prod.slug;
        const href = `/product/${prod.slug}`;
        if (selectedBlock().type === "button") {
          selectedBlock().properties.href = href;
        } else if (selectedBlock().type === "cta") {
          selectedBlock().properties.buttonHref = href;
        } else if (selectedBlock().type === "pricing") {
          selectedBlock().properties.buttonHref = href;
        } else if (selectedBlock().type === "product-showcase") {
          selectedBlock().properties.name = prod.name;
          selectedBlock().properties.description = prod.description || "";
          selectedBlock().properties.image = prod.image_url || "";
          selectedBlock().properties.imageAlt = prod.name;
          selectedBlock().properties.price = new Intl.NumberFormat(lang() === "en" ? "en-US" : "pt-BR", { style: "currency", currency: "BRL" }).format((prod.price_cents || 0) / 100);
          selectedBlock().properties.buttonHref = href;
        }
      } else {
        selectedBlock().properties.productId = null;
        selectedBlock().properties.productSlug = null;
      }
      pushHistory();
    }
    function deleteBlock(id) {
      function removeRecursive(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr.splice(i, 1);
            return true;
          }
          if (arr[i].children) {
            const removed = removeRecursive(arr[i].children);
            if (removed) return true;
          }
        }
        return false;
      }
      removeRecursive(blocks);
      if (selectedBlockId === id) {
        selectedBlockId = null;
        rightTab = "page";
      }
      pushHistory();
    }
    function duplicateBlock(id) {
      if (!id) return;
      function duplicateRecursive(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            let regenerateIds = function(block) {
              block.id = uid(block.type);
              if (block.children && Array.isArray(block.children)) {
                block.children.forEach(regenerateIds);
              }
            };
            const clone = JSON.parse(JSON.stringify(arr[i]));
            regenerateIds(clone);
            arr.splice(i + 1, 0, clone);
            return clone.id;
          }
          if (arr[i].children && Array.isArray(arr[i].children)) {
            const newId2 = duplicateRecursive(arr[i].children);
            if (newId2) return newId2;
          }
        }
        return null;
      }
      const newId = duplicateRecursive(blocks);
      if (newId) {
        selectedBlockId = newId;
        pushHistory();
      }
    }
    function moveBlock(id, direction) {
      function moveRecursive(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            if (direction === "up" && i > 0) {
              const temp = arr[i];
              arr[i] = arr[i - 1];
              arr[i - 1] = temp;
              return true;
            }
            if (direction === "down" && i < arr.length - 1) {
              const temp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = temp;
              return true;
            }
            return false;
          }
          if (arr[i].children) {
            const moved = moveRecursive(arr[i].children);
            if (moved) return true;
          }
        }
        return false;
      }
      moveRecursive(blocks);
      pushHistory();
    }
    head("13m5q3l", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Builder | ${escape_html(pageTitle)}</title>`);
      });
    });
    $$renderer2.push(`<div class="builder-root svelte-13m5q3l"><header class="builder-topbar svelte-13m5q3l"><div class="topbar-left svelte-13m5q3l"><a href="/admin/landing-pages" class="back-link svelte-13m5q3l"${attr("title", t(lang(), "admin.landing_pages.builder.back"))}><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></a> <span class="breadcrumb-txt svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.title"))}</span> <span class="divider svelte-13m5q3l">/</span> <input type="text" class="topbar-title-input svelte-13m5q3l"${attr("value", pageTitle)}/></div> <div class="topbar-center svelte-13m5q3l"><button${attr_class("device-btn svelte-13m5q3l", void 0, { "active": deviceMode === "desktop" })}${attr("title", t(lang(), "admin.landing_pages.builder.desktop"))}><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.11 1.2a.75.75 0 01-.74.8h-4.3a.75.75 0 01-.74-.8l.11-1.2H5a2 2 0 01-2-2V5zm2-.5a.5.5 0 00-.5.5v7.5a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V5a.5.5 0 00-.5-.5H5z" clip-rule="evenodd"></path></svg></button> <button${attr_class("device-btn svelte-13m5q3l", void 0, { "active": deviceMode === "mobile" })}${attr("title", t(lang(), "admin.landing_pages.builder.mobile"))}><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 1.5h6a.5.5 0 01.5.5v11a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5zM10 15a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg></button></div> <div class="topbar-right svelte-13m5q3l"><button class="history-btn svelte-13m5q3l"${attr("disabled", historyIndex === 0, true)}${attr("title", t(lang(), "admin.landing_pages.builder.undo"))}><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H11a5 5 0 110 10H9a1 1 0 110-2h2a3 3 0 100-6H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg></button> <button class="history-btn svelte-13m5q3l"${attr("disabled", historyIndex === history.length - 1, true)}${attr("title", t(lang(), "admin.landing_pages.builder.redo"))}><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H9a5 5 0 110-10h2a1 1 0 110 2H9a3 3 0 100 6h5.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button> `);
    $$renderer2.select(
      { class: "status-select", value: pageStatus, title: "Status" },
      ($$renderer3) => {
        $$renderer3.option({ value: "draft" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.landing_pages.draft"))}`);
        });
        $$renderer3.option({ value: "published" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(t(lang(), "admin.landing_pages.published"))}`);
        });
      },
      "svelte-13m5q3l"
    );
    $$renderer2.push(` <a${attr("href", `/p/${stringify(pageSlug)}`)} target="_blank" rel="noopener noreferrer" class="preview-btn svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.preview"))}</a> <button class="save-btn svelte-13m5q3l"${attr("disabled", saving, true)}>${escape_html(t(lang(), "admin.landing_pages.save"))}</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></header> <div class="builder-workspace svelte-13m5q3l"><aside class="left-sidebar svelte-13m5q3l"><div class="sidebar-tabs svelte-13m5q3l"><button class="tab-btn active svelte-13m5q3l" type="button">${escape_html(t(lang(), "admin.landing_pages.builder.elements"))}</button></div> <div class="sidebar-subtabs svelte-13m5q3l"><button${attr_class("subtab-btn svelte-13m5q3l", void 0, { "active": leftSubTab === "blocks" })}>${escape_html(t(lang(), "admin.landing_pages.builder.blocks"))}</button> <button${attr_class("subtab-btn svelte-13m5q3l", void 0, { "active": leftSubTab === "components" })}>${escape_html(t(lang(), "admin.landing_pages.builder.components"))}</button></div> <p class="dnd-hint svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.dnd_hint"))}</p> <div class="elements-group-list svelte-13m5q3l">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="group-title svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.group_basic"))}</span> <div class="elements-grid svelte-13m5q3l"><div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_section"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_text"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_image"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M12 14l3-3-3-3"></path></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_button"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><path d="M10 8l6 3-6 3V8z"></path></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_video"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_divider"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 17 12 21 16 17"></polyline><polyline points="8 7 12 3 16 7"></polyline><line x1="12" y1="3" x2="12" y2="21"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_spacer"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></span> <span class="elem-name svelte-13m5q3l">HTML</span></div></div> <span class="group-title svelte-13m5q3l" style="margin-top: 1.25rem;">Premium</span> <div class="elements-grid premium-elements svelte-13m5q3l"><div class="element-item svelte-13m5q3l" role="button" tabindex="0" draggable="true"><span class="elem-icon svelte-13m5q3l">✦</span><span class="elem-name svelte-13m5q3l">Hero premium</span></div> <div class="element-item svelte-13m5q3l" role="button" tabindex="0" draggable="true"><span class="elem-icon svelte-13m5q3l">◈</span><span class="elem-name svelte-13m5q3l">Produto</span></div> <div class="element-item svelte-13m5q3l" role="button" tabindex="0" draggable="true"><span class="elem-icon svelte-13m5q3l">☷</span><span class="elem-name svelte-13m5q3l">Posts</span></div> <div class="element-item svelte-13m5q3l" role="button" tabindex="0" draggable="true"><span class="elem-icon svelte-13m5q3l">✓</span><span class="elem-name svelte-13m5q3l">Confiança</span></div></div> <span class="group-title svelte-13m5q3l" style="margin-top: 1.25rem;">${escape_html(t(lang(), "admin.landing_pages.builder.group_structure"))}</span> <div class="elements-grid svelte-13m5q3l"><div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_cols2"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_cols3"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_container"))}</span></div></div> <span class="group-title svelte-13m5q3l" style="margin-top: 1.25rem;">${escape_html(t(lang(), "admin.landing_pages.builder.group_conversion"))}</span> <div class="elements-grid svelte-13m5q3l"><div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5M12 2C7.58 2 4 5.58 4 10c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zM12 6v8M9 10h6"></path></svg></span> <span class="elem-name svelte-13m5q3l">CTA</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_testimonial"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><path d="M6 15h2"></path><path d="M10 15h6"></path></svg></span> <span class="elem-name svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.block_pricing"))}</span></div> <div class="element-item svelte-13m5q3l" draggable="true"><span class="elem-icon svelte-13m5q3l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span> <span class="elem-name svelte-13m5q3l">FAQ</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></aside> <main class="builder-canvas-wrapper svelte-13m5q3l"><div${attr_class(`builder-canvas-frame ${stringify(deviceMode)}`, "svelte-13m5q3l")}${attr_style(`background-color: ${stringify(pageSettings.backgroundColor || "#ffffff")}; color: ${stringify(pageSettings.textColor || "#111827")};`)}>`);
    if (pageSettings.showHeader) {
      $$renderer2.push("<!--[0-->");
      LandingPageHeader($$renderer2, {
        logo: pageSettings.headerLogo,
        links: pageSettings.headerLinks || [],
        ctaText: pageSettings.headerCtaText,
        ctaHref: pageSettings.headerCtaHref,
        showCta: !!pageSettings.headerCtaEnabled,
        maxWidth: pageSettings.containerWidth || "1200px"
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="canvas-tree-wrap svelte-13m5q3l">`);
    LandingBlockTree($$renderer2, {
      blocks,
      lang: lang(),
      containerWidth: pageSettings.containerWidth || "1200px",
      editable: true,
      selectedId: selectedBlockId,
      onSelect: (id) => {
        selectedBlockId = id;
        rightTab = "block";
      },
      onDrop: handleTreeDrop,
      onDragOverTarget: handleDragOverTarget,
      onBlockDragStart: handleBlockDragStart,
      onDragEnd: handleDragEnd,
      onMoveBlock: moveBlock,
      onDuplicateBlock: duplicateBlock,
      onDeleteBlock: deleteBlock
    });
    $$renderer2.push(`<!----></div> `);
    if (blocks.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="section-empty-placeholder svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.empty_canvas"))}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></main> <aside class="right-sidebar svelte-13m5q3l"${attr_style(`width: ${stringify(rightSidebarWidth)}px;`)}><div${attr_class("sidebar-resize-handle svelte-13m5q3l", void 0, { "active": isResizing })} role="separator" aria-label="Redimensionar painel"></div> <div class="sidebar-tabs svelte-13m5q3l"><button${attr_class("tab-btn svelte-13m5q3l", void 0, { "active": rightTab === "page" })}><span class="tab-dot svelte-13m5q3l"></span>${escape_html(tr("tab_page", "Página"))}</button> <button${attr_class("tab-btn svelte-13m5q3l", void 0, { "active": rightTab === "block" })}${attr("disabled", !selectedBlockId, true)}><span class="tab-dot svelte-13m5q3l"></span>${escape_html(tr("tab_block", "Bloco"))}</button> <button${attr_class("tab-btn svelte-13m5q3l", void 0, { "active": rightTab === "styles" })}${attr("disabled", !selectedBlockId, true)}><span class="tab-dot svelte-13m5q3l"></span>${escape_html(tr("tab_styles", "Estilos"))}</button></div> <div class="settings-panel-content svelte-13m5q3l">`);
    if (rightTab === "page") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="settings-form lp-page-settings-form svelte-13m5q3l"><div class="panel-heading svelte-13m5q3l"><span class="panel-kicker svelte-13m5q3l">LANDING PAGE</span><h4 class="svelte-13m5q3l">${escape_html(tr("settings", "Configurações"))}</h4><p class="svelte-13m5q3l">Identidade, publicação e aparência geral da página.</p></div> <details class="lp-accordion svelte-13m5q3l" open=""><summary class="lp-accordion-header svelte-13m5q3l"><span class="lp-accordion-title svelte-13m5q3l"><b class="accordion-symbol svelte-13m5q3l">01</b><span class="svelte-13m5q3l">${escape_html(tr("group_identification", "Identificação"))}<small class="svelte-13m5q3l">Título, endereço e publicação</small></span></span> <span class="lp-accordion-icon svelte-13m5q3l">⌄</span></summary> <div class="lp-accordion-content svelte-13m5q3l"><div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.page_title"))}</label> <input type="text"${attr("value", pageTitle)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Slug</label> <input type="text"${attr("value", pageSlug)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.col_status"))}</label> <div class="choice-grid status-choice svelte-13m5q3l"><button type="button"${attr_class("svelte-13m5q3l", void 0, { "active": pageStatus === "draft" })}><span class="status-light draft svelte-13m5q3l"></span><b class="svelte-13m5q3l">Rascunho</b><small class="svelte-13m5q3l">Só administradores</small></button> <button type="button"${attr_class("svelte-13m5q3l", void 0, { "active": pageStatus === "published" })}><span class="status-light live svelte-13m5q3l"></span><b class="svelte-13m5q3l">Publicada</b><small class="svelte-13m5q3l">Visível no site</small></button></div></div></div></details> <details class="lp-accordion svelte-13m5q3l"><summary class="lp-accordion-header svelte-13m5q3l"><span class="lp-accordion-title svelte-13m5q3l"><b class="accordion-symbol svelte-13m5q3l">SEO</b><span class="svelte-13m5q3l">SEO &amp; ${escape_html(tr("group_social", "Redes sociais"))}<small class="svelte-13m5q3l">Google e compartilhamentos</small></span></span> <span class="lp-accordion-icon svelte-13m5q3l">⌄</span></summary> <div class="lp-accordion-content svelte-13m5q3l"><div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.meta_title"))}</label> <input type="text"${attr("value", pageSettings.seoTitle)}${attr("placeholder", t(lang(), "admin.landing_pages.builder.meta_title_ph"))} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.meta_desc"))}</label> <textarea${attr("placeholder", t(lang(), "admin.landing_pages.builder.meta_desc_ph"))} class="svelte-13m5q3l">`);
      const $$body = escape_html(pageSettings.seoDesc);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.social_image"))}</label> <div class="image-upload-mock-card svelte-13m5q3l">`);
      if (pageSettings.socialImage) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<img${attr("src", pageSettings.socialImage)} alt="Social" class="social-img-preview svelte-13m5q3l"/>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="upload-icon-svg svelte-13m5q3l">↑</span> <span class="upload-txt-main svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.add_image"))}</span> <span class="upload-txt-sub svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.image_size_hint"))}</span>`);
      }
      $$renderer2.push(`<!--]--> <input type="file" accept="image/*" class="hidden-upload-input svelte-13m5q3l"/></div></div></div></details> <details class="lp-accordion svelte-13m5q3l"><summary class="lp-accordion-header svelte-13m5q3l"><span class="lp-accordion-title svelte-13m5q3l"><b class="accordion-symbol svelte-13m5q3l">UI</b><span class="svelte-13m5q3l">${escape_html(tr("group_header_design", "Design & Cabeçalho"))}<small class="svelte-13m5q3l">Largura, fundo e navegação</small></span></span> <span class="lp-accordion-icon svelte-13m5q3l">⌄</span></summary> <div class="lp-accordion-content svelte-13m5q3l"><div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.container_width"))}</label> <div class="choice-grid width-choice svelte-13m5q3l"><button type="button"${attr_class("svelte-13m5q3l", void 0, { "active": pageSettings.containerWidth === "900px" })}><i class="width-icon narrow svelte-13m5q3l"></i><b class="svelte-13m5q3l">Compacta</b><small class="svelte-13m5q3l">900px</small></button> <button type="button"${attr_class("svelte-13m5q3l", void 0, { "active": pageSettings.containerWidth === "1200px" })}><i class="width-icon normal svelte-13m5q3l"></i><b class="svelte-13m5q3l">Padrão</b><small class="svelte-13m5q3l">1200px</small></button> <button type="button"${attr_class("svelte-13m5q3l", void 0, { "active": pageSettings.containerWidth === "1400px" })}><i class="width-icon wide svelte-13m5q3l"></i><b class="svelte-13m5q3l">Ampla</b><small class="svelte-13m5q3l">1400px</small></button></div></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.page_bg"))}</label> <div class="color-control svelte-13m5q3l"><input type="color"${attr("value", pageSettings.backgroundColor)} aria-label="Escolher fundo da página" class="svelte-13m5q3l"/><input type="text"${attr("value", pageSettings.backgroundColor)} aria-label="Cor hexadecimal do fundo" class="svelte-13m5q3l"/></div></div> <hr class="lp-accordion-divider svelte-13m5q3l"/> <div class="form-group checkbox-row svelte-13m5q3l"><label class="svelte-13m5q3l"><input type="checkbox"${attr("checked", !!pageSettings.showHeader, true)}/> ${escape_html(t(lang(), "admin.landing_pages.builder.show_header"))}</label></div> `);
      if (pageSettings.showHeader) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.header_logo"))}</label> <input type="text"${attr("value", pageSettings.headerLogo)}${attr("placeholder", t(lang(), "admin.landing_pages.builder.mock_logo"))} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.header_links"))}</label> <!--[-->`);
        const each_array = ensure_array_like(pageSettings.headerLinks || []);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let link = each_array[i];
          $$renderer2.push(`<div class="header-link-row svelte-13m5q3l"><input type="text"${attr("value", link.label)}${attr("placeholder", t(lang(), "admin.landing_pages.builder.header_link_label"))} class="svelte-13m5q3l"/> <input type="text"${attr("value", link.href)} placeholder="#section" class="svelte-13m5q3l"/> <button type="button" class="mini-btn svelte-13m5q3l"${attr("title", t(lang(), "admin.landing_pages.builder.remove"))}>✕</button></div>`);
        }
        $$renderer2.push(`<!--]--> <button type="button" class="mini-btn add svelte-13m5q3l">+ ${escape_html(t(lang(), "admin.landing_pages.builder.add_header_link"))}</button></div> <div class="form-group checkbox-row svelte-13m5q3l"><label class="svelte-13m5q3l"><input type="checkbox"${attr("checked", pageSettings.headerCtaEnabled, true)}/> ${escape_html(t(lang(), "admin.landing_pages.builder.show_header_cta"))}</label></div> `);
        if (pageSettings.headerCtaEnabled) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.header_cta_text"))}</label> <input type="text"${attr("value", pageSettings.headerCtaText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.header_cta_href"))}</label> <input type="text"${attr("value", pageSettings.headerCtaHref)} placeholder="# ou /products" class="svelte-13m5q3l"/></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></details></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (rightTab === "block" && selectedBlock()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="settings-form svelte-13m5q3l"><h4 class="settings-group-title svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.content"))}: ${escape_html(selectedBlock().type.toUpperCase())}</h4> `);
      if (selectedBlock().type === "hero") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Selo superior</span><input type="text"${attr("value", selectedBlock().properties.eyebrow)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Título</span><textarea rows="3" class="svelte-13m5q3l">`);
        const $$body_1 = escape_html(selectedBlock().properties.title);
        if ($$body_1) {
          $$renderer2.push(`${$$body_1}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Subtítulo</span><textarea rows="3" class="svelte-13m5q3l">`);
        const $$body_2 = escape_html(selectedBlock().properties.subtitle);
        if ($$body_2) {
          $$renderer2.push(`${$$body_2}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Botão principal</span><input type="text"${attr("value", selectedBlock().properties.primaryText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Link principal</span><input type="text"${attr("value", selectedBlock().properties.primaryHref)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Botão secundário</span><input type="text"${attr("value", selectedBlock().properties.secondaryText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Link secundário</span><input type="text"${attr("value", selectedBlock().properties.secondaryHref)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Imagem</span><input type="text"${attr("value", selectedBlock().properties.image)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><div class="upload-btn-wrapper svelte-13m5q3l"><input type="file" accept="image/*" id="hero-img-upload" class="svelte-13m5q3l"/><label for="hero-img-upload" class="upload-file-label svelte-13m5q3l">${escape_html("Enviar imagem")}</label></div></div>`);
      } else if (selectedBlock().type === "product-showcase") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Produto do blog</span>`);
        $$renderer2.select(
          {
            value: selectedBlock().properties.productId || "",
            onchange: (e) => linkProductToSelected(e.currentTarget.value),
            class: ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`Selecione`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(products());
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let prod = each_array_1[$$index_1];
              $$renderer3.option({ value: prod.id }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(prod.name)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-13m5q3l"
        );
        $$renderer2.push(`<small class="field-hint svelte-13m5q3l">Preenche nome, preço, imagem, descrição e link automaticamente.</small></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Título</span><input type="text"${attr("value", selectedBlock().properties.name)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Descrição</span><textarea rows="4" class="svelte-13m5q3l">`);
        const $$body_3 = escape_html(selectedBlock().properties.description);
        if ($$body_3) {
          $$renderer2.push(`${$$body_3}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Benefícios (um por linha)</span><textarea rows="4" class="svelte-13m5q3l">`);
        const $$body_4 = escape_html((selectedBlock().properties.bullets || []).join("\n"));
        if ($$body_4) {
          $$renderer2.push(`${$$body_4}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Preço exibido</span><input type="text"${attr("value", selectedBlock().properties.price)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Imagem</span><input type="text"${attr("value", selectedBlock().properties.image)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><div class="upload-btn-wrapper svelte-13m5q3l"><input type="file" accept="image/*" id="product-img-upload" class="svelte-13m5q3l"/><label for="product-img-upload" class="upload-file-label svelte-13m5q3l">${escape_html("Trocar imagem")}</label></div></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Texto do botão</span><input type="text"${attr("value", selectedBlock().properties.buttonText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Link</span><input type="text"${attr("value", selectedBlock().properties.buttonHref)} class="svelte-13m5q3l"/></div>`);
      } else if (selectedBlock().type === "posts-grid") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Título da seção</span><input type="text"${attr("value", selectedBlock().properties.title)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Subtítulo</span><textarea rows="2" class="svelte-13m5q3l">`);
        const $$body_5 = escape_html(selectedBlock().properties.subtitle);
        if ($$body_5) {
          $$renderer2.push(`${$$body_5}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Posts publicados (máx. 6)</span><div class="content-picker svelte-13m5q3l"><!--[-->`);
        const each_array_2 = ensure_array_like(posts());
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let post = each_array_2[$$index_2];
          $$renderer2.push(`<label class="content-picker-item svelte-13m5q3l"><input type="checkbox"${attr("checked", (selectedBlock().properties.posts || []).some((p) => p.id === post.id), true)}${attr("disabled", (selectedBlock().properties.posts || []).length >= 6 && !(selectedBlock().properties.posts || []).some((p) => p.id === post.id), true)} class="svelte-13m5q3l"/><span>${escape_html(post.title)}</span></label>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else if (selectedBlock().type === "trust-bar") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><span class="form-label svelte-13m5q3l">Itens de confiança (um por linha)</span><textarea rows="6" class="svelte-13m5q3l">`);
        const $$body_6 = escape_html((selectedBlock().properties.items || []).join("\n"));
        if ($$body_6) {
          $$renderer2.push(`${$$body_6}`);
        }
        $$renderer2.push(`</textarea></div>`);
      } else if (selectedBlock().type === "text" || selectedBlock().type === "html") {
        $$renderer2.push("<!--[4-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><div class="html-editor-header svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.html_content"))}</label> <div class="editor-toggle-pills svelte-13m5q3l"><button type="button"${attr_class("toggle-pill-btn svelte-13m5q3l", void 0, { "active": isEditingVisual })}>📝 Visual</button> <button type="button"${attr_class("toggle-pill-btn svelte-13m5q3l", void 0, { "active": !isEditingVisual })}>💻 HTML</button></div></div> `);
        {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="visual-editor-toolbar svelte-13m5q3l"><button type="button" class="toolbar-btn svelte-13m5q3l" title="Negrito"><b>B</b></button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Itálico"><i>I</i></button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Título 2">H2</button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Título 3">H3</button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Parágrafo">P</button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Lista">• Lista</button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Adicionar Link">🔗 Link</button> <button type="button" class="toolbar-btn svelte-13m5q3l" title="Inserir Imagem">🖼️ Foto</button></div> <div contenteditable="true" class="visual-editor-container svelte-13m5q3l" spellcheck="false"></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else if (selectedBlock().type === "image") {
        $$renderer2.push("<!--[5-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.image_url"))}</label> <input type="text"${attr("value", selectedBlock().properties.src)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Alt</label> <input type="text"${attr("value", selectedBlock().properties.alt)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.upload"))}</label> <div class="upload-btn-wrapper svelte-13m5q3l"><input type="file" accept="image/*" id="block-img-upload" class="svelte-13m5q3l"/> <label for="block-img-upload" class="upload-file-label svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.upload_image"))}</label></div></div>`);
      } else if (selectedBlock().type === "button") {
        $$renderer2.push("<!--[6-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_text"))}</label> <input type="text"${attr("value", selectedBlock().content)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.link_url"))}</label> <input type="text"${attr("value", selectedBlock().properties.href)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.link_product"))}</label> `);
        $$renderer2.select(
          {
            value: selectedBlock().properties.productId || "",
            onchange: (e) => linkProductToSelected(e.currentTarget.value),
            class: ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(t(lang(), "admin.landing_pages.builder.none"))}`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_3 = ensure_array_like(products());
            for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
              let prod = each_array_3[$$index_3];
              $$renderer3.option({ value: prod.id }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(prod.name)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-13m5q3l"
        );
        $$renderer2.push(` <small class="field-hint svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.product_href_hint"))}</small></div>`);
      } else if (selectedBlock().type === "video") {
        $$renderer2.push("<!--[7-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.youtube_link"))}</label> <input type="text"${attr("value", selectedBlock().properties.src)} class="svelte-13m5q3l"/></div>`);
      } else if (selectedBlock().type === "cta") {
        $$renderer2.push("<!--[8-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.label_title"))}</label> <input type="text"${attr("value", selectedBlock().content)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.subtitle_field"))}</label> <textarea rows="3" class="svelte-13m5q3l">`);
        const $$body_8 = escape_html(selectedBlock().properties.subtitle);
        if ($$body_8) {
          $$renderer2.push(`${$$body_8}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_text"))}</label> <input type="text"${attr("value", selectedBlock().properties.buttonText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_link"))}</label> <input type="text"${attr("value", selectedBlock().properties.buttonHref)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.link_product"))}</label> `);
        $$renderer2.select(
          {
            value: selectedBlock().properties.productId || "",
            onchange: (e) => linkProductToSelected(e.currentTarget.value),
            class: ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(t(lang(), "admin.landing_pages.builder.none"))}`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_4 = ensure_array_like(products());
            for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
              let prod = each_array_4[$$index_4];
              $$renderer3.option({ value: prod.id }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(prod.name)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-13m5q3l"
        );
        $$renderer2.push(`</div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_color"))}</label> <input type="color"${attr("value", selectedBlock().properties.buttonBg)} class="svelte-13m5q3l"/></div>`);
      } else if (selectedBlock().type === "testimonial") {
        $$renderer2.push("<!--[9-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.quote"))}</label> <textarea rows="4" class="svelte-13m5q3l">`);
        const $$body_9 = escape_html(selectedBlock().properties.quote);
        if ($$body_9) {
          $$renderer2.push(`${$$body_9}`);
        }
        $$renderer2.push(`</textarea></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.author"))}</label> <input type="text"${attr("value", selectedBlock().properties.author)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.role"))}</label> <input type="text"${attr("value", selectedBlock().properties.role)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.avatar_url"))}</label> <input type="text"${attr("value", selectedBlock().properties.avatar)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.rating"))}</label> <input type="number" min="1" max="5"${attr("value", selectedBlock().properties.rating)}/></div>`);
      } else if (selectedBlock().type === "pricing") {
        $$renderer2.push("<!--[10-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.plan_name"))}</label> <input type="text"${attr("value", selectedBlock().properties.name)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.price"))}</label> <input type="text"${attr("value", selectedBlock().properties.price)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.period"))}</label> <input type="text"${attr("value", selectedBlock().properties.period)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_text"))}</label> <input type="text"${attr("value", selectedBlock().properties.buttonText)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.button_link"))}</label> <input type="text"${attr("value", selectedBlock().properties.buttonHref)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.link_product"))}</label> `);
        $$renderer2.select(
          {
            value: selectedBlock().properties.productId || "",
            onchange: (e) => linkProductToSelected(e.currentTarget.value),
            class: ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(t(lang(), "admin.landing_pages.builder.none"))}`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_5 = ensure_array_like(products());
            for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
              let prod = each_array_5[$$index_5];
              $$renderer3.option({ value: prod.id }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(prod.name)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          },
          "svelte-13m5q3l"
        );
        $$renderer2.push(`</div> <div class="form-group checkbox-row svelte-13m5q3l"><label class="svelte-13m5q3l"><input type="checkbox"${attr("checked", selectedBlock().properties.featured, true)}/> ${escape_html(t(lang(), "admin.landing_pages.builder.feature_plan"))}</label></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.features"))}</label> <!--[-->`);
        const each_array_6 = ensure_array_like(selectedBlock().properties.features || []);
        for (let i = 0, $$length = each_array_6.length; i < $$length; i++) {
          let feat = each_array_6[i];
          $$renderer2.push(`<div class="inline-row svelte-13m5q3l"><input type="text"${attr("value", feat)} class="svelte-13m5q3l"/> <button type="button" class="mini-btn svelte-13m5q3l">✕</button></div>`);
        }
        $$renderer2.push(`<!--]--> <button type="button" class="mini-btn add svelte-13m5q3l">+ ${escape_html(t(lang(), "admin.landing_pages.builder.add_feature"))}</button></div>`);
      } else if (selectedBlock().type === "faq") {
        $$renderer2.push("<!--[11-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.section_title"))}</label> <input type="text"${attr("value", selectedBlock().properties.title)} class="svelte-13m5q3l"/></div> <!--[-->`);
        const each_array_7 = ensure_array_like(selectedBlock().properties.items || []);
        for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
          let item = each_array_7[i];
          $$renderer2.push(`<div class="faq-editor-card svelte-13m5q3l"><div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.question"))} ${escape_html(i + 1)}</label> <input type="text"${attr("value", item.q)} class="svelte-13m5q3l"/></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.answer"))}</label> <textarea rows="2" class="svelte-13m5q3l">`);
          const $$body_10 = escape_html(item.a);
          if ($$body_10) {
            $$renderer2.push(`${$$body_10}`);
          }
          $$renderer2.push(`</textarea></div> <button type="button" class="mini-btn svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.remove"))}</button></div>`);
        }
        $$renderer2.push(`<!--]--> <button type="button" class="mini-btn add svelte-13m5q3l">+ ${escape_html(t(lang(), "admin.landing_pages.builder.add_question"))}</button>`);
      } else if (selectedBlock().type === "columns") {
        $$renderer2.push("<!--[12-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.columns"))}</label> `);
        $$renderer2.select(
          {
            value: String(selectedBlock().properties.cols || 2),
            onchange: (e) => {
              selectedBlock().properties.cols = parseInt(e.currentTarget.value);
              pushHistory();
            },
            class: ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "2" }, ($$renderer4) => {
              $$renderer4.push(`2`);
            });
            $$renderer3.option({ value: "3" }, ($$renderer4) => {
              $$renderer4.push(`3`);
            });
          },
          "svelte-13m5q3l"
        );
        $$renderer2.push(`</div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Gap</label> <input type="text"${attr("value", selectedBlock().properties.gap)} class="svelte-13m5q3l"/></div> <p class="field-hint svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.columns_hint"))}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="field-hint svelte-13m5q3l">${escape_html(t(lang(), "admin.landing_pages.builder.select_block_hint"))}</p>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (rightTab === "styles" && selectedBlock()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="settings-form style-inspector svelte-13m5q3l"><div class="panel-heading style-heading svelte-13m5q3l"><span class="panel-kicker svelte-13m5q3l">${escape_html(selectedBlock().type.toUpperCase())}</span><h4 class="svelte-13m5q3l">Design do bloco</h4><p class="svelte-13m5q3l">Ajuste o visual e acompanhe no canvas em tempo real.</p></div> <section class="inspector-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Aparência rápida</span><small class="svelte-13m5q3l">Presets</small></div> <div class="preset-grid svelte-13m5q3l"><button type="button" class="svelte-13m5q3l"><i class="preset-preview clean svelte-13m5q3l"></i><b>Clean</b></button> <button type="button" class="svelte-13m5q3l"><i class="preset-preview card svelte-13m5q3l"></i><b>Card</b></button> <button type="button" class="svelte-13m5q3l"><i class="preset-preview dark svelte-13m5q3l"></i><b>Dark</b></button></div></section> <section class="inspector-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Cores</span><small class="svelte-13m5q3l">Hexadecimal</small></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Texto</label> <div class="color-control svelte-13m5q3l"><input type="color"${attr("value", selectedBlock().styles.textColor || "#0f172a")} aria-label="Escolher cor do texto" class="svelte-13m5q3l"/><input type="text"${attr("value", selectedBlock().styles.textColor || "#0f172a")} aria-label="Cor hexadecimal do texto" class="svelte-13m5q3l"/></div></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Fundo</label> <div class="color-control svelte-13m5q3l"><input type="color"${attr("value", selectedBlock().styles.backgroundColor === "transparent" ? "#ffffff" : selectedBlock().styles.backgroundColor || "#ffffff")} aria-label="Escolher cor do fundo" class="svelte-13m5q3l"/><input type="text"${attr("value", selectedBlock().styles.backgroundColor || "transparent")} aria-label="Cor hexadecimal do fundo" class="svelte-13m5q3l"/></div></div></section> <section class="inspector-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Alinhamento</span><small class="svelte-13m5q3l">Conteúdo</small></div> <div class="segmented-control svelte-13m5q3l" aria-label="Alinhamento do conteúdo"><button type="button" title="Esquerda"${attr_class("svelte-13m5q3l", void 0, {
        "active": (selectedBlock().styles.textAlign || "left") === "left"
      })}>≡<span class="svelte-13m5q3l">Esquerda</span></button> <button type="button" title="Centro"${attr_class("svelte-13m5q3l", void 0, { "active": selectedBlock().styles.textAlign === "center" })}>≡<span class="svelte-13m5q3l">Centro</span></button> <button type="button" title="Direita"${attr_class("svelte-13m5q3l", void 0, { "active": selectedBlock().styles.textAlign === "right" })}>≡<span class="svelte-13m5q3l">Direita</span></button></div></section> `);
      if (selectedBlock().type === "text" || selectedBlock().type === "button") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="inspector-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Tipografia</span><small class="svelte-13m5q3l">Tamanho</small></div> <div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Tamanho da fonte</label><div class="unit-input svelte-13m5q3l"><input type="text"${attr("value", selectedBlock().styles.fontSize || "16px")} class="svelte-13m5q3l"/><span class="svelte-13m5q3l">CSS</span></div></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <section class="inspector-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Forma</span><small class="svelte-13m5q3l">Cantos e borda</small></div> <div class="two-field-grid svelte-13m5q3l"><div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Raio</label><div class="unit-input svelte-13m5q3l"><input type="text"${attr("value", selectedBlock().styles.borderRadius || "0px")} class="svelte-13m5q3l"/><span class="svelte-13m5q3l">CSS</span></div></div> `);
      if (selectedBlock().type === "button") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Borda</label><div class="unit-input svelte-13m5q3l"><input type="text"${attr("value", selectedBlock().styles.borderWidth || "0px")} class="svelte-13m5q3l"/><span class="svelte-13m5q3l">CSS</span></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (selectedBlock().type === "button") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="form-group svelte-13m5q3l"><label class="svelte-13m5q3l">Cor da borda</label><div class="color-control svelte-13m5q3l"><input type="color"${attr("value", selectedBlock().styles.borderColor || "#0f172a")} aria-label="Escolher cor da borda" class="svelte-13m5q3l"/><input type="text"${attr("value", selectedBlock().styles.borderColor || "transparent")} class="svelte-13m5q3l"/></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></section> <section class="inspector-section spacing-section svelte-13m5q3l"><div class="inspector-title svelte-13m5q3l"><span class="svelte-13m5q3l">Espaçamento</span><small class="svelte-13m5q3l">Use px, rem ou %</small></div> <div class="spacing-box svelte-13m5q3l"><span class="spacing-caption svelte-13m5q3l">MARGEM</span> <div class="spacing-row svelte-13m5q3l"><label class="svelte-13m5q3l">Topo</label><input type="text"${attr("value", selectedBlock().styles.marginTop || "0px")} class="svelte-13m5q3l"/><label class="svelte-13m5q3l">Base</label><input type="text"${attr("value", selectedBlock().styles.marginBottom || "0px")} class="svelte-13m5q3l"/></div> <div class="padding-box svelte-13m5q3l"><span class="spacing-caption svelte-13m5q3l">PADDING</span><div class="spacing-row svelte-13m5q3l"><label class="svelte-13m5q3l">Topo</label><input type="text"${attr("value", selectedBlock().styles.paddingTop || "0px")} class="svelte-13m5q3l"/><label class="svelte-13m5q3l">Base</label><input type="text"${attr("value", selectedBlock().styles.paddingBottom || "0px")} class="svelte-13m5q3l"/></div></div></div></section></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></aside></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-xhxqO5b0.js.map
