import express from 'express'
import mongoose from 'mongoose';
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';

const router = express.Router();

router.get('/', async (req, res)=> {
    try {
        const response = await UserModel.find({})
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})


//get list of recipe ids of logged in user that they have saved
// need to get the params, were not sending via body
router.get("/faveCrypto/ids/:userID", async (req, res)=> {
    try {
    const user = await UserModel.findById(req.params.userID)
    res.json({faveCrypto: [user?.faveCrypto]})
    } catch(err){
        res.json(err)
    }
})

// saved recipes and not the ID's
// cant pass a req.body to a get request
router.get("/faveCrypto/:userID", async (req, res)=> {
    try {
        // find the specific user whose saved recipes you want to see (all of them)
    const user = await UserModel.findById(req.params.userID)
    const fave = await UserModel.find({
       // saved recipes which id's are in the users saved recipes
       faveCrypto: [user?.faveCrypto]
    })
    res.json({fave})
    } catch(err){
        res.json(err)
    }
})

router.put("/", verifyToken,async (req, res)=> {
    try {
    const crypto = req.body.coinName
    const user = await UserModel.findById(req.body.userID)
    //pushing the recipe ID into the list of users saved recipes
    user.faveCrypto.push(crypto);
    // save changes into the user who is saving recipe
    await user.save();
    res.json({faveCrypto: user.faveCrypto})
    } catch (err) {
        res.json(err)
    }
})

router.put("/delete/", verifyToken,async (req, res)=> {
    try {
    const crypto = req.body.coinName
    const user = await UserModel.findById(req.body.userID)
    //pushing the recipe ID into the list of users saved recipes
    user.faveCrypto.splice(crypto,1)
    // save changes into the user who is saving recipe
    await user.save();
    res.json({faveCrypto: user.faveCrypto})
    } catch (err) {
        res.json(err)
    }
})

export {router as profileRouter}