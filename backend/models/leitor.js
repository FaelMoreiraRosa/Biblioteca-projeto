'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leitor extends Model {
    static associate(models) {
      Leitor.hasMany(models.Emprestimo, {
        foreignKey: 'leitor_id',
        as: 'emprestimos'
      });
    }
  }

  Leitor.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf_ra: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    senha: DataTypes.STRING,
    telefone: DataTypes.STRING,
    endereco: DataTypes.STRING,
    status: {
      // Ativo | Inativo
      type: DataTypes.STRING,
      defaultValue: 'Ativo'
    }
  }, {
    sequelize,
    modelName: 'Leitor',
    tableName: 'Leitors'
  });

  return Leitor;
};
