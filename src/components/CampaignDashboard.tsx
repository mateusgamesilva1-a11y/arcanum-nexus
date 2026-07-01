import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Shield, Heart, Zap, Brain, Sparkles, Image as ImageIcon, Maximize2, Swords, Edit, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Creature { 
  id: string; name: string; type: string; level: number; pv_max: number; defesa: number; 
  energia_max: number; sanidade_max: number; bp: number; image_url?: string;
  forca: number; agilidade: number; constituicao: number; intelecto: number; presenca: number; 
  skills_json: any[]; notes: string;
}

interface CreatureAttack {
  id: string;
  name: string;
  damage: string;
  type: string;
  description: string;
}

export function CampaignDashboard({ onBack }: { onBack: () => void }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [creatures, setCreatures] = React.useState<Creature[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Modal de Zoom das Criaturas
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [zoomTarget, setZoomTarget] = React.useState<{ name: string; url: string } | null>(null);

  // Estado de Edição
  const [editingCreatureId, setEditingCreatureId] = React.useState<string | null>(null);

  // Estados do Formulário
  const [cName, setCName] = React.useState("");
  const [cType, setCType] = React.useState("Monstro");
  const [cLevel, setCLevel] = React.useState(1);
  const [cPvMax, setCPvMax] = React.useState(20);
  const [cDefesa, setCDefesa] = React.useState(10);
  const [cEnergiaMax, setCEnergiaMax] = React.useState(5);
  const [cSanidadeMax, setCSanidadeMax] = React.useState(10);
  const [cBp, setCBp] = React.useState(2);
  const [cImageUrl, setCImageUrl] = React.useState("");
  const [cNotes, setCNotes] = React.useState("");
  
  // Atributos da Criatura
  const [cForca, setCForca] = React.useState(0);
  const [cAgilidade, setCAgilidade] = React.useState(0);
  const [cConstituicao, setCConstituicao] = React.useState(0);
  const [cIntelecto, setCIntelecto] = React.useState(0);
  const [cPresenca, setCPresenca] = React.useState(0);

  // Sistema Modular de Ataques
  const [cAttacks, setCAttacks] = React.useState<CreatureAttack[]>([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) {
        setUserId(data.user.id);
        fetchCreatures(data.user.id);
      }
    });
  }, []);

  async function fetchCreatures(uid: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("creatures")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCreatures(data || []);
    } catch (err) {
      console.error("Erro ao buscar criaturas:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddAttack() {
    setCAttacks([
      ...cAttacks,
      { id: crypto.randomUUID(), name: "Ataque", damage: "1d6", type: "Físico", description: "" }
    ]);
  }

  function handleUpdateAttack(id: string, fields: Partial<CreatureAttack>) {
    setCAttacks(cAttacks.map(atk => atk.id === id ? { ...atk, ...fields } : atk));
  }

  function handleRemoveAttack(id: string) {
    setCAttacks(cAttacks.filter(atk => atk.id !== id));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;
      const filePath = `creatures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      if (data?.publicUrl) setCImageUrl(data.publicUrl);
    } catch (err) {
      console.error("Erro no upload da imagem:", err);
      alert("Não foi possível subir a imagem da criatura.");
    } finally {
      setUploading(false);
    }
  }

  function startEdit(cr: Creature) {
    setEditingCreatureId(cr.id);
    setCName(cr.name);
    setCType(cr.type);
    setCLevel(cr.level);
    setCPvMax(cr.pv_max);
    setCDefesa(cr.defesa);
    setCEnergiaMax(cr.energia_max);
    setCSanidadeMax(cr.sanidade_max);
    setCBp(cr.bp);
    setCImageUrl(cr.image_url || "");
    setCNotes(cr.notes || "");
    setCForca(cr.forca || 0);
    setCAgilidade(cr.agilidade || 0);
    setCConstituicao(cr.constituicao || 0);
    setCIntelecto(cr.intelecto || 0);
    setCPresenca(cr.presenca || 0);
    setCAttacks(Array.isArray(cr.skills_json) ? cr.skills_json : []);
  }

  function clearForm() {
    setEditingCreatureId(null);
    setCName("");
    setCType("Monstro");
    setCLevel(1);
    setCPvMax(20);
    setCDefesa(10);
    setCEnergiaMax(5);
    setCSanidadeMax(10);
    setCBp(2);
    setCImageUrl("");
    setCNotes("");
    setCForca(0);
    setCAgilidade(0);
    setCConstituicao(0);
    setCIntelecto(0);
    setCPresenca(0);
    setCAttacks([]);
  }

  async function handleSaveCreature(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !cName.trim()) return;

    const payload = {
      name: cName,
      type: cType,
      level: Number(cLevel),
      pv_max: Number(cPvMax),
      defesa: Number(cDefesa),
      energia_max: Number(cEnergiaMax),
      sanidade_max: Number(cSanidadeMax),
      bp: Number(cBp),
      image_url: cImageUrl,
      forca: Number(cForca),
      agilidade: Number(cAgilidade),
      constituicao: Number(cConstituicao),
      intelecto: Number(cIntelecto),
      presenca: Number(cPresenca),
      skills_json: cAttacks,
      notes: cNotes,
      user_id: userId,
    };

    try {
      if (editingCreatureId) {
        const { error } = await supabase
          .from("creatures")
          .update(payload)
          .eq("id", editingCreatureId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("creatures")
          .insert([payload]);
        if (error) throw error;
      }
      clearForm();
      fetchCreatures(userId);
    } catch (err) {
      console.error("Erro ao salvar criatura:", err);
    }
  }

  async function handleDeleteCreature(id: string) {
    try {
      const { error } = await supabase.from("creatures").delete().eq("id", id);
      if (error) throw error;
      setCreatures(creatures.filter((c) => c.id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error("Erro ao deletar criatura:", err);
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Top Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-zinc-400 hover:text-white text-xs font-medium border border-zinc-800 px-2.5 py-1 rounded bg-zinc-900 transition-all">
            ← Voltar
          </button>
          <div>
            <h1 className="text-sm font-black tracking-wide uppercase text-white flex items-center gap-1.5">
              🔮 Bestiário do Mestre
            </h1>
            <p className="text-[10px] text-zinc-500">Crie, edite e consulte as ameaças ativas da sua campanha.</p>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-0">
        
        {/* Formulário de Criação/Edição */}
        <div className="md:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
            <h2 className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1">
              {editingCreatureId ? "📝 Editar Criatura" : "✨ Nova Criatura"}
            </h2>
            {editingCreatureId && (
              <button onClick={clearForm} className="text-zinc-500 hover:text-zinc-300">
                <X className="size-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSaveCreature} className="space-y-4 text-xs">
            {/* Imagem / Upload */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Arte / Retrato da Ameaça</label>
              <div className="flex items-center gap-3 bg-zinc-950 p-2 border border-zinc-800 rounded-lg">
                <div className="size-14 bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                  {cImageUrl ? (
                    <img src={cImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="size-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-[10px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer" />
                  <input type="text" placeholder="Ou cole a URL da imagem aqui" value={cImageUrl} onChange={(e) => setCImageUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300" />
                </div>
              </div>
            </div>

            {/* Campos Gerais */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Nome da Criatura</label>
                <input type="text" required value={cName} onChange={(e) => setCName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500" placeholder="Ex: Carniçal das Sombras" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Classificação</label>
                <select value={cType} onChange={(e) => setCType(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white focus:outline-none">
                  <option value="Monstro">Monstro</option>
                  <option value="Humanoide">Humanoide</option>
                  <option value="Bestial">Bestial</option>
                  <option value="Entidade">Entidade</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Nível (VD)</label>
                <input type="number" value={cLevel} onChange={(e) => setCLevel(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-center" />
              </div>
            </div>

            {/* Atributos Básicos */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Atributos (Modificadores)</label>
              <div className="grid grid-cols-5 gap-1 bg-zinc-950 p-2 border border-zinc-800 rounded-lg text-center">
                <div><div className="text-[9px] text-zinc-500 font-bold">FOR</div><input type="number" value={cForca} onChange={(e) => setCForca(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded text-center py-0.5 text-white" /></div>
                <div><div className="text-[9px] text-zinc-500 font-bold">AGL</div><input type="number" value={cAgilidade} onChange={(e) => setCAgilidade(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded text-center py-0.5 text-white" /></div>
                <div><div className="text-[9px] text-zinc-500 font-bold">CON</div><input type="number" value={cConstituicao} onChange={(e) => setCConstituicao(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded text-center py-0.5 text-white" /></div>
                <div><div className="text-[9px] text-zinc-500 font-bold">INT</div><input type="number" value={cIntelecto} onChange={(e) => setCIntelecto(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded text-center py-0.5 text-white" /></div>
                <div><div className="text-[9px] text-zinc-500 font-bold">PRE</div><input type="number" value={cPresenca} onChange={(e) => setCPresenca(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded text-center py-0.5 text-white" /></div>
              </div>
            </div>

            {/* Status de Combate */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-950/40 p-2 border border-zinc-800/80 rounded-lg">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-rose-400 uppercase">Vida Máx (PV)</label>
                <input type="number" value={cPvMax} onChange={(e) => setCPvMax(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-bold text-rose-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-blue-400 uppercase">Defesa</label>
                <input type="number" value={cDefesa} onChange={(e) => setCDefesa(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-bold text-blue-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-violet-400 uppercase">Bônus Prof. (BP)</label>
                <input type="number" value={cBp} onChange={(e) => setCBp(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-bold text-violet-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-cyan-400 uppercase">Energia (PE)</label>
                <input type="number" value={cEnergiaMax} onChange={(e) => setCEnergiaMax(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-cyan-400" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-amber-500 uppercase">Sanidade</label>
                <input type="number" value={cSanidadeMax} onChange={(e) => setCSanidadeMax(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-amber-500" />
              </div>
            </div>

            {/* Bloco Modular de Ataques Detalhados */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1"><Swords className="size-3 text-purple-400" /> Ataques Criados</label>
                <button type="button" onClick={handleAddAttack} className="text-[10px] font-bold text-purple-400 hover:underline flex items-center gap-0.5">+ Criar</button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cAttacks.map((atk) => (
                  <div key={atk.id} className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg space-y-1 relative">
                    <button type="button" onClick={() => handleRemoveAttack(atk.id)} className="absolute top-1 right-1 text-zinc-600 hover:text-rose-400">×</button>
                    <div className="grid grid-cols-3 gap-1">
                      <input type="text" placeholder="Nome" value={atk.name} onChange={(e) => handleUpdateAttack(atk.id, { name: e.target.value })} className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] col-span-2" />
                      <input type="text" placeholder="Dano" value={atk.damage} onChange={(e) => handleUpdateAttack(atk.id, { damage: e.target.value })} className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-rose-400 text-center" />
                    </div>
                    <input type="text" placeholder="Descrição curta do efeito" value={atk.description} onChange={(e) => handleUpdateAttack(atk.id, { description: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades e Notas de Campanha */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Habilidades Passivas e Vulnerabilidades</label>
              <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500 font-mono text-[11px]" placeholder="Ex: Vulnerabilidade a fogo. Regenera 5 PV no início do turno se estiver nas sombras." />
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider py-2 rounded-lg transition-all shadow-lg shadow-purple-600/10 flex items-center justify-center gap-1.5">
              {editingCreatureId ? <Save className="size-3.5" /> : <Plus className="size-3.5" />}
              {editingCreatureId ? "Salvar Alterações" : "Concluir e Inserir"}
            </button>
          </form>
        </div>

        {/* Listagem das Criaturas Criadas */}
        <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex flex-col overflow-hidden">
          <h2 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-3 border-b border-zinc-800 pb-2">
            💀 Catálogo de Ameaças Ativas ({creatures.length})
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">Buscando bestiário...</div>
          ) : creatures.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-800 rounded-lg bg-zinc-900/10">
              <p className="text-xs font-bold text-zinc-500">Nenhuma criatura catalogada no momento.</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Monte suas ameaças personalizadas à esquerda.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1 align-start content-start">
              {creatures.map((cr) => (
                <div key={cr.id} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-zinc-700/80 transition-all group relative">
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-start gap-2.5">
                      <div className="size-12 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden shrink-0 relative group/img">
                        {cr.image_url ? (
                          <>
                            <img src={cr.image_url} alt={cr.name} className="w-full h-full object-cover" />
                            <button onClick={() => { setZoomTarget({ name: cr.name, url: cr.image_url! }); setZoomOpen(true); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                              <Maximize2 className="size-3 text-white" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-bold font-mono">💀</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black px-1 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wide shrink-0">
                            Nív {cr.level}
                          </span>
                          <h3 className="text-xs font-black text-white truncate uppercase tracking-wide">{cr.name}</h3>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{cr.type}</p>
                      </div>
                    </div>

                    {/* Atributos Inline */}
                    <div className="grid grid-cols-5 gap-1 bg-zinc-950/60 border border-zinc-800/50 rounded-md py-1 px-1.5 text-center font-mono mt-2 text-[10px]">
                      <div><span className="text-zinc-600 font-bold block text-[8px]">FOR</span>{cr.forca >= 0 ? `+${cr.forca}` : cr.forca}</div>
                      <div><span className="text-zinc-600 font-bold block text-[8px]">AGL</span>{cr.agilidade >= 0 ? `+${cr.agilidade}` : cr.agilidade}</div>
                      <div><span className="text-zinc-600 font-bold block text-[8px]">CON</span>{cr.constituicao >= 0 ? `+${cr.constituicao}` : cr.constituicao}</div>
                      <div><span className="text-zinc-600 font-bold block text-[8px]">INT</span>{cr.intelecto >= 0 ? `+${cr.intelecto}` : cr.intelecto}</div>
                      <div><span className="text-zinc-600 font-bold block text-[8px]">PRE</span>{cr.presenca >= 0 ? `+${cr.presenca}` : cr.presenca}</div>
                    </div>

                    {/* Status de Combate Rápido */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] font-bold">
                      <div className="flex items-center gap-1 text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2 py-1 rounded-lg">
                        <Heart className="size-3 text-rose-500 shrink-0" /> {cr.pv_max} PV
                      </div>
                      <div className="flex items-center gap-1 text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded-lg">
                        <Shield className="size-3 text-blue-500 shrink-0" /> {cr.defesa} DEF
                      </div>
                      <div className="flex items-center gap-1 text-violet-400 bg-violet-500/5 border border-violet-500/10 px-2 py-1 rounded-lg">
                        <Sparkles className="size-3 text-violet-500 shrink-0" /> +{cr.bp} BP
                      </div>
                    </div>

                    {/* Exibição dos Ataques Modulares */}
                    {Array.isArray(cr.skills_json) && cr.skills_json.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-zinc-800/60 pt-2.5">
                        {cr.skills_json.map((atk: any, idx: number) => (
                          <div key={atk.id || idx} className="bg-zinc-950 border border-zinc-800/40 p-1.5 rounded-md text-[10px]">
                            <div className="flex items-center justify-between font-black uppercase text-zinc-300">
                              <span className="truncate">{atk.name}</span>
                              <span className="text-rose-400 font-mono bg-rose-500/5 px-1 rounded border border-rose-500/10 text-[9px]">{atk.damage}</span>
                            </div>
                            {atk.description && <p className="text-[9px] text-zinc-500 font-medium leading-tight mt-0.5">{atk.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notas da Ficha */}
                    {cr.notes && (
                      <div className="mt-2 text-[9px] text-zinc-400 font-mono bg-zinc-950 p-1.5 border border-zinc-800/40 rounded border-l-2 border-l-amber-500/50 leading-relaxed whitespace-pre-wrap">
                        {cr.notes}
                      </div>
                    )}
                  </div>

                  {/* Ações Inferiores (Deletar/Editar) */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/40 flex items-center justify-between shrink-0">
                    <button onClick={() => startEdit(cr)} className="text-zinc-500 hover:text-purple-400 flex items-center gap-1 text-[10px] font-bold border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950 transition-colors">
                      <Edit className="size-3" /> Acessar & Editar
                    </button>

                    {deletingId === cr.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-500/10 px-1.5 py-0.5 border border-rose-500/20 rounded">
                        <span className="text-[9px] font-bold text-rose-400">Apagar?</span>
                        <button onClick={() => handleDeleteCreature(cr.id)} className="bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Sim</button>
                        <button onClick={() => setDeletingId(null)} className="bg-zinc-700 hover:bg-zinc-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Não</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(cr.id)} className="text-zinc-600 hover:text-rose-400 p-1 rounded transition-colors" title="Deletar Ameaça">
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Zoom Ampliado do Retrato */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="sm:max-w-md p-2 bg-zinc-950 border-zinc-800">
          <DialogHeader className="p-2 pb-0">
            <DialogTitle className="text-white text-xs font-bold">Retrato de {zoomTarget?.name}</DialogTitle>
            <DialogDescription className="text-[11px] text-zinc-400">Visualização ampliada da arte da criatura.</DialogDescription>
          </DialogHeader>
          <div className="w-full aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {zoomTarget?.url && <img src={zoomTarget.url} alt="Zoom" className="w-full h-full object-cover" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}