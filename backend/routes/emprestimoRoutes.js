const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

const TODOS = ['Administrador', 'Bibliotecário', 'Leitor'];
const STAFF = ['Administrador', 'Bibliotecário'];

/**
 * @swagger
 * tags:
 *   name: Empréstimos
 *   description: Registro e controle de empréstimos e devoluções
 */

/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Lista empréstimos (leitores só veem os próprios; staff pode filtrar por leitor)
 *     tags: [Empréstimos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: ["Em aberto", "Devolvido", "Atrasado"] }
 *       - in: query
 *         name: leitor_id
 *         schema: { type: integer }
 *       - in: query
 *         name: data_inicio
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: data_fim
 *         schema: { type: string, format: date }
 *     responses:
 *       200: { description: Lista de empréstimos }
 */
router.get('/', verificarToken, autorizar(TODOS), emprestimoController.listar);

/**
 * @swagger
 * /emprestimos/{id}:
 *   get:
 *     summary: Busca um empréstimo pelo ID
 *     tags: [Empréstimos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Empréstimo encontrado }
 *       403: { description: Leitor tentando ver empréstimo de outra pessoa }
 *       404: { description: Empréstimo não encontrado }
 */
router.get('/:id', verificarToken, autorizar(TODOS), emprestimoController.buscarPorId);

/**
 * @swagger
 * /emprestimos:
 *   post:
 *     summary: Registra um novo empréstimo (somente Administrador/Bibliotecário)
 *     tags: [Empréstimos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [livro_id, leitor_id, data_devolucao_prevista]
 *             properties:
 *               livro_id: { type: integer, example: 1 }
 *               leitor_id: { type: integer, example: 1 }
 *               data_devolucao_prevista: { type: string, format: date, example: "2026-07-15" }
 *     responses:
 *       201: { description: Empréstimo registrado }
 *       400: { description: Regra de negócio violada (sem estoque, leitor inativo, etc.) }
 */
router.post('/', verificarToken, autorizar(STAFF), emprestimoController.emprestar);

/**
 * @swagger
 * /emprestimos/{id}/devolucao:
 *   put:
 *     summary: Registra a devolução de um empréstimo (somente Administrador/Bibliotecário)
 *     tags: [Empréstimos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Devolução registrada }
 *       400: { description: Empréstimo já finalizado }
 *       404: { description: Empréstimo não encontrado }
 */
router.put('/:id/devolucao', verificarToken, autorizar(STAFF), emprestimoController.devolver);

module.exports = router;
