const { ErrorType } = require("../../constant/errorType");
const { generateToken } = require("../../helpers/jwt");
const { sendResponse, sendMessage } = require("../../helpers/response");
const db = require("../../models");
const bcrypt = require('bcrypt');
const {generateString} = require('../../helpers/randomString')
const generateOtp = require('../../helpers/otp')

const { appError } = require("../../utils/errorHandler");

const signUp =async (req,res,next)=>{
    try {
        const {email, password} = req.body;
        const userData = await db['User'].findOne({
            where:{
                email
            },
            attributes:['id']
        });

        if(userData) throw new appError('Account already exist using this email',ErrorType.conflict);

        const newUser = await db['User'].create(req.body);
        return sendResponse(req,res,201,newUser,'Account created successfully!');
    } catch (error) {
        next(error)
    }
}

const signIn =async (req,res,next)=>{
    try {
        const {email, password} = req.body;
        if(!email && !password) throw new appError('Invalid email or password!',ErrorType.invalid_request);

        const userData = await db['User'].findOne({
            where:{
                email
            },
            attributes:['id','password','name'],
            include:[{
                model:db['Event'],
                as:'CreatedEvents'
            },
            {
                model:db['Participate'],
                as:'Invites',
                attributes:['id'],
                include:{
                    model:db['Event'],
                        as:'eventDetails',
                        attributes:['title'],
                        include:{
                            model:db['User'],
                            as:'createrDetails',
                            attributes:['name']
                        }
                }
            },
        ]
        });
        if(!userData) throw new appError('Account does not exists!',ErrorType.invalid_request);
        if(!bcrypt.compareSync(password,userData.password)) throw new appError('Invalid email or password!',ErrorType.invalid_request);

        const token = generateToken({id:userData.id});
        await db['LoginDetail'].create({userId:userData.id,token});

        delete userData.dataValues['password']

        return sendResponse(req,res,200,{token,userData},'Sign in successfully!');
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req,res,next)=>{
    try {
        const {newPassword,password}= req.body;
        const userData = await db['User'].findOne({where:
        {
            id:req.user.id
        },
        attributes:['password']
    })
        if(!bcrypt.compareSync(password,userData.password)) throw new appError('Invalid current password!',ErrorType.invalid_request);

        await db['User'].update({password:newPassword},{
            where:{
            id:req.user.id
            },
            individualHooks: true
        })
            sendMessage(req,res,200,'Password change successffully!')
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req,res,next)=>{
    try {
        const { email }= req.body;
        if(!email) throw new appError('Please provide email using which you have created account!',ErrorType.invalid_request)
        const userData =await db['User'].findOne({
            where:{
                email
            },
            attributes:['id']
        });
        if(!userData) throw new appError('No account found!');
        const OTP = generateOtp();
        await db['Otp'].create({otp:OTP,userId:userData.id})
        sendResponse(req,res,200,{OTP,id:userData.id},'OTP has been sended to you registerd email! OTP will valid upto 10 minutes');
    } catch (error) {
        next(error)
    }
}

const verifyOtp =  async (req,res,next)=>{
    try {
        const { id,otp }= req.body;
        const otpData =await db['Otp'].findOne({
            where:{
                otp,
                userId:id
            },
            attributes:['id']
        });
        if(!otpData) throw new appError('Invalid OTP!',ErrorType.invalid_request);
        const token = generateString()
        await db['Otp'].update({token},{
            where:{
                otp,
                userId:id,
            }
        });
        sendResponse(req,res,200,{token},'Please enter new password!');
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req,res,next)=>{
    try {
        const { password,token }= req.body;

        const otpData =await db['Otp'].findOne({
            where:{
                token
            },
            attributes:['id','userId']
        });
        if(!otpData) throw new appError('Invalid Request!',ErrorType.invalid_request);
        await db['User'].update({password},{
            where:{
                id:otpData.userId,
            },
            individualHooks: true
        });
        await db['Otp'].destroy({
            where:{
                token
            }
        });
        sendMessage(req,res,200,'Password updated successfully!');
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signUp,
    signIn,
    changePassword,resetPassword,
    resetPassword,
    verifyOtp,
    updatePassword
}