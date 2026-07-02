const { Livro } = require('../models');
const { Op } = require('sequelize');

exports.criar = async (req, res) => {
  try {
    const { titulo, autor, editora, ano_publicacao, categoria, isbn, qtd_total } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Título e autor são obrigatórios.' });
    }

    const quantidade = qtd_total !== undefined ? Number(qtd_total) : 1;

    const novoLivro = await Livro.create({
      titulo,
      autor,
      editora,
      ano_publicacao,
      categoria,
      isbn,
      qtd_total: quantidade,
      qtd_disponivel: quantidade,
      status: quantidade > 0 ? 'Disponível' : 'Indisponível'
    });

    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!', livro: novoLivro });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar livro', detalhes: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const { busca, categoria, disponivel, autor, titulo, isbn } = req.query;
    const where = {};

    if (busca) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${busca}%` } },
        { autor: { [Op.iLike]: `%${busca}%` } },
        { isbn: { [Op.iLike]: `%${busca}%` } }
      ];
    }
    if (titulo) where.titulo = { [Op.iLike]: `%${titulo}%` };
    if (autor) where.autor = { [Op.iLike]: `%${autor}%` };
    if (isbn) where.isbn = { [Op.iLike]: `%${isbn}%` };
    if (categoria) where.categoria = { [Op.iLike]: `%${categoria}%` };
    if (disponivel === 'true') where.qtd_disponivel = { [Op.gt]: 0 };
    if (disponivel === 'false') where.qtd_disponivel = { [Op.lte]: 0 };

    const livros = await Livro.findAll({ where, order: [['titulo', 'ASC']] });
    res.json(livros);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar livros', detalhes: erro.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    res.json(livro);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar livro', detalhes: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { titulo, autor, editora, ano_publicacao, categoria, isbn, qtd_total } = req.body;
    const livro = await Livro.findByPk(req.params.id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    const dados = { titulo, autor, editora, ano_publicacao, categoria, isbn };

 
    if (qtd_total !== undefined) {
      const emprestados = livro.qtd_total - livro.qtd_disponivel;
      const novoTotal = Number(qtd_total);
      const novaDisponivel = Math.max(novoTotal - emprestados, 0);
      dados.qtd_total = novoTotal;
      dados.qtd_disponivel = novaDisponivel;
      dados.status = novaDisponivel > 0 ? 'Disponível' : 'Indisponível';
    }

    await livro.update(dados);
    res.json({ mensagem: 'Livro atualizado com sucesso!', livro });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar livro', detalhes: erro.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const livro = await Livro.findByPk(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    await livro.destroy();
    res.json({ mensagem: 'Livro deletado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar livro', detalhes: erro.message });
  }
};
