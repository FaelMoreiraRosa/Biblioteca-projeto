const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento dos usuários do sistema (Administrador e Bibliotecário). Acesso exclusivo do Administrador.
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários do sistema
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuários }
 *       403: { description: Acesso negado }
 */
router.get('/', verificarToken, autorizar(['Administrador']), usuarioController.listar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Usuário não encontrado }
 */
router.get('/:id', verificarToken, autorizar(['Administrador']), usuarioController.buscarPorId);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza nome, e-mail, tipo ou senha de um usuário do sistema
 *     tags: [Usuários]
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
 *               tipo: { type: string, enum: [Administrador, Bibliotecário] }
 *               senha: { type: string }
 *     responses:
 *       200: { description: Usuário atualizado }
 *       404: { description: Usuário não encontrado }
 */
router.put('/:id', verificarToken, autorizar(['Administrador']), usuarioController.atualizar);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário do sistema
 *     tags: [Usuários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário deletado }
 *       404: { description: Usuário não encontrado }
 */
router.delete('/:id', verificarToken, autorizar(['Administrador']), usuarioController.deletar);

module.exports = router;
