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
import { LogIn, UserPlus, LogOut, ShieldAlert } from "lucide-react";

type View = "list" | "sheet" | "wizard" | "rules" | "campaigns";

function AppContent() {
  const { activeCharacter, setActiveId } = useCharacterStore();
  const [view, setView] = React.useState<View>("list");
  const [user, setUser] = React.useState<any>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [authMode, setAuthMode] = React.useState<"login" | "register">("login");
  
  // Estados dos inputs de autenticação
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = React.useState(false);

  React.useEffect(() => {
    // Checa sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Escuta mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Detecta parâmetro de compartilhamento na URL
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("char");
    if (sharedId) {
      setActiveId(sharedId);
      setView("sheet");
    }

    return () => subscription.unsubscribe();
  }, []);

  // Sincroniza vínculos ao detectar usuário logado
  React.useEffect(() => {
    if (user) {
      supabase.from("campaign_players").update({ user_id: user.id }).eq("player_email", user.email);
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(false);

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess(true);
        setAuthMode("login");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView("list");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-muted-foreground">
        Carregando Conexão Mística...
      </div>
    );
  }

  // Se NÃO houver usuário logado, renderiza a tela de Login/Cadastro
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-black tracking-wider uppercase text-purple-400">Arcanum Nexus</h1>
            <p className="text-[10px] text-zinc-400 font-mono mt-1">Acesse sua Ficha de Herói</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 block mb-1">E-mail</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono transition-colors"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 block mb-1">Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-purple-500 font-mono transition-colors"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-2 bg-rose-950/30 border border-rose-900 text-rose-400 text-[10px] font-mono rounded flex items-center gap-2">
                <ShieldAlert className="size-3 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-2 bg-emerald-950/30 border border-emerald-900 text-emerald-400 text-[10px] font-mono rounded">
                Cadastro feito! Verifique seu e-mail se necessário.
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 font-bold uppercase tracking-wider text-[11px] text-white py-2.5 rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
            >
              {authMode === "login" ? <LogIn className="size-3.5" /> : <UserPlus className="size-3.5" />}
              {authMode === "login" ? "Entrar no Nexus" : "Criar Nova Conta"}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-zinc-800">
            <button 
              onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(null); }}
              className="text-[10px] text-purple-400 hover:underline font-mono"
            >
              {authMode === "login" ? "Não tem uma conta? Cadastre-se" : "Já tem conta? Faça o Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário estiver logado, exibe o app normal com o botão "Sair" adicionado no topo
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full bg-card border-b px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xs font-black tracking-wider uppercase text-primary">Arcanum Nexus</h1>
          <nav className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground ml-4">
            <button onClick={() => setView("list")} className={cn("hover:text-foreground px-2 py-1 rounded", view === "list" && "text-foreground bg-muted font-bold")}>Fichas</button>
            <button onClick={() => setView("campaigns")} className={cn("hover:text-foreground px-2 py-1 rounded", view === "campaigns" && "text-foreground bg-muted font-bold")}>Mestre/Bestiário</button>
            <button onClick={() => setView("rules")} className={cn("hover:text-foreground px-2 py-1 rounded", view === "rules" && "text-foreground bg-muted font-bold")}>Regras</button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground max-w-[120px] truncate hidden sm:inline" title={user.email}>
            {user.email}
          </span>
          <button 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-rose-400 p-1.5 rounded border border-transparent hover:border-border transition-all flex items-center gap-1 text-[10px] font-mono"
            title="Sair do Sistema"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50/40 dark:bg-zinc-950/20">
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

      <footer className="w-full text-center py-3 bg-card border-t text-[10px] text-muted-foreground hidden md:block">
        <p>
          Desenvolvido com ♥ por <span className="font-bold text-foreground">Mateus Henrique da Silva</span> (<span className="text-primary">@mhs.zoldyck</span>) 
          — Sistema criado por <span className="font-bold text-foreground">Heitor Tavares</span>
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <CharacterStoreProvider>
      <AppContent />
    </CharacterStoreProvider>
  );
}