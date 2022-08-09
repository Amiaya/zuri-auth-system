const AppError = require('../utils/appError')
const  catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const signupVal = require('../Validation/signupVal')
const loginVal = require('../Validation/loginVal')
const User = require('../models/userModel')
const {promisify} = require('util')
const crypto = require('crypto')
const sendEmail = require('../utils/email')

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })

}

const createToken= async (user, statusCode,res) => {
    const token = signToken(user._id)

    const  cookiesOptions = {
        expires: new Date( 
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN* 24* 60 *60 * 1000
        ),
        httpOnly: true
    }
    user.loggedOut = false
    await user.save({validateBeforeSave: false})

    res.cookie('jwt',token,cookiesOptions)
    user.password =  undefined
    // user.loggedOut = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signUp = catchAsync(async(req,res,next) => {
    const value = await signupVal.validateAsync(req.body)
    const Newuser = await User.create({
        name: value.name,
        email: value.email,
        password: value.password,
        confirmpassword: value.confirmpassword
    })
    createToken(Newuser,201,res)
})

exports.login = catchAsync(async(req,res,next) => {
    const value = await loginVal.validateAsync(req.body)
    if(!value.email || !value.password){
        return next(new AppError('Please provide an email and password', 400))
    }

    const user = await User.findOne({email: value.email}).select('+password')
    if(!user || ! await user.correctPassword(value.password, user.password)){
        return next(new AppError('incorrect password or username', 401))
    }
    createToken(user, 200, res)
})

exports.protect = catchAsync(async(req,res,next) => {
    let token
    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('You are not login, Please login to get access', 401))
    }
    let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)


    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError('The user belonging to this token, no longer exist',401))
    }
    console.log(currentUser)
    if(currentUser.loggedOut){
        return next( new AppError('You are not logged in, Please login to have access', 401))
    }
    // 4 check if the user change password after the token was issue
    
    if (await currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently change the password, Please login again',401))
    }
    req.user = currentUser
    next()
})

exports.restrictTo = (...roles)=>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}

exports.forgetPassword = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(new AppError('There is no user with this email', 404))
    }

    const resetToken = await user.createPasswordResetToken()

    await user.save({validateBeforeSave: false})

    const resetURL = `${req.protocol}://${req.get('host')}/auth/resetPassword/${resetToken}`

    const message = `Forgot password submit a PATCH request with your new password and confirmed password to: ${resetURL}
    .\n if you didn't forget your password, please ignore this email`


    try{
        sendEmail({
            email: user.email,
            subject: 'Your password reset token(valid for 10mins)',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    }catch(err){
        user.passwordResetToken = undefined
        user.passwordResetExpire = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError('There was an error sending the email, try again later', 500))
    }

})
exports.resetPassword = catchAsync(async (req,res,next)=>{
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpire: {$gt: Date.now()}})

    if(!user){
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password
    user.passwordConfirm  = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpire = undefined
    await user.save()

   
    createToken(user,200, res)
    
})

exports.logggedout = catchAsync(async (req,res,next) => {
    res.cookie('jwt','', {maxAge:1})
    const user = await User.findByIdAndUpdate(req.user._id,req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'successful',
        message: "You have log out succefully"
    })
})