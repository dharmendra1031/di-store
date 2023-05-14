const store = require("../../model/store");
const deal = require("../../model/deal");

var fs = require('fs');
var path = require("path");
require('dotenv/config');


function create_store(req,res)
{
    var req_body=req.body;
    const obj = new store({
        name: req_body.name,
        link: req_body.link,
        tags: req_body.tags
    })
    obj.save()
    .then((data)=>{
        res.status(200).json({message:"Success"});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function create_deal(req,res)
{
    var req_body=req.body;
    const obj = new deal({
        name: req_body.name,
        link: req_body.link,
        tags: req_body.tags,
        coupon: req_body.coupon,
        description: req_body.description
    })
    obj.save()
    .then((data)=>{
        res.status(200).json({message:"Success"});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}


module.exports = {
    create_store, create_deal
}