import express from 'express'
import cors from 'cors'

import notFoundMiddleware from './middlewares/not-found.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

import authRoute from './routes/auth.routes.js'
import userRoute from './routes/users.routes.js'
import mangaRoute from './routes/manga.routes.js'
import animeRoute from './routes/anime.routes.js'
import newsRoute from './routes/new.routes.js'

const app = express()

app.use(cors({
  origin : 'http://localhost:5173'
}))

app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/manga',mangaRoute)
app.use('/api/anime',animeRoute)
app.use('/api/news',newsRoute)
app.use('/api/favorites',(req, res)=>{ res.send('favorites service')})


app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
