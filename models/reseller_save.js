"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class reseller_save extends Model {
    static associate(models) {
      reseller_save.belongsTo(models.reseller, {
        foreignKey: "kode_reseller",
        as: "reseller_save",
      });
    }
  } 

  reseller_save.init(
    {
      s_id: {type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true },
      kode_reseller: {type: DataTypes.STRING},
      nama: { type: DataTypes.STRING},
      noTelp: { type: DataTypes.STRING },
      s_stype: { type: DataTypes.STRING },
      s_createdAt: { type: DataTypes.STRING },
      s_updatedAt: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "reseller_save",
      freezeTableName: true,
      timestamps: false,
    }
  );

  reseller_save.removeAttribute("id");

  reseller_save.sync({ force: false });

  reseller_save.beforeCreate((instance, option) => {});

  return reseller_save;
}