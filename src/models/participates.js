'use strict';
const {
  Model
} = require('sequelize');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
  class Participate extends Model {
    static associate(models) {
      Participate.belongsTo(models.Event,{foreignKey:'eventId', as:'eventDetails'})
    }
  }
  Participate.init({
    participateId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION'
    },
    eventId: {
        type:DataTypes.INTEGER,
        references: {
          model: 'Events',
          key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
      }
  }, {
    sequelize,
    updatedAt:false,
    modelName: 'Participate',
  });
  return Participate;
};