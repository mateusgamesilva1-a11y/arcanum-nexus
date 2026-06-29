// ============================================================
// LEVEL UP DIALOG
// ============================================================
import * as React from "react";
import type { Character } from "@/lib/character-types";
import type { AttributeKey } from "@/lib/rpg-data";
import { CLASSES, calcMaxPV, calcMaxEnergia, calcMaxSanidade, calcDefesa, calcBP, LEVEL_TABLE, ATTRIBUTE_NAMES, ATTRIBUTE_SHORT } from "@/lib/rpg-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUp, Star } from "lucide-react";

interface LevelUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: Character;
  onLevelUp: (updates: Partial<Character>) => void;
}

export function LevelUpDialog({ open, onOpenChange, character, onLevelUp }: LevelUpDialogProps) {
  const newLevel = character.level + 1;
  const prog = LEVEL_TABLE[newLevel - 1];
  const sub = character.classKey && character.subclassKey
    ? CLASSES[character.classKey]?.subclasses[character.subclassKey]
    : null;

  const [attrChoice, setAttrChoice] = React.useState<AttributeKey | null>(null);

  const newMaxPV = calcMaxPV(newLevel, character.attributes.constituicao, sub?.pvBonus ?? 0);
  // ⚡ Regra do Mestre: Garante que a energia máxima calculada nunca seja menor que 1
  const newMaxEnergia = Math.max(1, calcMaxEnergia(newLevel, character.attributes.intelecto, sub?.peBonus ?? 0));
  const newMaxSanidade = calcMaxSanidade(newLevel, character.attributes.presenca, sub?.sanBonus ?? 0);
  const newMaxBP = calcBP(newLevel, sub?.bpBonus ?? 0);
  const newDefesa = calcDefesa(character.attributes.agilidade);

  function handleConfirm() {
    const updates: Partial<Character> = {
      level: newLevel,
      maxPV: newMaxPV,
      maxEnergia: newMaxEnergia,
      maxSanidade: newMaxSanidade,
      maxBP: newMaxBP,
      defesa: newDefesa,
      currentPV: character.currentPV + prog.pvGain,
      currentSanidade: character.currentSanidade + prog.sanGain,
    };

    if (prog.peGain > 0) {
      // ⚡ Garante que a energia atual ganha nunca fique abaixo de 1
      updates.currentEnergia = Math.max(1, character.currentEnergia + prog.peGain);
    }

    if (prog.attrPoint && attrChoice) {
      const newAttrs = { ...character.attributes };
      (newAttrs as Record<string, number>)[attrChoice] = ((newAttrs as Record<string, number>)[attrChoice] || 0) + 1;
      updates.attributes = newAttrs;
      
      // Recalcula os atributos derivados baseados no novo ponto distribuído
      updates.maxPV = calcMaxPV(newLevel, newAttrs.constituicao, sub?.pvBonus ?? 0);
      // ⚡ Mantém a trava de energia mínima em 1 aqui também após a alteração do atributo
      updates.maxEnergia = Math.max(1, calcMaxEnergia(newLevel, newAttrs.intelecto, sub?.peBonus ?? 0));
      updates.maxSanidade = calcMaxSanidade(newLevel, newAttrs.presenca, sub?.sanBonus ?? 0);
      updates.defesa = calcDefesa(newAttrs.agilidade);
    }

    onLevelUp(updates);
    onOpenChange(false);
    setAttrChoice(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUp className="size-5 text-primary" />
            Subir para Nível {newLevel}
          </DialogTitle>
          <DialogDescription>
            Revise os ganhos do novo nível e confirme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo de Ganhos */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">PV Máx.</p>
              <p className="text-lg font-bold text-rose-500">
                {character.maxPV} → {newMaxPV} <span className="text-xs text-emerald-500">(+{prog.pvGain})</span>
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Sanidade Máx.</p>
              <p className="text-lg font-bold text-amber-500">
                {character.maxSanidade} → {newMaxSanidade} <span className="text-xs text-emerald-500">(+{prog.sanGain})</span>
              </p>
            </div>
            {prog.peGain > 0 && (
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground">Energia Máx.</p>
                <p className="text-lg font-bold text-blue-500">
                  {character.maxEnergia} → {newMaxEnergia} <span className="text-xs text-emerald-500">(+{prog.peGain})</span>
                </p>
              </div>
            )}
            {prog.bpGain > 0 && (
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground">BP Máx.</p>
                <p className="text-lg font-bold text-violet-500">
                  {character.maxBP} → {newMaxBP} <span className="text-xs text-emerald-500">(+{prog.bpGain})</span>
                </p>
              </div>
            )}
          </div>

          {/* Ganhos Especiais */}
          <div className="flex flex-wrap gap-2">
            {prog.newHabilidade && (
              <Badge className="gap-1"><Star className="size-3" /> Nova Habilidade</Badge>
            )}
            {prog.newPericia && (
              <Badge className="gap-1"><Star className="size-3" /> Nova Perícia</Badge>
            )}
          </div>

          {/* Escolha de Atributo (Se o nível permitir) */}
          {prog.attrPoint && (
            <div>
              <p className="text-sm font-medium mb-2 text-purple-400 font-bold uppercase tracking-wide text-xs">
                ✨ Distribuição de Atributo Livre:
              </p>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAttrChoice(key)}
                    className={cn(
                      "rounded-lg border-2 p-2 text-center transition-all flex flex-col justify-between min-h-[68px]",
                      attrChoice === key ? "border-purple-500 bg-purple-500/10" : "border-border bg-card hover:border-purple-500/50"
                    )}
                  >
                    <p className="text-xs font-black uppercase text-foreground">{ATTRIBUTE_SHORT[key]}</p>
                    <p className="text-[8px] text-muted-foreground truncate w-full">{ATTRIBUTE_NAMES[key]}</p>
                    <p className="text-[11px] font-mono mt-1">
                      {character.attributes[key] >= 0 ? `+${character.attributes[key]}` : character.attributes[key]}
                      → <span className="text-emerald-500 font-bold">
                        {(character.attributes[key] + 1) >= 0 ? `+${character.attributes[key] + 1}` : character.attributes[key] + 1}
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={prog.attrPoint && !attrChoice}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Confirmar Nível {newLevel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}