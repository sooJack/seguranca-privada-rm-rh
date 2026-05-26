import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import fileLogo from "../../public/file.png";
import "./LandingPage.css";
import { FaLightbulb } from "react-icons/fa";
import { Lightbulb, LightbulbFilament } from "phosphor-react";
import { LiaFlagUsaSolid } from "react-icons/lia";
import { GiBrazilFlag } from "react-icons/gi";
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
  const { language, toggleLanguage, t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const canvasRef = useRef(null);
  const isEnglish = language === "en-US";

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
    { icon: <AiOutlineFileProtect />, title: t("landing.features.totalProtection"), desc: t("landing.features.totalProtectionDesc") },
    { icon: <RxDashboard />, title: t("landing.features.realtimeDashboard"), desc: t("landing.features.realtimeDashboardDesc") },
    { icon: <CgController />, title: t("landing.features.accessControl"), desc: t("landing.features.accessControlDesc") },
    { icon: <AiOutlineThunderbolt />, title: t("landing.features.quickResponse"), desc: t("landing.features.quickResponseDesc") },
    { icon: <BsDatabaseLock />, title: t("landing.features.encryptedData"), desc: t("landing.features.encryptedDataDesc") },
    { icon: <MdOutlineWorkHistory />, title: t("landing.features.automatedSchedules"), desc: t("landing.features.automatedSchedulesDesc") },
  ];

  const stats = [
    { value: "99.9%", label: t("landing.availability") },
    { value: "<1s", label: t("landing.responseTime") },
    { value: "AES-256", label: t("landing.encryption") },
    { value: "24/7", label: t("landing.monitoring") },
  ];

  return (
    <div className={`landing ${loaded ? "loaded" : ""}`}>
      <canvas ref={canvasRef} className="landing-canvas" />

      <header className="landing-header">
        <div className="landing-logo">
          <img src={fileLogo} alt="AEGIS" className="logo-image" />
          <div>
            <span className="logo-name">AEGIS</span>
            <span className="logo-sub">DYNAMICS SECURITY</span>
          </div>
        </div>

        <div className="landing-header-actions">
          <button className="theme-toggle" onClick={toggleLanguage} title={t("topbar.changeLanguage")}>
            {isEnglish ? <LiaFlagUsaSolid size={20} /> : <GiBrazilFlag size={20} />}
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title={theme === "dark" ? t("topbar.lightMode") : t("topbar.darkMode")}>
            {theme === "dark" ? <LightbulbFilament size={20} /> : <Lightbulb size={20} />}
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/login")}>{t("landing.accessSystem")}</button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {t("common.systemActive")}
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line1">{t("landing.heroTitle1")}</span>
          <span className="hero-title-line2">{t("landing.heroTitle2")}</span>
          <span className="hero-title-line3">{t("landing.heroTitle3")}</span>
        </h1>

        <p className="hero-subtitle">
          {t("landing.heroSubtitle")}
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/login") }>
            <AiOutlineSecurityScan size={40} />
            {t("landing.enterSystem")}
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
        <h2 className="features-title"><span className="accent">{t("landing.modulesAccent")}</span> do Sistema</h2>
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
          <h2 className="cta-title">{t("landing.ctaTitle")}</h2>
          <p className="cta-desc">
            {t("landing.ctaDesc")}
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/signup")}>{t("landing.createAccount")}</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-logo">
          <span className="logo-shield small">
            <img src={fileLogo} alt="AEGIS" className="logo-image" />
          </span>
          <span className="footer-brand">AEGIS Dynamics Security</span>
        </div>
        <p className="footer-copy">{t("landing.footerCopy")}</p>
        <p className="footer-legal">{t("landing.footerLegal")}</p>
      </footer>
    </div>
  );
}
