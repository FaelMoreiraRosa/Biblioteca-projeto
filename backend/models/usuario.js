'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Emprestimo, {
        foreignKey: 'usuario_id',
        as: 'emprestimos_registrados'
      });
    }
  }

  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      // Administrador | Bibliotecário
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Administrador', 'Bibliotecário']]
      }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios'
  });

  return Usuario;
};
