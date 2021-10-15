'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class p_banner extends Model {
    static associate(models) {
    }
  };

  p_banner.init({
    code_banner: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name_banner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'Name Banner Tidak Boleh Kosong'
        }
      }
    },
    img_banner: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: false,
                msg: 'Name Banner Tidak Boleh Kosong'
            }
        }
    },
    desc_banner: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: false,
                msg: 'Desc Banner Tidak Boleh Kosong'
            }
        }
    },
    link_banner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
              args: false,
              msg: 'Link Banner Tidak Boleh Kosong'
          }
      }
  },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'p_banner',
  });
  p_banner.sync({
    alter: false
  })
  p_banner.removeAttribute("id");

  return p_banner;
};