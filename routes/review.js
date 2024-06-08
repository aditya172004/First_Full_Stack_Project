const express=require("express");
const router =express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
//we also need to acquire Listing because we are using it in our code.
const Listing=require("../models/listing.js");
const {isLoggedIn,isReviewAuthor, saveRedirectUrl}= require("../middleware.js");
const {listingSchema,reviewSchema}=require("../schema.js");

const reviewController=require("../controllers/reviews.js");

const validateReview=(req,res,next) => {
    // console.log(reviewSchema.validate(req.body));
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else {
        next();
    }
};

//REVIEWS

// to use routes wala technique we need to wipe out the common wala part in the links or we can say that route.

router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));

//DELETE ROUTE FOR REVIEW

router.delete("/:reviewId",isLoggedIn,validateReview,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;