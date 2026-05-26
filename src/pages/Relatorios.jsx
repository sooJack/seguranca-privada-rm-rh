import { useState, useEffect } from "react";
import { Dialog, Input, Select, Label, Textarea } from "../components/ui";
import { Plus, Trash2 } from "lucide-react";
import { vigilantesService, escalasService, ocorrenciasService, postosService, riscosService, feriasService, horasExtrasService } from "../services/api";

export default function Relatorios() {
  const [metricas, setMetricas] = useState({
    totalVigilantes: 0,
    vigilantesAtivos: 0,
    totalEscalas: 0,
    ocorrenciasMes: 0,
    riscos: { abertos: 0, mitigados: 0 },
    horasExtras: 0,
    postosCriticos: 0,
  });
  const [riscos, setRiscos] = useState([]);
  const [ferias, setFerias] = useState([]);
  const [horasExtras, setHorasExtras] = useState([]);
  const [vigilantes, setVigilantes] = useState([]);
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abas, setAbas] = useState("metricas");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [riscosRes, feriasRes, horasRes, vigRes, postosRes, escalasRes, ocorrenciasRes] = await Promise.all([
        riscosService.listar(),
        feriasService.listar(),
        horasExtrasService.listar(),
        vigilantesService.listar(),
        postosService.listar(),
        escalasService.listar(),
        ocorrenciasService.listar(),
      ]);

      const vigilantesData = vigRes.data || [];
      const postosData = postosRes.data || [];
      const escalasData = escalasRes.data || [];
      const ocorrenciasData = ocorrenciasRes.data || [];
      const riscosData = riscosRes.data || [];
      const horasData = horasRes.data || [];

      setMetricas({
        totalVigilantes: vigilantesData.length,
        vigilantesAtivos: vigilantesData.filter(v => v.status_vigilante === 'ATIVO').length,
        totalEscalas: escalasData.length,
        ocorrenciasMes: ocorrenciasData.length,
        riscos: {
          abertos: riscosData.filter(r => r.status_risco === 'ABERTO').length,
          mitigados: riscosData.filter(r => r.status_risco === 'MITIGADO').length,
        },
        horasExtras: horasData.reduce((sum, h) => sum + (h.quantidade_horas || 0), 0),
        postosCriticos: postosData.filter(p => p.nivel_risco === 'CRITICO').length,
      });

      setRiscos(riscosData);
      setFerias(feriasRes.data || []);
      setHorasExtras(horasData);
      setVigilantes(vigilantesData);
      setPostos(postosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarRisco = async () => {
    try {
      await riscosService.criar(formData);
      setOpenModal(false);
      carregarDados();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const deletarRisco = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        await riscosService.excluir(id);
        carregarDados();
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  };

  const adicionarFeria = async () => {
    try {
      await feriasService.criar(formData);
      setOpenModal(false);
      carregarDados();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const deletarFeria = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        await feriasService.excluir(id);
        carregarDados();
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero mb-6">
        <h1>Relatórios</h1>
        <p>Consulte relatórios operacionais, indicadores e análises de desempenho.</p>
      </section>

      {/* Abas */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: "metricas", label: "Métricas" },
          { id: "riscos", label: "Gestão de Riscos" },
          { id: "ferias", label: "Férias" },
          { id: "extras", label: "Horas Extras" },
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbas(aba.id)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              abas === aba.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando dados...</div>
      ) : (
        <>
          {/* MÉTRICAS */}
          {abas === "metricas" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: "Vigilantes", value: metricas.totalVigilantes, bg: "bg-blue-50", text: "text-blue-700" },
                  { label: "Ativos", value: metricas.vigilantesAtivos, bg: "bg-green-50", text: "text-green-700" },
                  { label: "Escalas", value: metricas.totalEscalas, bg: "bg-purple-50", text: "text-purple-700" },
                  { label: "Ocorrências", value: metricas.ocorrenciasMes, bg: "bg-orange-50", text: "text-orange-700" },
                  { label: "Postos Críticos", value: metricas.postosCriticos, bg: "bg-red-50", text: "text-red-700" },
                  { label: "Horas Extras", value: metricas.horasExtras + "h", bg: "bg-indigo-50", text: "text-indigo-700" },
                ].map((card, idx) => (
                  <div key={idx} className={`${card.bg} rounded-lg p-4 border`}>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Riscos Abertos</p>
                      <p className="text-3xl font-bold text-orange-600">{metricas.riscos.abertos}</p>
                    </div>
                    <div className="text-4xl">⚠️</div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Riscos Mitigados</p>
                      <p className="text-3xl font-bold text-green-600">{metricas.riscos.mitigados}</p>
                    </div>
                    <div className="text-4xl">✅</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* RISCOS */}
          {abas === "riscos" && (
            <>
              <button
                onClick={() => {
                  setFormData({ id_posto: "", tipo_risco: "", probabilidade: "MEDIA", impacto: "MEDIO", plano_acao: "" });
                  setOpenModal(true);
                }}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} /> Novo Risco
              </button>

              <div className="space-y-3">
                {riscos.map((risco) => (
                  <div key={risco.id_risco} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{risco.tipo_risco}</h3>
                        <p className="text-sm text-gray-600">{risco.nome_posto} - {risco.empresa}</p>
                      </div>
                      <button
                        onClick={() => deletarRisco(risco.id_risco)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{risco.plano_acao}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Prob: {risco.probabilidade}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Impacto: {risco.impacto}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{risco.status_risco}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* FÉRIAS */}
          {abas === "ferias" && (
            <>
              <button
                onClick={() => {
                  setFormData({ id_vigilante: "", data_inicio: "", data_fim: "" });
                  setOpenModal(true);
                }}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} /> Registrar Férias
              </button>

              <div className="space-y-3">
                {ferias.map((feria) => (
                  <div key={feria.id_ferias} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{feria.vigilante_nome}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(feria.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                        {new Date(feria.data_fim).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={() => deletarFeria(feria.id_ferias)}
                      className="p-2 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* HORAS EXTRAS */}
          {abas === "extras" && (
            <div className="space-y-3">
              {horasExtras.map((hora) => (
                <div key={hora.id_extra} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{hora.vigilante_nome}</h3>
                      <p className="text-sm text-gray-600">{hora.motivo}</p>
                      <p className="text-xs text-gray-500">{new Date(hora.data_extra).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold">{hora.quantidade_horas}h</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto">
          {abas === "riscos" ? (
            <>
              <h2 className="text-xl font-bold mb-4">Novo Risco</h2>
              <div className="space-y-3">
                <div>
                  <Label>Posto</Label>
                  <Select
                    value={formData.id_posto || ""}
                    onChange={(e) => setFormData({ ...formData, id_posto: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {postos.map((p) => (
                      <option key={p.id_posto} value={p.id_posto}>
                        {p.nome_posto}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Risco</Label>
                  <Input
                    value={formData.tipo_risco || ""}
                    onChange={(e) => setFormData({ ...formData, tipo_risco: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Plano de Ação</Label>
                  <Textarea
                    value={formData.plano_acao || ""}
                    onChange={(e) => setFormData({ ...formData, plano_acao: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarRisco}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Registrar Férias</h2>
              <div className="space-y-3">
                <div>
                  <Label>Vigilante</Label>
                  <Select
                    value={formData.id_vigilante || ""}
                    onChange={(e) => setFormData({ ...formData, id_vigilante: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {vigilantes.map((v) => (
                      <option key={v.id_vigilante} value={v.id_vigilante}>
                        {v.nome}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={formData.data_inicio || ""}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={formData.data_fim || ""}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarFeria}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}