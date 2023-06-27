const jwt = require('jsonwebtoken');
const { appError } = require('../utils/errorHandler');
const { ErrorType } = require('../constant/errorType');
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (data,option={})=>{
    return jwt.sign(data,SECRET_KEY,option);
};

const varifyToken =async (token)=>{
       return jwt.verify(token,SECRET_KEY,(err,decoded)=>{
        if(err) return err
        return decoded
       })
}

module.exports = {
    varifyToken,
    generateToken
}