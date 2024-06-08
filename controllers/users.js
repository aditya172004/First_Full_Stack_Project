const User=require("../models/user.js");

module.exports.renderSignUp=(req,res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLogIn=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup=async (req,res) =>{
    let {username,email,password} =req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err) =>{
        if(err){
            return next(err);
        }
        //we want ki jese hi user sign up kar de woh automatic logged in ho jaye.
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
    });
};


module.exports.login=async (req,res) => {
    // console.log("I am in post route of login ");
req.flash("success","Welcome back to Wanderlust! ");
//after calling of passport.authenticate
//passport req.session me se redirectUrl ko delete kar dega
// console.log(res.locals.redirectUrl);
let redirectUrl=res.locals.redirectUrl || "/listings";
if(redirectUrl.slice(redirectUrl.length-1)==="E"){
    res.redirect("/listings");
}
res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out now!");
        res.redirect("/listings");
    })
};