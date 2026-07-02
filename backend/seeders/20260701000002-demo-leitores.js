'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const senhaHash = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('Leitors', [
      {
        nome: 'Ana Souza',
        cpf_ra: '11122233344',
        email: 'ana.souza@aluno.com',
        senha: senhaHash,
        telefone: '(11) 98888-1111',
        endereco: 'Rua das Acácias, 100',
        status: 'Ativo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Bruno Lima',
        cpf_ra: '55566677788',
        email: 'bruno.lima@aluno.com',
        senha: senhaHash,
        telefone: '(11) 98888-2222',
        endereco: 'Av. das Palmeiras, 200',
        status: 'Ativo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Leitors', {
      email: ['ana.souza@aluno.com', 'bruno.lima@aluno.com']
    });
  }
};
