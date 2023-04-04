import express  from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/Users.js';
import dotenv from 'dotenv'

const router = express.Router();

router.post('/register', async (req, res) =>{
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});

    if(user){
        return res.json({message: 'username already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = UserModel({username, password: hashedPassword})
    newUser.save();
    res.json({message: 'new user has been saved successfully'});
})

router.post('/login', async (req, res) =>{
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});

    if (!user){
        return res.json({message: 'user does not exist'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid){
     return res.json({message: 'username or password is incorrect'});
    }

    const token = jwt.sign({id: user._id}, process.env.SECRET)
    //send back this token
    res.json({token, userID: user._id})
})

router.get("/users/:userID", async (req, res)=> {
    try {
    const user = await UserModel.findById(req.params.userID)
    // send back saved recipes ? for if there are none
    res.json({faveCrypto: user?.faveCrypto})
    } catch(err){
        res.json(err)
    }
})

// saved recipes and not the ID's
// cant pass a req.body to a get request
router.get("/users/:userID", async (req, res)=> {
    try {
        // find the specific user whose saved recipes you want to see (all of them)
    const user = await UserModel.findById(req.params.userID)
    const savedCrypto = await UserModel.find({
       // saved recipes which id's are in the users saved recipes
        _id: {$in: user.faveCrypto},
    })
    res.json({savedCrypto})
    } catch(err){
        res.json(err)
    }
})

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err)=>{
            if (err) return res.sendStatus(403)
            next()
        })
    } else {
        res.sendStatus(401);
    }
}

router.get('/user/:username', verifyToken, async (req,res)=>{
    try {
        const profile = await UserModel.findOne({username: req.params.username})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
    }
})


export {router as userRouter};

//middleware to verify every request that you're logged in to be authorised

