'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Livros', [
      {
        titulo: 'O Senhor dos Anéis',
        autor: 'J.R.R. Tolkien',
        editora: 'Martins Fontes',
        ano_publicacao: 1954,
        categoria: 'Fantasia',
        isbn: '978-8533613379',
        qtd_total: 3,
        qtd_disponivel: 3,
        status: 'Disponível',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        editora: 'Ática',
        ano_publicacao: 1899,
        categoria: 'Romance',
        isbn: '978-8508134672',
        qtd_total: 2,
        qtd_disponivel: 2,
        status: 'Disponível',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        editora: 'Alta Books',
        ano_publicacao: 2008,
        categoria: 'Tecnologia',
        isbn: '978-8576082675',
        qtd_total: 1,
        qtd_disponivel: 1,
        status: 'Disponível',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Livros', {
      isbn: ['978-8533613379', '978-8508134672', '978-8576082675']
    });
  }
};
