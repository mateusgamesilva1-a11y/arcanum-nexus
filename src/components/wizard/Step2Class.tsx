import { CLASSES } from "@/lib/rpg-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Step2ClassProps {
  classKey: string;
  subclassKey: string;
  onClassChange: (key: string) => void;
  onSubclassChange: (key: string) => void;
}

export function Step2Class({ classKey, subclassKey, onClassChange, onSubclassChange }: Step2ClassProps) {
  const selectedClass = classKey ? CLASSES[classKey] : null;
  const selectedSubclass = selectedClass && subclassKey ? selectedClass.subclasses[subclassKey] : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-3 text-foreground">Escolha sua Classe</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(CLASSES).map(([key, cls]) => (
            <button
              key={key}
              onClick={() => { onClassChange(key); onSubclassChange(""); }}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary hover:bg-accent",
                classKey === key ? "border-primary bg-primary/5" : "border-border bg-card"
              )}
            >
              <span className="text-2xl">{cls.icon}</span>
              <span className="font-semibold text-sm text-center leading-tight">{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedClass && (
        <div>
          <Separator className="mb-4" />
          <p className="text-sm font-medium mb-3 text-foreground">Escolha sua Subclasse</p>
          <ScrollArea className="h-65 pr-1">
            <div className="space-y-2">
              {Object.entries(selectedClass.subclasses).map(([key, sub]) => (
                <button
                  key={key}
                  onClick={() => onSubclassChange(key)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 rounded-lg border-2 p-3 transition-all hover:border-primary hover:bg-accent",
                    subclassKey === key ? "border-primary bg-primary/5" : "border-border bg-card"
                  )}
                >
                  <span className="text-xl mt-0.5 shrink-0">{sub.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{sub.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{sub.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sub.features.slice(0, 2).map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">
                          {f.length > 40 ? f.slice(0, 37) + "…" : f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {selectedSubclass && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bônus de Subclasse</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedSubclass.attrBonus).filter(([, v]) => v !== 0).map(([attr, val]) => (
              <Badge key={attr} variant="outline" className="text-xs">
                {attr.toUpperCase().slice(0, 3)} {(val as number) > 0 ? `+${val}` : val}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs">PV {selectedSubclass.pvBonus >= 0 ? `+${selectedSubclass.pvBonus}` : selectedSubclass.pvBonus}</Badge>
            <Badge variant="outline" className="text-xs">PE {selectedSubclass.peBonus >= 0 ? `+${selectedSubclass.peBonus}` : selectedSubclass.peBonus}</Badge>
            {selectedSubclass.sanBonus && <Badge variant="outline" className="text-xs">SAN {selectedSubclass.sanBonus > 0 ? `+${selectedSubclass.sanBonus}` : selectedSubclass.sanBonus}</Badge>}
            {selectedSubclass.bpBonus && <Badge variant="outline" className="text-xs">BP +{selectedSubclass.bpBonus}</Badge>}
          </div>
        </div>
      )}
    </div>
  );
}
