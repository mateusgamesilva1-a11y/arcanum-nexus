import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface StatOrbProps {
  label: string;
  current: number;
  max: number;
  color: "red" | "blue" | "yellow" | "purple";
  onCurrentChange: (v: number) => void;
}

const colorMap = {
  red: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-500", bar: "bg-rose-500" },
  blue: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-500", bar: "bg-blue-500" },
  yellow: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-500", bar: "bg-amber-500" },
  purple: { bg: "bg-violet-500/10 border-violet-500/30", text: "text-violet-500", bar: "bg-violet-500" },
};

export function StatOrb({ label, current, max, color, onCurrentChange }: StatOrbProps) {
  // Allow current to exceed max (bonus situations). Bar caps at 100%.
  const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  const c = colorMap[color];
  const isOverMax = current > max;

  return (
    <div className={cn("rounded-xl border p-3 flex flex-col gap-2", c.bg)}>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-bold uppercase tracking-wider", c.text)}>{label}</span>
        <span className={cn("text-xs font-mono font-bold", c.text, isOverMax && "ring-1 ring-current rounded px-1")}>
          {current}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-background/50 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", c.bar)} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => onCurrentChange(Math.max(0, current - 1))}>
          <Minus className="size-3" />
        </Button>
        <input
          type="number"
          className={cn("w-12 text-center text-sm font-bold bg-transparent border-0 outline-none", c.text)}
          value={current}
          min={0}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onCurrentChange(Math.max(0, v));
          }}
        />
        <Button variant="ghost" size="icon-sm" className="size-6" onClick={() => onCurrentChange(current + 1)}>
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}
