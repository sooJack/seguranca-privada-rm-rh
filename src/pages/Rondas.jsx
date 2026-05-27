import { useState, useEffect } from "react";
import { Badge, Dialog, Input, Select, Label } from "../components/ui";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { postosService, clientesService } from "../services/api";

export default function Rondas() {
  const [postos, setPostos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome_posto: "",
    localizacao: "",
    nivel_risco: "BAIXO",
    id_cliente: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [postosRes, clientesRes] = await Promise.all([
        postosService.listar(),
        clientesService.listar(),
      ]);

      setPostos(postosRes.data || []);
      setClientes(clientesRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirNovoModal = () => {
    setFormData({
      nome_posto: "",
      localizacao: "",
      nivel_risco: "BAIXO",
      id_cliente: "",
    });
    setEditingId(null);
    setOpenModal(true);
  };

  const editar = (posto) => {
    setFormData({
      nome_posto: posto.nome_posto,
      localizacao: posto.localizacao,
      nivel_risco: posto.nivel_risco,
      id_cliente: posto.id_cliente,
    });
    setEditingId(posto.id_posto);
    setOpenModal(true);
  };

  const salvar = async () => {
    try {
      const url = editingId ? `/api/postos/${editingId}` : "/api/postos";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpenModal(false);
        carregarDados();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        const response = await fetch(`/api/postos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          carregarDados();
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
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
            <h1>Rondas</h1>
            <p>Planeje rotas de ronda e monitore a cobertura de segurança.</p>
          </div>
          <button
            onClick={abrirNovoModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Novo Posto
          </button>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-8">Carregando rotas...</div>
      ) : (
        <div className="space-y-3">
          {postos.map((posto) => (
            <div
              key={posto.id_posto}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{posto.nome_posto}</h3>
                  <p className="text-sm text-gray-600">{posto.empresa}</p>
                </div>
                <Badge className={getRiscoColor(posto.nivel_risco)}>
                  {posto.nivel_risco}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">📍 Localização</p>
                  <p className="font-semibold">{posto.localizacao}</p>
                </div>
                <div>
                  <p className="text-gray-600">👤 Escalados</p>
                  <p className="font-semibold">{posto.vigilantes_escalados || 0}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => editar(posto)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Editar
                </button>
                <button
                  onClick={() => deletar(posto.id_posto)}
                  className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Deletar
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
            {editingId ? "Editar Posto" : "Novo Posto"}
          </h2>

          <div className="space-y-3">
            <div>
              <Label>Nome do Posto</Label>
              <Input
                value={formData.nome_posto}
                onChange={(e) =>
                  setFormData({ ...formData, nome_posto: e.target.value })
                }
                placeholder="Ex: Agência Central"
              />
            </div>

            <div>
              <Label>Localização</Label>
              <Input
                value={formData.localizacao}
                onChange={(e) =>
                  setFormData({ ...formData, localizacao: e.target.value })
                }
                placeholder="Ex: Centro, Zona Sul..."
              />
            </div>

            <div>
              <Label>Cliente</Label>
              <Select
                value={formData.id_cliente}
                onChange={(e) =>
                  setFormData({ ...formData, id_cliente: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.empresa}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Nível de Risco</Label>
              <Select
                value={formData.nivel_risco}
                onChange={(e) =>
                  setFormData({ ...formData, nivel_risco: e.target.value })
                }
              >
                <option>BAIXO</option>
                <option>MEDIO</option>
                <option>ALTO</option>
                <option>CRITICO</option>
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