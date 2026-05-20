import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seguranca_privada',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = pool;

export const query = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    return await connection.query(sql, params);
  } finally {
    connection.release();
  }
};

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error?.code || 'UNKNOWN', error?.message || error);
    return false;
  }
};
