import * as React from "react";
import type { Character } from "@/lib/character-types";
import type { ProficiencyKey } from "@/lib/rpg-data";
import { CLASSES, calcMaxPV, calcMaxEnergia, calcMaxSanidade, calcDefesa, calcBP } from "@/lib/rpg-data";
import { useCharacterStore } from "@/lib/character-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatOrb } from "./StatOrb";
import { AttributePanel } from "./AttributePanel";
import { CombatTab } from "./CombatTab";
import { InventoryTab } from "./InventoryTab";
import { MagicTab } from "./MagicTab";
import { HabilidadesTab } from "./HabilidadesTab";
import { ProficienciesTab } from "./ProficienciesTab";
import { NotesTab } from "./NotesTab";
import { SkillsTable } from "./SkillsTable";
import { LevelUpDialog } from "./LevelUpDialog";
import { ArrowLeft, Edit2, RefreshCw, User, Sword, Package, Sparkles, BookOpen, ScrollText, Zap, ArrowUp } from "lucide-react";

interface CharacterSheetProps {
  character: Character;
  onBack: () => void;
}

export function CharacterSheet({ character, onBack }: CharacterSheetProps) {
  const { updateCharacter } = useCharacterStore();
  const [editingName, setEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(character.name);
  const [levelUpOpen, setLevelUpOpen] = React.useState(false);

  const cls = character.classKey ? CLASSES[character.classKey] : null;
  const sub = cls && character.subclassKey ? cls.subclasses[character.subclassKey] : null;

  function update(updates: Partial<Character>) {
    updateCharacter(character.id, updates);
  }

  function recalcDerived() {
    const maxPV = calcMaxPV(character.level, character.attributes.constituicao, sub?.pvBonus ?? 0);
    // REGRA DO MESTRE: Energia mínima travada em 1
    const maxEnergia = Math.max(1, calcMaxEnergia(character.level, character.attributes.intelecto, sub?.peBonus ?? 0));
    const maxSanidade = calcMaxSanidade(character.level, character.attributes.presenca, sub?.sanBonus ?? 0);
    const maxBP = calcBP(character.level, sub?.bpBonus ?? 0);
    const defesa = calcDefesa(character.attributes.agilidade);
    update({ maxPV, maxEnergia, maxSanidade, maxBP, defesa });
  }

  function commitName() {
    if (nameInput.trim()) update({ name: nameInput.trim() });
    setEditingName(false);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="border-b bg-card shrink-0 px-4 py-3">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon-sm" onClick={onBack} className="mt-0.5 shrink-0">
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex-1 min-w-0">
            {editingName ? (
              <form onSubmit={(e) => { e.preventDefault(); commitName(); }} className="flex gap-2">
                <Input className="h-8 text-base font-bold" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoFocus onBlur={commitName} />
              </form>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-lg font-bold truncate">{character.name}</h1>
                <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100" onClick={() => { setNameInput(character.name); setEditingName(true); }}>
                  <Edit2 className="size-3" />
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {cls && <Badge variant="secondary" className="text-xs">{cls.icon} {cls.name}</Badge>}
              {sub && <Badge variant="outline" className="text-xs">{sub.icon} {sub.name}</Badge>}
              <Badge className="text-xs">Nível {character.level}</Badge>
              {character.race && <span className="text-xs text-muted-foreground">{character.race}</span>}
            </div>
          </div>

          {/* Botão de nível controlado pelo Mestre */}
          <Button onClick={() => setLevelUpOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5 h-8 px-3 shrink-0">
            <ArrowUp className="size-3.5" /> Subir de Nível
          </Button>
        </div>
      </div>

      {/* Vital stats bar */}
      <div className="border-b bg-background shrink-0 px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatOrb label="Pontos de Vida" current={character.currentPV} max={character.maxPV} color="red" onCurrentChange={(v) => update({ currentPV: v })} />
          <StatOrb label="Energia" current={character.currentEnergia} max={character.maxEnergia} color="blue" onCurrentChange={(v) => update({ currentEnergia: v })} />
          <StatOrb label="Sanidade" current={character.currentSanidade} max={character.maxSanidade} color="yellow" onCurrentChange={(v) => update({ currentSanidade: v })} />
          <StatOrb label="Bônus de Prof." current={character.currentBP} max={character.maxBP} color="purple" onCurrentChange={(v) => update({ currentBP: v })} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Defesa:</span>
            <span className="font-bold text-blue-500">{character.defesa}</span>
            <span className="text-xs text-muted-foreground">(10 + AGL)</span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={recalcDerived} className="text-xs gap-1">
            <RefreshCw className="size-3" />
            Recalcular
          </Button>
        </div>
      </div>

      {/* Tabs content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs defaultValue="attrs" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-3 shrink-0 w-auto justify-start overflow-x-auto flex-wrap h-auto gap-0.5">
            <TabsTrigger value="attrs" className="gap-1.5 text-xs">
              <User className="size-3.5" />
              <span className="hidden sm:inline">Atributos</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-1.5 text-xs">
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline">Perícias</span>
            </TabsTrigger>
            <TabsTrigger value="combat" className="gap-1.5 text-xs">
              <Sword className="size-3.5" />
              <span className="hidden sm:inline">Combate</span>
            </TabsTrigger>
            <TabsTrigger value="magic" className="gap-1.5 text-xs">
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">Magia</span>
            </TabsTrigger>
            <TabsTrigger value="habilidades" className="gap-1.5 text-xs">
              <Zap className="size-3.5" />
              <span className="hidden sm:inline">Habilidades</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-1.5 text-xs">
              <Package className="size-3.5" />
              <span className="hidden sm:inline">Inventário</span>
            </TabsTrigger>
            <TabsTrigger value="profs" className="gap-1.5 text-xs">
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline">Profic.</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <ScrollText className="size-3.5" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 mt-3">
            <TabsContent value="attrs">
              <AttributePanel attributes={character.attributes} skills={character.skills} />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsTable
                attributes={character.attributes}
                skills={character.skills}
                bp={character.currentBP}
                onToggle={(key, trained) => update({ skills: { ...character.skills, [key]: trained } })}
              />
            </TabsContent>

            <TabsContent value="combat">
              <CombatTab
                weapons={character.weapons}
                resistances={character.resistances}
                defesa={character.defesa}
                onWeaponsChange={(w) => update({ weapons: w })}
                onResistancesChange={(r) => update({ resistances: r })}
              />
            </TabsContent>

            <TabsContent value="magic">
              <MagicTab
                magics={character.magics}
                currentEnergia={character.currentEnergia}
                maxEnergia={character.maxEnergia}
                onMagicsChange={(m) => update({ magics: m })}
                onEnergiaChange={(v) => update({ currentEnergia: v })}
              />
            </TabsContent>

            <TabsContent value="habilidades">
              <HabilidadesTab
                habilidades={character.habilidades}
                onHabilidadesChange={(h) => update({ habilidades: h })}
              />
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryTab
                items={character.inventoryItems}
                forcaMod={character.attributes.forca}
                gold={character.dinheiroGold}
                silver={character.dinheiroPrata}
                copper={character.dinheiroCobre}
                onItemsChange={(items) => update({ inventoryItems: items })}
                onMoneyChange={(g, s, c) => update({ dinheiroGold: g, dinheiroPrata: s, dinheiroCobre: c })}
              />
            </TabsContent>

            <TabsContent value="profs">
              <ProficienciesTab
                proficiencies={character.proficiencies}
                onToggle={(key: ProficiencyKey, value: boolean) =>
                  update({ proficiencies: { ...character.proficiencies, [key]: value } })
                }
              />
            </TabsContent>

            <TabsContent value="notes">
              <NotesTab character={character} onUpdate={update} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <LevelUpDialog
        open={levelUpOpen}
        onOpenChange={setLevelUpOpen}
        character={character}
        onLevelUp={update}
      />
    </div>
  );
}