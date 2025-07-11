import express from 'express'
import { register } from '../controllers/auth.controller.js'
import { login } from '../controllers/auth.controller.js'
import { loginSchema, registerSchema, validate } from '../validations/validator.js'
const authRoute = express.Router()

authRoute.post('/register', validate(registerSchema),register)
authRoute.post('/login', validate(loginSchema),login)

export default authRoute
