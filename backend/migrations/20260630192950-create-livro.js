'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Livros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: { type: Sequelize.STRING, allowNull: false },
      autor: { type: Sequelize.STRING, allowNull: false },
      editora: { type: Sequelize.STRING },
      ano_publicacao: { type: Sequelize.INTEGER },
      categoria: { type: Sequelize.STRING },
      isbn: { type: Sequelize.STRING, unique: true },
      qtd_total: { type: Sequelize.INTEGER, defaultValue: 1 },
      qtd_disponivel: { type: Sequelize.INTEGER, defaultValue: 1 },
      status: { type: Sequelize.STRING, defaultValue: 'Disponível' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Livros');
  }
};
