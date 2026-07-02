const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const partes = header.split(' ');
  const token = partes.length === 2 ? partes[1] : partes[0];

  try {
    const decodificado = jwt.verify(token, SECRET);
    req.usuario = decodificado;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};


const autorizar = (cargosPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !cargosPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        erro: 'Acesso negado. Você não tem permissão para realizar esta ação.',
        seuPerfil: req.usuario ? req.usuario.tipo : 'Desconhecido',
        perfisExigidos: cargosPermitidos
      });
    }
    next();
  };
};

module.exports = { verificarToken, autorizar };
