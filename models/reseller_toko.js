"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class reseller_toko extends Model {
    static associate(models) {
      reseller_toko.belongsTo(models.reseller, {
        foreignKey: "kode_reseller",
        as: "reseller_toko",
      });
    }
  } 

  reseller_toko.init(
    {
      kode_reseller: {type: DataTypes.STRING,primaryKey: true},
      nama_toko: {type: DataTypes.STRING},
      alamat_toko: { type: DataTypes.STRING},
      tipe_toko: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.STRING },
      updatedAt: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "reseller_toko",
      freezeTableName: true,
      timestamps: false,
    }
  );

  reseller_toko.removeAttribute("id");

  reseller_toko.sync({ force: false });

  reseller_toko.beforeCreate((instance, option) => {});

  return reseller_toko;
}