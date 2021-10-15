'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        static associate(models) {
            Transaction.belongsTo(models.produk, {
                foreignKey: 'kode_produk',
            });
            Transaction.belongsTo(models.inbox, {
                foreignKey: 'kode_inbox',
                as: 'inboxes'
            });
            Transaction.belongsTo(models.reseller, {
                foreignKey: 'kode_reseller',
                as: 'reseller'
            });
        }
    };

    Transaction.init({
        kode: {
            type: DataTypes.STRING,
            autoIncrement: true,
            primaryKey: true
        },
        tgl_entri: DataTypes.STRING,
        kode_produk: DataTypes.STRING,
        tujuan: DataTypes.STRING,
        kode_reseller: DataTypes.STRING,
        pengirim: DataTypes.STRING,
        tipe_pengirim: DataTypes.STRING,
        harga: DataTypes.STRING,
        kode_inbox: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        tgl_status: DataTypes.STRING,
        kode_modul: DataTypes.INTEGER,
        kode_terminal: DataTypes.INTEGER,
        ket_modul: DataTypes.STRING,
        harga_beli: DataTypes.STRING,
        kode_jawaban: DataTypes.INTEGER,
        saldo_awal: DataTypes.STRING,
        perintah: DataTypes.STRING,
        counter: DataTypes.INTEGER,
        counter2: DataTypes.INTEGER,
        sn: DataTypes.STRING,
        modul_proses: DataTypes.STRING,
        kirim_ulang: DataTypes.INTEGER,
        penerima: DataTypes.STRING,
        qty: DataTypes.INTEGER,
        kirim_info: DataTypes.INTEGER,
        kode_area: DataTypes.STRING,
        ref_id: DataTypes.STRING,
        params: DataTypes.STRING,
        harga_beli2: DataTypes.STRING,
        is_voucher: DataTypes.INTEGER,
        komisi: DataTypes.INTEGER,
        bill_set: DataTypes.INTEGER,
        bill: DataTypes.STRING,
        keterangan: DataTypes.STRING,
        poin: DataTypes.INTEGER,
        hide_kiosk: DataTypes.INTEGER,
        unit: DataTypes.INTEGER,
        saldo_supplier: DataTypes.STRING,
    }, {
        timestamps: false,
        freezeTableName: true,
        sequelize,
        modelName: 'transaksi',
    });

    Transaction.sync({
        alter: false
    })

    Transaction.removeAttribute("id");

    return Transaction;
};