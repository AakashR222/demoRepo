'use strict';
const {
  Model
} = require('sequelize');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
      
    }
  }
  Otp.init({
    otp:{
      type:DataTypes.SMALLINT
    },
    userId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
  },
  token:{
    type:DataTypes.TEXT
  },
  }, {
    sequelize,
    updatedAt:false,
    modelName: 'Otp',
  });
  return Otp;
};