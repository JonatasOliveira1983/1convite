import ALL_EXERCISES from '../data/openGymCatalogue.json';

export const OPENGYM_BODYPARTS = [
  { id: 'all', label: 'Todos os Músculos' },
  { id: 'chest', label: 'Peitoral' },
  { id: 'back', label: 'Costas' },
  { id: 'shoulders', label: 'Ombros' },
  { id: 'upper arms', label: 'Braços (Bíceps/Tríceps)' },
  { id: 'upper legs', label: 'Pernas / Coxas' },
  { id: 'lower legs', label: 'Panturrilhas' },
  { id: 'waist', label: 'Abdômen / Core' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'full body', label: 'Corpo Inteiro' },
  { id: 'neck', label: 'Pescoço' },
];

export const OPENGYM_EQUIPMENTS = [
  { id: 'all', label: 'Qualquer Equipamento' },
  { id: 'body weight', label: 'Peso Corporal' },
  { id: 'dumbbell', label: 'Halteres' },
  { id: 'barbell', label: 'Barra' },
  { id: 'cable', label: 'Polia / Cabo' },
  { id: 'leverage machine', label: 'Aparelho / Máquina' },
  { id: 'band', label: 'Faixa Elástica' },
  { id: 'smith machine', label: 'Smith Machine' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'stability ball', label: 'Bola Suíça' },
  { id: 'weighted', label: 'Com Carga Extra' },
];

export const openGymCatalogueService = {
  getTotalCount() {
    return ALL_EXERCISES.length;
  },

  getAll() {
    return ALL_EXERCISES;
  },

  search({ query = '', bodyPart = 'all', equipment = 'all', page = 1, limit = 24 }) {
    const q = query.trim().toLowerCase();

    const filtered = ALL_EXERCISES.filter((ex) => {
      if (bodyPart !== 'all' && ex.bodyPart !== bodyPart) return false;
      if (equipment !== 'all' && ex.equipment !== equipment) return false;
      if (q) {
        const matchName = ex.nome.toLowerCase().includes(q);
        const matchEn = (ex.nomeEn || '').toLowerCase().includes(q);
        const matchTarget = (ex.target || '').toLowerCase().includes(q);
        const matchId = String(ex.id) === q;
        if (!matchName && !matchEn && !matchTarget && !matchId) return false;
      }
      return true;
    });

    const start = (page - 1) * limit;
    const paginated = filtered.slice(0, start + limit);

    return {
      total: filtered.length,
      hasMore: paginated.length < filtered.length,
      items: paginated,
    };
  },
};
