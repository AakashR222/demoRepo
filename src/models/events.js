'use strict';
const {
  Model
} = require('sequelize');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User,{foreignKey:'createrId',as:'createrDetails'})
    }
  }
  Event.init({
    title:{
      type:DataTypes.TEXT
    },
    createrId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
    },
    description:{
      type:DataTypes.TEXT
    }
  }, {
    sequelize,
    updatedAt:false,
    modelName: 'Event',
  });
  return Event;
};