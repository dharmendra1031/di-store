const mongoose = require('mongoose');
const user = mongoose.Schema({
    email: {type:String},
    referrer:{type:String, default:null},
    referral_code: {type:String},
    referral_points:{type:Number, default:0},
    email_verified: {type:Boolean, default:false},
    phone_number: {type:String},
    country_code: {type:String},
    phone_number_verified: {type:Boolean, default:false},
    first_name: {type:String},
    last_name: {type:String},
    password: {type:String},
    country: {type:String},
    profile_image: {type:String, default:null}
});
module.exports = mongoose.model("user",user);