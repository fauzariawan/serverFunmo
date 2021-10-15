'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tiket_deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tiket_deposit.hasOne(models.tiket_response,{foreignKey:'kode_tiketdeposit'})
      tiket_deposit.belongsTo(models.inbox, {
        foreignKey: 'kode'
      });
      tiket_deposit.belongsTo(models.inbox, {
        foreignKey: 'kode_inbox',
        as: 'inboxes'
      });
      tiket_deposit.belongsTo(models.data_bank, {
        foreignKey: 'kode_data_bank',
        as: 'bank'
      });
      tiket_deposit.belongsTo(models.reseller, {
        foreignKey: 'kode_reseller',
        as: 'reseller'
      });
      tiket_deposit.belongsTo(models.transaksi, {
        foreignKey: 'id_transaksi',
        as: 'transaksi'
      });
    }
  };

  tiket_deposit.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    waktu: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    status: DataTypes.STRING,
    tgl_status: DataTypes.STRING,
    kode_inbox: DataTypes.STRING,
    kode_data_bank: DataTypes.STRING,
    kode_reseller: DataTypes.STRING,
    kode_pembayaran: DataTypes.STRING,
    wrkirim: DataTypes.STRING,
    id_transaksi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tiket_deposit',
    freezeTableName: true,
    timestamps: false
  });

  tiket_deposit.sync({
    alter: false
  })

  tiket_deposit.removeAttribute('id')

  return tiket_deposit;
};