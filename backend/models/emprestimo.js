'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Emprestimo extends Model {
    static associate(models) {
      Emprestimo.belongsTo(models.Leitor, {
        foreignKey: 'leitor_id',
        as: 'leitor'
      });
      Emprestimo.belongsTo(models.Livro, {
        foreignKey: 'livro_id',
        as: 'livro'
      });
      Emprestimo.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'responsavel'
      });
    }
  }

  Emprestimo.init({
    data_emprestimo: DataTypes.DATE,
    data_devolucao_prevista: DataTypes.DATE,
    data_devolucao_real: DataTypes.DATE,
    status: {
      // Em aberto | Devolvido | Atrasado
      type: DataTypes.STRING,
      defaultValue: 'Em aberto'
    },
    usuario_id: DataTypes.INTEGER,
    leitor_id: DataTypes.INTEGER,
    livro_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Emprestimo',
    tableName: 'Emprestimos'
  });

  return Emprestimo;
};
