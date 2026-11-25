import { m as merge_tracing } from './index-Bo0hF4uT.js';
import { F as get_request_store, w as with_request_store } from './root-bZgTCCHH.js';
import { recordPageView, getUserByUsername, getSettings } from './database-GQg0oTqt.js';
import { validateSession } from './auth2-rxn-yo76.js';
import { h as htmlLang } from './i18n-LdHmnyr8.js';
import './index-BkmUvga9.js';
import './server-B3psWENk.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'bcryptjs';

/** @import { Handle, RequestEvent, ResolveOptions } from '@sveltejs/kit' */
/** @import { MaybePromise } from 'types' */

/**
 * A helper function for sequencing multiple `handle` calls in a middleware-like manner.
 * The behavior for the `handle` options is as follows:
 * - `transformPageChunk` is applied in reverse order and merged
 * - `preload` is applied in forward order, the first option "wins" and no `preload` options after it are called
 * - `filterSerializedResponseHeaders` behaves the same as `preload`
 *
 * ```js
 * /// file: src/hooks.server.js
 * import { sequence } from '@sveltejs/kit/hooks';
 *
 * /// type: import('@sveltejs/kit').Handle
 * async function first({ event, resolve }) {
 * 	console.log('first pre-processing');
 * 	const result = await resolve(event, {
 * 		transformPageChunk: ({ html }) => {
 * 			// transforms are applied in reverse order
 * 			console.log('first transform');
 * 			return html;
 * 		},
 * 		preload: () => {
 * 			// this one wins as it's the first defined in the chain
 * 			console.log('first preload');
 * 			return true;
 * 		}
 * 	});
 * 	console.log('first post-processing');
 * 	return result;
 * }
 *
 * /// type: import('@sveltejs/kit').Handle
 * async function second({ event, resolve }) {
 * 	console.log('second pre-processing');
 * 	const result = await resolve(event, {
 * 		transformPageChunk: ({ html }) => {
 * 			console.log('second transform');
 * 			return html;
 * 		},
 * 		preload: () => {
 * 			console.log('second preload');
 * 			return true;
 * 		},
 * 		filterSerializedResponseHeaders: () => {
 * 			// this one wins as it's the first defined in the chain
 * 			console.log('second filterSerializedResponseHeaders');
 * 			return true;
 * 		}
 * 	});
 * 	console.log('second post-processing');
 * 	return result;
 * }
 *
 * export const handle = sequence(first, second);
 * ```
 *
 * The example above would print:
 *
 * ```
 * first pre-processing
 * first preload
 * second pre-processing
 * second filterSerializedResponseHeaders
 * second transform
 * first transform
 * second post-processing
 * first post-processing
 * ```
 *
 * @param {...Handle} handlers The chain of `handle` functions
 * @returns {Handle}
 */
function sequence(...handlers) {
	const length = handlers.length;
	if (!length) return ({ event, resolve }) => resolve(event);

	return ({ event, resolve }) => {
		const { state } = get_request_store();
		return apply_handle(0, event, {});

		/**
		 * @param {number} i
		 * @param {RequestEvent} event
		 * @param {ResolveOptions | undefined} parent_options
		 * @returns {MaybePromise<Response>}
		 */
		function apply_handle(i, event, parent_options) {
			const handle = handlers[i];

			return state.tracing.record_span({
				name: `sveltekit.handle.sequenced.${handle.name ? handle.name : i}`,
				attributes: {},
				fn: async (current) => {
					const traced_event = merge_tracing(event, current);
					return await with_request_store({ event: traced_event, state }, () =>
						handle({
							event: traced_event,
							resolve: (event, options) => {
								/** @type {ResolveOptions['transformPageChunk']} */
								const transformPageChunk = async ({ html, done }) => {
									if (options?.transformPageChunk) {
										html = (await options.transformPageChunk({ html, done })) ?? '';
									}

									if (parent_options?.transformPageChunk) {
										html = (await parent_options.transformPageChunk({ html, done })) ?? '';
									}

									return html;
								};

								/** @type {ResolveOptions['filterSerializedResponseHeaders']} */
								const filterSerializedResponseHeaders =
									parent_options?.filterSerializedResponseHeaders ??
									options?.filterSerializedResponseHeaders;

								/** @type {ResolveOptions['preload']} */
								const preload = parent_options?.preload ?? options?.preload;

								return i < length - 1
									? apply_handle(i + 1, event, {
											transformPageChunk,
											filterSerializedResponseHeaders,
											preload
										})
									: resolve(event, {
											transformPageChunk,
											filterSerializedResponseHeaders,
											preload
										});
							}
						})
					);
				}
			});
		}
	};
}

const performanceHandle = async ({ event, resolve }) => {
  const start = Date.now();
  let lang = "pt";
  try {
    const settings = await getSettings();
    lang = settings.site_language || "pt";
  } catch {
  }
  const langAttr = htmlLang(lang);
  const result = await resolve(event, {
    transformPageChunk: ({ html }) => {
      if (/<html[^>]*\slang=/.test(html)) {
        return html.replace(/<html([^>]*)\slang="[^"]*"/, `<html$1 lang="${langAttr}"`);
      }
      return html.replace("<html", `<html lang="${langAttr}"`);
    }
  });
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== "production" && duration > 200) {
    console.log(`[PERF] ${event.request.method} ${event.url.pathname}: ${duration}ms`);
  }
  return result;
};
const authHandle = async ({ event, resolve }) => {
  const token = event.cookies.get("member_session");
  if (token) {
    try {
      const username = await validateSession(token);
      if (username) {
        const dbUser = await getUserByUsername(username);
        if (dbUser) {
          event.locals.user = {
            id: dbUser.id,
            username: dbUser.username,
            role: dbUser.role || "member",
            name: dbUser.name || "",
            cpf: dbUser.cpf || "",
            phone: dbUser.phone || ""
          };
        }
      }
    } catch (e) {
      console.error("[AUTH HOOK] Error validating session:", e);
    }
  }
  return resolve(event);
};
const analyticsHandle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const isGet = event.request.method === "GET";
  const isAsset = pathname.includes(".") || pathname.includes("/_app/") || pathname.includes("/images/") || pathname.endsWith("/favicon.png");
  const isAdminOrApi = pathname.startsWith("/admin") || pathname.startsWith("/blog/admin") || pathname.startsWith("/api") || pathname.startsWith("/blog/api") || pathname.startsWith("/auth") || pathname.startsWith("/blog/auth");
  const headers = event.request.headers;
  const purpose = headers.get("purpose") || "";
  const secPurpose = headers.get("sec-purpose") || "";
  const xPurpose = headers.get("x-purpose") || "";
  const xMoz = headers.get("x-moz") || "";
  const isPrefetch = purpose === "prefetch" || secPurpose === "prefetch" || secPurpose === "prerender" || xPurpose === "prefetch" || xPurpose === "preview" || xMoz === "prefetch" || headers.has("x-sveltekit-preload");
  if (isGet && !isAsset && !isAdminOrApi && !isPrefetch) {
    let ip = "127.0.0.1";
    try {
      ip = event.getClientAddress() || "127.0.0.1";
    } catch (e) {
    }
    const userAgent = event.request.headers.get("user-agent") || "";
    recordPageView(pathname, ip, userAgent).catch((err) => {
      console.error("[ANALYTICS] Error tracking page view:", err);
    });
  }
  return resolve(event);
};
const cacheControlHandle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
};
const handle = sequence(
  performanceHandle,
  authHandle,
  analyticsHandle,
  cacheControlHandle
);

export { handle };
//# sourceMappingURL=hooks.server-Bu5L87A1.js.map
