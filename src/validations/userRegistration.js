const validateRequest  = require('./validation');
const Joi =require('joi');

module.exports = (req, res, next) =>{
  const schema = Joi.object({
    name: Joi.string().required().messages({
        'any.required':'Name is required!',
        'string':'Name should be type of string!'
    }),
    email: Joi.string().email().required().messages({
        'any.required':'Email is required!',
        'string.email':'Invalid email!'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required':'Password is required!',
        'string.min':'Name should 6 character long!'
    }),
  });
  validateRequest(req,schema, next);
};