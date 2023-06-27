const Joi = require('joi'); 
const {ErrorType} = require('../constant/errorType');
const {appError} = require('../utils/errorHandler')
module.exports = (req,schema,next)=>{
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
      };
      
      const { error, value } = schema.validate(req.body, options); 
      if(!error) return next()
      throw new appError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, ErrorType.invalid_request);
}