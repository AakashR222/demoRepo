const express = require('express');
const routes = express.Router();
const userControllers = require('../controllers/user/index');
const createAccountSchema= require('../validations/userRegistration')
const changePasswordValidation= require('../validations/changePassword')    
const verifyOtpValidation= require('../validations/otpVerification')    
const updatPasswordValidation= require('../validations/updatePassword')    
const auth = require('../middlewares/auth');

routes.post('/signUp',createAccountSchema,userControllers.signUp)
routes.post('/signIn',userControllers.signIn)
routes.patch('/change-password',auth,changePasswordValidation,userControllers.changePassword)
routes.post('/reset-password',userControllers.resetPassword)
routes.post('/verify-otp',verifyOtpValidation,userControllers.verifyOtp)
routes.post('/update-otp',updatPasswordValidation,userControllers.updatePassword)

module.exports = routes