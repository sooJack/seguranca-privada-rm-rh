import { useState, useEffect } from "react";
import { Badge, Dialog, Input, Select, Label } from "../components/ui";
import { Trash2, Edit2, Plus } from "lucide-react";
import { vigilantesService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Vigilantes() {
  const { usuario } = useAuth();
  const [vigilantes, setVigilantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    nivel_treinamento: "BASICO",
    status_vigilante: "ATIVO",
  });

  const cargoAtual = usuario?.cargo?.toString().toLowerCase() || "";
  const isAdmin = cargoAtual === "adm ultimate" || cargoAtual === "adm" || cargoAtual === "admin" || cargoAtual === "administrator";

  const podeEditar = (vigilante) => isAdmin || vigilante.id_vigilante === usuario?.id_vigilante;
  const podeDeletar = (vigilante) => isAdmin || vigilante.id_vigilante === usuario?.id_vigilante;
  const vigilantesVisiveis = isAdmin
    ? vigilantes
    : vigilantes.filter((vigilante) => Number(vigilante.id_vigilante) === Number(usuario?.id_vigilante));

  // Carregar vigilantes
  useEffect(() => {
    carregarVigilantes();
  }, []);

  const carregarVigilantes = async () => {
    try {
      const { data } = await vigilantesService.listar();
      setVigilantes(data || []);
    } catch (error) {
      console.error("Erro ao carregar vigilantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para novo
  const abrirNovoModal = () => {
    setFormData({
      nome: "",
      cpf: "",
      telefone: "",
      nivel_treinamento: "BASICO",
      status_vigilante: "ATIVO",
    });
    setEditingId(null);
    setOpenModal(true);
  };

  // Editar vigilante
  const editar = (vigilante) => {
    setFormData(vigilante);
    setEditingId(vigilante.id_vigilante);
    setOpenModal(true);
  };

  // Salvar vigilante
  const salvar = async () => {
    try {
      if (editingId) {
        await vigilantesService.atualizar(editingId, formData);
      } else {
        await vigilantesService.criar(formData);
      }
      setOpenModal(false);
      carregarVigilantes();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // Deletar vigilante
  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        await vigilantesService.excluir(id);
        carregarVigilantes();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const getNivelColor = (nivel) => {
    const cores = {
      BASICO: "bg-blue-100 text-blue-800",
      INTERMEDIARIO: "bg-yellow-100 text-yellow-800",
      AVANCADO: "bg-green-100 text-green-800",
    };
    return cores[nivel] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const cores = {
      ATIVO: "bg-emerald-100 text-emerald-800",
      INATIVO: "bg-gray-100 text-gray-800",
      AFASTADO: "bg-red-100 text-red-800",
    };
    return cores[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="page-shell">
      <section className="page-hero mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Vigilantes</h1>
            <p>Cadastro, filtros e status de vigilantes carregados no sistema.</p>
          </div>
          {isAdmin ? (
            <button
              onClick={abrirNovoModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} /> Novo
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              Apenas administradores veem e cadastram outros vigilantes.
            </div>
          )}
        </div>
      </section>

      {loading ? (
        <div className="text-center py-8">Carregando vigilantes...</div>
      ) : (
        <>
          {!isAdmin && (
            <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {vigilantesVisiveis.map((vigilante) => (
              <div
              key={vigilante.id_vigilante}
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
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                  {vigilante.nome}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Badge className={getNivelColor(vigilante.nivel_treinamento)}>
                    {vigilante.nivel_treinamento}
                  </Badge>
                  <Badge className={getStatusColor(vigilante.status_vigilante)}>
                    {vigilante.status_vigilante}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div>📋 CPF: <strong>{vigilante.cpf}</strong></div>
                <div>📱 Tel: <strong>{vigilante.telefone || 'N/A'}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {podeEditar(vigilante) && (
                  <button
                    onClick={() => editar(vigilante)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-page)',
                      color: 'var(--text-primary)',
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
                      e.currentTarget.style.backgroundColor = 'var(--bg-page)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                )}
                {podeDeletar(vigilante) && (
                  <button
                    onClick={() => deletar(vigilante.id_vigilante)}
                    style={{
                      flex: 1,
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
                )}
              </div>
            </div>
          ))}
        </div>
      </>
      )}

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Editar Vigilante" : "Novo Vigilante"}
          </h2>

          <div className="space-y-3">
            <div>
              <Label>Nome</Label>
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Nome completo"
              />
            </div>

            <div>
              <Label>CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="(83) 99999-9999"
              />
            </div>

            <div>
              <Label>Nível de Treinamento</Label>
              <Select
                value={formData.nivel_treinamento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nivel_treinamento: e.target.value,
                  })
                }
              >
                <option>BASICO</option>
                <option>INTERMEDIARIO</option>
                <option>AVANCADO</option>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status_vigilante}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status_vigilante: e.target.value,
                  })
                }
              >
                <option>ATIVO</option>
                <option>INATIVO</option>
                <option>AFASTADO</option>
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
              Salvar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}