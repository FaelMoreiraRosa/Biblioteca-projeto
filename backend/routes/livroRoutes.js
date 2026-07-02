const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

const TODOS = ['Administrador', 'Bibliotecário', 'Leitor'];
const STAFF = ['Administrador', 'Bibliotecário'];

/**
 * @swagger
 * tags:
 *   name: Livros
 *   description: Gerenciamento do acervo de livros
 */

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista livros, com filtros opcionais
 *     tags: [Livros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema: { type: string }
 *         description: Busca por título, autor ou ISBN
 *       - in: query
 *         name: titulo
 *         schema: { type: string }
 *       - in: query
 *         name: autor
 *         schema: { type: string }
 *       - in: query
 *         name: isbn
 *         schema: { type: string }
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: disponivel
 *         schema: { type: boolean }
 *         description: true = apenas disponíveis, false = apenas indisponíveis
 *     responses:
 *       200: { description: Lista de livros }
 */
router.get('/', verificarToken, autorizar(TODOS), livroController.listar);

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags: [Livros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Livro encontrado }
 *       404: { description: Livro não encontrado }
 */
router.get('/:id', verificarToken, autorizar(TODOS), livroController.buscarPorId);

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Livros]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, autor]
 *             properties:
 *               titulo: { type: string, example: "O Senhor dos Anéis" }
 *               autor: { type: string, example: "J.R.R. Tolkien" }
 *               editora: { type: string, example: "Martins Fontes" }
 *               ano_publicacao: { type: integer, example: 1954 }
 *               categoria: { type: string, example: "Fantasia" }
 *               isbn: { type: string, example: "978-8533613379" }
 *               qtd_total: { type: integer, example: 3 }
 *     responses:
 *       201: { description: Livro cadastrado }
 *       400: { description: Dados inválidos }
 */
router.post('/', verificarToken, autorizar(STAFF), livroController.criar);

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza os dados de um livro
 *     tags: [Livros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               autor: { type: string }
 *               editora: { type: string }
 *               ano_publicacao: { type: integer }
 *               categoria: { type: string }
 *               isbn: { type: string }
 *               qtd_total: { type: integer }
 *     responses:
 *       200: { description: Livro atualizado }
 *       404: { description: Livro não encontrado }
 */
router.put('/:id', verificarToken, autorizar(STAFF), livroController.atualizar);

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Exclui um livro do acervo
 *     tags: [Livros]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Livro deletado }
 *       404: { description: Livro não encontrado }
 */
router.delete('/:id', verificarToken, autorizar(STAFF), livroController.deletar);

module.exports = router;
