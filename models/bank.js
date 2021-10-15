"use strict";
const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Bank extends Model {
        static associate(models) {}
    }

    Bank.init({
        kode: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        bank: DataTypes.STRING,
        tgl_proses: DataTypes.STRING,
        tgl_bank: DataTypes.STRING,
        jumlah: DataTypes.STRING,
        tipe: DataTypes.STRING,
        saldo: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        kode_tiket: DataTypes.INTEGER,
        terklaim: DataTypes.INTEGER,
        catatan: DataTypes.STRING,
        kode_rekening: DataTypes.STRING,
        tgl_data: DataTypes.STRING
    }, {
        sequelize,
        modelName: "data_bank",
        freezeTableName: true,
        timestamps: false,
    });

    Bank.removeAttribute("id");

    Bank.sync({
        force: false
    });

    Bank.beforeCreate((instance, option) => {});

    return Bank;
};