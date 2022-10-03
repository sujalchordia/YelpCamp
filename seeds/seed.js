const mongoose=require("mongoose");
const Campground= require("../models/campground");
const cities= require("./cities");
const seedhelpers= require("./seedhelpers");

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const sample= array=> array[ Math.floor(Math.random() * array.length)];

const seedDB =async()=>{
    await Campground.deleteMany();
    for(let i=0;i<50;i++){
        const temp = Math.floor(Math.random() * 1000 + 1);
        const temp2= Math.floor(Math.random() * 100 + 1);
        const camp= new Campground({
            location:`${cities[temp].city},${cities[temp].state}`,
            title: `${sample(seedhelpers.descriptors)},${sample(seedhelpers.places)} `,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium labore maiores nihil cum, soluta et suscipit, a rem voluptatum eveniet magni illum praesentium dolorum corporis est veritatis sed, ipsa vel.Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium labore maiores nihil cum, soluta et suscipit, a rem voluptatum eveniet magni illum praesentium dolorum corporis est veritatis sed, ipsa vel.",
            image:"https://source.unsplash.com/collection/483251/1600x900",
            price:`${temp2}$`
        })
        await camp.save();
}
}

seedDB();




