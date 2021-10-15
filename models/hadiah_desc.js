'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hadiah_desc extends Model {
    static associate(models) {
        hadiah_desc.belongsTo(models.hadiah_poin, {
            foreignKey: "kode",
        })
    }
  };

  hadiah_desc.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    h_desc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'Description Tidak Boleh Kosong'
        }
      }
    },
    h_img: DataTypes.STRING,
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'hadiah_desc',
  });
  hadiah_desc.sync({
    alter: false
  })
  hadiah_desc.removeAttribute("id");

  return hadiah_desc;
};