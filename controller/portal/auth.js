const store = require("../../model/store");
const deal = require("../../model/deal");
const country = require("../../model/country");


var fs = require('fs');
var path = require("path");
require('dotenv/config');


function create_store(req,res)
{
    var req_body=req.body;
    store.aggregate([
        {$match:{country:req_body.country}},
        {$group:{_id:null, max_index:{$max:"$index"}}}
    ])
    .then((data1)=>{
        var new_index = 1;
        if(data1.length == 0)
        {
            new_index = 1;
        }
        else
        {
            new_index = data1[0].max_index + 1;
        }
        
        const obj = new store({
            country: req_body.country,
            name: req_body.name,
            name_arabic: req_body.name_arabic,
            link: req_body.link,
            tags: req_body.tags,
            index: new_index
        })
        obj.save()
        .then((data)=>{
            res.status(200).json({
                message: "Success",
                store: data
            });
        })
        .catch((error)=>{
            res.status(500).json({
                error:error
            })
        })
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

    store.findOne({_id:req_body.store})
    .then((data1)=>{
        if(data1 == null)
        {
            res.status(404).json({message:"Store does not exists"});
        }
        else
        {
            deal.aggregate([
                {$match:{store: req_body.store}},
                {$group:{_id:null, max_index:{$max:"$index"}}}
            ])
            .then((data2)=>{
                var new_index = 1;
                if(data2.length == 0)
                {
                    new_index = 1;
                }
                else
                {
                    new_index = data2[0].max_index + 1;
                }
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
                    description_arabic: req_body.description_arabic,
                    index: new_index
                })
                obj.save()
                .then((data)=>{
                    res.status(200).json({
                        message:"Success",
                        deal: data
                    });
                })
                .catch((error)=>{
                    res.status(500).json({
                        error:error
                    })
                })
            })
            .catch((error)=>{
                res.status(500).json({
                    error:error
                })
            })
        }
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


function remove_store(req,res)
{
    var req_body = req.body;

    store.findOneAndDelete({_id: req_body.store})
    .then((data1)=>{
        deal.deleteMany({store: req_body.store})
        .then((data2)=>{
            res.status(200).json({message:"Success"});
        })
        .catch((error)=>{
            res.status(500).json({
                error:error
            })
        })
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function remove_deal(req,res)
{
    var req_body = req.body;

    deal.findOneAndDelete({_id: req_body.deal})
    .then((data2)=>{
        res.status(200).json({message:"Success"});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })        
    })
}

function create_country(req,res)
{
    var req_body = req.body;

    const obj = new country({
        name: req_body.name
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

function fetch_country(req,res)
{
    country.find({},{name:1, _id:0})
    .then((data)=>{
        res.status(200).json({message:"Success", countries:data});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })   
    })
}

module.exports = {
    create_store, create_deal, fetch_store, fetch_deal, remove_store, remove_deal, create_country, fetch_country
}