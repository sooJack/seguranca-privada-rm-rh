import express from 'express';
import { db } from './database.js';
import { authMiddleware, isAdminUser, createSession } from './session.js';
import crypto from 'crypto';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// AUTENTICAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

router.post('/auth/login', async (req, res) => {
  try {
    const { nome, cpf } = req.body;
    
    if (!nome || !cpf) {
      return res.status(400).json({ mensagem: 'Nome e CPF são obrigatórios' });
    }

    const connection = await db.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM vigilantes WHERE nome = ? AND cpf = ? LIMIT 1',
      [nome, cpf]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'Nome ou CPF inválidos' });
    }

    const usuario = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    
    createSession(token, {
      id_vigilante: usuario.id_vigilante,
      nome: usuario.nome,
      cpf: usuario.cpf,
      cargo: usuario.cargo || 'VIGILANTE'
    });

    res.json({
      token,
      usuario: {
        id_vigilante: usuario.id_vigilante,
        nome: usuario.nome,
        cpf: usuario.cpf,
        cargo: usuario.cargo || 'VIGILANTE'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/logout', authMiddleware, (req, res) => {
  res.json({ success: true });
});

router.get('/auth/me', authMiddleware, (req, res) => {
  res.json(req.usuario);
});

// ═══════════════════════════════════════════════════════════════════════════
// VIGILANTES
// ═══════════════════════════════════════════════════════════════════════════

router.get('/vigilantes', authMiddleware, async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM vigilantes ORDER BY nome');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    const vigilanteId = Number(req.params.id);

    if (!isAdminUser(req.usuario) && vigilanteId !== Number(req.usuario.id_vigilante)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM vigilantes WHERE id_vigilante = ?', [vigilanteId]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vigilantes', async (req, res) => {
  try {
    const { nome, cpf, telefone, nivel_treinamento, status_vigilante } = req.body;
    if (!nome || !cpf) return res.status(400).json({ error: 'Nome e CPF obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO vigilantes (nome, cpf, telefone, nivel_treinamento, status_vigilante) VALUES (?, ?, ?, ?, ?)',
      [nome, cpf, telefone, nivel_treinamento || 'BASICO', status_vigilante || 'ATIVO']
    );
    connection.release();
    res.status(201).json({ id_vigilante: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    const vigilanteId = Number(req.params.id);
    if (!isAdminUser(req.usuario) && vigilanteId !== Number(req.usuario.id_vigilante)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { nome, cpf, telefone, nivel_treinamento, status_vigilante } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE vigilantes SET nome = ?, cpf = ?, telefone = ?, nivel_treinamento = ?, status_vigilante = ? WHERE id_vigilante = ?',
      [nome, cpf, telefone, nivel_treinamento, status_vigilante, vigilanteId]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    const vigilanteId = Number(req.params.id);
    if (!isAdminUser(req.usuario) && vigilanteId !== Number(req.usuario.id_vigilante)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const connection = await db.getConnection();
    await connection.query('DELETE FROM vigilantes WHERE id_vigilante = ?', [vigilanteId]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTES
// ═══════════════════════════════════════════════════════════════════════════

router.get('/clientes', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM clientes ORDER BY empresa');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clientes', async (req, res) => {
  try {
    const { empresa, segmento, endereco } = req.body;
    if (!empresa) return res.status(400).json({ error: 'Empresa obrigatória' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO clientes (empresa, segmento, endereco) VALUES (?, ?, ?)',
      [empresa, segmento, endereco]
    );
    connection.release();
    res.status(201).json({ id_cliente: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/clientes/:id', async (req, res) => {
  try {
    const { empresa, segmento, endereco } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE clientes SET empresa = ?, segmento = ?, endereco = ? WHERE id_cliente = ?',
      [empresa, segmento, endereco, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clientes/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POSTOS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/postos', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        p.*,
        c.empresa,
        COUNT(e.id_escala) as vigilantes_escalados
      FROM postos p
      LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
      LEFT JOIN escalas e ON p.id_posto = e.id_posto
      GROUP BY p.id_posto
      ORDER BY p.nivel_risco DESC, p.nome_posto
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/postos', authMiddleware, async (req, res) => {
  try {
    const { nome_posto, localizacao, nivel_risco, id_cliente } = req.body;
    if (!nome_posto || !id_cliente) return res.status(400).json({ error: 'Nome e cliente obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO postos (nome_posto, localizacao, nivel_risco, id_cliente) VALUES (?, ?, ?, ?)',
      [nome_posto, localizacao, nivel_risco || 'BAIXO', id_cliente]
    );
    connection.release();
    res.status(201).json({ id_posto: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/postos/:id', authMiddleware, async (req, res) => {
  try {
    const { nome_posto, localizacao, nivel_risco, id_cliente } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE postos SET nome_posto = ?, localizacao = ?, nivel_risco = ?, id_cliente = ? WHERE id_posto = ?',
      [nome_posto, localizacao, nivel_risco, id_cliente, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/postos/:id', authMiddleware, async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM postos WHERE id_posto = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ESCALAS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/escalas', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        e.*,
        v.nome as vigilante_nome,
        p.nome_posto,
        c.empresa,
        p.nivel_risco
      FROM escalas e
      JOIN vigilantes v ON e.id_vigilante = v.id_vigilante
      JOIN postos p ON e.id_posto = p.id_posto
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY e.data_servico DESC
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/escalas', async (req, res) => {
  try {
    const { id_vigilante, id_posto, data_servico, turno, horas_trabalhadas } = req.body;
    if (!id_vigilante || !id_posto || !data_servico || !turno) 
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO escalas (id_vigilante, id_posto, data_servico, turno, horas_trabalhadas) VALUES (?, ?, ?, ?, ?)',
      [id_vigilante, id_posto, data_servico, turno, horas_trabalhadas || 0]
    );
    connection.release();
    res.status(201).json({ id_escala: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/escalas/:id', async (req, res) => {
  try {
    const { id_vigilante, id_posto, data_servico, turno, horas_trabalhadas } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE escalas SET id_vigilante = ?, id_posto = ?, data_servico = ?, turno = ?, horas_trabalhadas = ? WHERE id_escala = ?',
      [id_vigilante, id_posto, data_servico, turno, horas_trabalhadas, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/escalas/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM escalas WHERE id_escala = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// OCORRÊNCIAS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/ocorrencias', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        o.*,
        v.nome as vigilante_nome,
        p.nome_posto,
        e.turno
      FROM ocorrencias o
      JOIN escalas e ON o.id_escala = e.id_escala
      JOIN vigilantes v ON e.id_vigilante = v.id_vigilante
      JOIN postos p ON e.id_posto = p.id_posto
      ORDER BY o.data_ocorrencia DESC
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ocorrencias', async (req, res) => {
  try {
    const { id_escala, descricao, nivel_criticidade } = req.body;
    if (!id_escala || !descricao) return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO ocorrencias (id_escala, descricao, nivel_criticidade) VALUES (?, ?, ?)',
      [id_escala, descricao, nivel_criticidade || 'BAIXA']
    );
    connection.release();
    res.status(201).json({ id_ocorrencia: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/ocorrencias/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM ocorrencias WHERE id_ocorrencia = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ocorrencias/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        o.*,
        v.nome as vigilante_nome,
        p.nome_posto,
        e.turno
      FROM ocorrencias o
      JOIN escalas e ON o.id_escala = e.id_escala
      JOIN vigilantes v ON e.id_vigilante = v.id_vigilante
      JOIN postos p ON e.id_posto = p.id_posto
      WHERE o.id_ocorrencia = ?
      LIMIT 1
    `;
    const [rows] = await connection.query(sql, [req.params.id]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/ocorrencias/:id', async (req, res) => {
  try {
    const { id_escala, descricao, nivel_criticidade } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE ocorrencias SET id_escala = ?, descricao = ?, nivel_criticidade = ? WHERE id_ocorrencia = ?',
      [id_escala, descricao, nivel_criticidade, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FÉRIAS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/ferias', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        f.*,
        v.nome as vigilante_nome
      FROM ferias f
      JOIN vigilantes v ON f.id_vigilante = v.id_vigilante
      ORDER BY f.data_inicio DESC
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ferias', async (req, res) => {
  try {
    const { id_vigilante, data_inicio, data_fim } = req.body;
    if (!id_vigilante || !data_inicio || !data_fim) 
      return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO ferias (id_vigilante, data_inicio, data_fim) VALUES (?, ?, ?)',
      [id_vigilante, data_inicio, data_fim]
    );
    connection.release();
    res.status(201).json({ id_ferias: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/ferias/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM ferias WHERE id_ferias = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ferias/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        f.*, 
        v.nome as vigilante_nome
      FROM ferias f
      JOIN vigilantes v ON f.id_vigilante = v.id_vigilante
      WHERE f.id_ferias = ?
      LIMIT 1
    `;
    const [rows] = await connection.query(sql, [req.params.id]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/ferias/:id', async (req, res) => {
  try {
    const { id_vigilante, data_inicio, data_fim } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE ferias SET id_vigilante = ?, data_inicio = ?, data_fim = ? WHERE id_ferias = ?',
      [id_vigilante, data_inicio, data_fim, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HORAS EXTRAS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/horas-extras', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        h.*,
        v.nome as vigilante_nome
      FROM horas_extras h
      JOIN vigilantes v ON h.id_vigilante = v.id_vigilante
      ORDER BY h.data_extra DESC
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/horas-extras', async (req, res) => {
  try {
    const { id_vigilante, quantidade_horas, motivo, data_extra } = req.body;
    if (!id_vigilante || !quantidade_horas) 
      return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO horas_extras (id_vigilante, quantidade_horas, motivo, data_extra) VALUES (?, ?, ?, ?)',
      [id_vigilante, quantidade_horas, motivo, data_extra || new Date().toISOString().split('T')[0]]
    );
    connection.release();
    res.status(201).json({ id_extra: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/horas-extras/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM horas_extras WHERE id_extra = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/horas-extras/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        h.*, 
        v.nome as vigilante_nome
      FROM horas_extras h
      JOIN vigilantes v ON h.id_vigilante = v.id_vigilante
      WHERE h.id_extra = ?
      LIMIT 1
    `;
    const [rows] = await connection.query(sql, [req.params.id]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/horas-extras/:id', async (req, res) => {
  try {
    const { id_vigilante, quantidade_horas, motivo, data_extra } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE horas_extras SET id_vigilante = ?, quantidade_horas = ?, motivo = ?, data_extra = ? WHERE id_extra = ?',
      [id_vigilante, quantidade_horas, motivo, data_extra, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GESTÃO DE RISCOS
// ═══════════════════════════════════════════════════════════════════════════

router.get('/riscos', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const sql = `
      SELECT 
        g.*,
        p.nome_posto,
        c.empresa
      FROM gestao_risco_rm g
      JOIN postos p ON g.id_posto = p.id_posto
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY g.status_risco DESC, g.impacto DESC
    `;
    const [rows] = await connection.query(sql);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/riscos', async (req, res) => {
  try {
    const { id_posto, tipo_risco, probabilidade, impacto, plano_acao } = req.body;
    if (!id_posto || !tipo_risco) return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO gestao_risco_rm (id_posto, tipo_risco, probabilidade, impacto, plano_acao, status_risco) VALUES (?, ?, ?, ?, ?, ?)',
      [id_posto, tipo_risco, probabilidade || 'MEDIA', impacto || 'MEDIO', plano_acao, 'ABERTO']
    );
    connection.release();
    res.status(201).json({ id_risco: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/riscos/:id', async (req, res) => {
  try {
    const { tipo_risco, probabilidade, impacto, plano_acao, status_risco } = req.body;
    const connection = await db.getConnection();
    await connection.query(
      'UPDATE gestao_risco_rm SET tipo_risco = ?, probabilidade = ?, impacto = ?, plano_acao = ?, status_risco = ? WHERE id_risco = ?',
      [tipo_risco, probabilidade, impacto, plano_acao, status_risco, req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/riscos/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM gestao_risco_rm WHERE id_risco = ?', [req.params.id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
