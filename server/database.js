import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const fallbackPath = join(__dirname, 'fallback-db.json');

const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seguranca_privada',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let fallbackActive = false;
let fallbackDb = null;

const createDefaultFallback = () => ({
  vigilantes: [],
  clientes: [],
  postos: [],
  escalas: [],
  ocorrencias: [],
  gestao_risco_rm: [],
  ferias: [],
  horas_extras: [],
  nextId: {
    vigilantes: 1,
    clientes: 1,
    postos: 1,
    escalas: 1,
    ocorrencias: 1,
    gestao_risco_rm: 1,
    ferias: 1,
    horas_extras: 1
  }
});

const loadFallbackDb = () => {
  if (fallbackDb) return fallbackDb;
  if (fs.existsSync(fallbackPath)) {
    try {
      const raw = fs.readFileSync(fallbackPath, 'utf8');
      fallbackDb = raw ? JSON.parse(raw) : createDefaultFallback();
    } catch {
      fallbackDb = createDefaultFallback();
    }
  } else {
    fallbackDb = createDefaultFallback();
  }

  fallbackDb.nextId = fallbackDb.nextId || createDefaultFallback().nextId;
  for (const table of Object.keys(createDefaultFallback()).filter((k) => k !== 'nextId')) {
    if (!Array.isArray(fallbackDb[table])) fallbackDb[table] = [];
  }

  saveFallbackDb();
  return fallbackDb;
};

const saveFallbackDb = () => {
  fs.writeFileSync(fallbackPath, JSON.stringify(fallbackDb, null, 2), 'utf8');
};

const normalizeSql = (sql) => sql.replace(/\s+/g, ' ').trim().toUpperCase();

const getNextId = (table) => {
  fallbackDb.nextId[table] = (fallbackDb.nextId[table] || 1) + 1;
  return fallbackDb.nextId[table] - 1;
};

const sortBy = (rows, field, direction = 'ASC') => {
  const sorted = [...rows].sort((a, b) => {
    const left = a[field] || '';
    const right = b[field] || '';
    return String(left).localeCompare(String(right), 'pt-BR', { numeric: true });
  });
  return direction === 'DESC' ? sorted.reverse() : sorted;
};

const jsonQuery = async (sql, params = []) => {
  fallbackDb = loadFallbackDb();
  const normalized = normalizeSql(sql);

  if (normalized === 'SELECT 1 AS TEST') {
    return [[{ test: 1 }]];
  }

  if (normalized.startsWith('SELECT * FROM VIGILANTES ORDER BY NOME')) {
    return [sortBy(fallbackDb.vigilantes, 'nome')];
  }

  if (normalized.startsWith('SELECT * FROM VIGILANTES WHERE NOME = ? AND CPF = ?')) {
    const [nome, cpf] = params;
    const row = fallbackDb.vigilantes.filter(
      (item) => item.nome === nome && item.cpf === cpf
    );
    return [row];
  }

  if (normalized.startsWith('SELECT * FROM VIGILANTES WHERE ID_VIGILANTE = ?')) {
    const row = fallbackDb.vigilantes.filter((item) => item.id_vigilante === Number(params[0]));
    return [row];
  }

  if (normalized.startsWith('INSERT INTO VIGILANTES')) {
    const [nome, cpf, telefone, nivel_treinamento, status_vigilante] = params;
    const id_vigilante = getNextId('vigilantes');
    const newItem = {
      id_vigilante,
      nome,
      cpf,
      telefone,
      nivel_treinamento: nivel_treinamento || 'BASICO',
      status_vigilante: status_vigilante || 'ATIVO',
      created_at: new Date().toISOString()
    };
    fallbackDb.vigilantes.push(newItem);
    saveFallbackDb();
    return [{ insertId: id_vigilante }];
  }

  if (normalized.startsWith('UPDATE VIGILANTES SET')) {
    const [nome, cpf, telefone, nivel_treinamento, status_vigilante, id] = params;
    const item = fallbackDb.vigilantes.find((row) => row.id_vigilante === Number(id));
    if (item) {
      item.nome = nome;
      item.cpf = cpf;
      item.telefone = telefone;
      item.nivel_treinamento = nivel_treinamento;
      item.status_vigilante = status_vigilante;
      saveFallbackDb();
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (normalized.startsWith('DELETE FROM VIGILANTES WHERE ID_VIGILANTE = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.vigilantes.length;
    fallbackDb.vigilantes = fallbackDb.vigilantes.filter((row) => row.id_vigilante !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.vigilantes.length }];
  }

  if (normalized.startsWith('SELECT * FROM CLIENTES ORDER BY EMPRESA')) {
    return [sortBy(fallbackDb.clientes, 'empresa')];
  }

  if (normalized.startsWith('INSERT INTO CLIENTES')) {
    const [empresa, segmento, endereco] = params;
    const id_cliente = getNextId('clientes');
    fallbackDb.clientes.push({
      id_cliente,
      empresa,
      segmento,
      endereco,
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_cliente }];
  }

  if (normalized.startsWith('UPDATE CLIENTES SET')) {
    const [empresa, segmento, endereco, id] = params;
    const item = fallbackDb.clientes.find((row) => row.id_cliente === Number(id));
    if (item) {
      item.empresa = empresa;
      item.segmento = segmento;
      item.endereco = endereco;
      saveFallbackDb();
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (normalized.startsWith('DELETE FROM CLIENTES WHERE ID_CLIENTE = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.clientes.length;
    fallbackDb.clientes = fallbackDb.clientes.filter((row) => row.id_cliente !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.clientes.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM POSTOS P')) {
    const rows = fallbackDb.postos.map((posto) => {
      const cliente = fallbackDb.clientes.find((c) => c.id_cliente === posto.id_cliente) || {};
      const escalasPorPosto = fallbackDb.escalas.filter((e) => e.id_posto === posto.id_posto);
      return {
        ...posto,
        empresa: cliente.empresa || null,
        vigilantes_escalados: escalasPorPosto.length
      };
    });
    const levelOrder = { CRITICO: 4, ALTO: 3, MEDIO: 2, BAIXO: 1 };
    rows.sort((a, b) => {
      const diff = (levelOrder[b.nivel_risco] || 0) - (levelOrder[a.nivel_risco] || 0);
      return diff !== 0 ? diff : String(a.nome_posto).localeCompare(String(b.nome_posto), 'pt-BR', { numeric: true });
    });
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO POSTOS')) {
    const [nome_posto, localizacao, nivel_risco, id_cliente] = params;
    const id_posto = getNextId('postos');
    fallbackDb.postos.push({
      id_posto,
      nome_posto,
      localizacao,
      nivel_risco: nivel_risco || 'BAIXO',
      id_cliente: Number(id_cliente),
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_posto }];
  }

  if (normalized.startsWith('UPDATE POSTOS SET')) {
    const [nome_posto, localizacao, nivel_risco, id_cliente, id] = params;
    const item = fallbackDb.postos.find((row) => row.id_posto === Number(id));
    if (item) {
      item.nome_posto = nome_posto;
      item.localizacao = localizacao;
      item.nivel_risco = nivel_risco;
      item.id_cliente = Number(id_cliente);
      saveFallbackDb();
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (normalized.startsWith('DELETE FROM POSTOS WHERE ID_POSTO = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.postos.length;
    fallbackDb.postos = fallbackDb.postos.filter((row) => row.id_posto !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.postos.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM ESCALAS E')) {
    const rows = fallbackDb.escalas.map((escala) => {
      const vigilante = fallbackDb.vigilantes.find((v) => v.id_vigilante === escala.id_vigilante) || {};
      const posto = fallbackDb.postos.find((p) => p.id_posto === escala.id_posto) || {};
      const cliente = fallbackDb.clientes.find((c) => c.id_cliente === posto.id_cliente) || {};
      return {
        ...escala,
        vigilante_nome: vigilante.nome || null,
        nome_posto: posto.nome_posto || null,
        empresa: cliente.empresa || null,
        nivel_risco: posto.nivel_risco || null
      };
    });
    rows.sort((a, b) => new Date(b.data_servico).getTime() - new Date(a.data_servico).getTime());
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO ESCALAS')) {
    const [id_vigilante, id_posto, data_servico, turno, horas_trabalhadas] = params;
    const id_escala = getNextId('escalas');
    fallbackDb.escalas.push({
      id_escala,
      id_vigilante: Number(id_vigilante),
      id_posto: Number(id_posto),
      data_servico,
      turno,
      horas_trabalhadas: Number(horas_trabalhadas) || 0,
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_escala }];
  }

  if (normalized.startsWith('UPDATE ESCALAS SET')) {
    const [id_vigilante, id_posto, data_servico, turno, horas_trabalhadas, id] = params;
    const item = fallbackDb.escalas.find((row) => row.id_escala === Number(id));
    if (item) {
      item.id_vigilante = Number(id_vigilante);
      item.id_posto = Number(id_posto);
      item.data_servico = data_servico;
      item.turno = turno;
      item.horas_trabalhadas = Number(horas_trabalhadas) || 0;
      saveFallbackDb();
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (normalized.startsWith('DELETE FROM ESCALAS WHERE ID_ESCALA = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.escalas.length;
    fallbackDb.escalas = fallbackDb.escalas.filter((row) => row.id_escala !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.escalas.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM OCORRENCIAS O')) {
    const rows = fallbackDb.ocorrencias.map((ocorrencia) => {
      const escala = fallbackDb.escalas.find((e) => e.id_escala === ocorrencia.id_escala) || {};
      const vigilante = fallbackDb.vigilantes.find((v) => v.id_vigilante === escala.id_vigilante) || {};
      const posto = fallbackDb.postos.find((p) => p.id_posto === escala.id_posto) || {};
      return {
        ...ocorrencia,
        vigilante_nome: vigilante.nome || null,
        nome_posto: posto.nome_posto || null,
        turno: escala.turno || null
      };
    });
    rows.sort((a, b) => new Date(b.data_ocorrencia).getTime() - new Date(a.data_ocorrencia).getTime());
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO OCORRENCIAS')) {
    const [id_escala, descricao, nivel_criticidade] = params;
    const id_ocorrencia = getNextId('ocorrencias');
    fallbackDb.ocorrencias.push({
      id_ocorrencia,
      id_escala: Number(id_escala),
      descricao,
      nivel_criticidade: nivel_criticidade || 'BAIXA',
      data_ocorrencia: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_ocorrencia }];
  }

  if (normalized.startsWith('DELETE FROM OCORRENCIAS WHERE ID_OCORRENCIA = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.ocorrencias.length;
    fallbackDb.ocorrencias = fallbackDb.ocorrencias.filter((row) => row.id_ocorrencia !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.ocorrencias.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM FERIAS F')) {
    const rows = fallbackDb.ferias.map((ferias) => {
      const vigilante = fallbackDb.vigilantes.find((v) => v.id_vigilante === ferias.id_vigilante) || {};
      return {
        ...ferias,
        vigilante_nome: vigilante.nome || null
      };
    });
    rows.sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime());
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO FERIAS')) {
    const [id_vigilante, data_inicio, data_fim] = params;
    const id_ferias = getNextId('ferias');
    fallbackDb.ferias.push({
      id_ferias,
      id_vigilante: Number(id_vigilante),
      data_inicio,
      data_fim,
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_ferias }];
  }

  if (normalized.startsWith('DELETE FROM FERIAS WHERE ID_FERIAS = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.ferias.length;
    fallbackDb.ferias = fallbackDb.ferias.filter((row) => row.id_ferias !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.ferias.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM HORAS_EXTRAS H')) {
    const rows = fallbackDb.horas_extras.map((extra) => {
      const vigilante = fallbackDb.vigilantes.find((v) => v.id_vigilante === extra.id_vigilante) || {};
      return {
        ...extra,
        vigilante_nome: vigilante.nome || null
      };
    });
    rows.sort((a, b) => new Date(b.data_extra).getTime() - new Date(a.data_extra).getTime());
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO HORAS_EXTRAS')) {
    const [id_vigilante, quantidade_horas, motivo, data_extra] = params;
    const id_extra = getNextId('horas_extras');
    fallbackDb.horas_extras.push({
      id_extra,
      id_vigilante: Number(id_vigilante),
      quantidade_horas: Number(quantidade_horas),
      motivo,
      data_extra: data_extra || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_extra }];
  }

  if (normalized.startsWith('DELETE FROM HORAS_EXTRAS WHERE ID_EXTRA = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.horas_extras.length;
    fallbackDb.horas_extras = fallbackDb.horas_extras.filter((row) => row.id_extra !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.horas_extras.length }];
  }

  if (normalized.startsWith('SELECT') && normalized.includes('FROM GESTAO_RISCO_RM G')) {
    const rows = fallbackDb.gestao_risco_rm.map((risco) => {
      const posto = fallbackDb.postos.find((p) => p.id_posto === risco.id_posto) || {};
      const cliente = fallbackDb.clientes.find((c) => c.id_cliente === posto.id_cliente) || {};
      return {
        ...risco,
        nome_posto: posto.nome_posto || null,
        empresa: cliente.empresa || null
      };
    });
    rows.sort((a, b) => {
      if (a.status_risco === b.status_risco) {
        return (String(b.impacto).localeCompare(String(a.impacto), 'pt-BR', { numeric: true }));
      }
      return String(b.status_risco).localeCompare(String(a.status_risco), 'pt-BR', { numeric: true });
    });
    return [rows];
  }

  if (normalized.startsWith('INSERT INTO GESTAO_RISCO_RM')) {
    const [id_posto, tipo_risco, probabilidade, impacto, plano_acao] = params;
    const id_risco = getNextId('gestao_risco_rm');
    fallbackDb.gestao_risco_rm.push({
      id_risco,
      id_posto: Number(id_posto),
      tipo_risco,
      probabilidade: probabilidade || 'MEDIA',
      impacto: impacto || 'MEDIO',
      plano_acao,
      status_risco: 'ABERTO',
      created_at: new Date().toISOString()
    });
    saveFallbackDb();
    return [{ insertId: id_risco }];
  }

  if (normalized.startsWith('UPDATE GESTAO_RISCO_RM SET')) {
    const [tipo_risco, probabilidade, impacto, plano_acao, status_risco, id] = params;
    const item = fallbackDb.gestao_risco_rm.find((row) => row.id_risco === Number(id));
    if (item) {
      item.tipo_risco = tipo_risco;
      item.probabilidade = probabilidade;
      item.impacto = impacto;
      item.plano_acao = plano_acao;
      item.status_risco = status_risco;
      saveFallbackDb();
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (normalized.startsWith('DELETE FROM GESTAO_RISCO_RM WHERE ID_RISCO = ?')) {
    const id = Number(params[0]);
    const lengthBefore = fallbackDb.gestao_risco_rm.length;
    fallbackDb.gestao_risco_rm = fallbackDb.gestao_risco_rm.filter((row) => row.id_risco !== id);
    saveFallbackDb();
    return [{ affectedRows: lengthBefore - fallbackDb.gestao_risco_rm.length }];
  }

  throw new Error(`SQL não suportado no modo fallback: ${sql}`);
};

export const getConnection = async () => {
  if (!fallbackActive) {
    try {
      return await mysqlPool.getConnection();
    } catch (error) {
      console.warn('⚠️ MySQL indisponível, ativando fallback JSON local:', error.message);
      fallbackActive = true;
      loadFallbackDb();
    }
  }

  return {
    query: async (sql, params = []) => jsonQuery(sql, params),
    release: () => {}
  };
};

export const query = async (sql, params = []) => {
  if (!fallbackActive) {
    try {
      const connection = await mysqlPool.getConnection();
      try {
        return await connection.query(sql, params);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.warn('⚠️ MySQL indisponível em query, usando fallback JSON local:', error.message);
      fallbackActive = true;
      loadFallbackDb();
    }
  }

  return jsonQuery(sql, params);
};

export const testConnection = async () => {
  if (!fallbackActive) {
    try {
      const connection = await mysqlPool.getConnection();
      connection.release();
      console.log('✅ Conectado ao MySQL!');
      return true;
    } catch (error) {
      console.warn('⚠️ MySQL não disponível, usando fallback JSON local:', error.message);
      fallbackActive = true;
      loadFallbackDb();
      return true;
    }
  }

  console.log('ℹ️ Usando fallback JSON local.');
  return true;
};

export const isFallback = () => fallbackActive;

export const db = { getConnection, query, isFallback };
