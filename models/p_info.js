'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class p_info extends Model {
    static associate(models) {
    }
  };

  p_info.init({
    code_info: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name_info: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: 'Name info Tidak Boleh Kosong'
        }
      }
    },
    img_info: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: false,
                msg: 'Name Info Tidak Boleh Kosong'
            }
        }
    },
    desc_info: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: false,
                msg: 'Desc Info Tidak Boleh Kosong'
            }
        }
    },
    content_info: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: false,
                msg: 'Link Info Tidak Boleh Kosong'
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
    modelName: 'p_info',
  });
  p_info.sync({
    alter: false
  })
  p_info.removeAttribute("id");

  return p_info;
};