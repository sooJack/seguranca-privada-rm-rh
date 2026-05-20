import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { usuario } = useAuth();

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
          <h2>Vigilantes</h2>
          <p>Gerencie o time, avalie escalas e acompanhe o status de cada vigilante.</p>
        </article>
        <article className="card">
          <h2>Escalas</h2>
          <p>Planeje e acompanhe turnos de trabalho de forma segura e automatizada.</p>
        </article>
        <article className="card">
          <h2>Ocorrências</h2>
          <p>Registre incidentes, acompanhe o atendimento e mantenha o histórico organizado.</p>
        </article>
        <article className="card">
          <h2>Relatórios</h2>
          <p>Visualize os indicadores mais importantes para sua operação.</p>
        </article>
      </div>
    </div>
  );
}
