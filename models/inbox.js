"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class inbox extends Model {
    static associate(models) {
      inbox.hasOne(models.tiket_deposit,{
        foreignKey:'kode_inbox',
      })
    }
  }

  inbox.init(
    {
      kode: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tgl_entri: { type: DataTypes.STRING },
      penerima: { type: DataTypes.STRING },
      pengirim: { type: DataTypes.STRING },
      tipe_pengirim: { type: DataTypes.STRING },
      pesan: { type: DataTypes.STRING },
      status: { type: DataTypes.INTEGER },
      kode_terminal: { type: DataTypes.STRING },
      tgl_status: { type: DataTypes.STRING },
      kode_reseller: { type: DataTypes.STRING },
      kode_transaksi: { type: DataTypes.INTEGER },
      is_jawaban: { type: DataTypes.STRING },
      is_cs: { type: DataTypes.INTEGER },
      kode_jawaban_cs: { type: DataTypes.INTEGER },
      service_center: { type: DataTypes.STRING },
      hash: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "inbox",
      freezeTableName: true,
      timestamps: false,
    }
  );

  inbox.removeAttribute("id");

  inbox.sync({ force: false });

  inbox.beforeCreate((instance, option) => {});

  return inbox;
};
