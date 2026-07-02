const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] },
      order: [['nome', 'ASC']]
    });
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: erro.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, email, tipo, senha } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (tipo && !['Administrador', 'Bibliotecário'].includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo inválido. Use "Administrador" ou "Bibliotecário".' });
    }

    const dadosAtualizados = { nome, email, tipo };
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    await usuario.update(dadosAtualizados);

    const usuarioResposta = usuario.toJSON();
    delete usuarioResposta.senha;

    res.json({ mensagem: 'Usuário atualizado com sucesso!', usuario: usuarioResposta });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: erro.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (Number(req.params.id) === Number(req.usuario.id)) {
      return res.status(400).json({ erro: 'Você não pode excluir o seu próprio usuário enquanto está logado.' });
    }

    await usuario.destroy();
    res.json({ mensagem: 'Usuário deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar usuário', detalhes: erro.message });
  }
};
