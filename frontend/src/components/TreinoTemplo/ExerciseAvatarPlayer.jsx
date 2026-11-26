import React from 'react';

/**
 * ExerciseAvatarPlayer — Demonstração em GIF animado em loop contínuo (ilustrações open-source Wger).
 */
const WGER_GIFS = {
  jumping_jacks: '/templofit/gifs/jumping_jacks.gif',
  high_knees: '/templofit/gifs/jumping_jacks.gif',
  squat: '/templofit/gifs/squat.gif',
  pushup: '/templofit/gifs/pushup.gif',
  plank: '/templofit/gifs/plank.gif',
  lunge: '/templofit/gifs/lunge.gif',
  tricep_dip: '/templofit/gifs/tricep_dip.gif',
  bench_press: '/templofit/gifs/bench_press.gif',
  lat_pulldown: '/templofit/gifs/lat_pulldown.gif',
  leg_press: '/templofit/gifs/leg_press.gif',
  shoulder_press: '/templofit/gifs/shoulder_press.gif',
  cat_cow: '/templofit/gifs/plank.gif',
  child_pose: '/templofit/gifs/plank.gif',
  torso_twist: '/templofit/gifs/plank.gif',
  stretch: '/templofit/gifs/lunge.gif',
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

export default function ExerciseAvatarPlayer({ animType = 'squat', gifUrl = '', exerciseName = '' }) {
  const gifSrc = gifUrl || WGER_GIFS[animType] || WGER_GIFS.squat;
  const caption = ANIM_LABELS[animType] || 'Execução guiada em ritmo constante';

  return (
    <div className="templofit-video-box" aria-label={`Demonstração animada: ${exerciseName}`}>
      <div className="templofit-video-badge">
        <span className="templofit-live-dot" />
        <span>EXECUÇÃO EM LOOP</span>
      </div>

      <div className="templofit-wger-frame-wrap">
        <img
          src={gifSrc}
          alt={exerciseName || 'Demonstração do exercício'}
          className="templofit-wger-img"
        />
      </div>

      <span className="templofit-video-caption">{caption}</span>
    </div>
  );
}
