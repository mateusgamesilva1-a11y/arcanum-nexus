import type { AttributeKey, ResistanceKey, ProficiencyKey } from "./rpg-data";

export interface CharacterAttributes {
  forca: number;
  constituicao: number;
  agilidade: number;
  intelecto: number;
  presenca: number;
}

export interface WeaponEntry {
  id: string;
  name: string;
  damage: string;
  critRange: string;
  critMult: number;
  type: string;
  attrKey: string;
  notes: string;
}

export interface MagicEntry {
  id: string;
  name: string;
  type: "elemental" | "caotico" | "sereno";
  element: string;
  cost: number;
  costType: string;
  range: string;
  duration: string;
  description: string;
  effect: string;
}

export interface HabilidadeEntry {
  id: string;
  name: string;
  source: string;
  cost: string;
  costType: string;
  range: string;
  duration: string;
  description: string;
  effect: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  quantity: number;
  category: "arma" | "armadura" | "consumivel" | "equipamento" | "tesouro" | "misc";
  description: string;
  equipped: boolean;
}

export interface StatusCondition {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface Character {
  id: string;
  createdAt: number;
  updatedAt: number;

  name: string;
  player: string;
  classKey: string;
  subclassKey: string;
  level: number;
  imageUrl?: string;
  xp: number;
  description: string;
  backstory: string;
  appearance: string;
  age: string;
  race: string;

  attributes: CharacterAttributes;

  currentPV: number;
  maxPV: number;
  currentEnergia: number;
  maxEnergia: number;
  currentSanidade: number;
  maxSanidade: number;
  currentBP: number;
  maxBP: number;
  defesa: number;

  skills: Record<string, boolean>;
  proficiencies: Record<ProficiencyKey, boolean>;
  resistances: Record<ResistanceKey, number>;

  weapons: WeaponEntry[];
  magics: MagicEntry[];
  habilidades: HabilidadeEntry[];

  inventoryItems: InventoryItem[];
  dinheiroGold: number;
  dinheiroPrata: number;
  dinheiroCobre: number;

  conditions: StatusCondition[];
  notes: string;
}

export type { AttributeKey };

export function defaultAttributes(): CharacterAttributes {
  return { forca: -1, constituicao: -1, agilidade: -1, intelecto: -1, presenca: -1 };
}

export function createCharacter(overrides?: Partial<Character>): Character {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name: "Sem Nome",
    player: "",
    classKey: "",
    subclassKey: "",
    level: 1,
    imageUrl: "",
    xp: 0,
    description: "",
    backstory: "",
    appearance: "",
    age: "",
    race: "",
    attributes: defaultAttributes(),
    currentPV: 9,
    maxPV: 9,
    currentEnergia: 1,
    maxEnergia: 1,
    currentSanidade: 5,
    maxSanidade: 5,
    currentBP: 2,
    maxBP: 2,
    defesa: 9,
    skills: {},
    proficiencies: {} as Record<ProficiencyKey, boolean>,
    resistances: {
      r_balistico: 0,
      r_cortante: 0,
      r_perfurante: 0,
      r_contundente: 0,
      r_elemental: 0,
      r_caotica: 0,
      r_serena: 0,
    },
    weapons: [],
    magics: [],
    habilidades: [],
    inventoryItems: [],
    dinheiroGold: 0,
    dinheiroPrata: 0,
    dinheiroCobre: 0,
    conditions: [],
    notes: "",
    ...overrides,
  };
}
