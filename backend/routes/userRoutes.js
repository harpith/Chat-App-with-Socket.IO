const express=require("express");
const app=express();
const { registerUser }=require("../controller/userControllers")
const userRoutes=app.Router()

userRoutes.route('/').post(registerUser)
// router.post('/login',authUser)\

module.exports=userRoutes;