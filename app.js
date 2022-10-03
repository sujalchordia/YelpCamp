const express= require ("express");
const path= require("path");
const mongoose=require("mongoose");
const catchAsync=require("./utils/catchasync")
const ExpressError=require("./utils/ExpressError")
const Campground= require("./models/campground");
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const app = express();

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const {campgroundSchema}=require("./seeds/SCHEMAS_JOI");
const  validateSchema= (req,res,next)=>{
    const {error}= campgroundSchema.validate(req.body);

    if(error){
    const msg=error.details.map(el=>el.message).join(",");
    throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

app.listen(3000,()=>{
    console.log("i am listening");
})

app.get("/campgrounds/new",catchAsync(async (req,res)=>{
    res.render("campgrounds/new");
}))
app.post("/campgrounds",catchAsync(async (req,res)=>{
        const campground= new Campground(req.body);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

app.get("/campgrounds/:id",catchAsync(async (req,res)=>{
    const  campground= await Campground.findById(req.params.id).exec();
    res.render("campgrounds/show",{campground});
}))

app.get("/campgrounds/:id/edit",catchAsync(async (req,res)=>{
    const  campground= await Campground.findById(req.params.id).exec();
    res.render("campgrounds/edit",{campground});
}))

app.put("/campgrounds/:id",validateSchema,catchAsync(async(req,res)=>{
    const {id}= req.params;
    const campground= await Campground.findByIdAndUpdate(id,req.body);
    res.redirect("/campgrounds")
}))
app.get("/campgrounds",catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});

    res.render("campgrounds/index", {campgrounds});
}))

app.delete("/campgrounds/:id",catchAsync(async(req,res)=>{
    const {id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))
app.get("/",(req,res)=>{
    res.render("home");
})
app.all("*",(req,res,next)=>{
    next(new ExpressError("PAGE NOT FOUND",404))
})
app.use((err,req,res,next)=>{
   const{statuscode=500}=err;
   if(!err.messsage) err.messsage="oh no something went wrong";
   res.status(statuscode).render("campgrounds/error",{err});
})


