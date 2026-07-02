const { Usuario, Leitor } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';


exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, senha, tipo.' });
    }

    if (!['Administrador', 'Bibliotecário'].includes(tipo)) {
      return res.status(400).json({
        erro: 'Tipo inválido. Use "Administrador" ou "Bibliotecário". Para cadastrar leitores, use a rota /leitores.'
      });
    }

    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(409).json({ erro: 'Já existe um usuário cadastrado com este e-mail.' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({ nome, email, senha: hashSenha, tipo });

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, tipo: novoUsuario.tipo }
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: erro.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    let tipo = null;
    let id = null;
    let nome = null;

    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta.' });
      }
      tipo = usuario.tipo;
      id = usuario.id;
      nome = usuario.nome;
    } else {
      const leitor = await Leitor.findOne({ where: { email } });

      if (!leitor) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      if (!leitor.senha) {
        return res.status(401).json({ erro: 'Este leitor existe, mas não possui uma senha cadastrada.' });
      }

      if (leitor.status === 'Inativo') {
        return res.status(403).json({ erro: 'Este cadastro de leitor está inativo. Procure a biblioteca.' });
      }

      const senhaValida = await bcrypt.compare(senha, leitor.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta.' });
      }

      tipo = 'Leitor';
      id = leitor.id;
      nome = leitor.nome;
    }

    const token = jwt.sign({ id, tipo, nome }, SECRET, { expiresIn: EXPIRES_IN });

    res.json({ mensagem: 'Login bem-sucedido', token, tipo, nome, id });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhes: erro.message });
  }
};
