'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mutation extends Model {
        static associate(models) {
            Mutation.belongsTo(models.reseller, {
                foreignKey: 'kode_reseller',
                as: 'reseller'
            });
            Mutation.belongsTo(models.transaksi, {
                foreignKey: 'kode_transaksi',
                as: 'transaksi'
            });
            Mutation.belongsTo(models.outbox, {
                foreignKey: 'kode_outbox',
                as: 'outbox'
            });
        }
    };

    Mutation.init({
        kode: {
            type: DataTypes.STRING,
            autoIncrement: true,
            primaryKey: true
        },
        kode_reseller: {
            type: DataTypes.STRING
        },
        tanggal: {
            type: DataTypes.STRING
        },
        jumlah: {
            type: DataTypes.STRING
        },
        keterangan: {
            type: DataTypes.STRING
        },
        kode_reseller_2: {
            type: DataTypes.STRING
        },
        jenis: {
            type: DataTypes.STRING
        },
        kode_transaksi: {
            type: DataTypes.INTEGER
        },
        kode_outbox: {
            type: DataTypes.INTEGER
        },
        saldo_akhir: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        sequelize,
        modelName: 'mutasi',
    });

    Mutation.sync({
        alter: false
    })
    Mutation.removeAttribute("id");

    return Mutation;
};