import * as React from "react";
import { ATTRIBUTE_NAMES, ATTRIBUTE_SHORT, SKILLS_BY_ATTR, SKILL_NAMES } from "@/lib/rpg-data";
import type { AttributeKey } from "@/lib/rpg-data";
import type { CharacterAttributes } from "@/lib/character-types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttributePanelProps {
  attributes: CharacterAttributes;
  skills: Record<string, boolean>;
}

const ATTR_ORDER: AttributeKey[] = ["forca", "constituicao", "agilidade", "intelecto", "presenca"];

const ATTR_COLORS: Record<AttributeKey, { bg: string; text: string; border: string }> = {
  forca: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30" },
  constituicao: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  agilidade: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
  intelecto: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  presenca: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/30" },
};

export function AttributePanel({ attributes, skills }: AttributePanelProps) {
  const [lastRoll, setLastRoll] = React.useState<{ label: string; result: number; mod: number; d20: number } | null>(null);

  function handleRoll(label: string, mod: number) {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const result = d20 + mod;
    setLastRoll({ label, result, mod, d20 });
    setTimeout(() => setLastRoll(null), 4000);
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {lastRoll && (
          <div className="rounded-lg border bg-primary/5 border-primary/20 px-4 py-2 text-sm flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="font-medium">{lastRoll.label}</span>
            <span className="font-mono font-bold text-primary">
              {lastRoll.d20} {lastRoll.mod >= 0 ? `+ ${lastRoll.mod}` : `- ${Math.abs(lastRoll.mod)}`} = <span className="text-lg">{lastRoll.result}</span>
            </span>
          </div>
        )}

        {ATTR_ORDER.map((key) => {
          const val = attributes[key];
          const c = ATTR_COLORS[key];
          const attrSkills = SKILLS_BY_ATTR[key];

          return (
            <div key={key} className={cn("rounded-lg border p-3", c.bg, c.border)}>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-12 text-center rounded-md py-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleRoll(ATTRIBUTE_NAMES[key], val)}
                    >
                      <div className={cn("text-xl font-black leading-none", c.text)}>
                        {val >= 0 ? `+${val}` : val}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {ATTRIBUTE_SHORT[key]}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Rolar 1d20 {val >= 0 ? `+${val}` : val} para {ATTRIBUTE_NAMES[key]}</TooltipContent>
                </Tooltip>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{ATTRIBUTE_NAMES[key]}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {attrSkills.map((sk) => {
                      const trained = !!skills[sk];
                      return (
                        <Tooltip key={sk}>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border transition-all cursor-pointer hover:opacity-80",
                                trained
                                  ? `${c.bg} ${c.border} ${c.text} font-bold`
                                  : "bg-card border-border text-muted-foreground"
                              )}
                              onClick={() => trained && handleRoll(SKILL_NAMES[sk], val)}
                            >
                              {SKILL_NAMES[sk]}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {trained ? `Treinado — Rolar 1d20${val >= 0 ? `+${val}` : val}` : "Sem treinamento"}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
