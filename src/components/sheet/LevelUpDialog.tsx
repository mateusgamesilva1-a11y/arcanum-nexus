import * as React from "react";
import type { Character } from "@/lib/character-types";
import type { AttributeKey } from "@/lib/rpg-data";
import { CLASSES, calcMaxPV, calcMaxEnergia, calcMaxSanidade, calcDefesa, calcBP, LEVEL_TABLE, ATTRIBUTE_NAMES, ATTRIBUTE_SHORT } from "@/lib/rpg-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUp, Star, AlertTriangle } from "lucide-react";

interface LevelUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: Character;
  onLevelUp: (updates: Partial<Character>) => void;
}

export function LevelUpDialog({ open, onOpenChange, character, onLevelUp }: LevelUpDialogProps) {
  const newLevel = character.level + 1;
  const prog = LEVEL_TABLE[newLevel - 1] || { pvGain: 0, sanGain: 0, peGain: 0, bpGain: 0, newHabilidade: false, newPericia: false };
  const sub = character.classKey && character.subclassKey
    ? CLASSES[character.classKey]?.subclasses[character.subclassKey]
    : null;

  const [attrChoice, setAttrChoice] = React.useState<AttributeKey | null>(null);

  // REGRA DO MESTRE: A cada nível ímpar, você ganha 1 atributo livre!
  const isOddLevel = newLevel % 2 !== 0;

  const newMaxPV = calcMaxPV(newLevel, character.attributes.constituicao + (isOddLevel && attrChoice === "constituicao" ? 1 : 0), sub?.pvBonus ?? 0);
  const newMaxEnergia = Math.max(1, calcMaxEnergia(newLevel, character.attributes.intelecto + (isOddLevel && attrChoice === "intelecto" ? 1 : 0), sub?.peBonus ?? 0));
  const newMaxSanidade = calcMaxSanidade(newLevel, character.attributes.presenca + (isOddLevel && attrChoice === "presenca" ? 1 : 0), sub?.sanBonus ?? 0);
  const newMaxBP = calcBP(newLevel, sub?.bpBonus ?? 0);
  const newDefesa = calcDefesa(character.attributes.agilidade + (isOddLevel && attrChoice === "agilidade" ? 1 : 0));

  function handleConfirm() {
    const updates: Partial<Character> = {
      level: newLevel,
      maxPV: newMaxPV,
      maxEnergia: newMaxEnergia,
      maxSanidade: newMaxSanidade,
      maxBP: newMaxBP,
      defesa: newDefesa,
      currentPV: character.currentPV + (prog.pvGain || 0),
      currentSanidade: character.currentSanidade + (prog.sanGain || 0),
    };

    if (prog.peGain > 0) {
      updates.currentEnergia = Math.max(1, character.currentEnergia + prog.peGain);
    } else {
      updates.currentEnergia = Math.max(1, character.currentEnergia);
    }

    const newAttrs = { ...character.attributes };
    if (isOddLevel && attrChoice) {
      newAttrs[attrChoice] = (newAttrs[attrChoice] || 0) + 1;
      updates.attributes = newAttrs;
      updates.maxPV = calcMaxPV(newLevel, newAttrs.constituicao, sub?.pvBonus ?? 0);
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
            Revise os ganhos do novo nível e confirme a ascensão determinada pelo mestre.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo de Ganhos Mecânicos */}
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
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Energia Máx.</p>
              <p className="text-lg font-bold text-blue-500">
                {character.maxEnergia} → {newMaxEnergia} <span className="text-xs text-emerald-500">(+{prog.peGain || 0})</span>
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">BP Máx.</p>
              <p className="text-lg font-bold text-violet-500">
                {character.maxBP} → {newMaxBP} <span className="text-xs text-emerald-500">(+{prog.bpGain || 0})</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {prog.newHabilidade && <Badge className="gap-1"><Star className="size-3" /> Nova Habilidade</Badge>}
            {prog.newPericia && <Badge className="gap-1"><Star className="size-3" /> Nova Perícia</Badge>}
          </div>

          {/* ALERTA E SELEÇÃO DE ATRIBUTO LIVRE EM NÍVEL ÍMPAR */}
          {isOddLevel ? (
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-2">
              <p className="text-sm font-medium text-purple-400 font-bold uppercase tracking-wide text-xs flex items-center gap-1.5">
                <Star className="size-3.5 fill-purple-400" /> ✨ Nível Ímpar: Distribua +1 Atributo!
              </p>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(ATTRIBUTE_NAMES) as AttributeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAttrChoice(key)}
                    className={cn(
                      "rounded-lg border-2 p-2 text-center transition-all flex flex-col justify-between min-h-[68px]",
                      attrChoice === key ? "border-purple-500 bg-purple-500/20" : "border-border bg-card hover:border-purple-500/50"
                    )}
                  >
                    <p className="text-xs font-black uppercase text-foreground">{ATTRIBUTE_SHORT[key]}</p>
                    <p className="text-[8px] text-muted-foreground truncate w-full">{ATTRIBUTE_NAMES[key]}</p>
                    <p className="text-[11px] font-mono mt-1">
                      {character.attributes[key] >= 0 ? `+${character.attributes[key]}` : character.attributes[key]}
                      → <span className="text-emerald-500 font-bold">
                        {character.attributes[key] + 1 >= 0 ? `+${character.attributes[key] + 1}` : character.attributes[key] + 1}
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/40 border rounded-lg flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-tight">
                Nível par alcançado. Pontos de atributos livres não são concedidos neste nível.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isOddLevel && !attrChoice}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Confirmar Nível {newLevel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}