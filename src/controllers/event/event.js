const { ErrorType } = require("../../constant/errorType");
const { sendResponse, sendMessage } = require("../../helpers/response");
const db = require("../../models");
const { Op } = require('sequelize')

const { appError } = require("../../utils/errorHandler");

const createEvent =async (req,res,next)=>{
    try {
        const {title} = req.body;
        if(!title) throw new appError('Please provide event title!',ErrorType.invalid_request);

        const newEvent = await db['Event'].create({...req.body,createrId:req.user.id});
        return sendResponse(req,res,201,newEvent,'Event created successfully!');
    } catch (error) {
        next(error)
    }
}

const updateEvent =async (req,res,next)=>{
    try {
        if(!req.params.id) throw new appError('Please provide event id!',ErrorType.invalid_request);
        const eventData =   await db['Event'].findOne({
            where:{
                id:req.params.id
            },
            attributes:['id','createrId']
        });

        if(!eventData) throw new appError("Event does now exists!");
        if(req.user.id !== eventData.createrId) throw new appError("You can not manipulate other user's event!");
        delete req.body['createrId']
        await db['Event'].update(req.body,{
            where:{
                createrId: req.user.id,
                id:req.params.id
            }
        });

        return sendMessage(req,res,200,'Event updated successfully!');
    } catch (error) {
        next(error)
    }
}

const getInvited = async (req,res,next)=>{
    try {
        const eventInclude ={
                    model:db['Event'],
                    as:'eventDetails',
                    attributes:['title','id'],
                    include:{
                        model:db['User'],
                        as:'createrDetails',
                        attributes:['name']
                    },
                    
                };
        
        const fetchQuery = {
            order: [
                [{model: db['Event'], as: 'eventDetails'},req.query?.sortBy || 'id',req.query?.order || 'ASC'],
            ],
            include:eventInclude
        };
          // specific single data
          if(req.params?.id){
            const eventData =  req.fetch = await db['Participate'].findOne({
                where:{
                    eventId:req.params.id,
                    participateId:req.user.id
                },
                ...fetchQuery
            });
            return sendResponse(req,res,200,eventData,'Fetch successfully!');
        }
      
        if(req.query?.limit && req.query?.page){
            fetchQuery.limit = req.query.limit;
            fetchQuery.offset = (req.query.page - 1) * req.query.limit
        }

        //title filter
        if(req.query?.title){
            eventInclude.where = {
                title:{
                    [Op.iLike]:`%${req.query.title}%`
            }
        }};

        // date filter
        if(req.query?.date){
            eventInclude.where = {
                ...eventInclude.where, 
                createdAt:req.query?.date
        }};
    
        const created = await db['Participate'].findAll(fetchQuery);
        return sendResponse(req,res,200,created,'Fetch successfully!');
    } catch (error) {
        next(error)
    }
}

const getCreated = async (req,res,next)=>{
    try {

          // specific single data
          if(req.params?.id){
            const eventData =  req.fetch = await db['Event'].findOne({
                where:{
                    id:req.params.id,
                    createrId:req.user.id
                }
            });
            return sendResponse(req,res,200,eventData,'Fetch successfully!');
        }
        
        const fetchQuery = {
            order: [
                [req.query?.sortBy || 'id',req.query?.order || 'ASC'],
            ]
        };
      
        if(req.query?.limit && req.query?.page){
            fetchQuery.limit = req.query.limit;
            fetchQuery.offset = (req.query.page - 1) * req.query.limit
        }

        //title filter
        if(req.query?.title){
            fetchQuery.where = {
                ...fetchQuery.where, 
                title:{
                    [Op.iLike]:`%${req.query.title}%`
            }
        }};

        // date filter
        if(req.query?.date){
            fetchQuery.where = {
                ...fetchQuery.where, 
                createdAt:req.query?.date
        }};
    
        const created = await db['Event'].findAll(fetchQuery);
        return sendResponse(req,res,200,created,'Fetch successfully!');
    } catch (error) {
        next(error)
    }
}

const sendInvitation = async (req,res,next)=>{
    try {
        const {eventId,userId} = req.body;
        const isInvited = await db['Participate'].findOne({
            where:{
                participateId:userId,
                eventId
            },
            attributes:['id'],
            include:[
                {
                    model:db['Event'],
                    as:'eventDetails',
                    attributes:['title']
                }
            ]
        })
        if(isInvited) throw new appError(`User is already invited in ${isInvited.eventDetails.title}`,ErrorType.conflict)

        const newEvent = await db['Participate'].create({   
            participateId:userId,
            eventId
        });
        return sendResponse(req,res,201,newEvent,'Event created successfully!');
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createEvent,
    updateEvent,
    getInvited,
    getCreated,
    sendInvitation
}