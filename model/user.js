const mongoose = require('mongoose');
const user = mongoose.Schema({
    email: {type:String},
    email_verified: {type:Boolean, default:false},
    phone_number: {type:String},
    country_code: {type:String},
    phone_number_verified: {type:Boolean, default:false},
    first_name: {type:String},
    last_name: {type:String},
    password: {type:String},
    country: {type:String}
});
module.exports = mongoose.model("user",user);