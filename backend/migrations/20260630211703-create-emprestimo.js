'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Emprestimos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data_emprestimo: { type: Sequelize.DATE },
      data_devolucao_prevista: { type: Sequelize.DATE },
      data_devolucao_real: { type: Sequelize.DATE },
      status: { type: Sequelize.STRING, defaultValue: 'Em aberto' },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      leitor_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Leitors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      livro_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Livros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Emprestimos');
  }
};
