import { I as attr_class, O as stringify, J as attr, X as attr_style, Q as escape_html, K as derived, L as store_get, T as unsubscribe_stores } from './root-bZgTCCHH.js';
import { p as page } from './stores-BFh6Xi2m.js';
import { t } from './i18n-LdHmnyr8.js';
import { h as html } from './html-FW6Ia4bL.js';

function AdRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { ads, placement } = $$props;
    const lang = derived(() => store_get($$store_subs ??= {}, "$page", page).data.language || "pt");
    function selectAd(availableAds) {
      if (!availableAds || availableAds.length === 0) return null;
      const totalWeight = availableAds.reduce((sum, ad) => sum + (ad.weight || 1), 0);
      let random = Math.random() * totalWeight;
      for (const ad of availableAds) {
        random -= ad.weight || 1;
        if (random <= 0) return ad;
      }
      return availableAds[0];
    }
    function parseStyle(styleStr) {
      if (!styleStr) return {};
      try {
        return JSON.parse(styleStr);
      } catch {
        return {};
      }
    }
    function getYouTubeId(url) {
      if (!url) return null;
      let str = url.trim();
      if (!str) return null;
      const iframeMatch = str.match(/src=["']([^"']+)["']/i);
      if (iframeMatch) {
        str = iframeMatch[1];
      }
      if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        return str;
      }
      const patterns = [
        /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /[?&]v=([a-zA-Z0-9_-]{11})/
      ];
      for (const pattern of patterns) {
        const match = str.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      if (str.includes("youtu")) {
        const fallback = str.match(/([a-zA-Z0-9_-]{11})/);
        if (fallback && fallback[1]) return fallback[1];
      }
      return null;
    }
    const selectedAd = derived(() => selectAd(ads));
    const customStyle = derived(() => parseStyle(selectedAd()?.style || null));
    let videoExpanded = false;
    const videoId = derived(() => selectedAd() ? getYouTubeId(selectedAd().youtube_video_url || null) : null);
    const isVideoAd = derived(() => !!videoId());
    if (selectedAd()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`ad-container ad-${stringify(placement)}`, "svelte-1l2mzta", {
        "ad-native": selectedAd().type === "native" && !isVideoAd(),
        "ad-video": isVideoAd(),
        "expanded": isVideoAd() && videoExpanded
      })}${attr("data-ad-id", selectedAd().id)}${attr_style(Object.entries(customStyle()).map(([k, v]) => `--ad-${k}: ${v}`).join("; "))}>`);
      if (isVideoAd()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="ad-video-header svelte-1l2mzta"><span class="video-pulse-container svelte-1l2mzta"><span class="pulse-dot svelte-1l2mzta"></span></span> `);
        if (selectedAd().link_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<a${attr("href", selectedAd().link_url)} target="_blank" rel="nofollow noopener" class="ad-video-title svelte-1l2mzta">${escape_html(selectedAd().name)}</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<h4 class="ad-video-title svelte-1l2mzta">${escape_html(selectedAd().name)}</h4>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="ad-video-wrapper svelte-1l2mzta">`);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<button class="ad-video-thumbnail svelte-1l2mzta"><img${attr("src", `https://img.youtube.com/vi/${stringify(videoId())}/maxresdefault.jpg`)}${attr("alt", selectedAd().name)} class="svelte-1l2mzta"/> <div class="ad-play-button svelte-1l2mzta"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="svelte-1l2mzta"><polygon points="5 3 19 12 5 21 5 3" class="svelte-1l2mzta"></polygon></svg></div></button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else if (selectedAd().type === "native") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<a${attr("href", selectedAd().link_url)} target="_blank" rel="nofollow noopener" class="native-ad-link svelte-1l2mzta">`);
        if (selectedAd().image_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="native-image-wrapper svelte-1l2mzta"><img${attr("src", selectedAd().image_url)}${attr("alt", selectedAd().name)} class="native-image svelte-1l2mzta"/> <span class="native-badge svelte-1l2mzta">${escape_html(t(lang(), "ad.exclusive"))}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="native-content svelte-1l2mzta"><span class="native-label svelte-1l2mzta">${escape_html(selectedAd().content || t(lang(), "ad.recommended"))}</span> <h4 class="native-title svelte-1l2mzta">${escape_html(selectedAd().name)}</h4> `);
        if (selectedAd().link_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="native-cta svelte-1l2mzta">${escape_html(t(lang(), "ad.learn_more"))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></a>`);
      } else if (selectedAd().type === "image") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<a${attr("href", selectedAd().link_url)} target="_blank" rel="nofollow noopener" class="ad-link svelte-1l2mzta"><img${attr("src", selectedAd().image_url)}${attr("alt", selectedAd().name)} class="ad-image svelte-1l2mzta"/></a>`);
      } else if (selectedAd().type === "html") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<div class="ad-html svelte-1l2mzta">${html(selectedAd().content)}</div>`);
      } else if (selectedAd().type === "text") {
        $$renderer2.push("<!--[4-->");
        $$renderer2.push(`<a${attr("href", selectedAd().link_url)} target="_blank" rel="nofollow noopener" class="ad-text-link svelte-1l2mzta">${escape_html(selectedAd().content)}</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="ad-label svelte-1l2mzta">${escape_html(t(lang(), "ad.label"))}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { AdRenderer as A };
//# sourceMappingURL=AdRenderer-Ccc4IUSO.js.map
