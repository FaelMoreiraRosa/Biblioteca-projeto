const { Leitor, Emprestimo, Livro } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.criar = async (req, res) => {
  try {
    const { nome, email, telefone, cpf_ra, endereco, senha } = req.body;

    if (!nome || !email || !cpf_ra) {
      return res.status(400).json({ erro: 'Nome, e-mail e CPF/RA são obrigatórios.' });
    }

    const jaExiste = await Leitor.findOne({ where: { [Op.or]: [{ email }, { cpf_ra }] } });
    if (jaExiste) {
      return res.status(409).json({ erro: 'Já existe um leitor cadastrado com este e-mail ou CPF/RA.' });
    }

    const senhaBase = senha || cpf_ra;
    const hashSenha = await bcrypt.hash(senhaBase, 10);

    const novoLeitor = await Leitor.create({
      nome, email, telefone, cpf_ra, endereco,
      senha: hashSenha,
      status: 'Ativo'
    });

    const leitorResposta = novoLeitor.toJSON();
    delete leitorResposta.senha;

    res.status(201).json({ mensagem: 'Leitor cadastrado com sucesso!', leitor: leitorResposta });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar leitor', detalhes: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const { busca, status } = req.query;
    const where = {};

    if (busca) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${busca}%` } },
        { cpf_ra: { [Op.iLike]: `%${busca}%` } }
      ];
    }
    if (status) where.status = status;

    const leitores = await Leitor.findAll({
      where,
      attributes: { exclude: ['senha'] },
      order: [['nome', 'ASC']]
    });
    res.json(leitores);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar leitores', detalhes: erro.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const leitor = await Leitor.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });
    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado' });
    }
    res.json(leitor);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar leitor', detalhes: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, email, telefone, cpf_ra, endereco, senha, status } = req.body;
    const leitor = await Leitor.findByPk(req.params.id);

    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado' });
    }

    const dadosAtualizados = { nome, email, telefone, cpf_ra, endereco, status };

    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    await leitor.update(dadosAtualizados);

    const leitorResposta = leitor.toJSON();
    delete leitorResposta.senha;

    res.json({ mensagem: 'Leitor atualizado com sucesso!', leitor: leitorResposta });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar leitor', detalhes: erro.message });
  }
};

exports.inativar = async (req, res) => {
  try {
    const leitor = await Leitor.findByPk(req.params.id);
    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado' });
    }

    const novoStatus = leitor.status === 'Ativo' ? 'Inativo' : 'Ativo';
    await leitor.update({ status: novoStatus });

    res.json({ mensagem: `Leitor marcado como ${novoStatus}.`, status: novoStatus });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao alterar status do leitor', detalhes: erro.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const leitor = await Leitor.findByPk(req.params.id);
    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado' });
    }

    await leitor.destroy();
    res.json({ mensagem: 'Leitor deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar leitor', detalhes: erro.message });
  }
};


exports.historicoEmprestimos = async (req, res) => {
  try {
    const leitor = await Leitor.findByPk(req.params.id);
    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado' });
    }

    const emprestimos = await Emprestimo.findAll({
      where: { leitor_id: req.params.id },
      include: [{ model: Livro, as: 'livro' }],
      order: [['data_emprestimo', 'DESC']]
    });

    res.json(emprestimos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar histórico do leitor', detalhes: erro.message });
  }
};
