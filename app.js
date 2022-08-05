const express =  require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const errorController = require('./controller/errorController')
const userRouter = require('./routes/user')
const app = express()

app.use(express.json())
app.use(morgan('dev'))


app.use('/auth', userRouter)

app.all('*', (req,res,next) => {
     next(new AppError(`Can't find ${req.originalUrl} on this server`,400))
})


app.use(errorController)

module.exports = app