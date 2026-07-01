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
import { LogIn, UserPlus, LogOut, ShieldAlert, KeyRound, Mail } from "lucide-react";

type View = "list" | "sheet" | "wizard" | "rules" | "campaigns";

function AppContent() {
  const { activeCharacter, setActiveId } = useCharacterStore();
  const [view, setView] = React.useState<View>("list");
  const [user, setUser] = React.useState<any>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [authMode, setAuthMode] = React.useState<"login" | "register">("login");
  
  // Estados de autenticação
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = React.useState(false);

  React.useEffect(() => {
    // Checa sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Escuta mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("char");
    if (sharedId) {
      setActiveId(sharedId);
      setView("sheet");
    }

    return () => subscription.unsubscribe();
  }, []);

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
      <div className="flex min-h-svh items-center justify-center bg-background font-mono text-xs text-muted-foreground animate-pulse">
        Carregando Conexão Mística...
      </div>
    );
  }

  // Se NÃO estiver logado, exibe uma tela de autenticação condizente e bonita
  if (!user) {
    return (
      <div className="flex min-h-svh bg-background text-foreground items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-sm bg-card border rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Arcanum Nexus
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono mt-1">Acesse o seu painel de herói</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground block mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border rounded pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono transition-colors"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground block mb-1">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border rounded pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono rounded flex items-center gap-2">
                <ShieldAlert className="size-3.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono rounded">
                Cadastro concluído! Acesse agora utilizando suas credenciais.
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 font-bold uppercase tracking-wider text-[11px] text-primary-foreground py-2.5 rounded transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/10"
            >
              {authMode === "login" ? <LogIn className="size-3.5" /> : <UserPlus className="size-3.5" />}
              {authMode === "login" ? "Entrar no Nexus" : "Criar Nova Conta"}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t">
            <button 
              onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(null); }}
              className="text-[10px] text-primary hover:underline font-mono"
            >
              {authMode === "login" ? "Não tem uma conta? Cadastre-se" : "Já possui conta? Faça o Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se estiver logado, exibe o aplicativo original idêntico ao seu layout anterior
  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground transition-colors">
      {/* CABEÇALHO GLOBAL */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-card px-4 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("list")}>
            <span className="font-black uppercase tracking-wider text-sm sm:text-base bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Arcanum Nexus
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
          <span className="text-[10px] font-mono text-muted-foreground hidden lg:inline max-w-[150px] truncate" title={user.email}>
            {user.email}
          </span>
          <button 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive p-2 rounded-md border border-transparent hover:bg-muted transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            title="Sair do Sistema"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Sair</span>
          </button>
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
          Desenvolvido com por <span className="font-bold text-foreground">Mateus Henrique da Silva</span> (<span className="text-primary">@mhs.zoldyck</span>) 
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