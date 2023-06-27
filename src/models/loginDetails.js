'use strict';
const {
  Model
} = require('sequelize');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
  class LoginDetail extends Model {
    static associate(models) {
      
    }
  }
  LoginDetail.init({
    token:{
      type:DataTypes.TEXT
    },
    userId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
    }
  }, {
    sequelize,
    updatedAt:false,
    modelName: 'LoginDetail',
  });
  return LoginDetail;
};