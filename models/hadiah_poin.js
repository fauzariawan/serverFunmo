'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hadiah_poin extends Model {
    static associate(models) {
      hadiah_poin.hasOne(models.hadiah_desc,{
        foreignKey: "kode",
      })
    }
  };

  hadiah_poin.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    jml_poin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'jumlah poin tidak boleh kosong'
        }
      }
    },
    nama: DataTypes.STRING,
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'hadiah_poin',
  });
  hadiah_poin.sync({
    alter: false
  })
  hadiah_poin.removeAttribute("id");

  return hadiah_poin;
};