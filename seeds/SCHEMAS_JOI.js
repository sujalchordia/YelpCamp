const joi=require("joi");

module.exports.campgroundSchema= joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    price:joi.number().min(0),
}).required();

