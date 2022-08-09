const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    confirmpassword: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ['users','admin','staff','manager'],
        default: 'users'
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    loggedOut:{
        type: Boolean,
        default: true
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmpassword = undefined
    next()
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangeAt = Date.now() - 1000
    next()
})
userSchema.methods.correctPassword = async function(canidatePassword, userPassowrd){
    return await bcrypt.compare(canidatePassword, userPassowrd)
}

userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
    if(this.passwordChangeAt){
        const changeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)
        return JWTTimestamp < changeTimestamp
    }
}
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex') 
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}
const User = mongoose.model('User',userSchema)
module.exports = User