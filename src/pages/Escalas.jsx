import { useState, useEffect } from "react";
import { Badge, Dialog, Input, Select, Label } from "../components/ui";
import { Trash2, Plus } from "lucide-react";
import { escalasService, vigilantesService, postosService } from "../services/api";

export default function Escalas() {
  const [escalas, setEscalas] = useState([]);
  const [vigilantes, setVigilantes] = useState([]);
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    id_vigilante: "",
    id_posto: "",
    data_servico: "",
    turno: "DIURNO",
    horas_trabalhadas: 8,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [escalasRes, vigilantesRes, postosRes] = await Promise.all([
        escalasService.listar(),
        vigilantesService.listar(),
        postosService.listar(),
      ]);

      setEscalas(escalasRes.data || []);
      setVigilantes(vigilantesRes.data || []);
      setPostos(postosRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    try {
      await escalasService.criar(formData);
      setOpenModal(false);
      setFormData({
        id_vigilante: "",
        id_posto: "",
        data_servico: "",
        turno: "DIURNO",
        horas_trabalhadas: 8,
      });
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        await escalasService.excluir(id);
        carregarDados();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const getTurnoColor = (turno) => {
    return turno === "NOTURNO"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-orange-100 text-orange-800";
  };

  const getRiscoColor = (risco) => {
    const cores = {
      BAIXO: "bg-green-100 text-green-800",
      MEDIO: "bg-yellow-100 text-yellow-800",
      ALTO: "bg-orange-100 text-orange-800",
      CRITICO: "bg-red-100 text-red-800",
    };
    return cores[risco] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="page-shell">
      <section className="page-hero mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Escalas</h1>
            <p>Planeje turnos, acompanhe horários e visualize a escala de trabalho.</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Nova Escala
          </button>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-8">Carregando escalas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {escalas.map((escala) => (
            <div
              key={escala.id_escala}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                  {escala.vigilante_nome}
                </h3>
                <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {escala.nome_posto} • {escala.empresa}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>📅 Data</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {new Date(escala.data_servico).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>⏰ Horas</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {escala.horas_trabalhadas}h
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge className={getTurnoColor(escala.turno)}>
                  {escala.turno}
                </Badge>
                <Badge className={getRiscoColor(escala.nivel_risco)}>
                  {escala.nivel_risco}
                </Badge>
              </div>

              <button
                onClick={() => deletar(escala.id_escala)}
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
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto">
          <h2 className="text-xl font-bold mb-4">Nova Escala</h2>

          <div className="space-y-3">
            <div>
              <Label>Vigilante</Label>
              <Select
                value={formData.id_vigilante}
                onChange={(e) =>
                  setFormData({ ...formData, id_vigilante: e.target.value })
                }
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
              <Label>Posto</Label>
              <Select
                value={formData.id_posto}
                onChange={(e) =>
                  setFormData({ ...formData, id_posto: e.target.value })
                }
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
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.data_servico}
                onChange={(e) =>
                  setFormData({ ...formData, data_servico: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Turno</Label>
              <Select
                value={formData.turno}
                onChange={(e) =>
                  setFormData({ ...formData, turno: e.target.value })
                }
              >
                <option>DIURNO</option>
                <option>NOTURNO</option>
              </Select>
            </div>

            <div>
              <Label>Horas Trabalhadas</Label>
              <Input
                type="number"
                value={formData.horas_trabalhadas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horas_trabalhadas: parseFloat(e.target.value),
                  })
                }
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
              onClick={salvar}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}