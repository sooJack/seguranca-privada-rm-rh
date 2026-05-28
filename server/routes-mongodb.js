import express from 'express';
import { authMiddleware, isAdminUser, createSession } from './session.js';
import crypto from 'crypto';
import {
  Vigilante,
  Cliente,
  Posto,
  Escala,
  Ocorrencia,
  Feria,
  HoraExtra,
  Risco_RM
} from './mongodb.js';

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

    const usuario = await Vigilante.findOne({ nome, cpf });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Nome ou CPF inválidos' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    createSession(token, {
      id_vigilante: usuario._id.toString(),
      nome: usuario.nome,
      cpf: usuario.cpf,
      cargo: usuario.cargo || 'VIGILANTE'
    });

    res.json({
      token,
      usuario: {
        id_vigilante: usuario._id.toString(),
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
    let query;
    if (!isAdminUser(req.usuario)) {
      query = Vigilante.find({ _id: req.usuario.id_vigilante });
    } else {
      query = Vigilante.find({});
    }
    
    const vigilantes = await query.sort({ nome: 1 });
    res.json(vigilantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdminUser(req.usuario) && req.params.id !== req.usuario.id_vigilante) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const vigilante = await Vigilante.findById(req.params.id);
    if (!vigilante) return res.status(404).json({ error: 'Não encontrado' });
    res.json(vigilante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vigilantes', async (req, res) => {
  try {
    const { nome, cpf, telefone, nivel_treinamento, status_vigilante } = req.body;
    if (!nome || !cpf) return res.status(400).json({ error: 'Nome e CPF obrigatórios' });
    
    const vigilante = await Vigilante.create({
      nome,
      cpf,
      telefone,
      nivel_treinamento: nivel_treinamento || 'BASICO',
      status_vigilante: status_vigilante || 'ATIVO'
    });
    
    res.status(201).json(vigilante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdminUser(req.usuario) && req.params.id !== req.usuario.id_vigilante) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { nome, cpf, telefone, nivel_treinamento, status_vigilante } = req.body;
    const vigilante = await Vigilante.findByIdAndUpdate(
      req.params.id,
      { nome, cpf, telefone, nivel_treinamento, status_vigilante },
      { new: true }
    );
    
    res.json(vigilante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/vigilantes/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdminUser(req.usuario) && req.params.id !== req.usuario.id_vigilante) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await Vigilante.findByIdAndDelete(req.params.id);
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
    const clientes = await Cliente.find({}).sort({ empresa: 1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clientes', async (req, res) => {
  try {
    const { empresa, segmento, endereco } = req.body;
    if (!empresa) return res.status(400).json({ error: 'Empresa obrigatória' });
    
    const cliente = await Cliente.create({ empresa, segmento, endereco });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/clientes/:id', async (req, res) => {
  try {
    const { empresa, segmento, endereco } = req.body;
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { empresa, segmento, endereco },
      { new: true }
    );
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clientes/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
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
    const postos = await Posto.find({})
      .populate('id_cliente')
      .sort({ nivel_risco: -1, nome_posto: 1 });
    res.json(postos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/postos', async (req, res) => {
  try {
    const { nome_posto, localizacao, nivel_risco, id_cliente } = req.body;
    if (!nome_posto || !id_cliente) return res.status(400).json({ error: 'Nome e cliente obrigatórios' });
    
    const posto = await Posto.create({
      nome_posto,
      localizacao,
      nivel_risco: nivel_risco || 'BAIXO',
      id_cliente
    });
    res.status(201).json(posto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/postos/:id', async (req, res) => {
  try {
    const { nome_posto, localizacao, nivel_risco, id_cliente } = req.body;
    const posto = await Posto.findByIdAndUpdate(
      req.params.id,
      { nome_posto, localizacao, nivel_risco, id_cliente },
      { new: true }
    );
    res.json(posto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/postos/:id', async (req, res) => {
  try {
    await Posto.findByIdAndDelete(req.params.id);
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
    const escalas = await Escala.find({})
      .populate('id_vigilante')
      .populate('id_posto')
      .sort({ data_servico: -1 });
    res.json(escalas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/escalas', async (req, res) => {
  try {
    const { id_vigilante, id_posto, data_servico, turno, horas_trabalhadas } = req.body;
    if (!id_vigilante || !id_posto || !data_servico || !turno) 
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    
    const escala = await Escala.create({
      id_vigilante,
      id_posto,
      data_servico,
      turno,
      horas_trabalhadas: horas_trabalhadas || 0
    });
    res.status(201).json(escala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/escalas/:id', async (req, res) => {
  try {
    const { id_vigilante, id_posto, data_servico, turno, horas_trabalhadas } = req.body;
    const escala = await Escala.findByIdAndUpdate(
      req.params.id,
      { id_vigilante, id_posto, data_servico, turno, horas_trabalhadas },
      { new: true }
    );
    res.json(escala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/escalas/:id', async (req, res) => {
  try {
    await Escala.findByIdAndDelete(req.params.id);
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
    const ocorrencias = await Ocorrencia.find({})
      .populate('id_escala')
      .sort({ criado_em: -1 });
    res.json(ocorrencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ocorrencias', async (req, res) => {
  try {
    const { id_escala, descricao, nivel_criticidade } = req.body;
    if (!id_escala || !descricao) return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const ocorrencia = await Ocorrencia.create({
      id_escala,
      descricao,
      nivel_criticidade: nivel_criticidade || 'BAIXA'
    });
    res.status(201).json(ocorrencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/ocorrencias/:id', async (req, res) => {
  try {
    await Ocorrencia.findByIdAndDelete(req.params.id);
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
    const ferias = await Feria.find({})
      .populate('id_vigilante')
      .sort({ data_inicio: -1 });
    res.json(ferias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ferias', async (req, res) => {
  try {
    const { id_vigilante, data_inicio, data_fim } = req.body;
    if (!id_vigilante || !data_inicio || !data_fim) 
      return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const feria = await Feria.create({ id_vigilante, data_inicio, data_fim });
    res.status(201).json(feria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/ferias/:id', async (req, res) => {
  try {
    await Feria.findByIdAndDelete(req.params.id);
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
    const horasExtras = await HoraExtra.find({})
      .populate('id_vigilante')
      .sort({ data_extra: -1 });
    res.json(horasExtras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/horas-extras', async (req, res) => {
  try {
    const { id_vigilante, quantidade_horas, motivo, data_extra } = req.body;
    if (!id_vigilante || !quantidade_horas) 
      return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const horaExtra = await HoraExtra.create({
      id_vigilante,
      quantidade_horas,
      motivo,
      data_extra: data_extra || new Date()
    });
    res.status(201).json(horaExtra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/horas-extras/:id', async (req, res) => {
  try {
    await HoraExtra.findByIdAndDelete(req.params.id);
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
    const riscos = await Risco_RM.find({})
      .populate('id_posto')
      .sort({ impacto: -1 });
    res.json(riscos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/riscos', async (req, res) => {
  try {
    const { id_posto, tipo_risco, probabilidade, impacto, plano_acao } = req.body;
    if (!id_posto || !tipo_risco) return res.status(400).json({ error: 'Campos obrigatórios' });
    
    const risco = await Risco_RM.create({
      id_posto,
      tipo_risco,
      probabilidade: probabilidade || 'MEDIA',
      impacto: impacto || 'MEDIO',
      plano_acao,
      status_risco: 'ABERTO'
    });
    res.status(201).json(risco);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/riscos/:id', async (req, res) => {
  try {
    const { tipo_risco, probabilidade, impacto, plano_acao, status_risco } = req.body;
    const risco = await Risco_RM.findByIdAndUpdate(
      req.params.id,
      { tipo_risco, probabilidade, impacto, plano_acao, status_risco },
      { new: true }
    );
    res.json(risco);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/riscos/:id', async (req, res) => {
  try {
    await Risco_RM.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
