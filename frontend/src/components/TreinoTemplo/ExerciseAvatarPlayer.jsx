import React from 'react';

/**
 * ExerciseAvatarPlayer — Demonstração animada em loop (SVG/CSS) para os exercícios do TemploFit.
 * Exibe o movimento biomecânico sincronizado ao lado do mapa muscular anatômico.
 */
const ANIM_LABELS = {
  jumping_jacks: 'Abertura rítmica de braços e pernas',
  squat: 'Flexão de quadril e joelhos a 90°',
  pushup: 'Descida controlada e extensão de braços',
  plank: 'Estabilização isométrica do core',
  lunge: 'Passada alternada mantendo tronco ereto',
  tricep_dip: 'Flexão de cotovelos com apoio firme',
  high_knees: 'Elevação alternada dos joelhos',
  cat_cow: 'Mobilidade fluida da coluna vertebral',
  child_pose: 'Descompressão lombar e alongamento',
  torso_twist: 'Rotação suave da região lombar',
  bench_press: 'Empurrada horizontal controlada',
  lat_pulldown: 'Puxada vertical focada nas dorsais',
  leg_press: 'Extensão controlada de membros inferiores',
  shoulder_press: 'Elevação vertical acima dos ombros',
  stretch: 'Respiração profunda e alongamento axial',
};

export default function ExerciseAvatarPlayer({ animType = 'squat', exerciseName = '' }) {
  const caption = ANIM_LABELS[animType] || 'Execução guiada em ritmo constante';

  return (
    <div className="templofit-video-box" aria-label={`Demonstração animada: ${exerciseName}`}>
      <div className="templofit-video-badge">
        <span className="templofit-live-dot" />
        <span>EXECUÇÃO EM LOOP</span>
      </div>

      <div className={`templofit-stage templofit-anim-${animType}`}>
        <svg viewBox="0 0 160 130" className="templofit-avatar-svg" role="img" aria-label={exerciseName}>
          {/* Linha de solo */}
          <line x1="16" y1="116" x2="144" y2="116" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="2" strokeLinecap="round" />

          {animType === 'plank' || animType === 'pushup' || animType === 'cat_cow' || animType === 'child_pose' || animType === 'torso_twist' ? (
            <g className="tf-body-floor">
              {/* Tapete */}
              <rect x="24" y="112" width="112" height="4" rx="2" fill="rgba(16, 185, 129, 0.35)" />
              {/* Cabeça */}
              <circle cx="114" cy="72" r="9" fill="#34D399" />
              {/* Tronco */}
              <line x1="106" y1="76" x2="54" y2="86" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              {/* Braços apoio */}
              <line x1="103" y1="79" x2="103" y2="112" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round" className="tf-arm" />
              {/* Pernas */}
              <line x1="54" y1="86" x2="30" y2="112" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" className="tf-leg" />
            </g>
          ) : animType === 'bench_press' ? (
            <g className="tf-body-bench">
              {/* Banco */}
              <rect x="34" y="96" width="84" height="7" rx="3" fill="#475569" />
              <line x1="44" y1="103" x2="44" y2="115" stroke="#475569" strokeWidth="4" />
              <line x1="108" y1="103" x2="108" y2="115" stroke="#475569" strokeWidth="4" />
              {/* Corpo deitado */}
              <circle cx="106" cy="86" r="8" fill="#34D399" />
              <line x1="98" y1="90" x2="52" y2="92" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              <line x1="52" y1="92" x2="34" y2="114" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" />
              {/* Barra e braços em movimento */}
              <g className="tf-bar-group">
                <line x1="88" y1="88" x2="88" y2="52" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
                <line x1="68" y1="52" x2="108" y2="52" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                <circle cx="68" cy="52" r="5" fill="#F59E0B" />
                <circle cx="108" cy="52" r="5" fill="#F59E0B" />
              </g>
            </g>
          ) : (
            <g className="tf-body-standing">
              {/* Cabeça */}
              <circle cx="80" cy="28" r="10" fill="#34D399" className="tf-head" />
              {/* Tronco */}
              <line x1="80" y1="40" x2="80" y2="76" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" className="tf-torso" />
              {/* Braço Esquerdo */}
              <line x1="76" y1="45" x2="52" y2="66" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round" className="tf-arm-left" />
              {/* Braço Direito */}
              <line x1="84" y1="45" x2="108" y2="66" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round" className="tf-arm-right" />
              {/* Perna Esquerda */}
              <line x1="76" y1="76" x2="64" y2="114" stroke="#CBD5E1" strokeWidth="6.5" strokeLinecap="round" className="tf-leg-left" />
              {/* Perna Direita */}
              <line x1="84" y1="76" x2="96" y2="114" stroke="#CBD5E1" strokeWidth="6.5" strokeLinecap="round" className="tf-leg-right" />
            </g>
          )}
        </svg>
      </div>

      <span className="templofit-video-caption">{caption}</span>
    </div>
  );
}
