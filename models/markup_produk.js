'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class markup_produk extends Model {
        static associate(models) {
            markup_produk.belongsTo(models.reseller,{
                foreignKey:'kode_reseller'
            })
        }
    };

    markup_produk.init({
        kode_reseller: DataTypes.STRING,
        kode_produk: DataTypes.STRING,
        markup: DataTypes.STRING,
        tgl_data: DataTypes.STRING,
    }, {
        timestamps: false,
        freezeTableName: true,
        sequelize,
        modelName: 'markup_produk',
    });

    markup_produk.sync({
        alter: false
    })

    markup_produk.removeAttribute("id");

    return markup_produk;
};