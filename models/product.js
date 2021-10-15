"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.operator, { foreignKey: "kode" });
      Product.hasMany(models.transaksi, {foreignKey: "kode_produk"})
    }
  }

  Product.init(
    {
      kode: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      nama: { type: DataTypes.STRING },
      harga_jual: { type: DataTypes.INTEGER },
      harga_beli: { type: DataTypes.INTEGER },
      stok: { type: DataTypes.INTEGER },
      aktif: { type: DataTypes.INTEGER },
      gangguan: { type: DataTypes.INTEGER },
      fisik: { type: DataTypes.INTEGER },
      kode_operator: { type: DataTypes.STRING },
      prefix_tujuan: { type: DataTypes.STRING },
      nominal: { type: DataTypes.INTEGER },
      kosong: { type: DataTypes.INTEGER },
      kode_hlr: {type: DataTypes.STRING },
      tanpa_kode: {type: DataTypes.INTEGER },
      harga_tetap: {type: DataTypes.INTEGER },
      kode_area: {type: DataTypes.STRING },
      catatan: {type: DataTypes.STRING },
      sms_end_user: {type: DataTypes.INTEGER },
      postpaid: {type: DataTypes.INTEGER },
      rumus_harga: {type: DataTypes.INTEGER },
      qty: {type: DataTypes.STRING },
      poin: { type: DataTypes.INTEGER },
      harga_awal: { type: DataTypes.INTEGER },
      tgl_data: { type: DataTypes.STRING },
      unit: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "produk",
      freezeTableName: true,
      timestamps: false,
    }
  );
  
  Product.removeAttribute("id");

  Product.sync({ force: false });

  Product.beforeCreate(() => {});

  return Product;
};
