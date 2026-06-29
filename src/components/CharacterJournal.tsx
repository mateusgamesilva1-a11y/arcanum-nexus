import * as React from "react";
import { useCharacterStore } from "@/lib/character-store";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, BookOpen, ImageIcon } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sketchUrl?: string;
  createdAt: string;
}

export function CharacterJournal() {
  const { activeCharacter, updateCharacter } = useCharacterStore();
  
  // Resgata ou cria a lista de notas do caderno salvas no JSON do personagem
  const notesList: JournalEntry[] = (activeCharacter as any)?.journalEntries || [];

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [sketchUrl, setSketchUrl] = React.useState("");

  function handleAddEntry() {
    if (!title.trim() && !content.trim()) return;
    
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: title.trim() || "Anotação Sem Título",
      content: content.trim(),
      sketchUrl: sketchUrl.trim() || undefined,
      createdAt: new Date().toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    updateCharacter(activeCharacter!.id, {
      ...activeCharacter,
      journalEntries: [newEntry, ...notesList]
    } as any);

    setTitle("");
    setContent("");
    setSketchUrl("");
  }

  function handleDeleteEntry(id: string) {
    const filtered = notesList.filter(n => n.id !== id);
    updateCharacter(activeCharacter!.id, {
      ...activeCharacter,
      journalEntries: filtered
    } as any);
  }

  if (!activeCharacter) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      <div className="flex items-center gap-2 border-b pb-3">
        <BookOpen className="size-5 text-primary" />
        <div>
          <h3 className="font-black uppercase tracking-wider text-sm">Caderno de Campo & Desenhos</h3>
          <p className="text-xs text-muted-foreground">Registre crônicas, segredos, pistas e anexe croquis da aventura.</p>
        </div>
      </div>

      {/* Editor / Criador de Notas */}
      <div className="border rounded-xl p-4 bg-card space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input 
            type="text" 
            placeholder="Título do Capítulo ou Descoberta..." 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-background border p-2 rounded-lg text-xs font-bold w-full focus:outline-none focus:border-primary"
          />
          <input 
            type="url" 
            placeholder="URL de Ilustração/Esboço do Desenho (opcional)..." 
            value={sketchUrl}
            onChange={e => setSketchUrl(e.target.value)}
            className="bg-background border p-2 rounded-lg text-xs w-full focus:outline-none focus:border-primary"
          />
        </div>
        <textarea 
          placeholder="Escreva livremente os acontecimentos ou descrições da sessão aqui..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="bg-background border p-3 rounded-lg text-xs w-full min-h-25 focus:outline-none focus:border-primary"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleAddEntry} className="font-bold gap-1.5">
            <Plus className="size-4" /> Registrar no Caderno
          </Button>
        </div>
      </div>

      {/* Exibição do Caderno Histórico */}
      <div className="space-y-4">
        {notesList.length === 0 ? (
          <p className="text-xs italic text-center text-muted-foreground py-8">O caderno está em branco. Nenhuma memória gravada ainda.</p>
        ) : (
          notesList.map((entry) => (
            <div key={entry.id} className="border bg-card/60 rounded-xl p-4 space-y-3 relative group transition-all hover:bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-sm text-foreground">{entry.title}</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">{entry.createdAt}</span>
                </div>
                <button 
                  onClick={() => handleDeleteEntry(entry.id)} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 rounded-lg"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans">{entry.content}</p>

              {/* Bloco de Desenho / Imagem Anexada */}
              {entry.sketchUrl && (
                <div className="mt-3 border rounded-lg overflow-hidden max-w-lg bg-zinc-900 border-dashed p-1">
                  <div className="text-[9px] font-bold text-muted-foreground p-1 flex items-center gap-1"><ImageIcon className="size-3" /> Desenho/Registro Visual Anexo:</div>
                  <img src={entry.sketchUrl} alt="Desenho do diário" className="w-full max-h-64 object-contain rounded" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}