const user = require("../../model/user");
const store = require("../../model/store");
const deal = require("../../model/deal");

var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require("path");
require('dotenv/config');

var syncLoop = require('sync-loop');



function fetch_profile(req,res)
{
    user.findOne({_id:req.middleware.user_id})
    .then((data1)=>{
        res.status(200).json({message:"Success", profile:{
            email: data1.email,
            email_verified: data1.email_verified,
            phone_number: data1.phone_number,
            country_code: data1.country_code,
            phone_number_verified: data1.phone_number_verified,
            first_name: data1.first_name,
            last_name: data1.last_name,
            country: data1.country,
            profile_image: data1.profile_image
        }});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function update_profile(req,res)
{
    var req_body = req.body;
    user.findOneAndUpdate({_id:req.middleware.user_id}, {$set:{first_name: req_body.first_name, last_name: req_body.last_name, country:req_body.country}})
    .then((data1)=>{
        res.status(200).json({
            message:"Success"
        });
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}


module.exports = {
    fetch_profile, update_profile
}