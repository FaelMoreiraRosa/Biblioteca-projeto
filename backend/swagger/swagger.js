const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Gerenciamento de Biblioteca',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de livros, leitores, usuários do sistema e empréstimos, ' +
        'com autenticação via JWT e controle de acesso por perfil (Administrador, Bibliotecário, Leitor).'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 3000), description: 'Servidor local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);
