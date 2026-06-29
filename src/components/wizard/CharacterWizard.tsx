// ============================================================
// WIZARD CONTAINER
// ============================================================
import * as React from "react";
import { CLASSES, calcMaxPV, calcMaxEnergia, calcMaxSanidade, calcDefesa, calcBP, ATTR_BASE } from "@/lib/rpg-data";
import type { AttributeKey, ProficiencyKey } from "@/lib/rpg-data";
import type { Character } from "@/lib/character-types";
import { defaultAttributes } from "@/lib/character-types";
import { useCharacterStore } from "@/lib/character-store";
import { Button } from "@/components/ui/button";
import { Step1Identity } from "./Step1Identity";
import { Step2Class } from "./Step2Class";
import { Step3Attributes } from "./Step3Attributes";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Identidade", icon: "👤" },
  { label: "Classe", icon: "⚔️" },
  { label: "Atributos", icon: "🎲" },
];

interface WizardProps {
  onComplete: (id: string) => void;
  onCancel: () => void;
}

export function CharacterWizard({ onComplete, onCancel }: WizardProps) {
  const { addCharacter } = useCharacterStore();
  const [step, setStep] = React.useState(0);

  const [identity, setIdentity] = React.useState({
    name: "",
    player: "",
    race: "",
    age: "",
    appearance: "",
    backstory: "",
  });
  const [classKey, setClassKey] = React.useState("");
  const [subclassKey, setSubclassKey] = React.useState("");
  const [attributes, setAttributes] = React.useState(defaultAttributes());
  const [skills, setSkills] = React.useState<Record<string, boolean>>({});

  function handleIdentityChange(field: string, value: string) {
    setIdentity((prev) => ({ ...prev, [field]: value }));
  }

  function handleAttrChange(key: AttributeKey, value: number) {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  }

  function handleSkillToggle(key: string) {
    setSkills((prev) => {
      const current = !!prev[key];
      const selected = Object.values(prev).filter(Boolean).length;
      if (!current && selected >= 2) return prev;
      return { ...prev, [key]: !current };
    });
  }

  function canProceed(): boolean {
    if (step === 0) return !!identity.name.trim();
    if (step === 1) return !!classKey && !!subclassKey;
    if (step === 2) {
      const pts = Object.values(attributes).reduce((s, v) => s + (v - ATTR_BASE), 0);
      return pts <= 4;
    }
    return true;
  }

  function buildCharacter(): Character {
    const sub = CLASSES[classKey]?.subclasses[subclassKey];

    // Apply subclass attr bonus ON TOP of distributed attributes
    const finalAttrs = { ...attributes };
    if (sub) {
      for (const [k, v] of Object.entries(sub.attrBonus)) {
        (finalAttrs as Record<string, number>)[k] = ((finalAttrs as Record<string, number>)[k] || 0) + (v as number);
      }
    }

    const maxPV = calcMaxPV(1, finalAttrs.constituicao, sub?.pvBonus ?? 0);
    const maxEnergia = Math.max(1, calcMaxEnergia(1, finalAttrs.intelecto, sub?.peBonus ?? 0));
    const maxSanidade = calcMaxSanidade(1, finalAttrs.presenca, sub?.sanBonus ?? 0);
    const maxBP = calcBP(1, sub?.bpBonus ?? 0);
    const defesa = calcDefesa(finalAttrs.agilidade);

    // Skill merging: wizard selection + subclass skills
    const mergedSkills: Record<string, boolean> = { ...skills };
    if (sub) {
      for (const sk of sub.skills) {
        mergedSkills[sk] = true;
      }
    }

    // Proficiency from subclass
    const profs: Record<ProficiencyKey, boolean> = {} as Record<ProficiencyKey, boolean>;
    if (sub) {
      for (const pk of sub.proficiencies) {
        profs[pk] = true;
      }
    }

    return {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...identity,
      classKey,
      subclassKey,
      level: 1,
      xp: 0,
      description: "",
      attributes: finalAttrs,
      currentPV: maxPV,
      maxPV,
      currentEnergia: maxEnergia,
      maxEnergia,
      currentSanidade: maxSanidade,
      maxSanidade,
      currentBP: maxBP,
      maxBP,
      defesa,
      skills: mergedSkills,
      proficiencies: profs,
      resistances: {
        r_balistico: 0,
        r_cortante: 0,
        r_perfurante: 0,
        r_contundente: 0,
        r_elemental: 0,
        r_caotica: 0,
        r_serena: 0,
      },
      weapons: [],
      magics: [],
      habilidades: [],
      inventoryItems: [],
      dinheiroGold: 0,
      dinheiroPrata: 0,
      dinheiroCobre: 0,
      conditions: [],
      notes: "",
    };
  }

  function handleFinish() {
    const char = buildCharacter();
    addCharacter(char);
    onComplete(char.id);
  }

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="border-b bg-card px-6 py-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Criar Personagem
            </h2>
            <p className="text-sm text-muted-foreground">Passo {step + 1} de {STEPS.length}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
        </div>

        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={cn(
                "flex items-center gap-2 text-sm",
                i < step ? "text-primary" : i === step ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "size-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                  i < step ? "border-primary bg-primary text-primary-foreground" :
                  i === step ? "border-primary text-primary" :
                  "border-border text-muted-foreground"
                )}>
                  {i < step ? <Check className="size-3" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border")} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {step === 0 && (
          <Step1Identity data={identity} onChange={handleIdentityChange} />
        )}
        {step === 1 && (
          <Step2Class
            classKey={classKey}
            subclassKey={subclassKey}
            onClassChange={setClassKey}
            onSubclassChange={setSubclassKey}
          />
        )}
        {step === 2 && (
          <Step3Attributes
            attributes={attributes}
            skills={skills}
            onAttrChange={handleAttrChange}
            onSkillToggle={handleSkillToggle}
            classKey={classKey}
            subclassKey={subclassKey}
          />
        )}
      </div>

      <div className="border-t bg-card px-6 py-4 flex items-center justify-between shrink-0">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Próximo
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!canProceed()}
            className="gap-2"
          >
            <Check className="size-4" />
            Criar Personagem
          </Button>
        )}
      </div>
    </div>
  );
}
