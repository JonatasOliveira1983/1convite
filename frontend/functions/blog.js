// Proxy Cloudflare Pages Functions para o Blog SvelteKit no Render (/blog)
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const blogOrigin = (context.env?.BLOG_ORIGIN || 'https://oneconvite-blog.onrender.com').replace(/\/$/, '');
  const targetUrl = `${blogOrigin}${url.pathname}${url.search}`;

  const headers = new Headers(context.request.headers);
  headers.set('x-forwarded-host', url.host);
  headers.set('x-forwarded-proto', url.protocol.replace(':', ''));

  const requestInit = {
    method: context.request.method,
    headers,
    redirect: 'manual',
  };

  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    requestInit.body = context.request.body;
  }

  return fetch(targetUrl, requestInit);
}
