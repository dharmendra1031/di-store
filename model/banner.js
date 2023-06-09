const mongoose = require('mongoose');
const banner = mongoose.Schema({
    image: {type:String},
    type: {type:String, default:"BANNER"}
});
module.exports = mongoose.model("banner",banner);