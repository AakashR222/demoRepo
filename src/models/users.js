'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Participate,{foreignKey:'participateId',as:'Invites'})
      User.hasMany(models.Event,{foreignKey:'createrId',as:'CreatedEvents'})
    }
  }
  User.init({
    name:{
      type:DataTypes.STRING
    },
    email: {
      type:DataTypes.STRING
    },
    password:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks:{
      beforeCreate: async (user) => {
        if (user.password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
        }
        if (user.email) {
            user.email = user.email.toLowerCase().trim()
        }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
      }
      if (user.email) {
          delete user.email
      }
  },
    }
  },
  
  );
  return User;
};