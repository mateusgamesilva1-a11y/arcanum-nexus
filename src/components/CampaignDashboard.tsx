import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Shield, Heart, Zap, Brain, Sparkles, Image as ImageIcon, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Creature { 
  id: string; name: string; type: string; level: number; pv_max: number; defesa: number; 
  energia_max: number; sanidade_max: number; bp: number; image_url?: string;
  forca: number; agilidade: number; constituicao: number; intelecto: number; presenca: number; 
  skills_json: any[]; notes: string;
}

export function CampaignDashboard({ onBack }: { onBack: () => void }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [creatures, setCreatures] = React.useState<Creature[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Modal de Zoom das Criaturas
  const [zoomOpen, setZoomOpen] = React.useState(false);
  const [zoomTarget, setZoomTarget] = React.useState<{ name: string; url: string } | null>(null);

  // Estados do Formulário de Criação
  const [cName, setCName] = React.useState(""); 
  const [cType, setCType] = React.useState("Monstro Transmutado");
  const [cLev, setCLev] = React.useState(1);
  const [imageUrl, setImageUrl] = React.useState("");
  const [attrFor, setAttrFor] = React.useState(0); 
  const [attrAgl, setAttrAgl] = React.useState(0);
  const [attrCon, setAttrCon] = React.useState(0); 
  const [attrInt, setAttrInt] = React.useState(0);
  const [attrPre, setAttrPre] = React.useState(0);
  const [pvMax, setPvMax] = React.useState(15);
  const [defesa, setDefesa] = React.useState(10);
  const [peMax, setPeMax] = React.useState(2);
  const [sanMax, setSanMax] = React.useState(0);
  const [bp, setBp] = React.useState(2);
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchCreatures();
      }
    });
  }, []);

  async function fetchCreatures() {
    setLoading(true);
    const { data, error } = await supabase
      .from("creatures")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCreatures(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!cName.trim() || !userId) return;

    const newCreature = {
      user_id: userId,
      name: cName,
      type: cType,
      level: cLev,
      image_url: imageUrl.trim() || null,
      forca: attrFor,
      agilidade: attrAgl,
      constituicao: attrCon,
      intelecto: attrInt,
      presenca: attrPre,
      pv_max: pvMax,
      defesa: defesa,
      energia_max: peMax,
      sanidade_max: sanMax,
      bp: bp,
      notes: notes,
      skills_json: []
    };

    const { error } = await supabase.from("creatures").insert(newCreature);
    if (!error) {
      setCName("");
      setImageUrl("");
      setNotes("");
      fetchCreatures();
    }
  }

  async function deleteCreature(id: string) {
    const { error } = await supabase.from("creatures").delete().eq("id", id);
    if (!error) {
      setDeletingId(null);
      fetchCreatures();
    }
  }

  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-purple-400">Bestiário de Ameaças</h1>
          <p className="text-[11px] text-muted-foreground">Registre monstros e perigos para as suas campanhas</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold border rounded px-3 py-1.5 hover:bg-muted">Voltar</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORMULÁRIO */}
        <form onSubmit={handleCreate} className="bg-card border rounded-xl p-4 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider">Nova Ameaça</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Nome do Monstro</label>
            <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Ex: Carniçal das Sombras" className="w-full bg-background border rounded p-2 text-xs font-medium" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Tipo/Espécie</label>
              <select value={cType} onChange={e => setCType(e.target.value)} className="w-full bg-background border rounded p-2 text-xs font-medium h-8">
                <option>Monstro Transmutado</option>
                <option>Cidadao Hostil</option>
                <option>Entidade Caótica</option>
                <option>Constructo Arcânico</option>
                <option>Bestial</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Nível / VD</label>
              <input type="number" value={cLev} onChange={e => setCLev(Number(e.target.value))} className="w-full bg-background border rounded p-1 text-xs font-mono h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">URL da Imagem (Opcional)</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-background border rounded p-2 text-xs font-mono" />
          </div>

          {/* ATRIBUTOS */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Atributos Base</label>
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
              {/* FOR */}
              <div className="bg-muted p-1 rounded border">
                <div className="text-[9px] font-black uppercase">FOR</div>
                <input type="number" value={attrFor} onChange={e => setAttrFor(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
              </div>
              {/* AGL */}
              <div className="bg-muted p-1 rounded border">
                <div className="text-[9px] font-black uppercase">AGL</div>
                <input type="number" value={attrAgl} onChange={e => setAttrAgl(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
              </div>
              {/* CON */}
              <div className="bg-muted p-1 rounded border">
                <div className="text-[9px] font-black uppercase">CON</div>
                <input type="number" value={attrCon} onChange={e => setAttrCon(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
              </div>
              {/* INT */}
              <div className="bg-muted p-1 rounded border">
                <div className="text-[9px] font-black uppercase">INT</div>
                <input type="number" value={attrInt} onChange={e => setAttrInt(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
              </div>
              {/* PRE */}
              <div className="bg-muted p-1 rounded border">
                <div className="text-[9px] font-black uppercase">PRE</div>
                <input type="number" value={attrPre} onChange={e => setAttrPre(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
              </div>
            </div>
          </div>

          {/* COMBAT COMBOS */}
          <div className="grid grid-cols-5 gap-1 font-mono text-center text-xs">
            <div className="bg-muted p-1 rounded border col-span-1">
              <div className="text-[9px] font-black text-rose-500">PV</div>
              <input type="number" value={pvMax} onChange={e => setPvMax(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
            </div>
            <div className="bg-muted p-1 rounded border col-span-1">
              <div className="text-[9px] font-black text-emerald-500">DEF</div>
              <input type="number" value={defesa} onChange={e => setDefesa(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
            </div>
            <div className="bg-muted p-1 rounded border col-span-1">
              <div className="text-[9px] font-black text-blue-500">PE</div>
              <input type="number" value={peMax} onChange={e => setPeMax(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
            </div>
            <div className="bg-muted p-1 rounded border col-span-1">
              <div className="text-[9px] font-black text-amber-500">SAN</div>
              <input type="number" value={sanMax} onChange={e => setSanMax(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
            </div>
            <div className="bg-muted p-1 rounded border col-span-1">
              <div className="text-[9px] font-black text-violet-400">BP</div>
              <input type="number" value={bp} onChange={e => setBp(Number(e.target.value))} className="w-full text-center bg-transparent mt-0.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Habilidades / Ataques e Notas</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Garra Cortante: +4 acerto, 2d6+2 dano..." className="w-full bg-background border rounded p-2 text-xs font-medium min-h-[70px]" />
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white rounded font-black uppercase text-xs py-2 shadow flex items-center justify-center gap-1 hover:bg-purple-700">
            <Plus className="size-3.5" /> Adicionar ao Bestiário
          </button>
        </form>

        {/* LISTAGEM DE CRIATURAS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            Ameaças Registradas <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 font-mono text-xs">{creatures.length}</span>
          </h3>

          {loading ? (
            <p className="text-xs text-muted-foreground">Invocando criaturas...</p>
          ) : creatures.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma ameaça cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creatures.map(cr => (
                <div key={cr.id} className="bg-card border rounded-xl overflow-hidden flex flex-col justify-between group shadow-sm">
                  <div className="p-4 space-y-3">
                    {/* Top Header Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 🖼️ QUADRADO DE RETRATO COM EFEITO DE HOVER ZOOM */}
                        <div 
                          className="size-12 rounded-lg bg-muted border flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative group/img cursor-pointer"
                          onClick={() => {
                            if (cr.image_url) {
                              setZoomTarget({ name: cr.name, url: cr.image_url });
                              setZoomOpen(true);
                            }
                          }}
                        >
                          {cr.image_url ? (
                            <>
                              <img src={cr.image_url} alt={cr.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 className="size-3.5 text-white" />
                              </div>
                            </>
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-sm truncate">{cr.name}</h4>
                          <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded px-1.5 py-0.5 font-bold uppercase tracking-wide">
                            {cr.type} — Nível {cr.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Rápidos Grid em Negrito */}
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                      <div className="bg-muted/60 p-1.5 rounded border">
                        <div className="text-[11px] font-extrabold text-rose-500">{cr.pv_max}</div>
                        <div className="text-[9px] text-muted-foreground font-sans font-bold uppercase">PV</div>
                      </div>
                      <div className="bg-muted/60 p-1.5 rounded border">
                        <div className="text-[11px] font-extrabold text-emerald-500">{cr.defesa}</div>
                        <div className="text-[9px] text-muted-foreground font-sans font-bold uppercase">DEF</div>
                      </div>
                      <div className="bg-muted/60 p-1.5 rounded border">
                        <div className="text-[11px] font-extrabold text-blue-500">{cr.energia_max}</div>
                        <div className="text-[9px] text-muted-foreground font-sans font-bold uppercase">PE</div>
                      </div>
                      <div className="bg-muted/60 p-1.5 rounded border">
                        <div className="text-[11px] font-extrabold text-amber-500">{cr.sanidade_max}</div>
                        <div className="text-[9px] text-muted-foreground font-sans font-bold uppercase">SAN</div>
                      </div>
                      <div className="bg-muted/60 p-1.5 rounded border">
                        <div className="text-[11px] font-extrabold text-violet-400">+{cr.bp}</div>
                        <div className="text-[9px] text-muted-foreground font-sans font-bold uppercase">BP</div>
                      </div>
                    </div>

                    {/* Atributos em Linha Tática */}
                    <div className="flex items-center justify-around bg-muted/30 p-1 rounded-lg border text-[10px] font-mono font-bold text-muted-foreground">
                      <span>FOR: <b className="text-foreground">{cr.forca >= 0 ? `+${cr.forca}` : cr.forca}</b></span>
                      <span>AGL: <b className="text-foreground">{cr.agilidade >= 0 ? `+${cr.agilidade}` : cr.agilidade}</b></span>
                      <span>CON: <b className="text-foreground">{cr.constituicao >= 0 ? `+${cr.constituicao}` : cr.constituicao}</b></span>
                      <span>INT: <b className="text-foreground">{cr.intelecto >= 0 ? `+${cr.intelecto}` : cr.intelecto}</b></span>
                      <span>PRE: <b className="text-foreground">{cr.presenca >= 0 ? `+${cr.presenca}` : cr.presenca}</b></span>
                    </div>

                    {/* Habilidades e Notas de Ataque */}
                    {cr.notes && (
                      <p className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded font-sans leading-tight border border-dashed whitespace-pre-line">{cr.notes}</p>
                    )}
                  </div>

                  {/* Rodapé Seguro de Exclusão */}
                  <div className="bg-muted/40 border-t px-4 py-2 flex items-center justify-end">
                    {deletingId === cr.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                        <span className="text-[10px] text-rose-400 font-medium">Tem certeza?</span>
                        <button onClick={() => deleteCreature(cr.id)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2 py-1 rounded">Sim</button>
                        <button onClick={() => setDeletingId(null)} className="bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] px-2 py-1 rounded">Não</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(cr.id)} className="text-muted-foreground hover:text-rose-400 p-1 rounded transition-colors" title="Deletar Ameaça">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎯 MODAL DE ZOOM EXCLUSIVO PARA CRIATURAS DO BESTIÁRIO */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="sm:max-w-md p-2 bg-zinc-950 border-zinc-800">
          <DialogHeader className="p-2 pb-0">
            <DialogTitle className="text-white text-xs font-bold">Retrato de {zoomTarget?.name}</DialogTitle>
            <DialogDescription className="text-[11px] text-zinc-400">Visualização ampliada da arte da criatura.</DialogDescription>
          </DialogHeader>
          <div className="w-full aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {zoomTarget?.url && <img src={zoomTarget.url} alt={zoomTarget.name} className="w-full h-full object-contain" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}