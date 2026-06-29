// ============================================================
// COMBAT TAB — Weapons, Resistances
// ============================================================
import type { WeaponEntry } from "@/lib/character-types";
import { RESISTANCE_NAMES, RESISTANCES } from "@/lib/rpg-data";
import type { ResistanceKey } from "@/lib/rpg-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Sword, Shield } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CombatTabProps {
  weapons: WeaponEntry[];
  resistances: Record<ResistanceKey, number>;
  defesa: number;
  onWeaponsChange: (w: WeaponEntry[]) => void;
  onResistancesChange: (r: Record<ResistanceKey, number>) => void;
}

function emptyWeapon(): WeaponEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    damage: "1d6",
    critRange: "20",
    critMult: 2,
    type: "Corte",
    attrKey: "FOR",
    notes: "",
  };
}

function rollDice(expr: string): { total: number; breakdown: string } {
  const match = expr.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return { total: 0, breakdown: "?" };
  const count = parseInt(match[1], 10);
  const faces = parseInt(match[2], 10);
  const bonus = match[3] ? parseInt(match[3], 10) : 0;
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * faces) + 1);
  const total = rolls.reduce((s, v) => s + v, 0) + bonus;
  return {
    total,
    breakdown: `[${rolls.join("+")}]${bonus ? (bonus > 0 ? `+${bonus}` : bonus) : ""} = ${total}`,
  };
}

import * as React from "react";

export function CombatTab({ weapons, resistances, defesa, onWeaponsChange, onResistancesChange }: CombatTabProps) {
  const [lastRoll, setLastRoll] = React.useState<{ label: string; result: string } | null>(null);

  function handleRoll(label: string, damage: string) {
    const roll = rollDice(damage);
    setLastRoll({ label, result: roll.breakdown });
    setTimeout(() => setLastRoll(null), 5000);
  }

  function addWeapon() {
    onWeaponsChange([...weapons, emptyWeapon()]);
  }

  function updateWeapon(id: string, updates: Partial<WeaponEntry>) {
    onWeaponsChange(weapons.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }

  function removeWeapon(id: string) {
    onWeaponsChange(weapons.filter((w) => w.id !== id));
  }

  function updateResistance(key: ResistanceKey, value: number) {
    onResistancesChange({ ...resistances, [key]: Math.max(0, Math.min(10, value)) });
  }

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Roll result toast */}
        {lastRoll && (
          <div className="rounded-lg border bg-rose-500/5 border-rose-500/20 px-4 py-2 text-sm flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="font-medium">{lastRoll.label}</span>
            <span className="font-mono font-bold text-rose-500">{lastRoll.result}</span>
          </div>
        )}

        {/* Defesa */}
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
          <Shield className="size-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Defesa</p>
            <p className="text-2xl font-black text-blue-500">{defesa}</p>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            10 + MOD AGL
          </div>
        </div>

        {/* Weapons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sword className="size-4" />
              Armas
            </p>
            <Button size="sm" onClick={addWeapon}>
              <Plus className="size-4" />
              Adicionar
            </Button>
          </div>

          {weapons.length === 0 ? (
            <Empty className="border-dashed py-6">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Sword className="size-4" /></EmptyMedia>
                <EmptyTitle className="text-sm">Sem armas</EmptyTitle>
                <EmptyDescription className="text-xs">Adicione armas ao repertório de combate.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2">
              {weapons.map((w) => (
                <div key={w.id} className="rounded-lg border bg-card p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground">Nome</label>
                      <Input
                        className="h-7 text-sm"
                        value={w.name}
                        placeholder="Nome da arma"
                        onChange={(e) => updateWeapon(w.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Dano</label>
                      <div className="flex gap-1">
                        <Input
                          className="h-7 text-sm"
                          value={w.damage}
                          placeholder="2d6"
                          onChange={(e) => updateWeapon(w.id, { damage: e.target.value })}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              className="h-7 w-7 shrink-0"
                              onClick={() => handleRoll(w.name || "Arma", w.damage)}
                            >
                              🎲
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rolar dano</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Crítico</label>
                        <Input
                          className="h-7 text-xs"
                          value={w.critRange}
                          placeholder="20"
                          onChange={(e) => updateWeapon(w.id, { critRange: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Mult.</label>
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={w.critMult}
                          min={1}
                          onChange={(e) => updateWeapon(w.id, { critMult: parseInt(e.target.value, 10) || 2 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      className="h-6 text-xs text-muted-foreground flex-1"
                      value={w.notes}
                      placeholder="Notas (tipo, atributo...)"
                      onChange={(e) => updateWeapon(w.id, { notes: e.target.value })}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeWeapon(w.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Resistances */}
        <div>
          <p className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Shield className="size-4" />
            Resistências
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RESISTANCES.map((key) => (
              <div key={key} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{RESISTANCE_NAMES[key as ResistanceKey]}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => updateResistance(key as ResistanceKey, resistances[key as ResistanceKey] - 1)}
                  >−</Button>
                  <span className="w-6 text-center text-sm font-bold">{resistances[key as ResistanceKey]}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => updateResistance(key as ResistanceKey, resistances[key as ResistanceKey] + 1)}
                  >+</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
