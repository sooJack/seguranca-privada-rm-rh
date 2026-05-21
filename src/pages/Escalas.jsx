import { useState, useEffect } from "react";
import { Badge, Dialog, Input, Select, Label } from "../components/ui";
import { Trash2, Plus } from "lucide-react";

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
        fetch("/api/escalas"),
        fetch("/api/vigilantes"),
        fetch("/api/postos"),
      ]);

      setEscalas(await escalasRes.json());
      setVigilantes(await vigilantesRes.json());
      setPostos(await postosRes.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    try {
      const response = await fetch("/api/escalas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpenModal(false);
        setFormData({
          id_vigilante: "",
          id_posto: "",
          data_servico: "",
          turno: "DIURNO",
          horas_trabalhadas: 8,
        });
        carregarDados();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deletar = async (id) => {
    if (confirm("Tem certeza?")) {
      try {
        const response = await fetch(`/api/escalas/${id}`, {
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
        <div className="space-y-3">
          {escalas.map((escala) => (
            <div
              key={escala.id_escala}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h3 className="font-semibold">{escala.vigilante_nome}</h3>
                  <p className="text-sm text-gray-600">
                    {escala.empresa} → {escala.posto_nome}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-start md:justify-end items-center">
                  <Badge className={getTurnoColor(escala.turno)}>
                    {escala.turno}
                  </Badge>
                  <Badge className={getRiscoColor(escala.nivel_risco)}>
                    {escala.nivel_risco}
                  </Badge>
                  <button
                    onClick={() => deletar(escala.id_escala)}
                    className="p-2 hover:bg-red-50 rounded text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Data</p>
                  <p className="font-semibold">
                    {new Date(escala.data_servico).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Horas</p>
                  <p className="font-semibold">{escala.horas_trabalhadas}h</p>
                </div>
              </div>
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