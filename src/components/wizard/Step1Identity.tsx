import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link2, Upload, ImageIcon } from "lucide-react";

interface Step1Props {
  data: {
    name: string;
    player: string;
    race: string;
    age: string;
    appearance: string;
    backstory: string;
    imageUrl?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function Step1Identity({ data, onChange }: Step1Props) {
  const [imageMode, setImageMode] = React.useState<"link" | "upload">("link");

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onChange("imageUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="char-name">Nome do Personagem *</Label>
          <Input id="char-name" placeholder="Ex: Kira Ashwood" value={data.name} onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-player">Nome do Jogador</Label>
          <Input id="char-player" placeholder="Seu nome" value={data.player} onChange={(e) => onChange("player", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-race">Raça / Espécie</Label>
          <Input id="char-race" placeholder="Ex: Humano, Elfo, Andróide..." value={data.race} onChange={(e) => onChange("race", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-age">Idade</Label>
          <Input id="char-age" placeholder="Ex: 24 anos" value={data.age} onChange={(e) => onChange("age", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2 border p-4 rounded-xl bg-card/50">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visual do Herói</Label>
          <div className="flex gap-1 border rounded-lg p-0.5 bg-background">
            <button
              type="button"
              onClick={() => setImageMode("link")}
              className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors ${imageMode === "link" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Link2 className="size-3" /> Link
            </button>
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors ${imageMode === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Upload className="size-3" /> Upload
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-xl border bg-muted flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {data.imageUrl ? (
              <img src={data.imageUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1">
            {imageMode === "link" ? (
              <Input
                type="url"
                placeholder="https://link-da-imagem.com/foto.jpg"
                value={data.imageUrl || ""}
                onChange={(e) => onChange("imageUrl", e.target.value)}
                className="h-10 text-xs"
              />
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="h-10 text-xs cursor-pointer file:mr-2 file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:px-2 file:py-0.5 file:text-[10px]"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="char-appearance">Aparência</Label>
        <Textarea id="char-appearance" placeholder="Descreva a aparência física do personagem..." value={data.appearance} onChange={(e) => onChange("appearance", e.target.value)} className="min-h-20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="char-backstory">História / Backstory</Label>
        <Textarea id="char-backstory" placeholder="Resumo da jornada do herói..." value={data.backstory} onChange={(e) => onChange("backstory", e.target.value)} className="min-h-25" />
      </div>
    </div>
  );
}