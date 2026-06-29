import { ATTRIBUTE_NAMES, ATTRIBUTE_SHORT, SKILLS_BY_ATTR, SKILL_NAMES, ATTR_BASE, ATTR_MIN, ATTR_MAX, ATTR_POINTS, CLASSES } from "@/lib/rpg-data";
import type { AttributeKey } from "@/lib/rpg-data";
import type { CharacterAttributes } from "@/lib/character-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Step3AttrsProps {
  attributes: CharacterAttributes;
  skills: Record<string, boolean>;
  onAttrChange: (key: AttributeKey, value: number) => void;
  onSkillToggle: (key: string) => void;
  classKey: string;
  subclassKey: string;
}

const ATTR_ORDER: AttributeKey[] = ["forca", "constituicao", "agilidade", "intelecto", "presenca"];

const ATTR_COLORS: Record<AttributeKey, string> = {
  forca: "text-rose-500",
  constituicao: "text-orange-500",
  agilidade: "text-emerald-500",
  intelecto: "text-blue-500",
  presenca: "text-violet-500",
};

// Points distributed ABOVE the base of -1
function distributedPoints(attrs: CharacterAttributes): number {
  return Object.values(attrs).reduce((s, v) => s + (v - ATTR_BASE), 0);
}

export function Step3Attributes({ attributes, skills, onAttrChange, onSkillToggle, classKey, subclassKey }: Step3AttrsProps) {
  const pts = distributedPoints(attributes);
  const MAX_PTS = ATTR_POINTS; // 4
  const SKILL_SLOTS = 2;
  const selected = Object.values(skills).filter(Boolean).length;

  // Get subclass bonus for preview
  const sub = classKey && subclassKey ? CLASSES[classKey]?.subclasses[subclassKey] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <div>
          <span className="text-sm font-medium">Pontos de Atributo</span>
          <p className="text-xs text-muted-foreground mt-0.5">Todos começam em -1. Distribua {MAX_PTS} pontos.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-lg font-bold", pts > MAX_PTS ? "text-destructive" : pts === MAX_PTS ? "text-emerald-500" : "text-foreground")}>
            {pts}
          </span>
          <span className="text-muted-foreground text-sm">/ {MAX_PTS}</span>
        </div>
      </div>

      <div className="space-y-3">
        {ATTR_ORDER.map((attrKey) => {
          const val = attributes[attrKey];
          const classBonus = sub?.attrBonus?.[attrKey] ?? 0;
          const finalVal = val + classBonus;
          return (
            <div key={attrKey} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <div className="w-20 shrink-0">
                <p className={cn("text-xs font-bold", ATTR_COLORS[attrKey])}>{ATTRIBUTE_SHORT[attrKey]}</p>
                <p className="text-xs text-muted-foreground leading-tight">{ATTRIBUTE_NAMES[attrKey]}</p>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Button variant="outline" size="icon-sm" onClick={() => onAttrChange(attrKey, Math.max(ATTR_MIN, val - 1))} disabled={val <= ATTR_MIN}>−</Button>
                <div className={cn("w-10 text-center font-bold text-lg", ATTR_COLORS[attrKey])}>
                  {val >= 0 ? `+${val}` : val}
                </div>
                <Button variant="outline" size="icon-sm" onClick={() => onAttrChange(attrKey, Math.min(ATTR_MAX, val + 1))} disabled={val >= ATTR_MAX || pts >= MAX_PTS}>+</Button>
                {classBonus !== 0 && (
                  <Badge variant="outline" className="text-xs ml-1">
                    {classBonus > 0 ? `+${classBonus}` : classBonus} classe
                  </Badge>
                )}
                {classBonus !== 0 && (
                  <span className="text-xs text-muted-foreground">
                    → {finalVal >= 0 ? `+${finalVal}` : finalVal}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground text-right w-24">
                {SKILLS_BY_ATTR[attrKey].slice(0, 2).map((s) => SKILL_NAMES[s]).join(", ")}
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Perícias Treinadas</p>
          <Badge variant={selected >= SKILL_SLOTS ? "default" : "secondary"}>{selected}/{SKILL_SLOTS} selecionadas</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ATTR_ORDER.flatMap((attrKey) =>
            SKILLS_BY_ATTR[attrKey].map((skillKey) => {
              const trained = !!skills[skillKey];
              const canSelect = !trained && selected < SKILL_SLOTS;
              return (
                <button
                  key={skillKey}
                  disabled={!trained && !canSelect}
                  onClick={() => onSkillToggle(skillKey)}
                  className={cn(
                    "text-left text-xs rounded-md border px-3 py-2 transition-all",
                    trained ? "border-primary bg-primary/5 font-medium" :
                    canSelect ? "border-border bg-card hover:border-primary hover:bg-accent" :
                    "border-border bg-card opacity-40 cursor-not-allowed"
                  )}
                >
                  <span className={cn("text-[10px] font-bold mr-1", ATTR_COLORS[attrKey])}>{ATTRIBUTE_SHORT[attrKey]}</span>
                  {SKILL_NAMES[skillKey]}
                </button>
              );
            })
          )}
        </div>
      </div>

      {pts > MAX_PTS && (
        <p className="text-xs text-destructive font-medium rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          Você distribuiu mais pontos do que o permitido ({pts}/{MAX_PTS}). Reduza alguns atributos.
        </p>
      )}
    </div>
  );
}
