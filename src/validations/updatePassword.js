const validateRequest  = require('./validation');
const Joi =require('joi');

module.exports = (req, res, next) =>{
  const schema = Joi.object({
    password: Joi.string().required().messages({
        'any.required':'Please provide new password!'
    }),
    token: Joi.string().required().messages({
        'any.required':'Please provide token!',
    }),
  });
  validateRequest(req,schema, next);
};