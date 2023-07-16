const mongoose = require('mongoose');
const categories = mongoose.Schema({
    name: {type:String},
    index: {type:Number, default:1},
});
module.exports = mongoose.model("categories",categories);