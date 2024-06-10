if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//While uploading in github we never upload it with .env file 
//we have our credentials there.

const express=require("express");
const app=express();
const mongoose =require("mongoose");
const Listing=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const flash=require("connect-flash");

const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" ,()=> {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions={
    store: store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

const Review=require("./models/review.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const {listingSchema,reviewSchema}=require("./schema.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}


app.listen(8080, ()=>{
    console.log(`server is listening to port 8080`);
});

app.use(session(sessionOptions));
app.use(flash());
// <----------------IMp--------------->
//THE ABOVE 2 LINES SHOULD BE WRITTEN BEFORE ROUTING WALA TWO LINES OF app.use

//ont important thing to note is that (connect-mongo) ko require karne se pehele expression 
//session ko require karna jaroori hai

//BELOW 6 LINES OF CODE IS USED TO USE PASSPORT.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes ke andar listing.js hota hai usme jitna routes likha hai use 
//sirf below line se connect kar sakte hai.

// below is a middleware which gives us flash messages
app.use((req,res,next) => {
    res.locals.success =req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
})

// app.get("/demouser", async (req,res) => {
//     let fakeUser=new User({
//         email: "student2@gmail.com",
//         username: "delta2-student"
//     })

//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.get("/",async(req,res) => {
    res.redirect("/listings");
})

/* Below is the most important thing to do in routing*/
// <--------------------IMPPPPPPPP-------------------->
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description: "by the beach",
//         price:1200,
//         location: "Calcangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//CUSTOM ERROR HANDLING MIDDLEWARES

app.use((err,req,res,next) => {
    let {status=500,message="some error occured"}=err;
    res.status(status).render("error.ejs",{message});
});
