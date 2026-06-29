import { PROFICIENCY_NAMES, PROFICIENCY_KEYS } from "@/lib/rpg-data";
import type { ProficiencyKey } from "@/lib/rpg-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProficienciesProps {
  proficiencies: Record<ProficiencyKey, boolean>;
  onToggle: (key: ProficiencyKey, value: boolean) => void;
}

const PROF_GROUPS: { label: string; keys: ProficiencyKey[] }[] = [
  { label: "Combate", keys: ["socos", "armas_brancas_leves", "armas_brancas_medias", "armas_brancas_pesadas", "armas_longo_alcance"] },
  { label: "Arcano", keys: ["arcanum_elemental", "pilares_caoticos", "pilares_serenos"] },
  { label: "Resistência", keys: ["resistencia_fisica", "resistencia_elemental"] },
  { label: "Habilidades", keys: ["producao", "artes", "primeiros_socorros", "sabedoria", "improvisacao"] },
];

export function ProficienciesTab({ proficiencies, onToggle }: ProficienciesProps) {
  const trainedCount = PROFICIENCY_KEYS.filter((k) => proficiencies[k]).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <span className="text-sm font-medium">Proficiências Treinadas</span>
        <Badge>{trainedCount}</Badge>
      </div>

      {PROF_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{group.label}</p>
          <div className="space-y-1">
            {group.keys.map((key) => {
              const trained = !!proficiencies[key];
              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    trained ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                  )}
                >
                  <Checkbox
                    id={key}
                    checked={trained}
                    onCheckedChange={(v) => onToggle(key, !!v)}
                  />
                  <Label
                    htmlFor={key}
                    className={cn("cursor-pointer flex-1", trained ? "font-medium" : "text-muted-foreground")}
                  >
                    {PROFICIENCY_NAMES[key]}
                  </Label>
                  {trained && <Badge variant="secondary" className="text-xs">Treinado</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
