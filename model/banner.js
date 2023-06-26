const mongoose = require('mongoose');
const banner = mongoose.Schema({
    image: {type:String},
    index: {type:Number, default:1}
});
module.exports = mongoose.model("banner",banner);