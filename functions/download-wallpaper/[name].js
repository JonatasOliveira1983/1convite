// Proxy de download com Content-Disposition: attachment para funcionar no Android WebView e iOS
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const name = context.params?.name;
  const allowed = ['1convite-celular-alvorada.jpg', '1convite-desktop-obsidiana.jpg'];

  if (!name || !allowed.includes(name)) {
    return new Response('Arquivo não encontrado', { status: 404 });
  }

  const assetResponse = await context.env.ASSETS.fetch(new URL(`/wallpapers/${name}`, url.origin));
  if (!assetResponse.ok) {
    return new Response('Erro ao ler imagem', { status: 404 });
  }

  const headers = new Headers(assetResponse.headers);
  headers.set('Content-Type', 'application/octet-stream');
  headers.set('Content-Disposition', `attachment; filename="${name}"`);
  headers.set('Cache-Control', 'public, max-age=86400');

  return new Response(assetResponse.body, {
    status: 200,
    headers,
  });
}
