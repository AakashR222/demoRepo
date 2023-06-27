const validateRequest  = require('./validation');
const Joi =require('joi');

module.exports = (req, res, next) =>{
  const schema = Joi.object({
    password: Joi.string().required().messages({
        'any.required':'Password is required!',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'any.required':'New password is required!',
        'string.min':'Name should 6 character long!'
    }),
  });
  validateRequest(req,schema, next);
};