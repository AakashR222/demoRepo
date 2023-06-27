const   express  =require("express");
const  dotevn =require('dotenv');
const  mainRouters =require('./routers/index');
const  db =require('./models/index');
const {ErrorType} = require('./constant/errorType')
const { appError } = require('./utils/errorHandler')
const  { logger } =require("./logger/logger");
const errorHandllerMiddleware = require('./middlewares/errorHelper')
dotevn.config();

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use('/api/v1',mainRouters)
app.use('*', (req, res, next) => {
    try {
        throw new appError('Path not found', ErrorType.not_found);
    } catch (error) {
        next(error)
    }
});
app.use(errorHandllerMiddleware);
const port= process.env.PORT
app.listen(port,()=>logger.info(`Server is running on port ${port}!`));