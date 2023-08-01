const mongoose = require('mongoose');
const contectUs = mongoose.Schema({
    name: {type:String},
    email: {type:String},
    mobile: {type:String},
    title:{type:String},
    message: {type:String},
});
module.exports = mongoose.model("contectUs",contectUs);