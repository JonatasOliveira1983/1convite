import React, { useState, useEffect } from 'react';

/**
 * ExerciseAvatarPlayer — Demonstração animada em loop com ilustrações anatômicas open-source (Wger).
 * Alterna entre a posição inicial e a posição de execução para simular o movimento real do exercício.
 */
const WGER_FRAMES = {
  jumping_jacks: ['/templofit/wger/jumping_jacks-1.png', '/templofit/wger/jumping_jacks-2.png'],
  high_knees: ['/templofit/wger/jumping_jacks-1.png', '/templofit/wger/jumping_jacks-2.png'],
  squat: ['/templofit/wger/squat-1.jpeg', '/templofit/wger/squat-2.jpeg'],
  pushup: ['/templofit/wger/pushup-1.png'],
  plank: ['/templofit/wger/plank-1.png', '/templofit/wger/plank-2.png'],
  lunge: ['/templofit/wger/lunge-1.png', '/templofit/wger/lunge-2.png'],
  tricep_dip: ['/templofit/wger/tricep_dip-1.png', '/templofit/wger/tricep_dip-2.png'],
  bench_press: ['/templofit/wger/bench_press-1.png', '/templofit/wger/bench_press-2.png'],
  lat_pulldown: ['/templofit/wger/lat_pulldown-1.png', '/templofit/wger/lat_pulldown-2.webp'],
  leg_press: ['/templofit/wger/leg_press-1.png', '/templofit/wger/leg_press-2.png'],
  shoulder_press: ['/templofit/wger/shoulder_press-1.png', '/templofit/wger/shoulder_press-2.png'],
  cat_cow: ['/templofit/wger/plank-1.png', '/templofit/wger/plank-2.png'],
  child_pose: ['/templofit/wger/plank-2.png'],
  torso_twist: ['/templofit/wger/plank-1.png', '/templofit/wger/plank-2.png'],
  stretch: ['/templofit/wger/lunge-1.png', '/templofit/wger/lunge-2.png'],
};

const ANIM_LABELS = {
  jumping_jacks: 'Posição inicial ↔ Abertura rítmica',
  squat: 'Flexão controlada de quadril e joelhos',
  pushup: 'Descida controlada e extensão de braços',
  plank: 'Estabilização isométrica do core',
  lunge: 'Passada alternada mantendo tronco ereto',
  tricep_dip: 'Flexão de cotovelos com apoio firme',
  high_knees: 'Elevação alternada em ritmo constante',
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
  const frames = WGER_FRAMES[animType] || WGER_FRAMES.squat;
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    setFrameIdx(0);
    if (frames.length <= 1) return undefined;
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, 1050);
    return () => clearInterval(timer);
  }, [animType, frames.length]);

  const currentSrc = frames[frameIdx] || frames[0];
  const caption = ANIM_LABELS[animType] || 'Execução guiada em ritmo constante';

  return (
    <div className="templofit-video-box" aria-label={`Demonstração animada: ${exerciseName}`}>
      <div className="templofit-video-badge">
        <span className="templofit-live-dot" />
        <span>EXECUÇÃO EM LOOP</span>
      </div>

      <div className="templofit-wger-frame-wrap">
        <img
          src={currentSrc}
          alt={exerciseName || 'Demonstração do exercício'}
          className={`templofit-wger-img ${frames.length === 1 ? 'templofit-single-pulse' : ''}`}
        />
      </div>

      <span className="templofit-video-caption">{caption}</span>
    </div>
  );
}
