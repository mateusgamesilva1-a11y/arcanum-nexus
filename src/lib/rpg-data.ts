// ============================================================
// RPG SYSTEM DATA — Complete game rules and structure
// ============================================================

export type AttributeKey = "forca" | "constituicao" | "agilidade" | "intelecto" | "presenca";

export const ATTRIBUTE_NAMES: Record<AttributeKey, string> = {
  forca: "Força",
  constituicao: "Constituição",
  agilidade: "Agilidade",
  intelecto: "Intelecto",
  presenca: "Presença",
};

export const ATTRIBUTE_SHORT: Record<AttributeKey, string> = {
  forca: "FOR",
  constituicao: "CON",
  agilidade: "AGL",
  intelecto: "INT",
  presenca: "PRE",
};

export const SKILLS_BY_ATTR: Record<AttributeKey, string[]> = {
  forca: ["atletismo", "musculos"],
  constituicao: ["fortitude"],
  agilidade: ["iniciativa", "furtividade", "crime", "reflexo"],
  intelecto: ["medicina", "tecnologia", "conhecimentos_gerais", "conhecimento_arcano"],
  presenca: ["diplomacia", "enganacao", "intimidacao", "intuicao", "percepcao", "vontade"],
};

export const SKILL_NAMES: Record<string, string> = {
  atletismo: "Atletismo",
  musculos: "Músculos",
  fortitude: "Fortitude",
  iniciativa: "Iniciativa",
  furtividade: "Furtividade",
  crime: "Crime",
  reflexo: "Reflexo",
  medicina: "Medicina",
  tecnologia: "Tecnologia",
  conhecimentos_gerais: "Conhecimentos Gerais",
  conhecimento_arcano: "Conhecimento Arcano",
  diplomacia: "Diplomacia",
  enganacao: "Enganação",
  intimidacao: "Intimidação",
  intuicao: "Intuição",
  percepcao: "Percepção",
  vontade: "Vontade",
};

export const SKILL_ATTR: Record<string, AttributeKey> = {
  atletismo: "forca",
  musculos: "forca",
  fortitude: "constituicao",
  iniciativa: "agilidade",
  furtividade: "agilidade",
  crime: "agilidade",
  reflexo: "agilidade",
  medicina: "intelecto",
  tecnologia: "intelecto",
  conhecimentos_gerais: "intelecto",
  conhecimento_arcano: "intelecto",
  diplomacia: "presenca",
  enganacao: "presenca",
  intimidacao: "presenca",
  intuicao: "presenca",
  percepcao: "presenca",
  vontade: "presenca",
};

export const RESISTANCES = [
  "r_balistico",
  "r_cortante",
  "r_perfurante",
  "r_contundente",
  "r_elemental",
  "r_caotica",
  "r_serena",
] as const;

export type ResistanceKey = typeof RESISTANCES[number];

export const RESISTANCE_NAMES: Record<ResistanceKey, string> = {
  r_balistico: "R. Balístico",
  r_cortante: "R. Cortante",
  r_perfurante: "R. Perfurante",
  r_contundente: "R. Contundente",
  r_elemental: "R. Elemental",
  r_caotica: "R. Caótica",
  r_serena: "R. Serena",
};

export const PROFICIENCY_KEYS = [
  "socos",
  "armas_brancas_leves",
  "armas_brancas_medias",
  "armas_brancas_pesadas",
  "armas_longo_alcance",
  "arcanum_elemental",
  "pilares_caoticos",
  "pilares_serenos",
  "resistencia_fisica",
  "resistencia_elemental",
  "producao",
  "artes",
  "primeiros_socorros",
  "sabedoria",
  "improvisacao",
] as const;

export type ProficiencyKey = typeof PROFICIENCY_KEYS[number];

export const PROFICIENCY_NAMES: Record<ProficiencyKey, string> = {
  socos: "Socos",
  armas_brancas_leves: "Armas Brancas Leves",
  armas_brancas_medias: "Armas Brancas Médias",
  armas_brancas_pesadas: "Armas Brancas Pesadas",
  armas_longo_alcance: "Armas de Longo Alcance",
  arcanum_elemental: "Arcanum Elemental",
  pilares_caoticos: "Pilares Caóticos",
  pilares_serenos: "Pilares Serenos",
  resistencia_fisica: "Resistência Física",
  resistencia_elemental: "Resistência Elemental",
  producao: "Produção",
  artes: "Artes",
  primeiros_socorros: "Primeiros Socorros",
  sabedoria: "Sabedoria",
  improvisacao: "Improvisação",
};

export interface SubclassData {
  name: string;
  description: string;
  skills: string[];
  attrBonus: Partial<Record<AttributeKey, number>>;
  pvBonus: number;
  peBonus: number;
  sanBonus?: number;
  bpBonus?: number;
  danoFisicoBonus?: number;
  proficiencies: ProficiencyKey[];
  features: string[];
  icon: string;
  hybridAttrChoice?: boolean;
  hybridProfChoice?: boolean;
  cidadaoChoice?: boolean;
}

export interface ClassData {
  name: string;
  description: string;
  icon: string;
  subclasses: Record<string, SubclassData>;
}

export const CLASSES: Record<string, ClassData> = {
  lutador: {
    name: "Lutador",
    description: "Especialista em combate físico e batalha corpo a corpo.",
    icon: "⚔️",
    subclasses: {
      brutamonte: {
        name: "Brutamonte",
        description: "Força bruta e poder esmagador. Socos com dano de arma leve.",
        icon: "💪",
        skills: ["atletismo", "musculos"],
        attrBonus: { forca: 2 },
        pvBonus: 1,
        peBonus: 0,
        proficiencies: ["armas_brancas_pesadas", "socos"],
        features: ["Socos com dano e crítico de arma leve", "+2 em Força"],
      },
      equilibrado: {
        name: "Equilibrado",
        description: "Combatente versátil, domínio de escudos e armas médias.",
        icon: "⚖️",
        skills: ["atletismo", "iniciativa"],
        attrBonus: { forca: 1, agilidade: 1 },
        pvBonus: 1,
        peBonus: 0,
        proficiencies: ["armas_brancas_medias"],
        features: ["Pode usar Escudos", "+1 Força e +1 Agilidade"],
      },
      leve: {
        name: "Leve",
        description: "Velocidade e agilidade. Iniciativa mínima de 10.",
        icon: "🌪️",
        skills: ["furtividade", "crime"],
        attrBonus: { agilidade: 2 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: ["armas_brancas_leves"],
        features: ["Iniciativa mínima de 10", "+2 em Agilidade"],
      },
      atirador: {
        name: "Atirador",
        description: "Mestre de armas à distância. Pode usar arma leve na mão secundária.",
        icon: "🏹",
        skills: ["iniciativa", "reflexo"],
        attrBonus: { agilidade: 2 },
        pvBonus: -1,
        peBonus: 2,
        proficiencies: ["armas_longo_alcance"],
        features: [
          "Pode usar arma branca leve na mão secundária com arma de longo alcance de uma mão",
          "+2 em Agilidade",
        ],
      },
      determinado: {
        name: "Determinado",
        description: "Resistência excepcional. Um turno extra ao frolar na Ferida Fatal.",
        icon: "🔥",
        skills: ["atletismo", "fortitude"],
        attrBonus: { forca: 1, constituicao: 1 },
        pvBonus: 1,
        peBonus: 0,
        proficiencies: ["armas_brancas_medias"],
        features: [
          "Uma vez por combate: turno extra ao falhar Ferida Fatal",
          "Vantagem em acerto nesse turno extra",
        ],
      },
    },
  },
  sentinela: {
    name: "Sentinela",
    description: "Guardião resistente. Especialista em defesa e proteção.",
    icon: "🛡️",
    subclasses: {
      fortaleza: {
        name: "Fortaleza",
        description: "Muralha viva. Não recebe dano de socos comuns.",
        icon: "🏰",
        skills: ["fortitude", "atletismo"],
        attrBonus: { constituicao: 2 },
        pvBonus: 3,
        peBonus: -2,
        proficiencies: ["resistencia_fisica"],
        features: ["Não recebe dano de socos (exceto Brutamontes ou crítico)", "+2 em Constituição"],
      },
      defensor: {
        name: "Defensor",
        description: "Protetor confiável. Domina escudos e resistência física.",
        icon: "🛡️",
        skills: ["fortitude", "atletismo"],
        attrBonus: { constituicao: 1, forca: 1 },
        pvBonus: 2,
        peBonus: -1,
        proficiencies: ["resistencia_fisica"],
        features: ["Pode usar escudos", "+1 Constituição e +1 Força"],
      },
      elemental: {
        name: "Elemental",
        description: "Resistência elemental natural. Teste para evitar efeitos.",
        icon: "🌊",
        skills: ["fortitude", "conhecimento_arcano"],
        attrBonus: { constituicao: 1, intelecto: 1 },
        pvBonus: 1,
        peBonus: 0,
        proficiencies: ["resistencia_elemental"],
        features: ["Teste de Constituição para evitar efeitos elementais"],
      },
      barreira: {
        name: "Barreira",
        description: "Ataque de oportunidade em inimigos que tentam passar.",
        icon: "🧱",
        skills: ["fortitude", "atletismo"],
        attrBonus: { constituicao: 2 },
        pvBonus: 2,
        peBonus: -1,
        proficiencies: ["resistencia_fisica"],
        features: ["Ataque de oportunidade em inimigos que tentam passar", "+2 em Constituição"],
      },
      guardiao: {
        name: "Guardião",
        description: "Pode absorver metade do dano de um aliado.",
        icon: "👁️",
        skills: ["fortitude", "intuicao"],
        attrBonus: { constituicao: 1, presenca: 1 },
        pvBonus: 2,
        peBonus: -1,
        proficiencies: ["resistencia_fisica"],
        features: ["Pode usar escudos", "Pode receber metade do dano de um aliado (próxima ação de movimento)"],
      },
    },
  },
  intelectual: {
    name: "Intelectual",
    description: "Mestre do conhecimento e habilidades práticas.",
    icon: "📚",
    subclasses: {
      produtor: {
        name: "Produtor",
        description: "Cria equipamentos improvisados em combate.",
        icon: "🔧",
        skills: ["tecnologia", "conhecimentos_gerais"],
        attrBonus: { intelecto: 2 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: ["producao"],
        features: ["Única classe que cria equipamentos improvisados em combate com as ferramentas certas"],
      },
      artista: {
        name: "Artista",
        description: "Usa instrumentos para inspirar e buffar aliados.",
        icon: "🎭",
        skills: ["diplomacia", "enganacao"],
        attrBonus: { presenca: 2 },
        pvBonus: -1,
        peBonus: 2,
        proficiencies: ["artes"],
        features: ["Única classe que usa instrumentos artísticos para inspirar e buffar aliados"],
      },
      curandeiro: {
        name: "Curandeiro",
        description: "Faz e aplica ataduras e bandagens improvisadas.",
        icon: "⚕️",
        skills: ["medicina", "conhecimentos_gerais"],
        attrBonus: { intelecto: 1, presenca: 1 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: ["primeiros_socorros"],
        features: ["Faz e aplica ataduras/bandagens com tecidos improvisados"],
      },
      pensador: {
        name: "Pensador",
        description: "Exclusivo da época da magia. Sabedoria e improvisação.",
        icon: "🧠",
        skills: ["conhecimentos_gerais", "conhecimento_arcano"],
        attrBonus: { intelecto: 2 },
        pvBonus: 0,
        peBonus: 2,
        proficiencies: ["sabedoria", "improvisacao"],
        features: ["Exclusivo da época da magia"],
      },
    },
  },
  arcanista: {
    name: "Arcanista",
    description: "Mestre das artes mágicas e poderes arcanos.",
    icon: "🔮",
    subclasses: {
      elemental: {
        name: "Elemental",
        description: "Dois elementos mágicos. Resistência elemental natural.",
        icon: "✨",
        skills: ["conhecimento_arcano", "tecnologia"],
        attrBonus: { intelecto: 2 },
        pvBonus: -1,
        peBonus: 2,
        proficiencies: ["arcanum_elemental"],
        features: ["Dois elementos mágicos à escolha", "Resistência aos elementos escolhidos"],
      },
      caotico: {
        name: "Caótico",
        description: "Pilares Caóticos. +1 BP especial e -1 Sanidade.",
        icon: "💀",
        skills: ["conhecimento_arcano", "intimidacao"],
        attrBonus: { intelecto: 2 },
        pvBonus: -1,
        peBonus: 2,
        sanBonus: -1,
        bpBonus: 1,
        proficiencies: ["pilares_caoticos"],
        features: ["Dois Pilares Caóticos à escolha", "+1 BP, -1 Sanidade base"],
      },
      hibrido: {
        name: "Híbrido",
        description: "Combina magia com combate físico.",
        icon: "⚡",
        skills: ["conhecimento_arcano"],
        attrBonus: { intelecto: 1 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: [],
        features: ["Imbuir elemento na arma (metade do dano elemental)", "+1 Intelecto e +1 Força/Agilidade (à escolha)"],
        hybridAttrChoice: true,
        hybridProfChoice: true,
      },
      sereno: {
        name: "Sereno",
        description: "Pilares Serenos. +1 Sanidade e -1 dano físico.",
        icon: "☀️",
        skills: ["conhecimento_arcano", "vontade"],
        attrBonus: { intelecto: 2 },
        pvBonus: -2,
        peBonus: 3,
        sanBonus: 1,
        danoFisicoBonus: -1,
        proficiencies: ["pilares_serenos"],
        features: ["Dois Pilares Serenos à escolha", "+1 Sanidade base, -1 Dano Físico"],
      },
      paladino: {
        name: "Paladino",
        description: "Combina fé e combate. Pode usar escudos.",
        icon: "✝️",
        skills: ["conhecimento_arcano", "fortitude"],
        attrBonus: { intelecto: 1, constituicao: 1 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: ["resistencia_fisica", "pilares_serenos"],
        features: ["Um Pilar Sereno à escolha", "Pode usar escudos"],
      },
      antimagia: {
        name: "Antimagia",
        description: "Cancela magias adversárias. Um elemento à escolha.",
        icon: "🚫",
        skills: ["conhecimento_arcano", "percepcao"],
        attrBonus: { intelecto: 2 },
        pvBonus: 0,
        peBonus: 1,
        proficiencies: ["resistencia_elemental"],
        features: ["Habilidade 'Cancelar Magia' (ação bônus)", "Um elemento à escolha"],
      },
      dos_dois_mundos: {
        name: "Dos Dois Mundos",
        description: "Uma magia elemental e um Pilar Caótico.",
        icon: "🌓",
        skills: ["conhecimento_arcano", "intuicao"],
        attrBonus: { intelecto: 1, presenca: 1 },
        pvBonus: -1,
        peBonus: 2,
        proficiencies: [],
        features: ["Uma Magia Elemental + uma de Pilar Caótico", "Ataques base com dano do tipo de uma das magias"],
      },
    },
  },
  cidadao: {
    name: "Cidadão",
    description: "Versátil e adaptável. Bônus em 4 atributos à escolha.",
    icon: "🎭",
    subclasses: {
      cidadao: {
        name: "Cidadão",
        description: "+1 em 4 atributos e uma proficiência à escolha.",
        icon: "🎭",
        skills: [],
        attrBonus: {},
        pvBonus: 0,
        peBonus: 0,
        proficiencies: [],
        features: ["+1 em 4 atributos à escolha", "Uma proficiência à escolha", "Duas perícias de qualquer atributo"],
        cidadaoChoice: true,
      },
    },
  },
};

export const WEAPONS = [
  { name: "Ataque Não Armado", damage: "1d6-3", crit: "20", mult: 2, attr: "FOR/AGL", type: "Impacto" },
  { name: "Arma Branca Leve", damage: "1d6-1", crit: "17", mult: 2, attr: "AGL", type: "Corte/Perfurante" },
  { name: "Arma Branca Média", damage: "1d6", crit: "18", mult: 2, attr: "FOR/AGL", type: "Corte/Perfurante" },
  { name: "Arma Branca Pesada", damage: "1d6+1", crit: "19", mult: 2, attr: "FOR", type: "Corte/Impacto" },
  { name: "Arma de Mão", damage: "2d6", crit: "18", mult: 2, attr: "AGL", type: "Balístico" },
  { name: "Arma de Fogo Média", damage: "2d6+3", crit: "18", mult: 2, attr: "AGL", type: "Balístico" },
  { name: "Arma de Fogo Pesada", damage: "3d6+1", crit: "17", mult: 3, attr: "AGL", type: "Balístico" },
];

export const ELEMENTS = ["Fogo", "Água", "Terra", "Proteção", "Vento", "Metal", "Tempestade"];
export const PILARES_CAOTICOS = ["Medo", "Morte", "Sangue", "Gravidade", "Sombra", "Tempo", "Energia"];
export const PILARES_SERENOS = ["Coragem", "Vida", "Natureza", "Luz"];
export const DAMAGE_TYPES = ["Balístico", "Corte", "Impacto", "Perfurante", "Elemental", "P. Caótico", "P. Sereno", "Arcano Não Específico"];

// ============================================================
// BASE FORMULAS (per the rules book)
// ============================================================
export const ATTR_BASE = -1;
export const ATTR_MIN = -2;
export const ATTR_MAX = 5;
export const ATTR_POINTS = 4;

export function calcBP(level: number, bpBonus = 0): number {
  return 2 + Math.floor((level - 1) / 3) + bpBonus;
}

export function calcMaxPV(level: number, constitMod: number, pvBonus = 0): number {
  return 10 + constitMod + pvBonus + (level - 1) * 2;
}

export function calcMaxEnergia(level: number, intMod: number, peBonus = 0): number {
  // REGRA DO MESTRE: Garante que a Energia Máxima nunca seja menor que 1
  return Math.max(1, 1 + Math.ceil(intMod / 2) + peBonus + Math.floor((level - 1) / 2));
}

export function calcMaxSanidade(level: number, presMod: number, sanBonus = 0): number {
  return 6 + presMod + sanBonus + (level - 1);
}

export function calcDefesa(agiMod: number): number {
  return 10 + agiMod;
}

export function calcInventoryCap(forcaMod: number): number {
  return 5 + forcaMod;
}

// ============================================================
// LEVEL PROGRESSION TABLE
// ============================================================
export interface LevelProgression {
  level: number;
  xpRequired: number;
  pvGain: number;
  peGain: number;
  sanGain: number;
  bpGain: number;
  attrPoint: boolean;
  newHabilidade: boolean;
  newPericia: boolean;
}

export function getLevelProgression(level: number): LevelProgression {
  // REGRA DO MESTRE: Níveis ímpares maiores que 1 ganham bônus de atributo (+1 ponto livre)
  const isOddLevel = level > 1 && level % 2 !== 0;

  return {
    level,
    xpRequired: level * 1000,
    pvGain: 2,
    peGain: level % 2 === 0 ? 1 : 0,
    sanGain: 1,
    bpGain: level === 4 || level === 7 || level === 10 || level === 13 || level === 16 || level === 19 ? 1 : 0,
    attrPoint: isOddLevel,
    newHabilidade: level % 3 === 0,
    newPericia: level === 5 || level === 11 || level === 17,
  };
}

export const LEVEL_TABLE: LevelProgression[] = Array.from({ length: 20 }, (_, i) => getLevelProgression(i + 1));