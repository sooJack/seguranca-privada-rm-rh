import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seguranca_privada';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

const vigilanteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  telefone: String,
  cargo: { type: String, default: 'VIGILANTE' },
  nivel_treinamento: { type: String, default: 'BASICO' },
  status_vigilante: { type: String, default: 'ATIVO' },
  criado_em: { type: Date, default: Date.now }
});

const clienteSchema = new mongoose.Schema({
  empresa: { type: String, required: true },
  segmento: String,
  endereco: String,
  criado_em: { type: Date, default: Date.now }
});

const postoSchema = new mongoose.Schema({
  nome_posto: { type: String, required: true },
  localizacao: String,
  nivel_risco: { type: String, default: 'BAIXO' },
  id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  criado_em: { type: Date, default: Date.now }
});

const escalaSchema = new mongoose.Schema({
  id_vigilante: { type: mongoose.Schema.Types.ObjectId, ref: 'Vigilante', required: true },
  id_posto: { type: mongoose.Schema.Types.ObjectId, ref: 'Posto', required: true },
  data_servico: { type: Date, required: true },
  turno: { type: String, required: true },
  horas_trabalhadas: { type: Number, default: 0 },
  criado_em: { type: Date, default: Date.now }
});

const ocorrenciaSchema = new mongoose.Schema({
  id_escala: { type: mongoose.Schema.Types.ObjectId, ref: 'Escala', required: true },
  descricao: { type: String, required: true },
  nivel_criticidade: { type: String, default: 'BAIXA' },
  criado_em: { type: Date, default: Date.now }
});

const feriaSchema = new mongoose.Schema({
  id_vigilante: { type: mongoose.Schema.Types.ObjectId, ref: 'Vigilante', required: true },
  data_inicio: { type: Date, required: true },
  data_fim: { type: Date, required: true },
  criado_em: { type: Date, default: Date.now }
});

const horaExtraSchema = new mongoose.Schema({
  id_vigilante: { type: mongoose.Schema.Types.ObjectId, ref: 'Vigilante', required: true },
  quantidade_horas: { type: Number, required: true },
  motivo: String,
  data_extra: { type: Date, default: Date.now },
  criado_em: { type: Date, default: Date.now }
});

const risco_rmSchema = new mongoose.Schema({
  id_posto: { type: mongoose.Schema.Types.ObjectId, ref: 'Posto', required: true },
  tipo_risco: { type: String, required: true },
  probabilidade: { type: String, default: 'MEDIA' },
  impacto: { type: String, default: 'MEDIO' },
  plano_acao: String,
  status_risco: { type: String, default: 'ABERTO' },
  criado_em: { type: Date, default: Date.now }
});

// ═══════════════════════════════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════════════════════════════

const Vigilante = mongoose.model('Vigilante', vigilanteSchema);
const Cliente = mongoose.model('Cliente', clienteSchema);
const Posto = mongoose.model('Posto', postoSchema);
const Escala = mongoose.model('Escala', escalaSchema);
const Ocorrencia = mongoose.model('Ocorrencia', ocorrenciaSchema);
const Feria = mongoose.model('Feria', feriaSchema);
const HoraExtra = mongoose.model('HoraExtra', horaExtraSchema);
const Risco_RM = mongoose.model('Risco_RM', risco_rmSchema);

// ═══════════════════════════════════════════════════════════════════════════
// CONEXÃO
// ═══════════════════════════════════════════════════════════════════════════

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB já conectado');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority'
    });
    isConnected = true;
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ Desconectado do MongoDB');
  } catch (error) {
    console.error('❌ Erro ao desconectar:', error.message);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  Vigilante,
  Cliente,
  Posto,
  Escala,
  Ocorrencia,
  Feria,
  HoraExtra,
  Risco_RM
};
