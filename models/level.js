'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class level extends Model {
    static associate(models) {
      level.hasMany(models.reseller,{
        foreignKey:'kode_level',
        sourceKey:'kode',
      })
    }
  };

  level.init({
    kode: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nama: DataTypes.STRING,
    selisih_harga: DataTypes.INTEGER,
    kode_upline: DataTypes.STRING,
    bonus: DataTypes.INTEGER,
    jumlah_ym: DataTypes.INTEGER,
    jumlah_sms: DataTypes.INTEGER,
    keterangan: DataTypes.STRING,
    blok_produk: DataTypes.STRING,
    deposit_minimal: DataTypes.INTEGER,
    sms_end_user: DataTypes.INTEGER,
    default_markup: DataTypes.INTEGER,
    par_balas: DataTypes.STRING,
    poin_trx: DataTypes.STRING,
    no_komisi: DataTypes.INTEGER,
    transfer_lintas: DataTypes.INTEGER,
    deposit_maksimal: DataTypes.INTEGER,
    max_pakai: DataTypes.INTEGER,
    guna_poin_produk: DataTypes.INTEGER,
    tgl_data: DataTypes.STRING,
    no_ubah_markup: DataTypes.STRING,
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'level',
  });

  level.sync({
    alter: false
  })

  return level
}