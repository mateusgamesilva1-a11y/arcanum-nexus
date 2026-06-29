// ============================================================
// SKILLS TABLE — Perícias with trained checkboxes and modifiers
// ============================================================
import { SKILLS_BY_ATTR, SKILL_NAMES, SKILL_ATTR, ATTRIBUTE_SHORT } from "@/lib/rpg-data";
import type { AttributeKey } from "@/lib/rpg-data";
import type { CharacterAttributes } from "@/lib/character-types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface SkillsTableProps {
  attributes: CharacterAttributes;
  skills: Record<string, boolean>;
  bp: number;
  onToggle: (key: string, trained: boolean) => void;
}

const ATTR_ORDER: AttributeKey[] = ["forca", "constituicao", "agilidade", "intelecto", "presenca"];

const ATTR_COLORS: Record<AttributeKey, string> = {
  forca: "text-rose-500",
  constituicao: "text-orange-500",
  agilidade: "text-emerald-500",
  intelecto: "text-blue-500",
  presenca: "text-violet-500",
};

export function SkillsTable({ attributes, skills, bp, onToggle }: SkillsTableProps) {
  const allSkills = ATTR_ORDER.flatMap((attr) => SKILLS_BY_ATTR[attr]);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Perícia</span>
        <span className="text-center w-12">Atributo</span>
        <span className="text-center w-12">Treinado</span>
        <span className="text-center w-14">Total</span>
      </div>
      <div className="divide-y">
        {allSkills.map((skillKey) => {
          const attrKey = SKILL_ATTR[skillKey];
          const attrMod = attributes[attrKey] ?? 0;
          const trained = !!skills[skillKey];
          const total = attrMod + (trained ? bp : 0);
          return (
            <div
              key={skillKey}
              className={cn(
                "grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 items-center transition-colors",
                trained ? "bg-primary/5" : "bg-card"
              )}
            >
              <span className={cn("text-xs", trained ? "font-medium" : "text-muted-foreground")}>
                {SKILL_NAMES[skillKey]}
              </span>
              <span className={cn("text-xs font-bold text-center w-12", ATTR_COLORS[attrKey])}>
                {ATTRIBUTE_SHORT[attrKey]}
              </span>
              <div className="flex justify-center w-12">
                <Checkbox
                  checked={trained}
                  onCheckedChange={(v) => onToggle(skillKey, !!v)}
                />
              </div>
              <div className="text-center w-14">
                <Badge variant={trained ? "default" : "secondary"} className="text-xs font-mono">
                  {total >= 0 ? `+${total}` : total}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 bg-muted/30 text-[10px] text-muted-foreground">
        Total = Mod. Atributo + BP (se treinado). BP atual: <span className="font-bold text-foreground">+{bp}</span>
      </div>
    </div>
  );
}
