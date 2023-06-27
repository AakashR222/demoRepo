const express = require('express');
const eventControllers = require('../controllers/event/event');
const auth = require('../middlewares/auth')
const inviteValidation = require('../validations/inviteUser')
const routes = express.Router();
routes.post('/',auth,eventControllers.createEvent);
routes.patch('/:id?',auth,eventControllers.updateEvent);
routes.get('/created/:id?',auth,eventControllers.getCreated);
routes.get('/invited/:id?',auth,eventControllers.getInvited);
routes.post('/invite',[inviteValidation,auth],eventControllers.sendInvitation);

module.exports = routes