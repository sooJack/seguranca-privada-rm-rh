import { useState, useEffect } from "react";
import { Badge, Dialog, Select, Label, Textarea } from "../components/ui";
import { Trash2, Plus } from "lucide-react";

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
        fetch("/api/ocorrencias"),
        fetch("/api/escalas"),
      ]);

      setOcorrencias(await ocorrenciasRes.json());
      setEscalas(await escalasRes.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    try {
      const response = await fetch("/api/ocorrencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpenModal(false);
        setFormData({ id_escala: "", descricao: "", nivel_criticidade: "BAIXA" });
        carregarDados();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        const response = await fetch(`/api/ocorrencias/${id}`, {
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
        <div className="space-y-3">
          {ocorrencias.map((ocorrencia) => {
            const isCritica =
              ocorrencia.nivel_criticidade === "CRITICA" ||
              ocorrencia.nivel_criticidade === "ALTA";

            return (
              <div
                key={ocorrencia.id_ocorrencia}
                className={`border rounded-lg p-4 transition-shadow ${
                  isCritica
                    ? "border-red-300 hover:shadow-lg hover:shadow-red-100"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{ocorrencia.vigilante_nome}</h3>
                    <p className="text-sm text-gray-600">{ocorrencia.posto_nome}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCriticidadeColor(ocorrencia.nivel_criticidade)}>
                      {ocorrencia.nivel_criticidade}
                    </Badge>
                    <button
                      onClick={() => deletar(ocorrencia.id_ocorrencia)}
                      className="p-2 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700">{ocorrencia.descricao}</p>
                </div>

                <div className="text-xs text-gray-600 flex justify-between">
                  <span>
                    {new Date(ocorrencia.data_ocorrencia).toLocaleDateString("pt-BR")}{" "}
                    {new Date(ocorrencia.data_ocorrencia).toLocaleTimeString("pt-BR")}
                  </span>
                  <span>{ocorrencia.turno}</span>
                </div>
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