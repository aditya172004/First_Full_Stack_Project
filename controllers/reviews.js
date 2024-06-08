const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async (req,res)=> {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    //as we know that req.body.review is an object.
    let newReview=new Review(req.body.review);

    //whenever we are creating a new Review 
    // hume author ko add karna hai newReview mein.
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview=async (req,res)=>{
    // console.log("hi review");
    let {id,reviewId}=req.params;
    // console.log(id);
    // console.log(res.locals.redirectUrl);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);

};