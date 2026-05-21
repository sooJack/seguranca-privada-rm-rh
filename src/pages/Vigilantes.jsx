import { useState, useEffect } from "react";
import { Badge, Dialog, Button, Input, Select, Label } from "../components/ui";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function Vigilantes() {
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

  // Carregar vigilantes
  useEffect(() => {
    carregarVigilantes();
  }, []);

  const carregarVigilantes = async () => {
    try {
      const response = await fetch("/api/vigilantes");
      const data = await response.json();
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
      const url = editingId ? `/api/vigilantes/${editingId}` : "/api/vigilantes";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpenModal(false);
        carregarVigilantes();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // Deletar vigilante
  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        const response = await fetch(`/api/vigilantes/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          carregarVigilantes();
        }
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
          <button
            onClick={abrirNovoModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Novo
          </button>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-8">Carregando vigilantes...</div>
      ) : (
        <div className="space-y-3">
          {vigilantes.map((vigilante) => (
            <div
              key={vigilante.id_vigilante}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{vigilante.nome}</h3>
                <p className="text-sm text-gray-600">CPF: {vigilante.cpf}</p>
                <p className="text-sm text-gray-600">📱 {vigilante.telefone}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className={getNivelColor(vigilante.nivel_treinamento)}>
                  {vigilante.nivel_treinamento}
                </Badge>
                <Badge className={getStatusColor(vigilante.status_vigilante)}>
                  {vigilante.status_vigilante}
                </Badge>
                <button
                  onClick={() => editar(vigilante)}
                  className="p-2 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deletar(vigilante.id_vigilante)}
                  className="p-2 hover:bg-red-50 rounded text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
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