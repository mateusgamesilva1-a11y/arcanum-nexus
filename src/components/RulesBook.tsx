// ============================================================
// RULES BOOK — Quick reference for game rules
// ============================================================
import { CLASSES, WEAPONS, ELEMENTS, PILARES_CAOTICOS, PILARES_SERENOS, DAMAGE_TYPES, ATTRIBUTE_NAMES, SKILLS_BY_ATTR, SKILL_NAMES, PROFICIENCY_NAMES, RESISTANCE_NAMES, RESISTANCES, LEVEL_TABLE, ATTR_BASE, ATTR_POINTS } from "@/lib/rpg-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Sword, Sparkles, BookOpen, Users, Zap, HelpCircle, TrendingUp } from "lucide-react";
import type { AttributeKey } from "@/lib/rpg-data";

interface RulesBookProps {
  onBack: () => void;
}

const ATTR_ORDER: AttributeKey[] = ["forca", "constituicao", "agilidade", "intelecto", "presenca"];

export function RulesBook({ onBack }: RulesBookProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="border-b bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <BookOpen className="size-5 text-primary" />
          <div>
            <h2 className="font-bold">Livro de Regras</h2>
            <p className="text-xs text-muted-foreground">Referência rápida do sistema</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs defaultValue="classes" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-3 shrink-0 w-auto justify-start flex-wrap h-auto gap-0.5">
            <TabsTrigger value="classes" className="text-xs gap-1"><Users className="size-3.5" />Classes</TabsTrigger>
            <TabsTrigger value="attrs" className="text-xs gap-1"><Zap className="size-3.5" />Atributos</TabsTrigger>
            <TabsTrigger value="combat" className="text-xs gap-1"><Sword className="size-3.5" />Combate</TabsTrigger>
            <TabsTrigger value="magic" className="text-xs gap-1"><Sparkles className="size-3.5" />Magia</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs gap-1"><TrendingUp className="size-3.5" />Progressão</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs gap-1"><HelpCircle className="size-3.5" />Regras</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 mt-3">
            {/* CLASSES */}
            <TabsContent value="classes">
              <Accordion type="multiple" className="space-y-2">
                {Object.entries(CLASSES).map(([classKey, cls]) => (
                  <AccordionItem key={classKey} value={classKey} className="border rounded-xl overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:bg-accent hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cls.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold">{cls.name}</p>
                          <p className="text-xs text-muted-foreground font-normal">{cls.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-1">
                        {Object.entries(cls.subclasses).map(([subKey, sub]) => (
                          <div key={subKey} className="rounded-lg border bg-card p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-base">{sub.icon}</span>
                              <span className="font-semibold text-sm">{sub.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{sub.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {Object.entries(sub.attrBonus).filter(([, v]) => v !== 0).map(([attr, val]) => (
                                <Badge key={attr} variant="secondary" className="text-xs">{attr.toUpperCase().slice(0, 3)} {(val as number) > 0 ? `+${val}` : val}</Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">PV {sub.pvBonus >= 0 ? `+${sub.pvBonus}` : sub.pvBonus}</Badge>
                              <Badge variant="outline" className="text-xs">PE {sub.peBonus >= 0 ? `+${sub.peBonus}` : sub.peBonus}</Badge>
                              {sub.sanBonus ? <Badge variant="outline" className="text-xs">SAN {sub.sanBonus > 0 ? `+${sub.sanBonus}` : sub.sanBonus}</Badge> : null}
                              {sub.bpBonus ? <Badge variant="outline" className="text-xs">BP +{sub.bpBonus}</Badge> : null}
                            </div>
                            <ul className="space-y-1">
                              {sub.features.map((f, i) => (
                                <li key={i} className="text-xs flex items-start gap-1.5">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                            {sub.proficiencies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {sub.proficiencies.map((pk) => (
                                  <Badge key={pk} variant="secondary" className="text-xs">{PROFICIENCY_NAMES[pk]}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* ATTRIBUTES */}
            <TabsContent value="attrs">
              <div className="space-y-3">
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-3">Distribuição de Pontos</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Todos os atributos começam em <strong className="text-foreground">{ATTR_BASE}</strong></li>
                    <li>• Total de <strong className="text-foreground">{ATTR_POINTS} pontos</strong> para distribuir entre os 5 atributos</li>
                    <li>• Mínimo: -2 por atributo; Máximo: +5</li>
                    <li>• Bônus de subclasse são adicionados automaticamente após a distribuição</li>
                  </ul>
                </div>

                {ATTR_ORDER.map((key) => (
                  <div key={key} className="rounded-lg border bg-card p-3">
                    <p className="font-semibold text-sm mb-1">{ATTRIBUTE_NAMES[key]}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {key === "forca" && "Determina carga máxima (5+FOR), uso de armas pesadas, socos e testes físicos."}
                      {key === "constituicao" && "Aumenta Pontos de Vida (10+CON). Testes de resistência física."}
                      {key === "agilidade" && "Determina Defesa (10+AGL), Iniciativa e armas leves/longas."}
                      {key === "intelecto" && "Aumenta Energia (1+⌈INT/2⌉). Magias e tecnologia."}
                      {key === "presenca" && "Aumenta Sanidade (6+PRE). Interações sociais e percepção."}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {SKILLS_BY_ATTR[key].map((sk) => (
                        <Badge key={sk} variant="secondary" className="text-xs">{SKILL_NAMES[sk]}</Badge>
                      ))}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-3">Estatísticas Derivadas</p>
                  <div className="space-y-2 text-sm">
                    {[
                      ["Pontos de Vida Máx.", "10 + CON + bônus classe + (nível-1)×2"],
                      ["Energia Máx.", "1 + ⌈INT/2⌉ + bônus + ⌊(nível-1)/2⌋"],
                      ["Sanidade Máx.", "6 + PRE + bônus + (nível-1)"],
                      ["Defesa", "10 + AGL"],
                      ["Bônus de Proficiência (BP)", "2 + ⌊(nível-1)/3⌋ + bônus"],
                      ["Carga Máx.", "5 + FOR"],
                    ].map(([label, formula]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-mono text-xs text-right">{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* COMBAT */}
            <TabsContent value="combat">
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-2">Sequência de Combate</p>
                  <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
                    <li>Iniciativa: 1d20 + AGL (mínimo 10 para Lutador Leve)</li>
                    <li>Turno: Ação Principal + Ação de Movimento + 1 Ação Bônus</li>
                    <li>Ataque: 1d20 + mod atributo vs Defesa do alvo</li>
                    <li>Crítico: acerto no intervalo crítico → dano multiplicado</li>
                    <li>Ferida Fatal: ao chegar em 0 PV, teste de CON (CD 10)</li>
                  </ol>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-2">Tipos de Dano</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DAMAGE_TYPES.map((dt) => <Badge key={dt} variant="outline" className="text-xs">{dt}</Badge>)}
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Armas de Referência</p>
                <div className="space-y-2">
                  {WEAPONS.map((w) => (
                    <div key={w.name} className="rounded-lg border bg-card p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.type} · {w.attr}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-mono font-bold">{w.damage}</p>
                        <p className="text-xs text-muted-foreground">Crit {w.crit}/x{w.mult}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-2">Resistências</p>
                  <div className="grid grid-cols-2 gap-1">
                    {RESISTANCES.map((rk) => <div key={rk} className="text-xs text-muted-foreground">• {RESISTANCE_NAMES[rk]}</div>)}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* MAGIC */}
            <TabsContent value="magic">
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Círculos Mágicos — Elementos e Pilares</p>
                  <img src="/images/elements/image.png" alt="Elementos e Pilares Mágicos" className="w-full rounded-md" />
                </div>

                <div className="rounded-lg border bg-blue-500/5 border-blue-500/20 p-4">
                  <p className="font-semibold text-sm mb-2">Arcanum Elemental</p>
                  <p className="text-xs text-muted-foreground mb-2">Arcanistas Elementais escolhem dois elementos e têm resistência natural a eles.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ELEMENTS.map((el) => <Badge key={el} variant="secondary" className="text-xs">{el}</Badge>)}
                  </div>
                </div>
                <div className="rounded-lg border bg-purple-500/5 border-purple-500/20 p-4">
                  <p className="font-semibold text-sm mb-2">Pilares Caóticos</p>
                  <p className="text-xs text-muted-foreground mb-2">+1 BP, -1 Sanidade base. Poderes sombrios e destrutivos.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PILARES_CAOTICOS.map((el) => <Badge key={el} variant="secondary" className="text-xs">{el}</Badge>)}
                  </div>
                </div>
                <div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-4">
                  <p className="font-semibold text-sm mb-2">Pilares Serenos</p>
                  <p className="text-xs text-muted-foreground mb-2">+1 Sanidade base, -1 Dano Físico. Poderes de cura e proteção.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PILARES_SERENOS.map((el) => <Badge key={el} variant="secondary" className="text-xs">{el}</Badge>)}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-3">Custo de Magia</p>
                  <p className="text-xs text-muted-foreground">Cada magia custa Pontos de Energia (PE). O custo varia por efeito e poder da magia. O Arcanista Híbrido pode imbuir o elemento na arma para metade do dano elemental.</p>
                </div>
              </div>
            </TabsContent>

            {/* PROGRESSION */}
            <TabsContent value="progress">
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-semibold text-sm mb-3">Tabela de Progressão</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="text-xs sm:text-sm">
                        <tr className="border-b">
                          <th className="text-left py-2 px-1">Nível</th>
                          <th className="text-center py-2 px-1">+PV</th>
                          <th className="text-center py-2 px-1">+PE</th>
                          <th className="text-center py-2 px-1">+SAN</th>
                          <th className="text-center py-2 px-1">+BP</th>
                          <th className="text-center py-2 px-1">Atrib.</th>
                          <th className="text-center py-2 px-1">Hab.</th>
                          <th className="text-center py-2 px-1">Perícia</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs sm:text-sm">
                        {LEVEL_TABLE.map((row) => (
                          <tr key={row.level} className="border-b border-border/50">
                            <td className="py-2 px-1 font-bold">{row.level}</td>
                            <td className="py-2 px-1 text-center text-rose-500">+{row.pvGain}</td>
                            <td className="py-2 px-1 text-center text-blue-500">{row.peGain > 0 ? `+${row.peGain}` : "—"}</td>
                            <td className="py-2 px-1 text-center text-amber-500">+{row.sanGain}</td>
                            <td className="py-2 px-1 text-center text-violet-500">{row.bpGain > 0 ? `+${row.bpGain}` : "—"}</td>
                            <td className="py-2 px-1 text-center">{row.attrPoint ? "✓" : "—"}</td>
                            <td className="py-2 px-1 text-center">{row.newHabilidade ? "✓" : "—"}</td>
                            <td className="py-2 px-1 text-center">{row.newPericia ? "✓" : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4 space-y-2 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">+PV:</strong> +2 PV máximo por nível</p>
                  <p><strong className="text-foreground">+PE:</strong> +1 energia máxima em níveis pares</p>
                  <p><strong className="text-foreground">+SAN:</strong> +1 sanidade máxima por nível</p>
                  <p><strong className="text-foreground">+BP:</strong> +1 bônus de proficiência a cada 3 níveis</p>
                  <p><strong className="text-foreground">Atrib.:</strong> +1 ponto de atributo em níveis pares</p>
                  <p><strong className="text-foreground">Hab.:</strong> nova habilidade em níveis ímpares</p>
                  <p><strong className="text-foreground">Perícia:</strong> nova perícia treinada a cada 5 níveis</p>
                </div>
              </div>
            </TabsContent>

            {/* GENERAL RULES */}
            <TabsContent value="rules">
              <div className="space-y-3">
                <Accordion type="multiple" className="space-y-2">
                  {[
                    { title: "Testes de Habilidade", content: "Role 1d20 e adicione o modificador do atributo relevante. Com treinamento na perícia, soma também o Bônus de Proficiência (BP). CD (Classe de Dificuldade) determinada pelo Mestre." },
                    { title: "Vantagem e Desvantagem", content: "Vantagem: role 2d20, use o maior resultado. Desvantagem: role 2d20, use o menor. Múltiplas fontes não acumulam — apenas um par de dados." },
                    { title: "Ferida Fatal", content: "Ao chegar em 0 PV, o personagem entra em estado de ferida fatal. Teste de Constituição CD 10 por turno. Falha 3x = morte. Aliados podem estabilizar com Primeiros Socorros." },
                    { title: "Bônus de Proficiência (BP)", content: "Recurso que soma em testes de perícias treinadas. Base: 2 + ⌊(nível-1)/3⌋. Caóticos ganham +1 BP extra. Recuperados no descanso longo." },
                    { title: "Sanidade", content: "Representa equilíbrio mental. Eventos traumáticos podem reduzir Sanidade. A 0, o personagem pode ter colapso ou agir fora de controle (decisão do Mestre)." },
                    { title: "Descanso", content: "Descanso Curto (1h): Recupera metade dos PV. Descanso Longo (8h): Recupera todos os PV, PE, e BP." },
                    { title: "Inventário e Carga", content: "Carga máxima: 5 + mod FOR. Exceder a carga impõe desvantagem em movimentação. Armas de duas mãos contam como 2 espaços." },
                    { title: "Progressão de Nível", content: "O avanço de nível é controlado diretamente pelo Mestre. A cada nível: +2 PV max, +1 SAN max. Níveis pares: +1 PE max. Níveis ímpares: +1 atributo livre. A cada 3 níveis: +1 BP max. Níveis ímpares alternados concedem novas habilidades e perícias conforme a tabela." }
                  ].map((item) => (
                    <AccordionItem key={item.title} value={item.title} className="border rounded-xl overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:bg-accent hover:no-underline">{item.title}</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
