// ═════════════════════════════════════════════════════════════════
// 1CONVITE — MOTOR DE RENDERIZAÇÃO EM CANVAS NATIVO FULL HD
// Gera imagens perfeitas em 1080x1080 (Post) e 1080x1920 (Story)
// Sem falhas de CSS/html2canvas, com vidro translúcido e alta fidelidade
// ═════════════════════════════════════════════════════════════════

/**
 * Quebra o texto em linhas para caber na largura máxima do canvas
 */
function getLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Desenha um retângulo com cantos arredondados (compatível com navegadores antigos)
 */
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Desenha a logomarca vetorial da chama de 1Convite no Canvas
 */
function drawFlameIcon(ctx, cx, cy, size, color = '#F97316') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  // Desenho estilizado da chama 1Convite
  const scale = size / 24;
  ctx.translate(cx - 12 * scale, cy - 12 * scale);
  ctx.scale(scale, scale);
  ctx.moveTo(12, 2);
  ctx.bezierCurveTo(8, 7, 5, 11, 5, 15);
  ctx.bezierCurveTo(5, 18.87, 8.13, 22, 12, 22);
  ctx.bezierCurveTo(15.87, 22, 19, 18.87, 19, 15);
  ctx.bezierCurveTo(19, 11, 16, 7, 12, 2);
  ctx.closePath();
  ctx.fill();

  // Núcleo interno da chama (dourado luminoso)
  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.moveTo(12, 20);
  ctx.bezierCurveTo(9.79, 20, 8, 18.21, 8, 16);
  ctx.bezierCurveTo(8, 13.5, 10.5, 10, 12, 8.5);
  ctx.bezierCurveTo(13.5, 10, 16, 13.5, 16, 16);
  ctx.bezierCurveTo(16, 18.21, 14.21, 20, 12, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Gera um Card em Alta Definição (1080p) via Canvas Nativo
 * @param {Object} options
 * @param {string} options.format - 'square' (1080x1080) ou 'story' (1080x1920)
 * @param {Object} options.bg - objeto de fundo { type: 'image'|'gradient', url, css, colors }
 * @param {Object} options.content - { tag, text, ref, link }
 * @returns {Promise<string>} Data URL (PNG ou JPEG) em altíssima qualidade
 */
export async function renderCardToHD(options) {
  const { format = 'square', bg, content } = options;

  // Dimensões Full HD
  const width = 1080;
  const height = format === 'story' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. PINTAR FUNDO (Imagem com proporção Cover ou Gradiente)
  if (bg && bg.type === 'image' && bg.url) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => resolve(null); // Fallback silencioso para gradiente
        img.src = bg.url;
      });

      if (img.width && img.height) {
        // Cálculo cover proporcional
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let renderW, renderH, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
          renderH = height;
          renderW = height * imgRatio;
          offsetX = (width - renderW) / 2;
          offsetY = 0;
        } else {
          renderW = width;
          renderH = width / imgRatio;
          offsetX = 0;
          offsetY = (height - renderH) / 2;
        }
        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      } else {
        throw new Error('Falha ao carregar imagem');
      }
    } catch {
      // Fallback: gradiente escuro elegante
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (bg && bg.colors) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, bg.colors[0] || '#1E1B4B');
    grad.addColorStop(1, bg.colors[1] || '#030712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1A1829');
    grad.addColorStop(1, '#08080C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. OVERLAY CINEMATOGRÁFICO DE CONTRASTE
  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
  overlay.addColorStop(0.4, 'rgba(0, 0, 0, 0.55)');
  overlay.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  // 3. MOLDURA CENTRAL DE VIDRO (DARK GLASSMORPHISM)
  const cardMargin = 80;
  const cardWidth = width - cardMargin * 2; // 920px
  const cardRadius = 36;

  // Medição prévia para altura adaptativa da caixa de vidro
  const maxTextWidth = cardWidth - 100; // 820px
  const textFontSize = format === 'story' ? 44 : 40;
  const textLineHeight = format === 'story' ? 64 : 58;

  ctx.font = `italic 500 ${textFontSize}px Georgia, "Playfair Display", serif`;
  const cleanQuote = (content.text || '').replace(/^["“”]+|["“”]+$/g, '').trim();
  const textLines = getLines(ctx, `“${cleanQuote}”`, maxTextWidth);

  // Limite de linhas
  const maxLines = format === 'story' ? 8 : 6;
  const displayedLines = textLines.slice(0, maxLines);
  if (textLines.length > maxLines) {
    displayedLines[maxLines - 1] = displayedLines[maxLines - 1] + '...';
  }

  const textBlockHeight = displayedLines.length * textLineHeight;
  const cardPaddingY = 50;
  const tagHeight = 44;
  const refHeight = content.ref ? 46 : 0;
  const cardHeight = Math.min(
    height - (format === 'story' ? 320 : 200),
    cardPaddingY * 2 + tagHeight + 30 + textBlockHeight + (content.ref ? 30 + refHeight : 0)
  );

  // Posição vertical centralizada com respiro
  const cardY = (height - cardHeight) / 2 - (format === 'story' ? 40 : 20);

  // Sombra profunda da moldura
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  // Fundo de vidro translúcido escuro
  ctx.fillStyle = 'rgba(15, 20, 32, 0.72)';
  drawRoundRect(ctx, cardMargin, cardY, cardWidth, cardHeight, cardRadius);
  ctx.fill();
  ctx.restore();

  // Borda suave de vidro com luz sutil
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.5;
  drawRoundRect(ctx, cardMargin, cardY, cardWidth, cardHeight, cardRadius);
  ctx.stroke();
  ctx.restore();

  // 4. TAG DA CATEGORIA (Topo da moldura de vidro)
  let currentY = cardY + cardPaddingY;

  const tagText = (content.tag || '1CONVITE').toUpperCase();
  ctx.font = '800 22px "Outfit", "Inter", sans-serif';
  const tagTextWidth = ctx.measureText(tagText).width;
  const tagPadX = 24;
  const tagPadY = 10;
  const tagTotalW = tagTextWidth + tagPadX * 2;
  const tagX = cardMargin + 50;

  // Pílula da Tag
  ctx.save();
  ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, tagX, currentY, tagTotalW, tagHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Texto da Tag
  ctx.fillStyle = '#FED7AA';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagText, tagX + tagTotalW / 2, currentY + tagHeight / 2 + 1);
  ctx.restore();

  // Data do dia alinhada à direita dentro da moldura (se fornecida)
  if (content.date) {
    ctx.save();
    ctx.font = '700 20px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(content.date).toUpperCase(), cardMargin + cardWidth - 50, currentY + tagHeight / 2);
    ctx.restore();
  }

  currentY += tagHeight + 36;

  // 5. CITAÇÃO PRINCIPAL / VERSÍCULO / CONVITE
  ctx.save();
  ctx.font = `italic 500 ${textFontSize}px Georgia, "Playfair Display", serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;

  displayedLines.forEach((line) => {
    ctx.fillText(line, cardMargin + 50, currentY);
    currentY += textLineHeight;
  });
  ctx.restore();

  // 6. REFERÊNCIA BÍBLICA OU COMPLEMENTO
  if (content.ref) {
    currentY += 16;
    ctx.save();
    ctx.font = '800 24px "Outfit", "Inter", sans-serif';
    ctx.fillStyle = '#FDBA74';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText(content.ref.toUpperCase(), cardMargin + 50, currentY);
    ctx.restore();
  }

  // 7. RODAPÉ OFICIAL & LINK: 1CONVITE.COM.BR
  const footerH = format === 'story' ? 160 : 112;
  ctx.save();
  ctx.fillStyle = 'rgba(9, 9, 11, 0.82)';
  ctx.fillRect(0, height - footerH, width, footerH);
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height - footerH);
  ctx.lineTo(width, height - footerH);
  ctx.stroke();
  ctx.restore();

  const footerY = height - (format === 'story' ? 96 : 68);
  const centerX = width / 2;

  // Mini chama de 1Convite
  drawFlameIcon(ctx, centerX - 138, footerY, 28, '#F97316');

  // Marca d'água e Link em destaque
  ctx.save();
  ctx.font = '800 26px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '1.5px';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 10;
  ctx.fillText('1CONVITE.COM.BR', centerX - 110, footerY);

  // Sublegenda convidativa
  ctx.font = '600 18px "Inter", sans-serif';
  ctx.fillStyle = '#FDBA74';
  ctx.textAlign = 'center';
  ctx.fillText('Meditação Diária • Bíblia em Áudio • https://1convite.com.br', centerX, footerY + 34);
  ctx.restore();

  // Retorna Data URL JPEG de 1080p em alta fidelidade (95% de qualidade)
  return canvas.toDataURL('image/jpeg', 0.95);
}
