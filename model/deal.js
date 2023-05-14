const mongoose = require('mongoose');
const deal = mongoose.Schema({
    name: {type:String},
    image: {type:String},
    description: {type:String},
    coupon:{type:String},
    link: {type:String},
    tags: {type:Array}
});
module.exports = mongoose.model("deal",deal);