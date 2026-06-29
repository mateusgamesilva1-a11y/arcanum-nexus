import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Character } from "@/lib/character-types";
import { CharacterJournal } from "@/components/CharacterJournal"; 

interface NotesTabProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export function NotesTab({ character, onUpdate }: NotesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 bg-muted/30 p-3 rounded-xl border">
          <Label className="text-xs font-bold uppercase tracking-wider">Aparência Física</Label>
          <Textarea
            value={character.appearance}
            placeholder="Descreva cicatrizes, vestimentas, feições físicas..."
            className="min-h-[80px] text-xs bg-background resize-none"
            onChange={(e) => onUpdate({ appearance: e.target.value })}
          />
        </div>

        <div className="space-y-2 bg-muted/30 p-3 rounded-xl border">
          <Label className="text-xs font-bold uppercase tracking-wider">História / Origem</Label>
          <Textarea
            value={character.backstory}
            placeholder="Crônicas passadas, motivações e segredos do herói..."
            className="min-h-[80px] text-xs bg-background resize-none"
            onChange={(e) => onUpdate({ backstory: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <CharacterJournal />
      </div>
    </div>
  );
}