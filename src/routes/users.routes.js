import express from 'express'
import { getUser } from '../controllers/users.controller.js'

const userRoute = express.Router()

userRoute.get('/me', getUser)

export default userRoute