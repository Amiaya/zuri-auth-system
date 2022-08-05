const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getAllUser = catchAsync(async(req,res,next)=>{
    const user = await User.find()

    res.status(200).json({
        status: "successful",
        data: {
            user
        }
    })
})

exports.updateRole = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new AppError('No user with this Id', 401))
    }
    const value = req.body.role
    const roles = ['users','admin','staff','manager']

    if(!roles.includes(value)){
        return next(new AppError('This is not part of the role', 401))
    }

    user.role = value
    await user.save()
    res.status(201).json({
        status: "successful",
        data: {
            user
        }
    })
})

exports.staff = catchAsync(async(req,res,next)=>{

    res.status(200).json({
        status: "successful",
        message: "staff endpoint"
    })
})


exports.manager = catchAsync(async(req,res,next)=>{

    res.status(200).json({
        status: "successful",
        message: "staff endpoint"
    })
})

exports.user = catchAsync(async(req,res,next)=>{

    res.status(200).json({
        status: "successful",
        message: "user endpoint"
    })
})
