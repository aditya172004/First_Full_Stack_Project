const Listing=require("./models/listing.js");
const Review = require("./models/review.js");

const isLoggedIn=(req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log("I am in isLoggedIn");
        console.log(req.originalUrl);
        req.flash("error", "You must be Logged in to perform the operation");
        return res.redirect("/login");
    }
    next();
}


const saveRedirectUrl=(req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

const isOwner= async (req,res,next) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor= async (req,res,next) => {
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports={isLoggedIn, saveRedirectUrl,isOwner,isReviewAuthor};