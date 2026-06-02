import dotenv from 'dotenv';
dotenv.config();

import { query } from './server/database.js';

const sql = `SELECT id_vigilante, nome, cpf FROM vigilantes WHERE LOWER(nome) = LOWER(?) AND REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = ? LIMIT 1`;

(async () => {
  try {
    console.log('Query:', sql);
    let res = await query(sql, ['Carlos Silva', '11111111111']);
    console.log('Result for 11111111111:', res[0]);

    res = await query(sql, ['Carlos Silva', '111.111.111-11']);
    console.log('Result for 111.111.111-11:', res[0]);
  } catch (err) {
    console.error('Erro:', err.message || err);
  }
})();
