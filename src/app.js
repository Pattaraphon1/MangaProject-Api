import express from 'express'
import cors from 'cors'

import notFoundMiddleware from './middlewares/not-found.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

import authRoute from './routes/auth.routes.js'
import userRoute from './routes/users.routes.js'

const app = express()

app.use(cors({
  origin : 'http://localhost:5173'
}))

app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/manga',(req, res)=>{ res.send('manga service')})
app.use('/api/anime',(req, res)=>{ res.send('anime service')})
app.use('/api/favorites',(req, res)=>{ res.send('favorites service')})
app.use('/api/news',(req, res)=>{ res.send('anime service')})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
