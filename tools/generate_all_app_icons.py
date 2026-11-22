import pymupdf as fitz
from PIL import Image
import os

# 1. SVGs for the three icon types
SVG_SQUIRCLE = """<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1c1e"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#F97316" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Base Dark Canvas -->
  <rect width="512" height="512" rx="115" ry="115" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="111" ry="111" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>

  <!-- Orange Flame Badge matching Landing Page .sp-brand-icon-box -->
  <rect x="76" y="76" width="360" height="360" rx="90" ry="90" fill="url(#flameGrad)" filter="url(#shadow)"/>

  <!-- Chaminha Path exactly from LandingPage.jsx -->
  <g transform="translate(148, 148) scale(9.0)">
    <!-- White Crisp Flame -->
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>"""

SVG_ROUND = """<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1c1e"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="flameGradR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <filter id="shadowR" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.5"/>
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#F97316" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Circle Canvas -->
  <circle cx="256" cy="256" r="256" fill="url(#bgGradR)"/>
  <circle cx="256" cy="256" r="252" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>

  <!-- Orange Circle Badge -->
  <circle cx="256" cy="256" r="185" fill="url(#flameGradR)" filter="url(#shadowR)"/>

  <!-- Chaminha Path exactly from LandingPage.jsx -->
  <g transform="translate(148, 148) scale(9.0)">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>"""

SVG_FOREGROUND = """<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flameGradF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
  </defs>

  <!-- Adaptive Icon Foreground in Safe Zone -->
  <rect x="126" y="126" width="260" height="260" rx="65" ry="65" fill="url(#flameGradF)"/>

  <!-- Chaminha Path -->
  <g transform="translate(178, 178) scale(6.5)">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>"""

def render_svg_to_pil(svg_text, target_size=1024):
    doc = fitz.open(stream=svg_text.encode('utf-8'), filetype='svg')
    zoom = target_size / 512.0
    mat = fitz.Matrix(zoom, zoom)
    pix = doc[0].get_pixmap(matrix=mat, alpha=True)
    img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
    return img

print("1. Renderizando matrizes SVG em 1024x1024...")
img_square = render_svg_to_pil(SVG_SQUIRCLE, 1024)
img_round = render_svg_to_pil(SVG_ROUND, 1024)
img_foreground = render_svg_to_pil(SVG_FOREGROUND, 1024)

# 2. PWA Web Icons in frontend/public and frontend/dist
print("2. Gerando icones PWA e Web (frontend/public & frontend/dist)...")
pwa_targets = [
    ('frontend/public/favicon.png', 512),
    ('frontend/public/pwa-192x192.png', 192),
    ('frontend/public/pwa-512x512.png', 512),
    ('frontend/public/apple-touch-icon.png', 180),
    ('frontend/public/LOGO.png', 512),
    ('frontend/public/LOGOMARCA.png', 1024),
    ('frontend/dist/favicon.png', 512),
    ('frontend/dist/pwa-192x192.png', 192),
    ('frontend/dist/pwa-512x512.png', 512),
    ('frontend/dist/apple-touch-icon.png', 180),
    ('frontend/dist/LOGO.png', 512),
    ('frontend/dist/LOGOMARCA.png', 1024),
    ('.agents/marca/logo.png', 512),
    ('.agents/marca/logomarca.png', 1024),
]

for path, size in pwa_targets:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    resized = img_square.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(path, format="PNG", optimize=True)
    print(f"  ✓ {path} ({size}x{size})")

# 3. Android Mipmap Icons
print("3. Gerando icones nativos do Android (res/mipmap-*)...")
android_sizes = {
    'mipmap-mdpi':    (48, 48, 108),
    'mipmap-hdpi':    (72, 72, 162),
    'mipmap-xhdpi':   (96, 96, 216),
    'mipmap-xxhdpi':  (144, 144, 324),
    'mipmap-xxxhdpi': (192, 192, 432),
}

base_res = 'frontend/android/app/src/main/res'
for folder, (sq_sz, rd_sz, fg_sz) in android_sizes.items():
    dir_path = os.path.join(base_res, folder)
    if not os.path.exists(dir_path):
        continue
    # Square / normal
    sq = img_square.resize((sq_sz, sq_sz), Image.Resampling.LANCZOS)
    sq.save(os.path.join(dir_path, 'ic_launcher.png'), format="PNG", optimize=True)
    
    # Round
    rd = img_round.resize((rd_sz, rd_sz), Image.Resampling.LANCZOS)
    rd.save(os.path.join(dir_path, 'ic_launcher_round.png'), format="PNG", optimize=True)
    
    # Foreground
    fg = img_foreground.resize((fg_sz, fg_sz), Image.Resampling.LANCZOS)
    fg.save(os.path.join(dir_path, 'ic_launcher_foreground.png'), format="PNG", optimize=True)
    print(f"  ✓ {folder}: normal({sq_sz}), round({rd_sz}), foreground({fg_sz})")

print("Todos os icones do aplicativo e da area de trabalho do celular foram atualizados com sucesso!")
