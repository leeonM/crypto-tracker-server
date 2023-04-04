import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {userRouter} from './routes/users.js'
import {profileRouter} from './routes/profile.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use('/auth', userRouter)
app.use('/profile', profileRouter)
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_DB_URL)

if (PORT){
    app.listen(PORT,()=>{
        console.log(`listening on port ${PORT}`)
    })
}

export {app} 