const express= require("express");
const router =express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");


const userController=require("../controllers/users.js");
router.get("/signup",userController.renderSignUp);

router.post("/signup" ,wrapAsync(userController.signup));


router.get("/login",userController.renderLogIn);

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect: "/login", failureFlash:true }),wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports=router;