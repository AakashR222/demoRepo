const validateRequest  = require('./validation');
const Joi =require('joi');

module.exports = (req, res, next) =>{
  const schema = Joi.object({
    userId: Joi.number().required().messages({
        'any.required':'Please provide user!'
    }),
    eventId: Joi.number().required().messages({
        'any.required':'Please provide event!',
    }),
  });
  validateRequest(req,schema, next);
};