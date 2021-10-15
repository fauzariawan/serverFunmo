'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      
    }
  };

  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    kode_reseller: DataTypes.STRING,
    text_reseller: DataTypes.STRING,
    text_cs: DataTypes.STRING,
    tgl_reseller_ngirim: DataTypes.DATE,
    tgl_cs_ngirim: DataTypes.DATE,
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'chat',
  });
  Chat.sync({
    alter: false
  })
  return Chat;
};