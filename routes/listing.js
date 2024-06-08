const express=require("express");
const router =express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

const {isLoggedIn,isOwner}= require("../middleware.js");
// const { index } = require("../controllers/listings.js");


const multer=require('multer');

const {storage}=require("../cloudConfig.js");
const upload=multer({ storage });




//we can also transfer this following to middleware.js
const validateListing=(req,res,next) => {
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else {
        next();
    }
};

const listingController=require("../controllers/listings.js");

//INDEX route
router.get("/",wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//  READ  ---> Show Route

router.get("/:id",wrapAsync(listingController.showListing));

//CREATE ROUTE
//for now we are not adding validate listing here.
router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
    //Edit Route
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
    
    // Update route 
    router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing));
    
        //DELETE Route
        router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

    module.exports=router;