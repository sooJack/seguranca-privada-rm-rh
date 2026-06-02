import dotenv from 'dotenv';
dotenv.config();

import { query } from './server/database.js';

(async () => {
  try {
    const [rows] = await query('SELECT id_vigilante, nome, cpf, telefone FROM vigilantes ORDER BY nome LIMIT 50');
    console.log('Vigilantes encontrados:', rows.length);
    for (const r of rows) {
      console.log(r);
    }
  } catch (err) {
    console.error('Erro ao listar vigilantes:', err.message || err);
  }
})();
