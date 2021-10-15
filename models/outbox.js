"use strict";
const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Outbox extends Model {
    static associate(models) {}
  }

  Outbox.init({
    kode: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },
    tgl_entri: {
      type: DataTypes.STRING
    },
    penerima: {
      type: DataTypes.STRING
    },
    tipe_penerima: {
      type: DataTypes.STRING
    },
    pesan: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.INTEGER
    },
    tgl_status: {
      type: DataTypes.STRING
    },
    kode_inbox: {
      type: DataTypes.INTEGER
    },
    kode_transaksi: {
      type: DataTypes.INTEGER
    },
    kode_reseller: {
      type: DataTypes.STRING
    },
    bebas_biaya: {
      type: DataTypes.INTEGER
    },
    is_perintah: {
      type: DataTypes.INTEGER
    },
    kode_modul: {
      type: DataTypes.INTEGER
    },
    prioritas: {
      type: DataTypes.INTEGER
    },
    modul_proses: {
      type: DataTypes.STRING
    },
    pengirim: {
      type: DataTypes.STRING
    },
    kode_terminal: {
      type: DataTypes.INTEGER
    },
    ctr_kirim: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: "outbox",
    freezeTableName: true,
    timestamps: false,
  });

  Outbox.removeAttribute("id");

  Outbox.sync({
    force: false
  });

  Outbox.beforeCreate((instance, option) => {});

  return Outbox;
};