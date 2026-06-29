// ============================================================
// HABILIDADES TAB — Character abilities (non-magic)
// ============================================================
import type { HabilidadeEntry } from "@/lib/character-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import * as React from "react";

function emptyHabilidade(): HabilidadeEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    source: "",
    cost: "",
    costType: "Ação",
    range: "",
    duration: "",
    description: "",
    effect: "",
  };
}

interface HabilidadesTabProps {
  habilidades: HabilidadeEntry[];
  onHabilidadesChange: (h: HabilidadeEntry[]) => void;
}

export function HabilidadesTab({ habilidades, onHabilidadesChange }: HabilidadesTabProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  function addHabilidade() {
    const h = emptyHabilidade();
    onHabilidadesChange([...habilidades, h]);
    setExpanded(h.id);
  }

  function updateHabilidade(id: string, updates: Partial<HabilidadeEntry>) {
    onHabilidadesChange(habilidades.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  }

  function removeHabilidade(id: string) {
    onHabilidadesChange(habilidades.filter((h) => h.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Zap className="size-4" />
          {habilidades.length} {habilidades.length === 1 ? "habilidade" : "habilidades"}
        </p>
        <Button size="sm" onClick={addHabilidade}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      {habilidades.length === 0 ? (
        <Empty className="border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Zap className="size-5" /></EmptyMedia>
            <EmptyTitle>Nenhuma habilidade</EmptyTitle>
            <EmptyDescription>Adicione habilidades especiais do personagem (não-mágicas).</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {habilidades.map((hab) => {
            const isExpanded = expanded === hab.id;
            return (
              <div key={hab.id} className="rounded-lg border bg-card overflow-hidden">
                {/* Header row — always visible */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Nome da Habilidade</label>
                        <Input
                          className="h-7 text-sm font-medium"
                          value={hab.name}
                          placeholder="Ex: Último Sorriso"
                          onChange={(e) => updateHabilidade(hab.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Origem (classe/raça/etc)</label>
                        <Input
                          className="h-7 text-xs"
                          value={hab.source}
                          placeholder="Ex: Arcanista Caótico"
                          onChange={(e) => updateHabilidade(hab.id, { source: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setExpanded(isExpanded ? null : hab.id)}
                      >
                        {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeHabilidade(hab.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="flex flex-wrap gap-1.5">
                    {hab.cost && <Badge variant="secondary" className="text-xs">Custo: {hab.cost}</Badge>}
                    {hab.costType && <Badge variant="outline" className="text-xs">{hab.costType}</Badge>}
                    {hab.range && <Badge variant="outline" className="text-xs">Alcance: {hab.range}</Badge>}
                    {hab.duration && <Badge variant="outline" className="text-xs">Duração: {hab.duration}</Badge>}
                  </div>
                </div>

                {/* Expanded section — full details */}
                {isExpanded && (
                  <div className="border-t bg-muted/20 p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground">Custo</label>
                        <Input
                          className="h-7 text-xs"
                          value={hab.cost}
                          placeholder="Ex: 3 PE"
                          onChange={(e) => updateHabilidade(hab.id, { cost: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Tipo de Custo</label>
                        <Input
                          className="h-7 text-xs"
                          value={hab.costType}
                          placeholder="Ex: Sustentada, Ação, etc"
                          onChange={(e) => updateHabilidade(hab.id, { costType: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Alcance</label>
                        <Input
                          className="h-7 text-xs"
                          value={hab.range}
                          placeholder="Ex: Pessoal, 9m, Toque"
                          onChange={(e) => updateHabilidade(hab.id, { range: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">Duração</label>
                        <Input
                          className="h-7 text-xs"
                          value={hab.duration}
                          placeholder="Ex: 1 turno, Sustentada"
                          onChange={(e) => updateHabilidade(hab.id, { duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground">Descrição</label>
                      <Textarea
                        className="min-h-[80px] text-xs"
                        value={hab.description}
                        placeholder="Descrição narrativa da habilidade..."
                        onChange={(e) => updateHabilidade(hab.id, { description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground">Efeito / Mecânica</label>
                      <Textarea
                        className="min-h-[120px] text-xs font-mono"
                        value={hab.effect}
                        placeholder="Descreva o efeito mecânico completo da habilidade, incluindo resultados, condições, bônus..."
                        onChange={(e) => updateHabilidade(hab.id, { effect: e.target.value })}
                      />
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
