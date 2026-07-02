const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login e cadastro de usuários do sistema
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário (Administrador, Bibliotecário ou Leitor) e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, example: admin@biblioteca.com }
 *               senha: { type: string, example: admin123 }
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Cadastra um novo usuário do sistema (Administrador ou Bibliotecário). Requer autenticação de Administrador.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha, tipo]
 *             properties:
 *               nome: { type: string, example: Maria Bibliotecária }
 *               email: { type: string, example: maria@biblioteca.com }
 *               senha: { type: string, example: senha123 }
 *               tipo: { type: string, enum: [Administrador, Bibliotecário], example: Bibliotecário }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado (somente Administrador)
 */
router.post('/registrar', verificarToken, autorizar(['Administrador']), authController.registrar);

module.exports = router;
