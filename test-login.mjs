import dotenv from 'dotenv';
dotenv.config();

const BASE = (process.env.VITE_API_URL || `http://localhost:${process.env.SERVER_PORT || 3001}/api`).replace(/\/$/,'');

const tryLogin = async (nome, cpf) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cpf })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);
};

(async () => {
  // experimente com e sem pontuação
  await tryLogin('Carlos Silva', '11111111111');
  await tryLogin('Carlos Silva', '111.111.111-11');
  await tryLogin('João Souza', '22222222222');
})();
