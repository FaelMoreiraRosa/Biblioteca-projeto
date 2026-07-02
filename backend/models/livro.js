'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Livro extends Model {
    static associate(models) {
      Livro.hasMany(models.Emprestimo, {
        foreignKey: 'livro_id',
        as: 'emprestimos'
      });
    }
  }

  Livro.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editora: DataTypes.STRING,
    ano_publicacao: DataTypes.INTEGER,
    categoria: DataTypes.STRING,
    isbn: {
      type: DataTypes.STRING,
      unique: true
    },
    qtd_total: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    qtd_disponivel: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      // Disponível | Indisponível
      type: DataTypes.STRING,
      defaultValue: 'Disponível'
    }
  }, {
    sequelize,
    modelName: 'Livro',
    tableName: 'Livros'
  });

  return Livro;
};
