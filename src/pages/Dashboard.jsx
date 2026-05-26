import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { vigilantesService, escalasService, ocorrenciasService, postosService, riscosService } from "../services/api";

export default function Dashboard() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({
    totalVigilantes: 0,
    totalEscalas: 0,
    totalOcorrencias: 0,
    totalPostos: 0,
    riscosAbertos: 0,
  });
  const [recentData, setRecentData] = useState({
    ultimasEscalas: [],
    ultimasOcorrencias: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [vigilantes, escalas, ocorrencias, postos, riscos] = await Promise.all([
        vigilantesService.listar(),
        escalasService.listar(),
        ocorrenciasService.listar(),
        postosService.listar(),
        riscosService.listar(),
      ]);

      setStats({
        totalVigilantes: vigilantes.data?.length || 0,
        totalEscalas: escalas.data?.length || 0,
        totalOcorrencias: ocorrencias.data?.length || 0,
        totalPostos: postos.data?.length || 0,
        riscosAbertos: riscos.data?.filter(r => r.status_risco === 'ABERTO').length || 0,
      });

      setRecentData({
        ultimasEscalas: escalas.data?.slice(0, 5) || [],
        ultimasOcorrencias: ocorrencias.data?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <h1>Dashboard Operacional</h1>
        <p>
          Bem-vindo{usuario?.nome ? `, ${usuario.nome.split(" ")[0]}` : ""}! Aqui você tem acesso rápido
          aos principais módulos do sistema.
        </p>
      </section>

      <div className="cards-grid">
        <article className="card card-accent">
          <div className="stat-number">{stats.totalVigilantes}</div>
          <h2 style={{ color: 'var(--text-primary)' }}>Vigilantes</h2>
          <p>Profissionais ativos no sistema.</p>
        </article>
        <article className="card">
          <div className="stat-number">{stats.totalEscalas}</div>
          <h2 style={{ color: 'var(--text-primary)' }}>Escalas</h2>
          <p>Turnos planejados e operacionais.</p>
        </article>
        <article className="card">
          <div className="stat-number">{stats.totalOcorrencias}</div>
          <h2 style={{ color: 'var(--text-primary)' }}>Ocorrências</h2>
          <p>Incidentes registrados no sistema.</p>
        </article>
        <article className="card">
          <div className="stat-number">{stats.totalPostos}</div>
          <h2 style={{ color: 'var(--text-primary)' }}>Postos</h2>
          <p>Pontos de segurança monitorados.</p>
        </article>
      </div>

      {/* Seção de dados recentes */}
      <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <section>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600" }}>Últimas Escalas</h3>
          {recentData.ultimasEscalas.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recentData.ultimasEscalas.map((escala) => (
                <div key={escala.id_escala} style={{
                  padding: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-surface)",
                }}>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {escala.vigilante_nome}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {escala.nome_posto} • {escala.turno}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(escala.data_servico).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Nenhuma escala recente</p>
          )}
        </section>

        <section>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600" }}>Últimas Ocorrências</h3>
          {recentData.ultimasOcorrencias.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recentData.ultimasOcorrencias.map((ocorrencia) => (
                <div key={ocorrencia.id_ocorrencia} style={{
                  padding: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  backgroundColor: ocorrencia.nivel_criticidade === 'CRITICA' ? 'rgba(209, 0, 0, 0.1)' : 'var(--bg-surface)',
                }}>
                  <div style={{ fontWeight: "600", color: ocorrencia.nivel_criticidade === 'CRITICA' ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {ocorrencia.nome_posto}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    {ocorrencia.descricao.substring(0, 50)}...
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {new Date(ocorrencia.data_ocorrencia).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Nenhuma ocorrência recente</p>
          )}
        </section>
      </div>
    </div>
  );
}
