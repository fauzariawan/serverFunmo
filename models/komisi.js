'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Komisi extends Model {
    static associate(models) {
      // Komisi.belongsTo(models.reseller, {
      //   foreignKey: 'kode_reseller',
      //   as: 'reseller'
      // });
      // Komisi.belongsTo(models.transaksi, {
      //   foreignKey: 'kode_transaksi',
      //   as: 'transaksi'
      // });
      Komisi.belongsTo(models.transaksi, {
        foreignKey: 'kode_transaksi',
        as: 'transaksi'
      });
      Komisi.belongsTo(models.reseller,{
        foreignKey: 'kode_reseller',
        as: 'komisi'
      })
    }
  };

  Komisi.init({
    kode_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    kode_reseller: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    tukar: DataTypes.INTEGER
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'komisi',
  });

  Komisi.removeAttribute("id");

  Komisi.sync({ force: false });

  Komisi.beforeCreate((instance, option) => {});

  return Komisi;
}
