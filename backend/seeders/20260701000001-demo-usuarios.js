'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const senhaHash = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('Usuarios', [
      {
        nome: 'Administrador Geral',
        email: 'admin@biblioteca.com',
        senha: senhaHash,
        tipo: 'Administrador',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Bibliotecário Responsável',
        email: 'bibliotecario@biblioteca.com',
        senha: senhaHash,
        tipo: 'Bibliotecário',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Usuarios', {
      email: ['admin@biblioteca.com', 'bibliotecario@biblioteca.com']
    });
  }
};
