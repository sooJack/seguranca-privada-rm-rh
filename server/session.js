const activeSessions = new Map();

export const createSession = (token, usuario) => {
  activeSessions.set(token, usuario);
};

export const getSession = (token) => activeSessions.get(token);

export const deleteSession = (token) => activeSessions.delete(token);

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  const usuario = getSession(token);

  if (!usuario) {
    return res.status(401).json({ mensagem: "Autenticação necessária." });
  }

  req.usuario = usuario;
  next();
};

export const isAdminUser = (usuario) => {
  if (!usuario) return false;

  const cargo = String(usuario.cargo || "").trim().toLowerCase();
  const nome = String(usuario.nome || "").trim().toLowerCase();
  const cpf = String(usuario.cpf || "").trim();

  const adminCpfs = (process.env.ADMIN_CPF || "").split(',').map((item) => item.trim()).filter(Boolean);
  const adminNames = (process.env.ADMIN_NAME || "").split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);

  return (
    cargo === 'adm ultimate' ||
    cargo === 'adm' ||
    cargo === 'admin' ||
    cargo === 'administrator' ||
    adminCpfs.includes(cpf) ||
    adminNames.includes(nome)
  );
};
