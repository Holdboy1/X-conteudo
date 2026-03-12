import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Twitter, 
  Settings, 
  Activity, 
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';

function App() {

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1 className="logo">SOCIAL.AI</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
            Control Center for Discord & X
          </p>
        </div>
        <div className="status-badge">
          <div className="status-dot"></div>
          SISTEMA ONLINE
        </div>
      </header>

      <div className="grid">
        {/* Post Generation Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <div className="icon-box"><Zap size={20} color="var(--primary)" /></div>
              Gerar Postagem IA
            </h2>
          </div>
          <div className="input-group">
            <label>Plataforma</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, border: '1px solid var(--primary)' }}>
                <Twitter size={16} /> Twitter
              </button>
              <button className="btn btn-secondary" style={{ flex: 1 }}>
                <MessageSquare size={16} /> Discord
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Tópico ou Notícia</label>
            <textarea placeholder="Ex: Avanços da IA em Web3 hoje..." rows={3}></textarea>
          </div>
          <button className="btn">
            <Send size={18} /> Gerar e Postar Agora
          </button>
        </div>

        {/* Persona Settings Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <div className="icon-box"><Settings size={20} color="var(--secondary)" /></div>
              Configuração da Persona
            </h2>
          </div>
          <div className="input-group">
            <label>Especialização</label>
            <input type="text" defaultValue="Web3, Crypto, AI, Gaming" />
          </div>
          <div className="input-group">
            <label>Tom de Voz</label>
            <input type="text" defaultValue="Humano, Curioso e Inteligente" />
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">280</span>
              <span className="stat-label">Chars X</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">PT-BR</span>
              <span className="stat-label">Idioma</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">
              <div className="icon-box"><Activity size={20} color="#ffaa00" /></div>
              Atividade Recente
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ActivityItem 
              icon={<Twitter size={14} />} 
              title="Post enviado para o Twitter" 
              time="Há 10 minutos" 
              status="Sucesso"
            />
            <ActivityItem 
              icon={<MessageSquare size={14} />} 
              title="Interação no Discord (Canal Gaming)" 
              time="Há 2 horas" 
              status="Sucesso"
            />
            <ActivityItem 
              icon={<Clock size={14} />} 
              title="Agendamento: Postagem Diária" 
              time="Amanhã às 10:00" 
              status="Pendente"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time, status }: any) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '12px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      border: '1px solid var(--card-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: 'var(--primary)' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{time}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#00ff64' }}>
        <CheckCircle2 size={14} /> {status}
      </div>
    </div>
  );
}

export default App;
