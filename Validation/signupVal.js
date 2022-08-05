const Joi = require('joi')

const signupValidator = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmpassword:Joi.string().required().valid(Joi.ref('password')),
})
module.exports = signupValidator