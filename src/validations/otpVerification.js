const validateRequest  = require('./validation');
const Joi =require('joi');

module.exports = (req, res, next) =>{
  const schema = Joi.object({
    id: Joi.string().required().messages({
        'any.required':'Id is required!'
    }),
    otp: Joi.string().min(4).max(4).required().messages({
        'any.required':'New password is required!',
        'string.min':'OTP should 4 digit long!',
        'string.max':'OTP should 4 digit long!'
    }),
  });
  validateRequest(req,schema, next);
};