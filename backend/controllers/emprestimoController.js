const { Emprestimo, Livro, Leitor, Usuario } = require('../models');
const { Op } = require('sequelize');

async function recalcularAtraso(emprestimo) {
  if (
    emprestimo.status === 'Em aberto' &&
    emprestimo.data_devolucao_prevista &&
    new Date(emprestimo.data_devolucao_prevista) < new Date()
  ) {
    await emprestimo.update({ status: 'Atrasado' });
  }
  return emprestimo;
}

const includePadrao = [
  { model: Livro, as: 'livro' },
  { model: Leitor, as: 'leitor', attributes: { exclude: ['senha'] } },
  { model: Usuario, as: 'responsavel', attributes: { exclude: ['senha'] } }
];


exports.listar = async (req, res) => {
  try {
    const { status, leitor_id, data_inicio, data_fim } = req.query;
    const where = {};

    if (req.usuario.tipo === 'Leitor') {
      where.leitor_id = req.usuario.id;
    } else if (leitor_id) {
      where.leitor_id = leitor_id;
    }

    if (status) where.status = status;

    if (data_inicio || data_fim) {
      where.data_emprestimo = {};
      if (data_inicio) where.data_emprestimo[Op.gte] = new Date(data_inicio);
      if (data_fim) where.data_emprestimo[Op.lte] = new Date(data_fim);
    }

    let emprestimos = await Emprestimo.findAll({
      where,
      include: includePadrao,
      order: [['id', 'DESC']]
    });

    emprestimos = await Promise.all(emprestimos.map(recalcularAtraso));

    if (status === 'Atrasado') {
      emprestimos = emprestimos.filter(e => e.status === 'Atrasado');
    }

    return res.json(emprestimos);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar empréstimos.', detalhes: erro.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findByPk(req.params.id, { include: includePadrao });
    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
    }

    if (req.usuario.tipo === 'Leitor' && emprestimo.leitor_id !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você só pode visualizar seus próprios empréstimos.' });
    }

    await recalcularAtraso(emprestimo);
    return res.json(emprestimo);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar empréstimo.', detalhes: erro.message });
  }
};

exports.emprestar = async (req, res) => {
  try {
    const { livro_id, leitor_id, data_devolucao_prevista } = req.body;
    const usuario_id = req.usuario.id;

    if (!livro_id || !leitor_id || !data_devolucao_prevista) {
      return res.status(400).json({ erro: 'livro_id, leitor_id e data_devolucao_prevista são obrigatórios.' });
    }

    const livro = await Livro.findByPk(livro_id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado no acervo.' });
    }

    const leitor = await Leitor.findByPk(leitor_id);
    if (!leitor) {
      return res.status(404).json({ erro: 'Leitor não encontrado.' });
    }

    if (leitor.status !== 'Ativo') {
      return res.status(400).json({ erro: 'Este leitor está inativo e não pode realizar empréstimos.' });
    }

    if (livro.qtd_disponivel <= 0) {
      return res.status(400).json({ erro: 'Não há cópias disponíveis deste livro no momento.' });
    }

    const novoEmprestimo = await Emprestimo.create({
      livro_id,
      leitor_id,
      usuario_id,
      data_emprestimo: new Date(),
      data_devolucao_prevista,
      status: 'Em aberto'
    });

    const novaDisponivel = livro.qtd_disponivel - 1;
    await livro.update({
      qtd_disponivel: novaDisponivel,
      status: novaDisponivel > 0 ? 'Disponível' : 'Indisponível'
    });

    const emprestimoCompleto = await Emprestimo.findByPk(novoEmprestimo.id, { include: includePadrao });

    return res.status(201).json({
      mensagem: 'Empréstimo registrado com sucesso!',
      emprestimo: emprestimoCompleto
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao registrar o empréstimo', detalhes: erro.message });
  }
};

exports.devolver = async (req, res) => {
  try {
    const { id } = req.params;

    const emprestimo = await Emprestimo.findByPk(id);
    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
    }

    if (emprestimo.status === 'Devolvido') {
      return res.status(400).json({ erro: 'Este empréstimo já foi finalizado.' });
    }

    await emprestimo.update({
      status: 'Devolvido',
      data_devolucao_real: new Date()
    });

    const livro = await Livro.findByPk(emprestimo.livro_id);
    if (livro) {
      const novaDisponivel = livro.qtd_disponivel + 1;
      await livro.update({
        qtd_disponivel: novaDisponivel,
        status: 'Disponível'
      });
    }

    const emprestimoCompleto = await Emprestimo.findByPk(emprestimo.id, { include: includePadrao });

    return res.json({
      mensagem: 'Livro devolvido com sucesso e estoque atualizado!',
      emprestimo: emprestimoCompleto
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao registrar devolução', detalhes: erro.message });
  }
};
