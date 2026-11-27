import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import './ConvitesVipView.css';
import appLogoDark from '../../assets/logomarca_dark.png';
import voucherGoldTexture from '../../assets/convites/voucher-rajado-dourado.jpg';
import pacoteSementeiraBg from '../../assets/convites/pacote-sementeira.jpg';
import pacoteColheitaBg from '../../assets/convites/pacote-colheita.jpg';
import pacoteEmbaixadoresBg from '../../assets/convites/pacote-embaixadores.jpg';
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

const VERSICULOS_SUGESTAO = [
  {
    id: 'numeros',
    label: 'Números 6:24',
    texto: '“O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti.”',
  },
  {
    id: 'jeremias',
    label: 'Jeremias 29:11',
    texto: '“Eu é que sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e de esperança.”',
  },
  {
    id: 'salmos',
    label: 'Salmos 23:1',
    texto: '“O Senhor é o meu pastor; nada me faltará. Ele refrigera a minha alma e guia meus passos.”',
  },
];

const PACOTES_ESPECIAIS = [
  {
    offerId: 'convite_pacote_10',
    nome: 'Pacote Sementeira',
    qtd: 10,
    desconto: '5% OFF',
    precoOriginal: 'R$ 249,90',
    precoFinal: 'R$ 237,40',
    unitInfo: 'R$ 23,74 por convite',
    desc: 'Ideal para abençoar familiares próximos e amigos queridos.',
    bgImage: pacoteSementeiraBg,
    highlight: false,
  },
  {
    offerId: 'convite_pacote_15',
    nome: 'Pacote Colheita',
    qtd: 15,
    desconto: '10% OFF',
    precoOriginal: 'R$ 374,85',
    precoFinal: 'R$ 337,35',
    unitInfo: 'R$ 22,49 por convite',
    desc: 'Perfeito para células, grupos de oração e discipulado.',
    bgImage: pacoteColheitaBg,
    highlight: false,
  },
  {
    offerId: 'convite_pacote_20',
    nome: 'Pacote Embaixadores do Reino',
    qtd: 20,
    desconto: '15% OFF • Melhor Custo',
    precoOriginal: 'R$ 499,80',
    precoFinal: 'R$ 424,83',
    unitInfo: 'R$ 21,24 por convite',
    desc: 'Para líderes, pastores e evangelismo de alto impacto na igreja.',
    bgImage: pacoteEmbaixadoresBg,
    highlight: true,
  },
];

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

  const pageW = 595;
  const pageH = 842;
  const margin = 28;
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
  const [sharingCode, setSharingCode] = useState('');
  const [shareToast, setShareToast] = useState('');
  const [pdfRenderVoucher, setPdfRenderVoucher] = useState(null);

  const [recipientName, setRecipientName] = useState('');
  const [customDedication, setCustomDedication] = useState(VERSICULOS_SUGESTAO[0].texto);
  const [previewQrUrl, setPreviewQrUrl] = useState('');
  const [pdfQrUrl, setPdfQrUrl] = useState('');
  const pdfCardRef = useRef(null);
  const buySectionRef = useRef(null);

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
  const activeVoucher = availableVouchers[0] || null;
  const previewCode = activeVoucher?.code || vouchers[0]?.code || 'REINO-VIP';

  useEffect(() => {
    const url = `https://1convite.com.br/app?vip=${encodeURIComponent(previewCode)}`;
    QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: { dark: '#0B0B0F', light: '#F5E199' },
    })
      .then((dataUrl) => setPreviewQrUrl(dataUrl))
      .catch(() => {});
  }, [previewCode]);

  const handleCopyInvite = (code) => {
    const link = `https://1convite.com.br/app?vip=${encodeURIComponent(code)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const renderVoucherCanvas = async (voucher) => {
    const link = `https://1convite.com.br/app?vip=${encodeURIComponent(voucher.code)}`;
    const qrData = await QRCode.toDataURL(link, {
      width: 260,
      margin: 1,
      color: { dark: '#0B0B0F', light: '#F5E199' },
    });
    setPdfQrUrl(qrData);
    setPdfRenderVoucher(voucher);

    await new Promise((r) => setTimeout(r, 200));
    if (!pdfCardRef.current) {
      throw new Error('Cartão do voucher não disponível.');
    }
    return html2canvas(pdfCardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#060911',
    });
  };

  const handleSendWhatsApp = async (voucher) => {
    if (!voucher) return;
    setSharingCode(voucher.code);
    setShareToast('');
    const sender = userInfo.name || userName || 'um amigo especial';
    const link = `https://1convite.com.br/app?vip=${encodeURIComponent(voucher.code)}`;
    const saudacao = recipientName.trim() ? `Olá, ${recipientName.trim()}! ` : 'Olá! ';
    const msg =
      `${saudacao}Deus colocou você no meu coração hoje.\n\n` +
      `${customDedication}\n\n` +
      `Estou te presenteando com um *Convite VIP 1Convite (${voucher.daysValid} dias grátis)* enviado por *${sender}*!\n` +
      `Você vai ter acesso à Bíblia Sagrada ACF narrada, Café com Deus 365, TemploFit e Mentores Bíblicos.\n\n` +
      `*Seu Código VIP:* ${voucher.code}\n` +
      `*Resgate seu presente aqui:* ${link}`;

    try {
      const canvas = await renderVoucherCanvas(voucher);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.96));
      if (blob) {
        const file = new File([blob], `Convite-VIP-1Convite-${voucher.code}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Convite VIP 1Convite',
            text: msg,
          });
          setShareToast('Convite compartilhado com a imagem e o link!');
          setTimeout(() => setShareToast(''), 5000);
          return;
        }

        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
            setShareToast('Imagem do Voucher copiada! No WhatsApp Web, aperte Ctrl+V na conversa para enviar o cartão junto com o link.');
            setTimeout(() => setShareToast(''), 8000);
          } catch {
            // fallback apenas texto se clipboard de imagem for bloqueado
          }
        }
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    } catch (err) {
      if (err?.name !== 'AbortError') {
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setSharingCode('');
      setPdfRenderVoucher(null);
    }
  };

  const handleDownloadPng = async (voucher) => {
    if (!voucher) return;
    setDownloadingCode(`png_${voucher.code}`);
    try {
      const canvas = await renderVoucherCanvas(voucher);
      const pngUrl = canvas.toDataURL('image/png', 0.96);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `Convite-VIP-1Convite-${voucher.code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao baixar PNG do convite:', err);
    } finally {
      setDownloadingCode('');
      setPdfRenderVoucher(null);
    }
  };

  const handleDownloadPdf = async (voucher) => {
    if (!voucher) return;
    setDownloadingCode(voucher.code);
    try {
      const canvas = await renderVoucherCanvas(voucher);
      const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
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
  };

  const unitTotal = selectedQty === 10
    ? 237.4
    : selectedQty === 15
      ? 337.35
      : selectedQty === 20
        ? 424.83
        : Number((24.99 * selectedQty).toFixed(2));
  const senderDisplay = (userInfo.name || userName || 'Um Irmão em Cristo').trim();

  return (
    <div className="cv-container">
      {/* Header Unslop */}
      <div className="cv-topbar">
        <button type="button" className="cv-back-btn" onClick={onBack}>
          ← Voltar
        </button>
        <span className="cv-badge-gold">Controle de Convites VIP</span>
      </div>

      {/* Hero Personalizado + Prévia Fiel do Voucher Vertical Alto com Fundo Rajado Dourado */}
      <section className="cv-hero-card">
        <div className="cv-hero-copy">
          {userInfo.isInvitedUser ? (
            <>
              <span className="cv-kicker">Corrente de Bênção • Você foi lembrado(a)</span>
              <h1 className="cv-title">
                Você recebeu um presente{userInfo.giftedByName ? ` de ${userInfo.giftedByName}` : ''}. Agora, abençoe outra vida!
              </h1>
              <p className="cv-subtitle">
                Alguém especial presenteou você com <strong>180 dias gratuitos no 1Convite</strong> porque desejou o melhor para a sua caminhada com Deus. Hoje você também pode ser canal de transformação: dê <strong>6 meses VIP completos</strong> para alguém que ama por apenas <strong>R$ 24,99</strong>.
              </p>
            </>
          ) : (
            <>
              <span className="cv-kicker">Multiplique o Reino • Seu Círculo de Fé</span>
              <h1 className="cv-title">
                Não guarde a Palavra só para você. Entregue um Convite VIP hoje!
              </h1>
              <p className="cv-subtitle">
                Cada <strong>Vale-Presente 1Convite</strong> libera <strong>180 dias de acesso VIP completo</strong> (Bíblia Narrada, Café com Deus 365, TemploFit e Mentores Bíblicos) sem o seu convidado pagar nada. Personalize a dedicatória abaixo, baixe o Cartão-Joia em PDF ou envie no WhatsApp.
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

          <div className="cv-dedication-box">
            <label className="cv-dedication-label">
              Personalize seu cartão antes de baixar em PDF ou enviar:
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Para: Nome do amigo ou familiar (opcional)"
              className="cv-dedication-input"
              maxLength={45}
            />
            <div className="cv-verse-pills">
              {VERSICULOS_SUGESTAO.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`cv-verse-pill ${customDedication === v.texto ? 'active' : ''}`}
                  onClick={() => setCustomDedication(v.texto)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prévia do Voucher Vertical Mais Alto com Fundo Rajado Dourado + Botões Logo Abaixo */}
        <div className="cv-preview-wrap">
          <div className="cv-gv-card">
            <div
              className="cv-gv-inner"
              style={{
                backgroundImage: `linear-gradient(175deg, rgba(10, 10, 14, 0.72) 0%, rgba(12, 11, 16, 0.84) 100%), url(${voucherGoldTexture})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="cv-gv-gold-bars" aria-hidden="true">
                <div className="cv-gv-bar cv-gv-bar-1" />
                <div className="cv-gv-bar cv-gv-bar-2" />
              </div>

              <div className="cv-gv-header">
                <img src={appLogoDark} alt="1Convite" className="cv-gv-logo" />
                <div className="cv-gv-seal">
                  <span className="cv-gv-seal-big">180</span>
                  <span className="cv-gv-seal-small">DIAS</span>
                  <span className="cv-gv-seal-small">GRÁTIS</span>
                </div>
              </div>

              <div className="cv-gv-kicker">Gift Voucher • VIP</div>
              <h2 className="cv-gv-serif-title">Você é Especial</h2>

              <div className="cv-gv-people">
                {recipientName.trim() && (
                  <div className="cv-gv-to">Para: <strong>{recipientName.trim()}</strong></div>
                )}
                <div className="cv-gv-from">Presente de <strong>{senderDisplay}</strong></div>
              </div>

              <p className="cv-gv-dedication">{customDedication}</p>

              {/* Divisória tracejada bem destacada */}
              <div className="cv-gv-coupon-tear">
                <span className="cv-tear-icon">✂</span>
                <span className="cv-tear-line" />
              </div>

              <div className="cv-gv-bottom-grid">
                <div className="cv-gv-code-box">
                  <span className="cv-gv-code-label">Código do Seu Convite</span>
                  <strong className="cv-gv-code-value">{previewCode}</strong>
                </div>
                {previewQrUrl && (
                  <div className="cv-gv-qr-box">
                    <img src={previewQrUrl} alt="QR Code de Ativação" />
                  </div>
                )}
              </div>

              <div className="cv-gv-auth-seal">
                Convite Oficial • Ecossistema 1Convite
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida Logo Abaixo do Voucher */}
          {activeVoucher ? (
            <div className="cv-preview-actions">
              <button
                type="button"
                className="cv-preview-btn-wpp"
                disabled={sharingCode === activeVoucher.code}
                onClick={() => handleSendWhatsApp(activeVoucher)}
              >
                {sharingCode === activeVoucher.code ? 'Preparando imagem...' : 'Enviar no WhatsApp (com Imagem)'}
              </button>
              <button
                type="button"
                className="cv-preview-btn-pdf"
                disabled={downloadingCode === activeVoucher.code}
                onClick={() => handleDownloadPdf(activeVoucher)}
              >
                {downloadingCode === activeVoucher.code ? 'Gerando PDF...' : 'Baixar em PDF'}
              </button>
              <button
                type="button"
                className="cv-preview-btn-png"
                disabled={downloadingCode === `png_${activeVoucher.code}`}
                onClick={() => handleDownloadPng(activeVoucher)}
              >
                {downloadingCode === `png_${activeVoucher.code}` ? 'Gerando PNG...' : 'Baixar Imagem (PNG)'}
              </button>
            </div>
          ) : (
            <div className="cv-preview-actions">
              <button
                type="button"
                className="cv-preview-btn-buy"
                onClick={() => buySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                Adquirir Convite VIP Abaixo ↓
              </button>
            </div>
          )}

          {shareToast && (
            <div className="cv-share-toast">{shareToast}</div>
          )}

          <p className="cv-preview-caption">
            {activeVoucher
              ? `Usando seu convite disponível: ${activeVoucher.code}`
              : 'Prévia oficial do Voucher Vertical com QR Code e dedicatória'}
          </p>
        </div>
      </section>

      {/* Compra de Novos Convites: Avulso + 3 Pacotes Especiais com Imagens Temáticas */}
      <section ref={buySectionRef} className="cv-buy-section">
        <div className="cv-buy-header">
          <div>
            <span className="cv-kicker-green">Expandir Meus Convites</span>
            <h2>Escolha um Pacote Especial ou compre a quantidade desejada</h2>
            <p>
              Cada convite dá <strong>6 meses VIP gratuitos</strong> para o seu convidado e fica liberado na hora para baixar em PDF ou enviar pelo WhatsApp.
            </p>
          </div>
        </div>

        {/* 3 Pacotes Especiais com Imagens de Fundo Exclusivas */}
        <div className="cv-packages-grid">
          {PACOTES_ESPECIAIS.map((pkg) => (
            <div
              key={pkg.offerId}
              className={`cv-pkg-card ${pkg.highlight ? 'is-featured' : ''}`}
            >
              <img src={pkg.bgImage} alt={pkg.nome} className="cv-pkg-bg" />
              <div className="cv-pkg-overlay" />
              <div className="cv-pkg-content">
                <div className="cv-pkg-top">
                  <span className="cv-pkg-discount">{pkg.desconto}</span>
                  <span className="cv-pkg-qty">{pkg.qtd} convites VIP</span>
                </div>
                <h3 className="cv-pkg-title">{pkg.nome}</h3>
                <p className="cv-pkg-desc">{pkg.desc}</p>
                <div className="cv-pkg-pricing">
                  <span className="cv-price-old">De {pkg.precoOriginal}</span>
                  <strong className="cv-pkg-price">{pkg.precoFinal}</strong>
                  <small className="cv-pkg-unit">{pkg.unitInfo}</small>
                </div>
                <button
                  type="button"
                  className={pkg.highlight ? 'cv-btn-gold' : 'cv-btn-primary'}
                  onClick={() => setCheckoutOffer({ offerId: pkg.offerId, quantity: 1 })}
                >
                  Garantir {pkg.qtd} Convites →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Compra Flexível Unitária */}
        <div className="cv-unit-bar">
          <div className="cv-unit-copy">
            <span className="cv-offer-tag">Compra Flexível • R$ 24,99 / convite</span>
            <h3>Ou escolha qualquer quantidade personalizada</h3>
            <p>Compre 1 convite avulso ou ajuste abaixo a quantidade exata que deseja enviar hoje.</p>
          </div>
          <div className="cv-unit-controls">
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
                <small>{selectedQty} convite{selectedQty > 1 ? 's' : ''}</small>
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
              Escolha um dos pacotes acima ou adquira um Convite VIP avulso por apenas <strong>R$ 24,99</strong> para baixar o PDF com QR Code ou enviar pelo WhatsApp.
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
                      {isUsed ? '✓ Resgatado' : '★ Disponível para enviar'}
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
                        disabled={sharingCode === v.code}
                        onClick={() => handleSendWhatsApp(v)}
                      >
                        {sharingCode === v.code ? 'Preparando imagem...' : 'Enviar no WhatsApp (com Imagem)'}
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
                        disabled={downloadingCode === `png_${v.code}`}
                        onClick={() => handleDownloadPng(v)}
                      >
                        {downloadingCode === `png_${v.code}` ? 'Gerando PNG...' : 'Baixar Imagem'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Template PDF offscreen fiel ao Voucher Vertical Mais Alto com Fundo Rajado Dourado + QR Maior */}
      {pdfRenderVoucher && (
        <div className="cv-pdf-offscreen" aria-hidden="true">
          <div ref={pdfCardRef} className="cv-pdf-luxury-sheet">
            <div className="cv-gv-card cv-gv-card-pdf">
              <div
                className="cv-gv-inner cv-gv-inner-pdf"
                style={{
                  backgroundImage: `linear-gradient(175deg, rgba(10, 10, 14, 0.72) 0%, rgba(12, 11, 16, 0.85) 100%), url(${voucherGoldTexture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="cv-gv-gold-bars" aria-hidden="true">
                  <div className="cv-gv-bar cv-gv-bar-1" />
                  <div className="cv-gv-bar cv-gv-bar-2" />
                </div>

                <div className="cv-gv-header">
                  <img src={appLogoDark} alt="1Convite" className="cv-gv-logo cv-gv-logo-pdf" />
                  <div className="cv-gv-seal cv-gv-seal-pdf">
                    <span className="cv-gv-seal-big">{pdfRenderVoucher.daysValid}</span>
                    <span className="cv-gv-seal-small">DIAS</span>
                    <span className="cv-gv-seal-small">GRÁTIS</span>
                  </div>
                </div>

                <div className="cv-gv-kicker">Gift Voucher • VIP</div>
                <h2 className="cv-gv-serif-title cv-gv-serif-pdf">Você é Especial</h2>

                <div className="cv-gv-people">
                  {recipientName.trim() && (
                    <div className="cv-gv-to">Para: <strong>{recipientName.trim()}</strong></div>
                  )}
                  <div className="cv-gv-from">Presente de <strong>{senderDisplay}</strong></div>
                </div>

                <p className="cv-gv-dedication cv-gv-dedication-pdf">{customDedication}</p>

                <p className="cv-pdf-benefits">
                  Bíblia Sagrada ACF Narrada • Café com Deus 365 • TemploFit • 7 Mentores Bíblicos • Trilha do Reino
                </p>

                <div className="cv-gv-coupon-tear">
                  <span className="cv-tear-icon">✂</span>
                  <span className="cv-tear-line" />
                </div>

                <div className="cv-gv-bottom-grid cv-gv-bottom-pdf">
                  <div className="cv-gv-code-box cv-gv-code-box-pdf">
                    <span className="cv-gv-code-label">Código do Seu Convite</span>
                    <strong className="cv-gv-code-value">{pdfRenderVoucher.code}</strong>
                  </div>
                  {pdfQrUrl && (
                    <div className="cv-gv-qr-box cv-gv-qr-pdf">
                      <img src={pdfQrUrl} alt="QR Code" />
                    </div>
                  )}
                </div>

                <div className="cv-pdf-steps">
                  <div><strong>1.</strong> Aponte a câmera para o QR Code ou acesse <strong>1convite.com.br/app</strong></div>
                  <div><strong>2.</strong> Toque em <strong>Tenho um Convite VIP</strong> e digite o código acima</div>
                  <div><strong>3.</strong> Crie seu acesso gratuito e aproveite <strong>{pdfRenderVoucher.daysValid} dias VIP</strong></div>
                </div>

                <div className="cv-gv-auth-seal">
                  Convite Oficial • Ecossistema 1Convite • Código {pdfRenderVoucher.code}
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
