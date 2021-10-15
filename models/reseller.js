'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reseller extends Model {
    static associate(models) {
      reseller.hasMany(models.pengirim, {
        foreignKey: "kode_reseller",
        as: "pengirim",
      });

      reseller.belongsTo(models.level,{
        foreignKey: 'kode_level',
        targetKey: 'kode'
      })

      reseller.hasMany(models.markup_produk,{
        foreignKey:'kode_reseller',
        as:'markup_produk'
      })

      reseller.hasMany(models.komisi,{
        foreignKey:'kode_reseller',
        as:'komisi'
      })

      reseller.hasMany(models.reseller_data,{
        foreignKey:'kode_reseller',
        as: 'reseller_data'
      })

      reseller.hasMany(models.reseller_save,{
        foreignKey:'kode_reseller',
        as: 'reseller_save'
      })

      reseller.hasOne(models.reseller_toko,{
        foreignKey:'kode_reseller',
        as: 'reseller_toko'
      })
    }
  };

  reseller.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'Nama Tidak Boleh Kosong'
        }
      }
    },
    saldo: DataTypes.INTEGER,
    alamat: DataTypes.STRING,
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'PIN Tidak Boleh Kosong'
        }
      }
    },
    aktif: DataTypes.STRING,
    kode_upline: DataTypes.STRING,
    kode_level: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    tgl_daftar: DataTypes.STRING,
    saldo_minimal: DataTypes.INTEGER,
    tgl_aktivitas: DataTypes.DATE,
    pengingat_saldo: DataTypes.INTEGER,
    f_pengingat_saldo: DataTypes.INTEGER,
    nama_pemilik: DataTypes.STRING,
    kode_area: DataTypes.STRING,
    tgl_pengingat_saldo: DataTypes.DATE,
    markup: DataTypes.INTEGER,
    oid: DataTypes.STRING,
    poin: DataTypes.INTEGER,
    alamat_ip: DataTypes.STRING,
    password_ip: DataTypes.STRING,
    url_report: DataTypes.STRING,
    tgl_data: DataTypes.STRING,
    suspend: DataTypes.INTEGER,
    ip_no_sign: DataTypes.INTEGER,
    deleted: DataTypes.INTEGER,
    nomor_ktp: DataTypes.STRING,
    npwp: DataTypes.STRING
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'reseller',
  });
  reseller.sync({
    alter: false
  })
  reseller.removeAttribute("id");

  return reseller;
};