import { useState, useEffect } from "react";
import { Badge, Dialog, Select, Label, Textarea } from "../components/ui";
import { Trash2, Plus } from "lucide-react";
import { ocorrenciasService, escalasService } from "../services/api";

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    id_escala: "",
    descricao: "",
    nivel_criticidade: "BAIXA",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [ocorrenciasRes, escalasRes] = await Promise.all([
        ocorrenciasService.listar(),
        escalasService.listar(),
      ]);

      setOcorrencias(ocorrenciasRes.data || []);
      setEscalas(escalasRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    try {
      await ocorrenciasService.criar(formData);
      setOpenModal(false);
      setFormData({ id_escala: "", descricao: "", nivel_criticidade: "BAIXA" });
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        await ocorrenciasService.excluir(id);
        carregarDados();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const getCriticidadeColor = (criticidade) => {
    const cores = {
      BAIXA: "bg-green-100 text-green-800",
      MEDIA: "bg-blue-100 text-blue-800",
      ALTA: "bg-orange-100 text-orange-800",
      CRITICA: "bg-red-100 text-red-800",
    };
    return cores[criticidade] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="page-shell">
      <section className="page-hero mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Ocorrências</h1>
            <p>Registre eventos e acompanhe o histórico de ocorrências em tempo real.</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Nova Ocorrência
          </button>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-8">Carregando ocorrências...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {ocorrencias.map((ocorrencia) => {
            const isCritica = ocorrencia.nivel_criticidade === "CRITICA" || ocorrencia.nivel_criticidade === "ALTA";
            return (
              <div
                key={ocorrencia.id_ocorrencia}
                style={{
                  border: isCritica ? '1px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  backgroundColor: isCritica ? 'rgba(209, 0, 0, 0.05)' : 'var(--bg-surface)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeftWidth: isCritica ? '4px' : '1px',
                  borderLeftColor: isCritica ? 'var(--primary)' : 'var(--border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isCritica ? '0 4px 16px rgba(209, 0, 0, 0.2)' : 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: isCritica ? 'var(--primary)' : 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                      {ocorrencia.vigilante_nome}
                    </h3>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      📍 {ocorrencia.nome_posto}
                    </p>
                  </div>
                  <Badge className={getCriticidadeColor(ocorrencia.nivel_criticidade)}>
                    {ocorrencia.nivel_criticidade}
                  </Badge>
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                }}>
                  {ocorrencia.descricao}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div>
                    📅 {new Date(ocorrencia.data_ocorrencia).toLocaleDateString('pt-BR')}{' '}
                    {new Date(ocorrencia.data_ocorrencia).toLocaleTimeString('pt-BR')}
                  </div>
                  <div>🕐 {ocorrencia.turno}</div>
                </div>

                <button
                  onClick={() => deletar(ocorrencia.id_ocorrencia)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(209, 0, 0, 0.3)',
                    backgroundColor: 'rgba(209, 0, 0, 0.08)',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: '500',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(209, 0, 0, 0.08)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  <Trash2 size={16} /> Deletar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto">
          <h2 className="text-xl font-bold mb-4">Nova Ocorrência</h2>

          <div className="space-y-3">
            <div>
              <Label>Escala</Label>
              <Select
                value={formData.id_escala}
                onChange={(e) =>
                  setFormData({ ...formData, id_escala: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {escalas.map((e) => (
                  <option key={e.id_escala} value={e.id_escala}>
                    {e.vigilante_nome} - {e.posto_nome}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descreva a ocorrência..."
              />
            </div>

            <div>
              <Label>Criticidade</Label>
              <Select
                value={formData.nivel_criticidade}
                onChange={(e) =>
                  setFormData({ ...formData, nivel_criticidade: e.target.value })
                }
              >
                <option>BAIXA</option>
                <option>MEDIA</option>
                <option>ALTA</option>
                <option>CRITICA</option>
              </Select>
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
              onClick={salvar}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Registrar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}