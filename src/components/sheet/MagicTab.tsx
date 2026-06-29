// ============================================================
// MAGIC TAB
// ============================================================
import type { MagicEntry } from "@/lib/character-types";
import { ELEMENTS, PILARES_CAOTICOS, PILARES_SERENOS } from "@/lib/rpg-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import * as React from "react";

type MagicType = "elemental" | "caotico" | "sereno";

const MAGIC_TYPE_COLORS: Record<MagicType, string> = {
  elemental: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  caotico: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  sereno: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const TYPE_LABELS: Record<MagicType, string> = {
  elemental: "Elemental",
  caotico: "Caótico",
  sereno: "Sereno",
};

function emptyMagic(): MagicEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "elemental",
    element: "",
    cost: 1,
    costType: "Ação",
    range: "Toque",
    duration: "",
    description: "",
    effect: "",
  };
}

interface MagicTabProps {
  magics: MagicEntry[];
  currentEnergia: number;
  maxEnergia: number;
  onMagicsChange: (m: MagicEntry[]) => void;
  onEnergiaChange: (v: number) => void;
}

export function MagicTab({ magics, currentEnergia, maxEnergia, onMagicsChange, onEnergiaChange }: MagicTabProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  function addMagic() {
    const m = emptyMagic();
    onMagicsChange([...magics, m]);
    setExpanded(m.id);
  }

  function updateMagic(id: string, updates: Partial<MagicEntry>) {
    onMagicsChange(magics.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }

  function removeMagic(id: string) {
    onMagicsChange(magics.filter((m) => m.id !== id));
  }

  function getElementOptions(type: MagicType): string[] {
    if (type === "elemental") return ELEMENTS;
    if (type === "caotico") return PILARES_CAOTICOS;
    return PILARES_SERENOS;
  }

  return (
    <div className="space-y-4">
      {/* Energy display */}
      <div className="rounded-lg border bg-blue-500/5 border-blue-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="size-4 text-blue-500" />
            Pontos de Energia
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => onEnergiaChange(Math.max(0, currentEnergia - 1))}>−</Button>
            <span className="font-mono font-bold text-blue-500">{currentEnergia}/{maxEnergia}</span>
            <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => onEnergiaChange(currentEnergia + 1)}>+</Button>
          </div>
        </div>
      </div>

      {/* Elements reference image */}
      <div className="rounded-lg border bg-card p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Elementos e Pilares</p>
        <img src="/images/elements/image.png" alt="Elementos e Pilares Mágicos" className="w-full rounded-md" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{magics.length} {magics.length === 1 ? "magia" : "magias"}</p>
        <Button size="sm" onClick={addMagic}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      {magics.length === 0 ? (
        <Empty className="border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Sparkles className="size-5" /></EmptyMedia>
            <EmptyTitle>Nenhuma magia</EmptyTitle>
            <EmptyDescription>Adicione magias elementais, caóticas ou serenas.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {magics.map((magic) => {
            const isExpanded = expanded === magic.id;
            return (
              <div key={magic.id} className={cn("rounded-lg border overflow-hidden", MAGIC_TYPE_COLORS[magic.type])}>
                {/* Always visible header */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-muted-foreground">Nome da Magia</label>
                        <Input
                          className="h-7 text-sm font-medium"
                          value={magic.name}
                          placeholder="Ex: Bola de Fogo"
                          onChange={(e) => updateMagic(magic.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Tipo</label>
                        <Select value={magic.type} onValueChange={(v) => updateMagic(magic.id, { type: v as MagicType, element: "" })}>
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(["elemental", "caotico", "sereno"] as MagicType[]).map((t) => (
                              <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Elemento / Pilar</label>
                        <Select value={magic.element} onValueChange={(v) => updateMagic(magic.id, { element: v })}>
                          <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Escolher" /></SelectTrigger>
                          <SelectContent>
                            {getElementOptions(magic.type).map((el) => (
                              <SelectItem key={el} value={el}>{el}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon-sm" onClick={() => setExpanded(isExpanded ? null : magic.id)}>
                        {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeMagic(magic.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">Custo: {magic.cost} PE</Badge>
                    <Badge variant="outline" className="text-xs">{magic.costType}</Badge>
                    {magic.range && <Badge variant="outline" className="text-xs">Alcance: {magic.range}</Badge>}
                    {magic.duration && <Badge variant="outline" className="text-xs">Duração: {magic.duration}</Badge>}
                  </div>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="border-t bg-muted/20 p-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Custo (PE)</label>
                        <Input type="number" className="h-7 text-xs" value={magic.cost} min={0} onChange={(e) => updateMagic(magic.id, { cost: parseInt(e.target.value, 10) || 0 })} />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Tipo de Custo</label>
                        <Input className="h-7 text-xs" value={magic.costType} placeholder="Ex: Ação, Sustentada" onChange={(e) => updateMagic(magic.id, { costType: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Alcance</label>
                        <Input className="h-7 text-xs" value={magic.range} placeholder="Ex: 9m, Toque" onChange={(e) => updateMagic(magic.id, { range: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Duração</label>
                        <Input className="h-7 text-xs" value={magic.duration} placeholder="Ex: 1 turno" onChange={(e) => updateMagic(magic.id, { duration: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Descrição</label>
                      <Textarea className="min-h-[80px] text-xs" value={magic.description} placeholder="Descrição narrativa da magia..." onChange={(e) => updateMagic(magic.id, { description: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground">Efeito / Mecânica</label>
                      <Textarea className="min-h-[120px] text-xs font-mono" value={magic.effect} placeholder="Descreva o efeito mecânico completo da magia..." onChange={(e) => updateMagic(magic.id, { effect: e.target.value })} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
