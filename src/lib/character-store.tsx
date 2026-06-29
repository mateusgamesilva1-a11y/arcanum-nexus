// ============================================================
// CHARACTER STORE — localStorage persistence + React context
// ============================================================
import * as React from "react";
import type { Character } from "./character-types";
import { createCharacter } from "./character-types";

const STORAGE_KEY = "rpg-characters-v1";
const ACTIVE_KEY = "rpg-active-character-v1";

function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Character[];
  } catch {
    return [];
  }
}

function saveCharacters(chars: Character[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

// ---- Context ----

interface CharacterStoreState {
  characters: Character[];
  activeId: string | null;
  activeCharacter: Character | null;
  setActiveId: (id: string | null) => void;
  addCharacter: (c: Partial<Character>) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  duplicateCharacter: (id: string) => Character;
}

const CharacterStoreContext = React.createContext<CharacterStoreState | null>(null);

export function CharacterStoreProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = React.useState<Character[]>(() => loadCharacters());
  const [activeId, _setActiveId] = React.useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });

  React.useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  function setActiveId(id: string | null) {
    _setActiveId(id);
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  }

  function addCharacter(overrides?: Partial<Character>): Character {
    const c = createCharacter(overrides);
    setCharacters((prev) => [...prev, c]);
    return c;
  }

  function updateCharacter(id: string, updates: Partial<Character>) {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c))
    );
  }

  function deleteCharacter(id: string) {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function duplicateCharacter(id: string): Character {
    const original = characters.find((c) => c.id === id);
    if (!original) throw new Error("Character not found");
    const dupe = createCharacter({ ...original, name: `${original.name} (Cópia)`, id: undefined });
    setCharacters((prev) => [...prev, dupe]);
    return dupe;
  }

  const activeCharacter = characters.find((c) => c.id === activeId) ?? null;

  const value: CharacterStoreState = {
    characters,
    activeId,
    activeCharacter,
    setActiveId,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
  };

  return (
    <CharacterStoreContext.Provider value={value}>
      {children}
    </CharacterStoreContext.Provider>
  );
}

export function useCharacterStore(): CharacterStoreState {
  const ctx = React.useContext(CharacterStoreContext);
  if (!ctx) throw new Error("useCharacterStore must be used within CharacterStoreProvider");
  return ctx;
}
