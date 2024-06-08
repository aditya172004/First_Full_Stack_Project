const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate:{path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename= req.file.filename;
    // console.log(req.body);
    //there will be problem when we are sending request from hoppscoth or postman
            const newListing=new Listing(req.body.listing);
            newListing.owner=req.user._id;
            newListing.image= {url, filename};
            await newListing.save();
            req.flash("success", "New Listing Created!");
            res.redirect("/listings");
    }

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    // let {title,description,image,price,country,location}=req.body;
    // console.log(title);
    // console.log(req.body.listing);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename= req.file.filename;

    listing.image={url,filename};
    //we are forgetting a crucial step here 
//that is to save the above listing.

await listing.save();
    }
    // await Listing.findByIdAndUpdate(id,{
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     country:country,
    //     location:location,
    // });
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
