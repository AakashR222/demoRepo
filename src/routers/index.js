const express =require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const eventRoutes = require('./event');

router.use('/user',userRoutes)
router.use('/event',eventRoutes)

module.exports= router