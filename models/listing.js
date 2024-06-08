const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        url: String,
        filename: String,
        // type:String,
        // url:String,
        // default:"https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
        //  set:(v)=> v==="" ? "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9":v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    map_src: {
        type: String,
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

//default and set:(v) is bery important to understand.
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;