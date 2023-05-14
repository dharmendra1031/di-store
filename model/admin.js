const mongoose = require('mongoose');
const admin = mongoose.Schema({
    email: {type:String},
    first_name: {type:String},
    last_name: {type:String},
    password: {type:String}
});
module.exports = mongoose.model("admin",admin);