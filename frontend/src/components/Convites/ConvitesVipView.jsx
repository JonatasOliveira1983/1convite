import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './ConvitesVipView.css';
import conviteVipArt from '../../assets/landing/convite_vip.jpg';
import appLogoDark from '../../assets/logomarca_dark.png';
import AsaasCheckoutModal from '../Checkout/AsaasCheckoutModal';

function getApiBase() {
  const isCapacitor = Boolean(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
  );
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost && !isCapacitor
    ? 'http://localhost:3001/api/v1'
    : import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1';
}

/**
 * Gera um PDF 1.4 válido a partir de um JPEG (DataURL) sem dependências externas.
 */
function buildSingleImagePdfBlob(jpegDataUrl, imgWidthPx, imgHeightPx) {
  const base64 = jpegDataUrl.split(',')[1];
  const binaryStr = atob(base64);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  // Página A4 paisagem (842 x 595 pt) ou proporcional com margem elegante
  const pageW = 842;
  const pageH = 595;
  const margin = 40;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const scale = Math.min(maxW / imgWidthPx, maxH / imgHeightPx);
  const drawW = (imgWidthPx * scale).toFixed(2);
  const drawH = (imgHeightPx * scale).toFixed(2);
  const drawX = ((pageW - Number(drawW)) / 2).toFixed(2);
  const drawY = ((pageH - Number(drawH)) / 2).toFixed(2);

  const enc = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let byteLen = 0;

  const pushStr = (s) => {
    const b = enc.encode(s);
    parts.push(b);
    byteLen += b.length;
  };
  const pushBytes = (b) => {
    parts.push(b);
    byteLen += b.length;
  };

  pushStr('%PDF-1.4\n');

  offsets.push(byteLen);
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  offsets.push(byteLen);
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  offsets.push(byteLen);
  pushStr(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);

  offsets.push(byteLen);
  pushStr(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidthPx} /Height ${imgHeightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`);
  pushBytes(imgBytes);
  pushStr('\nendstream\nendobj\n');

  const contentStream = `q\n${drawW} 0 0 ${drawH} ${drawX} ${drawY} cm\n/Im0 Do\nQ\n`;
  offsets.push(byteLen);
  pushStr(`5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`);

  const xrefStart = byteLen;
  pushStr(`xref\n0 ${offsets.length}\n`);
  pushStr('0000000000 65535 f \n');
  for (let i = 1; i < offsets.length; i++) {
    pushStr(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  }
  pushStr(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  return new Blob(parts, { type: 'application/pdf' });
}

export default function ConvitesVipView({ userEmail, userName, onBack }) {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: userName || 'Membro 1Convite',
    contact: userEmail || '',
    isInvitedUser: false,
    giftedByName: '',
  });
  const [vouchers, setVouchers] = useState([]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [checkoutOffer, setCheckoutOffer] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [downloadingCode, setDownloadingCode] = useState('');
  const [pdfRenderVoucher, setPdfRenderVoucher] = useState(null);
  const pdfCardRef = useRef(null);

  const loadConvites = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/convites/meus?contact=${encodeURIComponent(userEmail || '')}`);
      const data = await res.json();
      if (data?.success) {
        if (data.userInfo) setUserInfo(data.userInfo);
        if (Array.isArray(data.vouchers)) setVouchers(data.vouchers);
      }
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConvites();
  }, [userEmail]);

  const availableVouchers = vouchers.filter((v) => v.active && v.usedCount < v.maxUses);
  const redeemedVouchers = vouchers.filter((v) => v.usedCount >= v.maxUses);
  const previewCode = availableVouchers[0]?.code || vouchers[0]?.code || 'REINO-VIP';

  const handleCopyInvite = (code) => {
    const link = `https://1convite.com.br/app?vip=${encodeURIComponent(code)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const handleSendWhatsApp = (voucher) => {
    const sender = userInfo.name || userName || 'um amigo especial';
    const link = `https://1convite.com.br/app?vip=${encodeURIComponent(voucher.code)}`;
    const msg =
      `Olá! Deus colocou você no meu coração hoje.\n\n` +
      `Estou te presenteando com um *Convite VIP 1Convite (180 dias grátis)* enviado por *${sender}*!\n\n` +
      `Você vai ter acesso à Bíblia Sagrada ACF narrada, Café com Deus 365, TemploFit, Mentores Bíblicos e muito mais.\n\n` +
      `*Seu Código VIP:* ${voucher.code}\n` +
      `*Resgate seu presente aqui:* ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPdf = async (voucher) => {
    setDownloadingCode(voucher.code);
    setPdfRenderVoucher(voucher);
    setTimeout(async () => {
      try {
        if (!pdfCardRef.current) return;
        const canvas = await html2canvas(pdfCardRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#09090b',
        });
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.94);
        const pdfBlob = buildSingleImagePdfBlob(jpegUrl, canvas.width, canvas.height);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Convite-VIP-1Convite-${voucher.code}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Erro ao gerar PDF do convite:', err);
      } finally {
        setDownloadingCode('');
        setPdfRenderVoucher(null);
      }
    }, 140);
  };

  const unitTotal = selectedQty === 10 ? 240.99 : Number((24.99 * selectedQty).toFixed(2));

  return (
    <div className="cv-container">
      {/* Header */}
      <div className="cv-topbar">
        <button type="button" className="cv-back-btn" onClick={onBack}>
          ← Voltar
        </button>
        <span className="cv-badge-gold">EXCLUSIVO • CONTROLE DE CONVITES VIP</span>
      </div>

      {/* Hero Personalizado (Convidado vs Comprador) */}
      <section className="cv-hero-card">
        <div className="cv-hero-copy">
          {userInfo.isInvitedUser ? (
            <>
              <span className="cv-kicker">CORRENTE DE BÊNÇÃO • VOCÊ FOI LEMBRADO(A)</span>
              <h1 className="cv-title">
                Você recebeu um presente com amor{userInfo.giftedByName ? ` de ${userInfo.giftedByName}` : ''}. Agora, abençoe outra vida!
              </h1>
              <p className="cv-subtitle">
                Alguém especial presenteou você com <strong>180 dias gratuitos no 1Convite</strong> porque desejou o melhor para a sua caminhada com Deus. Hoje você também pode ser canal de transformação: dê <strong>6 meses VIP completos</strong> para alguém que precisa de esperança, direção e Palavra diária — por apenas <strong>R$ 24,99</strong>.
              </p>
            </>
          ) : (
            <>
              <span className="cv-kicker">MULTIPLIQUE O REINO • SEU CÍRCULO DE FÉ</span>
              <h1 className="cv-title">
                Não guarde a Palavra só para você. Entregue um Convite VIP hoje!
              </h1>
              <p className="cv-subtitle">
                Cada <strong>Vale-Presente 1Convite</strong> libera <strong>180 dias de acesso VIP completo</strong> (Bíblia Narrada, Café com Deus 365, TemploFit e Mentores Bíblicos) sem o seu convidado pagar nada. Escolha um convite disponível abaixo ou adquira novos convites para sua família, célula ou igreja.
              </p>
            </>
          )}

          <div className="cv-stats-row">
            <div className="cv-stat-pill">
              <strong>{availableVouchers.length}</strong>
              <span>Disponíveis para enviar</span>
            </div>
            <div className="cv-stat-pill cv-stat-ok">
              <strong>{redeemedVouchers.length}</strong>
              <span>Vidas já abençoadas</span>
            </div>
          </div>
        </div>

        {/* Vitrine do Convite Prêmio Dourado */}
        <div className="cv-preview-wrap">
          <div className="cv-vip-card-visual">
            <div className="cv-vip-card-top">
              <img src={appLogoDark} alt="1Convite" className="cv-vip-logo" />
              <span className="cv-vip-pill">180 DIAS VIP GRÁTIS</span>
            </div>
            <div className="cv-vip-card-art">
              <img src={conviteVipArt} alt="Cartão Convite Prêmio 1Convite" />
            </div>
            <div className="cv-vip-card-bottom">
              <div className="cv-vip-quote">“Você é Especial • Presente de {(userInfo.name || userName || 'Um Amigo').split(' ')[0]}”</div>
              <div className="cv-vip-code-sample">{previewCode}</div>
            </div>
          </div>
          <p className="cv-preview-caption">
            Prévia oficial do Convite Prêmio enviado em PDF ou pelo WhatsApp
          </p>
        </div>
      </section>

      {/* Compra de Novos Convites VIP (R$ 24,99 unitário ou Pacote 10x R$ 240,99) */}
      <section className="cv-buy-section">
        <div className="cv-buy-header">
          <div>
            <span className="cv-kicker-green">EXPANDIR MEUS CONVITES</span>
            <h2>Envie o Reino para mais pessoas por apenas R$ 24,99</h2>
            <p>
              Compre 1 convite avulso ou escolha a quantidade que desejar. Cada convite dá <strong>6 meses VIP gratuitos</strong> para o seu convidado e fica salvo aqui na hora!
            </p>
          </div>
        </div>

        <div className="cv-buy-grid">
          {/* Card Quantidade Livre */}
          <div className="cv-offer-card">
            <div className="cv-offer-tag">COMPRA FLEXÍVEL • R$ 24,99 / CONVITE</div>
            <h3>Escolha quantos convites deseja</h3>
            <p className="cv-offer-desc">
              Ideal para presentear um amigo especial, cônjuge, filhos ou colegas de trabalho.
            </p>

            <div className="cv-qty-row">
              <button
                type="button"
                className="cv-qty-btn"
                onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="50"
                value={selectedQty}
                onChange={(e) => setSelectedQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="cv-qty-input"
              />
              <button
                type="button"
                className="cv-qty-btn"
                onClick={() => setSelectedQty((q) => Math.min(50, q + 1))}
                aria-label="Aumentar quantidade"
              >
                +
              </button>
              <div className="cv-qty-price">
                <strong>R$ {unitTotal.toFixed(2).replace('.', ',')}</strong>
                <small>{selectedQty} convite{selectedQty > 1 ? 's' : ''} VIP (180 dias cada)</small>
              </div>
            </div>

            <button
              type="button"
              className="cv-btn-primary"
              onClick={() => setCheckoutOffer({ offerId: 'convite_extra', quantity: selectedQty })}
            >
              Comprar {selectedQty} Convite{selectedQty > 1 ? 's' : ''} por R$ {unitTotal.toFixed(2).replace('.', ',')} →
            </button>
          </div>

          {/* Card Pacote Sugestão 10 Convites */}
          <div className="cv-offer-card cv-offer-highlight">
            <div className="cv-offer-tag cv-tag-gold">SUGESTÃO ESPECIAL • CÉLULAS &amp; FAMÍLIAS</div>
            <h3>Pacote 10 Convites VIP</h3>
            <p className="cv-offer-desc">
              Abençoe toda a sua célula, grupo de oração, ministério ou família com 10 Vales-Presente de 180 dias cada.
            </p>
            <div className="cv-pack-price">
              <span className="cv-price-old">De R$ 249,90</span>
              <strong>R$ 240,99</strong>
              <small>Apenas R$ 24,10 por vida alcançada</small>
            </div>
            <button
              type="button"
              className="cv-btn-gold"
              onClick={() => setCheckoutOffer({ offerId: 'convite_pacote_10', quantity: 1 })}
            >
              Garantir Pacote com 10 Convites (R$ 240,99) →
            </button>
          </div>
        </div>
      </section>

      {/* Lista de Convites VIP do Usuário */}
      <section className="cv-list-section">
        <div className="cv-list-head">
          <h2>Seus Convites VIP ({vouchers.length})</h2>
          <button type="button" className="cv-refresh-btn" onClick={loadConvites}>
            ↻ Atualizar Lista
          </button>
        </div>

        {loading ? (
          <div className="cv-empty-box">Carregando seus Convites VIP...</div>
        ) : vouchers.length === 0 ? (
          <div className="cv-empty-box">
            <h3>Você ainda não possui convites disponíveis na sua conta</h3>
            <p>
              Adquira seu primeiro Convite VIP acima por apenas <strong>R$ 24,99</strong> e envie o cartão-presente oficial em PDF ou pelo WhatsApp para abençoar alguém hoje!
            </p>
          </div>
        ) : (
          <div className="cv-vouchers-grid">
            {vouchers.map((v) => {
              const isUsed = v.usedCount >= v.maxUses;
              return (
                <div key={v.code} className={`cv-voucher-item ${isUsed ? 'is-used' : ''}`}>
                  <div className="cv-voucher-top">
                    <span className={`cv-status-badge ${isUsed ? 'used' : 'avail'}`}>
                      {isUsed ? '✓ RESGATADO' : '★ DISPONÍVEL PARA ENVIAR'}
                    </span>
                    <span className="cv-days-pill">{v.daysValid} dias VIP</span>
                  </div>

                  <div className="cv-voucher-code">{v.code}</div>

                  {isUsed ? (
                    <div className="cv-redeemed-info">
                      Presente ativado{v.redeemedByName ? ` por ${v.redeemedByName}` : ''}. Missão cumprida!
                    </div>
                  ) : (
                    <div className="cv-voucher-actions">
                      <button
                        type="button"
                        className="cv-act-wpp"
                        onClick={() => handleSendWhatsApp(v)}
                      >
                        Enviar no WhatsApp
                      </button>
                      <button
                        type="button"
                        className="cv-act-pdf"
                        disabled={downloadingCode === v.code}
                        onClick={() => handleDownloadPdf(v)}
                      >
                        {downloadingCode === v.code ? 'Gerando PDF...' : 'Baixar em PDF'}
                      </button>
                      <button
                        type="button"
                        className="cv-act-copy"
                        onClick={() => handleCopyInvite(v.code)}
                      >
                        {copiedCode === v.code ? '✓ Link Copiado' : 'Copiar Link'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Template oculto em alta resolução para gerar o PDF oficial do Convite Prêmio */}
      {pdfRenderVoucher && (
        <div className="cv-pdf-offscreen" aria-hidden="true">
          <div ref={pdfCardRef} className="cv-pdf-canvas-card">
            <div className="cv-pdf-top">
              <img src={appLogoDark} alt="1Convite" className="cv-pdf-logo" />
              <span className="cv-pdf-pill">VALE-PRESENTE • {pdfRenderVoucher.daysValid} DIAS VIP GRATUITOS</span>
            </div>
            <div className="cv-pdf-body">
              <div className="cv-pdf-art-col">
                <img src={conviteVipArt} alt="Convite VIP 1Convite" />
              </div>
              <div className="cv-pdf-info-col">
                <div className="cv-pdf-eyebrow">VOCÊ FOI LEMBRADO(A) COM CARINHO</div>
                <h2>Um presente especial de {(userInfo.name || userName || 'Alguém Especial')}</h2>
                <p>
                  Este Convite VIP libera acesso gratuito por {pdfRenderVoucher.daysValid} dias à Bíblia Sagrada ACF narrada, Café com Deus 365, TemploFit, 7 Mentores Bíblicos e Trilha do Reino.
                </p>
                <div className="cv-pdf-code-box">
                  <span>SEU CÓDIGO EXCLUSIVO DE RESGATE:</span>
                  <strong>{pdfRenderVoucher.code}</strong>
                </div>
                <div className="cv-pdf-link">
                  Acesse agora: https://1convite.com.br/app?vip={pdfRenderVoucher.code}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Checkout Asaas */}
      <AsaasCheckoutModal
        isOpen={Boolean(checkoutOffer)}
        offerId={checkoutOffer?.offerId || null}
        quantity={checkoutOffer?.quantity || 1}
        defaultName={userInfo.name || userName || ''}
        defaultEmail={userInfo.contact || userEmail || ''}
        onClose={() => setCheckoutOffer(null)}
        onSuccess={() => {
          loadConvites();
        }}
      />
    </div>
  );
}
