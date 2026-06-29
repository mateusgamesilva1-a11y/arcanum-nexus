import type { InventoryItem } from "@/lib/character-types";
import { calcInventoryCap } from "@/lib/rpg-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Package, Shield, FlaskConical, Wrench, Coins, Box, Sword } from "lucide-react";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";

const CATEGORIES = [
  { value: "arma", label: "Arma", icon: Sword },
  { value: "armadura", label: "Armadura", icon: Shield },
  { value: "consumivel", label: "Consumível", icon: FlaskConical },
  { value: "equipamento", label: "Equipamento", icon: Wrench },
  { value: "tesouro", label: "Tesouro", icon: Coins },
  { value: "misc", label: "Misc", icon: Box },
] as const;

type CategoryValue = typeof CATEGORIES[number]["value"];

const CAT_COLORS: Record<CategoryValue, string> = {
  arma: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  armadura: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  consumivel: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  equipamento: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  tesouro: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  misc: "bg-muted text-muted-foreground border-border",
};

interface InventoryProps {
  items: InventoryItem[];
  forcaMod: number;
  gold: number;
  silver: number;
  copper: number;
  onItemsChange: (items: InventoryItem[]) => void;
  onMoneyChange: (gold: number, silver: number, copper: number) => void;
}

function emptyItem(): InventoryItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    weight: 1,
    quantity: 1,
    category: "misc",
    description: "",
    equipped: false,
  };
}

export function InventoryTab({ items, forcaMod, gold, silver, copper, onItemsChange, onMoneyChange }: InventoryProps) {
  const cap = calcInventoryCap(forcaMod);
  const totalWeight = items.reduce((s, i) => s + i.weight * i.quantity, 0);

  function addItem() {
    onItemsChange([...items, emptyItem()]);
  }

  function updateItem(id: string, updates: Partial<InventoryItem>) {
    onItemsChange(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }

  function removeItem(id: string) {
    onItemsChange(items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Capacity + money */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Capacidade</p>
          <div className="flex items-end gap-1">
            <span className={cn("text-2xl font-bold", totalWeight > cap ? "text-destructive" : "text-foreground")}>
              {totalWeight}
            </span>
            <span className="text-muted-foreground text-sm mb-0.5">/ {cap}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
            <div
              className={cn("h-full rounded-full transition-all", totalWeight > cap ? "bg-destructive" : "bg-primary")}
              style={{ width: `${Math.min(100, (totalWeight / cap) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground mb-2">Dinheiro</p>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "Ouro", value: gold, color: "text-amber-500", onChange: (v: number) => onMoneyChange(v, silver, copper) },
              { label: "Prata", value: silver, color: "text-slate-400", onChange: (v: number) => onMoneyChange(gold, v, copper) },
              { label: "Cobre", value: copper, color: "text-orange-700", onChange: (v: number) => onMoneyChange(gold, silver, v) },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className={cn("text-sm font-bold", m.color)}>{m.value}</div>
                <Input
                  type="number"
                  className="h-6 text-xs text-center px-1"
                  value={m.value}
                  min={0}
                  onChange={(e) => m.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <div className="text-[9px] text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item list */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{items.length} {items.length === 1 ? "item" : "itens"}</p>
        <Button size="sm" onClick={addItem}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      {items.length === 0 ? (
        <Empty className="border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Package className="size-5" /></EmptyMedia>
            <EmptyTitle>Inventário vazio</EmptyTitle>
            <EmptyDescription>Adicione itens ao inventário do personagem.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const catDef = CATEGORIES.find((c) => c.value === item.category);
            const CatIcon = catDef?.icon ?? Package;
            return (
              <div key={item.id} className="rounded-lg border bg-card p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className={cn("size-7 rounded-md border flex items-center justify-center shrink-0 mt-0.5", CAT_COLORS[item.category])}>
                    <CatIcon className="size-3.5" />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="col-span-2 sm:col-span-2">
                      <Input
                        className="h-7 text-sm"
                        placeholder="Nome do item"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      />
                    </div>

                    <Select value={item.category} onValueChange={(v) => updateItem(item.id, { category: v as CategoryValue })}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <label className="text-[9px] text-muted-foreground">Qtd</label>
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground">Peso</label>
                        <Input
                          type="number"
                          className="h-7 text-xs"
                          value={item.weight}
                          min={0}
                          step={0.5}
                          onChange={(e) => updateItem(item.id, { weight: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <Input
                  className="h-7 text-xs text-muted-foreground"
                  placeholder="Descrição (opcional)"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
