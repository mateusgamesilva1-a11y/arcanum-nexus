import * as React from "react";
import { CharacterStoreProvider, useCharacterStore } from "@/lib/character-store";
import { CharacterList } from "@/components/CharacterList";
import { CharacterSheet } from "@/components/sheet/CharacterSheet";
import { CharacterWizard } from "@/components/wizard/CharacterWizard";
import { RulesBook } from "@/components/RulesBook";
import { CampaignDashboard } from "@/components/CampaignDashboard"; 
import { ModeToggle } from "@/components/mode-toggle";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type View = "list" | "sheet" | "wizard" | "rules" | "campaigns";

function AppContent() {
  const { activeCharacter, setActiveId } = useCharacterStore();
  const [view, setView] = React.useState<View>("list");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("campaign_players").update({ user_id: user.id }).eq("player_email", user.email);
      }
    });

    // Detecta se há um parâmetro de compartilhamento na URL para abrir a ficha direto
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("char");
    if (sharedId) {
      setActiveId(sharedId);
      setView("sheet");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground transition-colors">
      {/* CABEÇALHO GLOBAL */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-card px-4 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("list")}>
            <span className="font-black uppercase tracking-wider text-sm sm:text-base bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tavernas & Monstros
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => setView("list")} 
              className={cn("px-3 py-1.5 rounded-md transition-colors", view === "list" || view === "sheet" || view === "wizard" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              Personagens
            </button>
            <button 
              onClick={() => setView("campaigns")} 
              className={cn("px-3 py-1.5 rounded-md transition-colors", view === "campaigns" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              Bestiário de Ameaças
            </button>
            <button 
              onClick={() => setView("rules")} 
              className={cn("px-3 py-1.5 rounded-md transition-colors", view === "rules" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              Livro de Regras
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
        </div>
      </header>

      {/* Navegação Mobile Inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-12 bg-card border-t flex items-center justify-around z-50 text-[10px] font-black uppercase tracking-wider">
        <button onClick={() => setView("list")} className={cn("flex-1 py-3 text-center", view === "list" || view === "sheet" ? "text-primary border-t-2 border-primary" : "text-muted-foreground")}>Fichas</button>
        <button onClick={() => setView("campaigns")} className={cn("flex-1 py-3 text-center", view === "campaigns" ? "text-primary border-t-2 border-primary" : "text-muted-foreground")}>Bestiário</button>
        <button onClick={() => setView("rules")} className={cn("flex-1 py-3 text-center", view === "rules" ? "text-primary border-t-2 border-primary" : "text-muted-foreground")}>Regras</button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col pt-14 pb-16 md:pb-6 w-full mx-auto max-w-7xl">
        {view === "list" && (
          <CharacterList
            onSelect={(id) => { setActiveId(id); setView("sheet"); }}
            onNew={() => setView("wizard")}
            onRulesBook={() => setView("rules")}
          />
        )}

        {view === "wizard" && (
          <CharacterWizard
            onComplete={(id) => { setActiveId(id); setView("sheet"); }}
            onCancel={() => setView("list")}
          />
        )}

        {view === "sheet" && activeCharacter && (
          <CharacterSheet character={activeCharacter} onBack={() => setView("list")} />
        )}

        {view === "rules" && <RulesBook onBack={() => setView("list")} />}

        {view === "campaigns" && (
          <CampaignDashboard onBack={() => setView("list")} />
        )}
      </main>

      {/* 📜 CRÉDITOS ESPECIAIS NO RODAPÉ DA PÁGINA */}
      <footer className="w-full text-center py-3 bg-card border-t text-[10px] text-muted-foreground hidden md:block">
        <p>
          Desenvolvido com por <span className="font-bold text-foreground">Mateus Henrique aura da Silva</span> (<span className="text-primary">@mhs.zoldyck</span>) 
          — Sistema criado por <span className="font-bold text-foreground">Heitor Tavares</span> (<span className="text-primary">@vecter01</span>)
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CharacterStoreProvider>
      <AppContent />
    </CharacterStoreProvider>
  );
}