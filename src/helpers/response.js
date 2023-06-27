const {logger} = require('../logger/logger');

const sendResponse = (req,res,status,data,message)=>{
    logger.info(`${status} - ${message} - ${req.originalUrl} - ${req.method}`);
    return res.status(status).json({message,data})
};

const sendMessage = (req,res,status,data,message)=>{
    logger.info(`${status} - ${message} - ${req.originalUrl} - ${req.method}`);
    return res.status(status).json({status,message,data})
};

module.exports= {
    sendMessage,
    sendResponse
}
