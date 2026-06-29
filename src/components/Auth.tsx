import * as React from "react";
import { supabase } from "@/lib/supabase";

export function Auth() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [message, setMessage] = React.useState("");

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(`Erro no cadastro: ${error.message}`);
      else setMessage("Cadastro realizado! Verifique seu e-mail se necessário ou faça login.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Erro no login: ${error.message}`);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 max-w-sm mx-auto w-full min-h-svh">
      <div className="w-full border border-border bg-card text-card-foreground p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-center tracking-tight mb-2">
          {isSignUp ? "Criar Conta RPG" : "Entrar no RPG"}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {isSignUp ? "Preencha os dados abaixo" : "Insira seu e-mail e senha para continuar"}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-medium p-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        {message && <p className="text-xs text-center mt-4 text-emerald-500 font-medium">{message}</p>}

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary underline hover:opacity-80"
          >
            {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}