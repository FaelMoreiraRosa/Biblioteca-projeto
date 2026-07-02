const express = require('express');
const router = express.Router();
const leitorController = require('../controllers/leitorController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

const STAFF = ['Administrador', 'Bibliotecário'];

/**
 * @swagger
 * tags:
 *   name: Leitores
 *   description: Gerenciamento de leitores/alunos
 */

/**
 * @swagger
 * /leitores:
 *   get:
 *     summary: Lista leitores, com filtro por nome/CPF/RA e status
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema: { type: string }
 *         description: Busca por nome ou CPF/RA
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Ativo, Inativo] }
 *     responses:
 *       200: { description: Lista de leitores }
 */
router.get('/', verificarToken, autorizar(STAFF), leitorController.listar);

/**
 * @swagger
 * /leitores/{id}:
 *   get:
 *     summary: Busca um leitor pelo ID
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Leitor encontrado }
 *       404: { description: Leitor não encontrado }
 */
router.get('/:id', verificarToken, autorizar(STAFF), leitorController.buscarPorId);

/**
 * @swagger
 * /leitores/{id}/emprestimos:
 *   get:
 *     summary: Histórico de empréstimos de um leitor específico
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Histórico de empréstimos }
 */
router.get('/:id/emprestimos', verificarToken, autorizar(STAFF), leitorController.historicoEmprestimos);

/**
 * @swagger
 * /leitores:
 *   post:
 *     summary: Cadastra um novo leitor
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, cpf_ra]
 *             properties:
 *               nome: { type: string, example: "Maria Silva" }
 *               email: { type: string, example: "maria@email.com" }
 *               cpf_ra: { type: string, example: "12345678900" }
 *               telefone: { type: string, example: "(11) 99999-0000" }
 *               endereco: { type: string, example: "Rua das Flores, 123" }
 *               senha: { type: string, example: "opcional, padrão é o CPF/RA" }
 *     responses:
 *       201: { description: Leitor cadastrado }
 *       409: { description: E-mail ou CPF/RA já cadastrado }
 */
router.post('/', verificarToken, autorizar(STAFF), leitorController.criar);

/**
 * @swagger
 * /leitores/{id}:
 *   put:
 *     summary: Atualiza os dados de um leitor
 *     tags: [Leitores]
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
 *               nome: { type: string }
 *               email: { type: string }
 *               cpf_ra: { type: string }
 *               telefone: { type: string }
 *               endereco: { type: string }
 *               status: { type: string, enum: [Ativo, Inativo] }
 *     responses:
 *       200: { description: Leitor atualizado }
 *       404: { description: Leitor não encontrado }
 */
router.put('/:id', verificarToken, autorizar(STAFF), leitorController.atualizar);

/**
 * @swagger
 * /leitores/{id}/inativar:
 *   patch:
 *     summary: Alterna o status do leitor entre Ativo e Inativo
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Status alterado }
 *       404: { description: Leitor não encontrado }
 */
router.patch('/:id/inativar', verificarToken, autorizar(STAFF), leitorController.inativar);

/**
 * @swagger
 * /leitores/{id}:
 *   delete:
 *     summary: Exclui um leitor
 *     tags: [Leitores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Leitor deletado }
 *       404: { description: Leitor não encontrado }
 */
router.delete('/:id', verificarToken, autorizar(STAFF), leitorController.deletar);

module.exports = router;
