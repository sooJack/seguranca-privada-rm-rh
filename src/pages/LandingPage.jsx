import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { FaLightbulb } from "react-icons/fa";
import { Lightbulb, LightbulbFilament } from "phosphor-react";
import { SiSpringsecurity } from "react-icons/si";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { AiOutlineFileProtect } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { CgController } from "react-icons/cg";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsDatabaseLock } from "react-icons/bs";
import { MdOutlineWorkHistory } from "react-icons/md";


export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature((f) => (f + 1) % features.length), 3600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrame;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const baseColor = isDark ? "255,255,255" : "0,0,0";
      const redColor = "209,0,0";

      particles.forEach((p, index) => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;

        particles.slice(index + 1).forEach((q) => {
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            const alpha = (1 - distance / 100) * 0.12;
            ctx.strokeStyle = distance < 50
              ? `rgba(${redColor},${alpha * 1.5})`
              : `rgba(${baseColor},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = index % 8 === 0
          ? `rgba(${redColor},${p.opacity * 1.5})`
          : `rgba(${baseColor},${p.opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const features = [
    { icon: <AiOutlineFileProtect />, title: "Proteção Total", desc: "Sistema de vigilância integrado com monitoramento 24/7" },
    { icon: <RxDashboard />, title: "Dashboard em Tempo Real", desc: "Acompanhe todas as operações com dados ao vivo" },
    { icon: <CgController />, title: "Controle de Acesso", desc: "Registro biométrico e controle de entrada/saída" },
    { icon: <AiOutlineThunderbolt />, title: "Resposta Rápida", desc: "Ocorrências registradas e tratadas em segundos" },
    { icon: <BsDatabaseLock />, title: "Dados Criptografados", desc: "Todas as informações protegidas com criptografia avançada" },
    { icon: <MdOutlineWorkHistory />, title: "Escalas Automatizadas", desc: "Gestão inteligente de turnos e escalas de serviço" },
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilidade" },
    { value: "<1s", label: "Tempo de Resposta" },
    { value: "AES-256", label: "Criptografia" },
    { value: "24/7", label: "Monitoramento" },
  ];

  return (
    <div className={`landing ${loaded ? "loaded" : ""}`}>
      <canvas ref={canvasRef} className="landing-canvas" />

      <header className="landing-header">
        <div className="landing-logo">
          <img src="/file.png" alt="AEGIS" className="logo-image" />
          <div>
            <span className="logo-name">AEGIS</span>
            <span className="logo-sub">DYNAMICS SECURITY</span>
          </div>
        </div>

        <div className="landing-header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
            {theme === "dark" ? <LightbulbFilament size={20} /> : <Lightbulb size={20} />}
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/login")}>Acessar Sistema</button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Sistema Ativo · Operacional
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line1">AEGIS</span>
          <span className="hero-title-line2">Dynamics</span>
          <span className="hero-title-line3">Security</span>
        </h1>

        <p className="hero-subtitle">
          Plataforma de gestão avançada para segurança privada.<br />
          Controle vigilantes, escalas e ocorrências com precisão absoluta.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
            <AiOutlineSecurityScan size={40} />
            Entrar no Sistema
          </button>
        </div>

        <div className="hero-stats">
          {stats.map((s, i) => (
            <div key={i} className="hero-stat" style={{ animationDelay: `${0.6 + i * 0.08}s` }}>
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-features">
        <h2 className="features-title"><span className="accent">Módulos</span> do Sistema</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${activeFeature === index ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.08}s` }}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="cta-box">
          <div className="cta-icon"><SiSpringsecurity size={32} /></div>
          <h2 className="cta-title">Pronto para começar?</h2>
          <p className="cta-desc">
            Faça login com seu nome e CPF para acessar o painel de controle operacional.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>Acessar Agora →</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-logo">
          <span className="logo-shield small">
            <img src="/file.png" alt="AEGIS" className="logo-image" />
          </span>
          <span className="footer-brand">AEGIS Dynamics Security</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} AEGIS Dynamics Security. Todos os direitos reservados.</p>
        <p className="footer-legal">Sistema de uso interno. Acesso não autorizado é crime nos termos da Lei nº 12.737/2012.</p>
      </footer>
    </div>
  );
}
