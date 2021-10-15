"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    static associate(models) {
      Operator.hasMany(models.produk, {
        foreignKey: "kode_operator",
        as: "products",
      });
    }
  }

  Operator.init(
    {
      kode: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      nama: { type: DataTypes.STRING },
      prefix_tujuan: { type: DataTypes.STRING },
      prefix_tujuan: { type: DataTypes.STRING },
      gangguan: { type: DataTypes.INTEGER },
      kosong: { type: DataTypes.INTEGER },
      regex_tujuan: { type: DataTypes.STRING },
      kode_hlr: { type: DataTypes.STRING },
      panjang_maks: { type: DataTypes.INTEGER },
      panjang_min: { type: DataTypes.INTEGER },
      prioritas: { type: DataTypes.INTEGER },
      format_sukses: { type: DataTypes.STRING },
      kode_level: { type: DataTypes.STRING },
      kode_area: { type: DataTypes.STRING },
      catatan: { type: DataTypes.STRING },
      auto_succ: { type: DataTypes.INTEGER },
      par_balas: { type: DataTypes.STRING },
      apk_ikon: { type: DataTypes.STRING },
      struk_path: { type: DataTypes.STRING },
      struk_regex: { type: DataTypes.STRING },
      tgl_data: { type: DataTypes.STRING },
      cutoff_awal: { type: DataTypes.STRING },
      cutoff_akhir: { type: DataTypes.STRING },
      cutoff_ket: { type: DataTypes.STRING },
      struk_auto_cetak: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "operator",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Operator.removeAttribute("id");

  Operator.sync({ force: false });

  Operator.beforeCreate(() => {});

  return Operator;
};
