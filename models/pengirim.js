"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pengirim extends Model {
    static associate(models) {
      Pengirim.belongsTo(models.reseller, {
        foreignKey: "kode_reseller",
        as: "reseller",
      });
    }
  } 

  Pengirim.init(
    {
      pengirim: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      tipe_pengirim: { type: DataTypes.STRING },
      kode_reseller: { type: DataTypes.STRING },
      kirim_info: { type: DataTypes.INTEGER },
      tgl_data: { type: DataTypes.STRING },
      akses: { type: DataTypes.INTEGER }
    },
    {
      sequelize,
      modelName: "pengirim",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Pengirim.removeAttribute("id");

  Pengirim.sync({ force: false });

  Pengirim.beforeCreate((instance, option) => {});

  return Pengirim;
}