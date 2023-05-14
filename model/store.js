const mongoose = require('mongoose');
const store = mongoose.Schema({
    name: {type:String},
    logo: {type:String},
    link: {type:String},
    tags: {type:Array}
});
module.exports = mongoose.model("store",store);