const store = require("../../model/store");
const deal = require("../../model/deal");

var fs = require('fs');
var path = require("path");
require('dotenv/config');


function create_store(req,res)
{
    var req_body=req.body;
    const obj = new store({
        country: req_body.country,
        name: req_body.name,
        name_arabic: req_body.name_arabic,
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
        store: req_body.store,
        name: req_body.name,
        name_arabic: req_body.name_arabic,
        link: req_body.link,
        tags: req_body.tags,
        used_times: req_body.used_times,
        last_used: req_body.last_used,
        coupon: req_body.coupon,
        description: req_body.description,
        description_arabic: req_body.description_arabic
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


function fetch_store(req,res)
{
    var req_body=req.query;
    var search = {};

    if(req_body.country == "ALL")
    {
        search = {};
    }
    else
    {
        search = {country: req_body.country};
    }

    store.find(search)
    .then((data1)=>{
        res.status(200).json({message:"Success", store:data1});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function fetch_deal(req,res)
{
    var req_body=req.query;
    
    deal.find({store: req_body.store})
    .then((data1)=>{
        res.status(200).json({message:"Success", deal:data1});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}


module.exports = {
    create_store, create_deal, fetch_store, fetch_deal
}