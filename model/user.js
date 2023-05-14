const mongoose = require('mongoose');
const user = mongoose.Schema({
    email: {type:String},
    first_name: {type:String},
    last_name: {type:String},
    password: {type:String}
});
module.exports = mongoose.model("user",user);