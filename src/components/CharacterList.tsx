import type { Character } from "@/lib/character-types";
import { CLASSES, calcMaxPV, calcMaxEnergia, calcMaxSanidade, calcDefesa } from "@/lib/rpg-data";
import { useCharacterStore } from "@/lib/character-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { Plus, Minus, MoreVertical, Trash2, Copy, Eye, BookOpen, Maximize2, Share2 } from "lucide-react";
import * as React from "react";

interface CharacterListProps {
  onSelect: (id: string) => void;
  onNew: () => void;
  onRulesBook: () => void;
}

function PVBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden border border-background">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function CharacterCard({ character, onSelect, onDelete, onDuplicate }: {
  character: Character;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const cls = character.classKey ? CLASSES[character.classKey] : null;
  const sub = cls && character.subclassKey ? cls.subclasses[character.subclassKey] : null;
  const { updateCharacter } = useCharacterStore();
  const [zoomOpen, setZoomOpen] = React.useState(false);

  const constMod = character.attributes?.constituicao ?? -1;
  const intMod = character.attributes?.intelecto ?? -1;
  const presMod = character.attributes?.presenca ?? -1;
  const agiMod = character.attributes?.agilidade ?? -1;
  const currentLevel = character.level ?? 1;

  const pvBonus = sub?.pvBonus ?? 0;
  const peBonus = sub?.peBonus ?? 0;
  const sanBonus = sub?.sanBonus ?? 0;

  const maxPV = calcMaxPV(currentLevel, constMod, pvBonus);
  const maxPE = calcMaxEnergia(currentLevel, intMod, peBonus);
  const maxSAN = calcMaxSanidade(currentLevel, presMod, sanBonus);
  const defesaReal = calcDefesa(agiMod);

  const changeLevel = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    const newLevel = Math.max(1, currentLevel + amount);
    
    const newMaxPV = calcMaxPV(newLevel, constMod, pvBonus);
    const newMaxPE = calcMaxEnergia(newLevel, intMod, peBonus);
    const newMaxSAN = calcMaxSanidade(newLevel, presMod, sanBonus);

    updateCharacter(character.id, { 
      level: newLevel,
      maxPV: newMaxPV,
      currentPV: newMaxPV,
      maxEnergia: newMaxPE,
      currentEnergia: newMaxPE,
      maxSanidade: newMaxSAN,
      currentSanidade: newMaxSAN
    });
  };

  const changeXP = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    const currentXP = character.xp ?? 0;
    updateCharacter(character.id, { xp: Math.max(0, currentXP + amount) });
  };

  // 🔗 CRIA LINK COMPARTILHÁVEL DA FICHA
  const copyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?char=${character.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link direto da ficha copiado para a área de transferência!");
    });
  };

  return (
    <Card className="group hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between">
      <CardHeader className="pb-2" onClick={onSelect}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="size-14 rounded-xl bg-muted border flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative group/img"
              onClick={(e) => {
                e.stopPropagation();
                if (character.imageUrl) setZoomOpen(true);
              }}
            >
              {character.imageUrl ? (
                <>
                  <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="size-4 text-white" />
                  </div>
                </>
              ) : (
                <span className="text-2xl">{cls?.icon ?? "👤"}</span>
              )}
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-bold truncate">{character.name}</CardTitle>
              <CardDescription className="text-xs truncate mt-0.5">
                {cls ? cls.name : "Sem Classe"} {sub && `— ${sub.name}`}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(); }}>
                <Eye className="size-4" /> Abrir Ficha
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyShareLink}>
                <Share2 className="size-4" /> Copiar Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="size-4" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="size-4" /> Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir personagem?</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{character.name}" será removido permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} variant="destructive">Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent onClick={onSelect} className="space-y-3 pb-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "PV", value: character.currentPV, max: maxPV, color: "text-rose-500" },
            { label: "PE", value: character.currentEnergia, max: maxPE, color: "text-blue-500" },
            { label: "SAN", value: character.currentSanidade, max: maxSAN, color: "text-amber-500" },
            { label: "DEF", value: defesaReal, max: null, color: "text-emerald-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 py-2 border">
              <div className={cn("text-xs md:text-sm font-extrabold antialiased tracking-tight", s.color)}>
                {s.max !== null ? `${s.value}/${s.max}` : s.value}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <PVBar current={character.currentPV} max={maxPV} color="bg-rose-500" />
          <PVBar current={character.currentSanidade} max={maxSAN} color="bg-amber-500" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 w-full border-t border-dashed pt-2.5">
          <div className="flex items-center bg-secondary rounded-lg px-1.5 py-0.5 border gap-0.5">
            <button onClick={(e) => changeLevel(e, -1)} className="hover:bg-background rounded p-0.5 text-muted-foreground"><Minus className="size-3" /></button>
            <span className="text-[11px] font-black px-1">Nível {currentLevel}</span>
            <button onClick={(e) => changeLevel(e, 1)} className="hover:bg-background rounded p-0.5 text-muted-foreground"><Plus className="size-3" /></button>
          </div>

          <div className="flex items-center bg-background rounded-lg px-1.5 py-0.5 border gap-0.5">
            <button onClick={(e) => changeXP(e, -10)} className="hover:bg-muted rounded p-0.5 text-muted-foreground"><Minus className="size-3" /></button>
            <span className="text-[11px] font-bold px-1">{character.xp} XP</span>
            <button onClick={(e) => changeXP(e, 10)} className="hover:bg-muted rounded p-0.5 text-muted-foreground"><Plus className="size-3" /></button>
          </div>

          {character.race && (
            <span className="text-[11px] font-extrabold text-muted-foreground ml-auto uppercase tracking-wide truncate max-w-22.5">
              {character.race}
            </span>
          )}
        </div>
      </CardFooter>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="sm:max-w-md p-2 bg-zinc-950 border-zinc-800">
          <DialogHeader className="p-2 pb-0">
            <DialogTitle className="text-white text-xs font-bold">Retrato de {character.name}</DialogTitle>
            <DialogDescription className="text-[11px] text-zinc-400">Visualização ampliada da arte do personagem.</DialogDescription>
          </DialogHeader>
          <div className="w-full aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <img src={character.imageUrl} alt={character.name} className="w-full h-full object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function CharacterList({ onSelect, onNew, onRulesBook }: CharacterListProps) {
  const { characters, deleteCharacter, duplicateCharacter, setActiveId } = useCharacterStore();

  function handleSelect(id: string) {
    setActiveId(id);
    onSelect(id);
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-4 py-4">
      <div className="flex items-center justify-between gap-4 border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider">Fichas de Personagens</h1>
            <p className="text-[11px] text-muted-foreground">Gerencie e jogue no Sistema de Taverna</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRulesBook} className="font-bold h-8 text-xs">
            <BookOpen className="size-3.5" /> Regras do Sistema
          </Button>
          <Button size="sm" onClick={onNew} className="font-black h-8 text-xs">
            <Plus className="size-3.5" /> Criar novo
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {characters.length === 0 ? (
          <Empty className="min-h-87.5">
            <EmptyHeader>
              <EmptyTitle>Nenhum personagem ativo</EmptyTitle>
              <EmptyDescription>Crie sua primeira ficha estrita e comece a pontuar.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={onNew} size="sm"><Plus className="size-4" /> Criar primeiro personagem</Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onSelect={() => handleSelect(char.id)}
                onDelete={() => deleteCharacter(char.id)}
                onDuplicate={() => {
                  const d = duplicateCharacter(char.id);
                  handleSelect(d.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}