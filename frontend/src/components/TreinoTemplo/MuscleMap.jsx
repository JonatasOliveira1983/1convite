import React from 'react';

/**
 * MuscleMap — Avatar Anatômico Interativo do Corpo Humano (Estilo OpenGym)
 * Mapeia e ilumina grupos musculares trabalhados nos treinos.
 * Grupos suportados:
 * - chest (Peitoral)
 * - shoulders (Ombros / Deltoides)
 * - biceps (Bíceps)
 * - triceps (Tríceps)
 * - abs (Abdômen / Core)
 * - back (Costas / Dorsais / Trapézio)
 * - glutes (Glúteos)
 * - quads (Quadríceps / Coxas Frente)
 * - hamstrings (Posterior de Coxa)
 * - calves (Panturrilhas)
 */

export default function MuscleMap({ 
  highlightMuscles = [], 
  view = 'frente', // 'frente', 'costas', 'ambos'
  size = 'md', // 'sm', 'md', 'lg'
  interactive = false,
  onSelectMuscle = null 
}) {
  const isHighlighted = (group) => highlightMuscles.includes(group);

  const activeColor = '#10B981'; // Verde Esmeralda Vitalidade
  const activeGlow = 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))';
  const inactiveColor = '#242833'; // Grafite escuro refinado
  const strokeColor = 'rgba(255, 255, 255, 0.08)';

  const dimensions = {
    sm: { width: 44, height: 80 },
    md: { width: 75, height: 135 },
    lg: { width: 110, height: 200 }
  }[size] || { width: 75, height: 135 };

  // SVG Anatômico Visão Frontal
  const renderFront = () => (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 100 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Cabeça e Pescoço (Silhueta Neutra) */}
      <circle cx="50" cy="16" r="10" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M46 26H54V32H46V26Z" fill={inactiveColor} />

      {/* Ombros / Deltoides */}
      <path 
        d="M26 36C26 33 30 30 36 30L34 44L26 42C25 40 25 38 26 36Z" 
        fill={isHighlighted('shoulders') ? activeColor : inactiveColor} 
        filter={isHighlighted('shoulders') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M74 36C74 33 70 30 64 30L66 44L74 42C75 40 75 38 74 36Z" 
        fill={isHighlighted('shoulders') ? activeColor : inactiveColor} 
        filter={isHighlighted('shoulders') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Peitoral (Chest) */}
      <path 
        d="M37 32C42 32 48 35 49 39L49 52C44 52 36 50 34 46L37 32Z" 
        fill={isHighlighted('chest') ? activeColor : inactiveColor} 
        filter={isHighlighted('chest') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M63 32C58 32 52 35 51 39L51 52C56 52 64 50 66 46L63 32Z" 
        fill={isHighlighted('chest') ? activeColor : inactiveColor} 
        filter={isHighlighted('chest') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Bíceps (Braços Frente) */}
      <path 
        d="M24 45C27 45 29 48 28 58L22 57C21 52 22 47 24 45Z" 
        fill={isHighlighted('biceps') ? activeColor : inactiveColor} 
        filter={isHighlighted('biceps') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M76 45C73 45 71 48 72 58L78 57C79 52 78 47 76 45Z" 
        fill={isHighlighted('biceps') ? activeColor : inactiveColor} 
        filter={isHighlighted('biceps') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Antebraços */}
      <path d="M22 60L27 60L25 76L20 74L22 60Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M78 60L73 60L75 76L80 74L78 60Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />

      {/* Abdômen / Core (Abs) */}
      <path 
        d="M40 54H60L58 76H42L40 54Z" 
        fill={isHighlighted('abs') ? activeColor : inactiveColor} 
        filter={isHighlighted('abs') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      {/* Detalhes dos gomos do abdômen */}
      <line x1="50" y1="55" x2="50" y2="75" stroke={strokeColor} strokeWidth="1" />
      <line x1="42" y1="62" x2="58" y2="62" stroke={strokeColor} strokeWidth="1" />
      <line x1="43" y1="69" x2="57" y2="69" stroke={strokeColor} strokeWidth="1" />

      {/* Quadril / Pelve */}
      <path d="M41 78H59L55 90H45L41 78Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />

      {/* Quadríceps / Coxas (Quads) */}
      <path 
        d="M37 92C42 92 47 94 46 118L36 118C34 108 34 98 37 92Z" 
        fill={isHighlighted('quads') ? activeColor : inactiveColor} 
        filter={isHighlighted('quads') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M63 92C58 92 53 94 54 118L64 118C66 108 66 98 63 92Z" 
        fill={isHighlighted('quads') ? activeColor : inactiveColor} 
        filter={isHighlighted('quads') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Joelhos */}
      <circle cx="41" cy="123" r="4" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <circle cx="59" cy="123" r="4" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />

      {/* Panturrilhas / Canelas (Calves) */}
      <path 
        d="M38 128C43 128 44 135 43 155L37 155C35 145 36 135 38 128Z" 
        fill={isHighlighted('calves') ? activeColor : inactiveColor} 
        filter={isHighlighted('calves') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M62 128C57 128 56 135 57 155L63 155C65 145 64 135 62 128Z" 
        fill={isHighlighted('calves') ? activeColor : inactiveColor} 
        filter={isHighlighted('calves') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Pés */}
      <path d="M36 158H44L46 166H34L36 158Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M64 158H56L54 166H66L64 158Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
    </svg>
  );

  // SVG Anatômico Visão Dorsal (Costas)
  const renderBack = () => (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 100 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Cabeça e Pescoço (Silhueta Neutra) */}
      <circle cx="50" cy="16" r="10" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M46 26H54V32H46V26Z" fill={inactiveColor} />

      {/* Trapézio & Costas Superiores (Back) */}
      <path 
        d="M44 30L50 26L56 30L64 36L50 50L36 36L44 30Z" 
        fill={isHighlighted('back') ? activeColor : inactiveColor} 
        filter={isHighlighted('back') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Ombros Traseiros (Posterior Deltoid) */}
      <path 
        d="M26 36C26 33 30 30 36 30L34 44L26 42C25 40 25 38 26 36Z" 
        fill={isHighlighted('shoulders') ? activeColor : inactiveColor} 
        filter={isHighlighted('shoulders') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M74 36C74 33 70 30 64 30L66 44L74 42C75 40 75 38 74 36Z" 
        fill={isHighlighted('shoulders') ? activeColor : inactiveColor} 
        filter={isHighlighted('shoulders') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Grande Dorsal (Lats - Costas) */}
      <path 
        d="M34 46C38 52 46 54 48 68L42 74C37 66 33 55 34 46Z" 
        fill={isHighlighted('back') ? activeColor : inactiveColor} 
        filter={isHighlighted('back') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M66 46C62 52 54 54 52 68L58 74C63 66 67 55 66 46Z" 
        fill={isHighlighted('back') ? activeColor : inactiveColor} 
        filter={isHighlighted('back') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Tríceps (Braço Costas) */}
      <path 
        d="M24 45C27 45 29 48 28 58L22 57C21 52 22 47 24 45Z" 
        fill={isHighlighted('triceps') ? activeColor : inactiveColor} 
        filter={isHighlighted('triceps') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M76 45C73 45 71 48 72 58L78 57C79 52 78 47 76 45Z" 
        fill={isHighlighted('triceps') ? activeColor : inactiveColor} 
        filter={isHighlighted('triceps') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Antebraços */}
      <path d="M22 60L27 60L25 76L20 74L22 60Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M78 60L73 60L75 76L80 74L78 60Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />

      {/* Glúteos (Glutes) */}
      <path 
        d="M39 78C44 78 49 80 49 92C43 93 37 90 36 84C36 80 37 78 39 78Z" 
        fill={isHighlighted('glutes') ? activeColor : inactiveColor} 
        filter={isHighlighted('glutes') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M61 78C56 78 51 80 51 92C57 93 63 90 64 84C64 80 63 78 61 78Z" 
        fill={isHighlighted('glutes') ? activeColor : inactiveColor} 
        filter={isHighlighted('glutes') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Isquiotibiais / Posterior de Coxa (Hamstrings) */}
      <path 
        d="M37 94C43 94 47 96 46 118L36 118C34 108 34 100 37 94Z" 
        fill={isHighlighted('hamstrings') ? activeColor : inactiveColor} 
        filter={isHighlighted('hamstrings') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M63 94C57 94 53 96 54 118L64 118C66 108 66 100 63 94Z" 
        fill={isHighlighted('hamstrings') ? activeColor : inactiveColor} 
        filter={isHighlighted('hamstrings') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Joelhos Posteriores */}
      <circle cx="41" cy="123" r="3.5" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <circle cx="59" cy="123" r="3.5" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />

      {/* Panturrilhas Posteriores (Calves) */}
      <path 
        d="M38 127C44 127 45 136 43 155L37 155C35 145 35 135 38 127Z" 
        fill={isHighlighted('calves') ? activeColor : inactiveColor} 
        filter={isHighlighted('calves') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />
      <path 
        d="M62 127C56 127 55 136 57 155L63 155C65 145 65 135 62 127Z" 
        fill={isHighlighted('calves') ? activeColor : inactiveColor} 
        filter={isHighlighted('calves') ? activeGlow : 'none'}
        stroke={strokeColor} strokeWidth="1"
      />

      {/* Pés */}
      <path d="M37 158H43L44 165H36L37 158Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
      <path d="M63 158H57L56 165H64L63 158Z" fill={inactiveColor} stroke={strokeColor} strokeWidth="1" />
    </svg>
  );

  if (view === 'ambos') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {renderFront()}
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frente</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {renderBack()}
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Costas</span>
        </div>
      </div>
    );
  }

  return view === 'costas' ? renderBack() : renderFront();
}
