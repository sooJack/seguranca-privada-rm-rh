import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Globe, Lock, Bell, Save, LogOut } from "lucide-react";

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { logout } = useAuth();
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    alertas: true,
    relatorios: true,
  });
  const [privacidade, setPrivacidade] = useState({
    perfil_publico: false,
    mostrar_atividades: false,
  });

  const salvarConfigurações = () => {
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    localStorage.setItem('privacidade', JSON.stringify(privacidade));
    alert('Configurações salvas com sucesso!');
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero mb-8">
        <h1>Configurações</h1>
        <p>Personalize o sistema e ajuste suas preferências de funcionamento.</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Tema */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Tema</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Alterne entre tema claro e escuro para melhor conforto visual.
          </p>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-page)'}
          >
            {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>
        </div>

        {/* Idioma */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Globe size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Idioma</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Escolha o idioma de interface do sistema.
          </p>
          <button
            onClick={toggleLanguage}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-page)'}
          >
            🌐 Português/English
          </button>
        </div>

        {/* Notificações */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Bell size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Notificações</h3>
          </div>

          {[
            { key: 'email', label: 'Notificações por E-mail', desc: 'Receba atualizações importantes' },
            { key: 'alertas', label: 'Alertas de Sistema', desc: 'Alertas de segurança e incidentes' },
            { key: 'relatorios', label: 'Relatórios Semanais', desc: 'Resumo semanal de atividades' },
          ].map((item) => (
            <div key={item.key} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={notificacoes[item.key]}
                onChange={(e) => setNotificacoes({ ...notificacoes, [item.key]: e.target.checked })}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </div>
          ))}
        </div>

        {/* Privacidade */}
        <div style={{
          padding: '1.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          backgroundColor: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Lock size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Privacidade</h3>
          </div>

          {[
            { key: 'perfil_publico', label: 'Perfil Público', desc: 'Permitir que outros vejam seu perfil' },
            { key: 'mostrar_atividades', label: 'Mostrar Atividades', desc: 'Exibir histórico de ações' },
          ].map((item) => (
            <div key={item.key} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={privacidade[item.key]}
                onChange={(e) => setPrivacidade({ ...privacidade, [item.key]: e.target.checked })}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </div>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={salvarConfigurações}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition)',
            }}
          >
            <Save size={18} /> Salvar Configurações
          </button>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition)',
            }}
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}