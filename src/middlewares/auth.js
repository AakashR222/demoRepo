const { ErrorType } = require("../constant/errorType");
const db = require("../models");
const jwt = require('jsonwebtoken')
const { appError } = require("../utils/errorHandler");
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req,res,next)=>{
    try {
      const token = req.headers.authorization?.split(' ')[1];;
    if(!token) throw new appError('Invalid authentication!',ErrorType.unauthorized);
    req.user =  await verify(token);
    next()
} catch (error) {
        next(error)
}
}

const verify =async (token)=>{
    return jwt.verify(token,SECRET_KEY,async(err,decoded)=>{
        if(!decoded) throw new appError('Invalid authentication!',ErrorType.unauthorized);
    
        if(decoded.id){
            const userLoginData = await db['LoginDetail'].findAll({
                where:{
                    userId:decoded.id
                },
                attributes:['token']
            })
            if(!userLoginData.length) throw new appError('Invalid authentication!',ErrorType.unauthorized);
            if(userLoginData.some((currData)=>currData.token === token)){
                return decoded;
            }
            throw new appError('Invalid authentication!',ErrorType.unauthorized);
        }
    })
}

