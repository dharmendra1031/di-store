const user = require("../../model/user");
const store = require("../../model/store");
const deal = require("../../model/deal");
const country = require("../../model/country");
const banner = require("../../model/banner");


var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require("path");
require('dotenv/config');
const private_key  = fs.readFileSync(path.join(__dirname,'../../keys/private.key'), 'utf8');
var syncLoop = require('sync-loop');

async function generate_token(user_id)
{
    return new Promise((resolve,reject)=>{
        
        var payload={
            user_id:user_id
        }

        var sign_options = {
            issuer:  process.env.ISSUER,
            subject: process.env.SUBJECT,
            audience:  process.env.AUDIENCE,
            expiresIn:  process.env.EXPIRESIN,
            algorithm: process.env.ALGORITHM
        };
    
        jwt.sign(payload, private_key, sign_options,function(err,token){
            if(err)
                reject({status:403, response:{error:"Failed generating token"}});
            else
                resolve(token);
        });       
    })
}


async function create_user(input)
{
    return new Promise((resolve,reject)=>{
        const obj = new user(input);
        obj.save()
        .then((data2)=>{
            generate_token(data2._id)
            .then((token)=>{
                resolve({
                    status:200,
                    response:{
                        token: token,
                        user_id: data2._id
                    }
                })
            })
            .catch((error)=>{
                reject({
                    status:500,
                    response:{error:error}
                })
            })
        })
        .catch((error)=>{
            reject({
                status:500,
                response:{error:error}
            })
        })
    })
}


function signup(req,res)
{
    var req_body=req.body;

    if(req_body.email != null)
    {
        user.findOne({email:req_body.email})
        .then((data1)=>{
            if(data1 == null)
            {   
                create_user({
                    country_code: null,
                    phone_number: null,
                    email: req_body.email,
                    email_verified: false,
                    phone_number_verified: false,
                    first_name: req_body.first_name,
                    last_name: req_body.last_name,
                    password: req_body.password,
                    country: req_body.country
                })
                .then((data)=>{
                    res.status(200).json(data.response);
                })
                .catch((error)=>{
                    res.status(error.status).json(error.response);
                })
            }
            else
            {
                res.status(400).json({
                    message: "Email already registered"
                })
            }
        })
        .catch((error)=>{
            res.status(500).json({
                error:error
            })
        })
    }
    else
    {
        if(req_body.country_code == null || req_body.phone_number == null)
        {
            res.status(400).json({
                message: "Email and Phone Number both cannot be null"
            })
        }   
        else
        {
            user.findOne({country_code:req_body.country_code, phone_number:req_body.phone_number})
            .then((data1)=>{
                if(data1 == null)
                {   
                    create_user({
                        country_code: req_body.country_code,
                        phone_number: req_body.phone_number,
                        email: null,
                        email_verified: false,
                        phone_number_verified: true,
                        first_name: req_body.first_name,
                        last_name: req_body.last_name,
                        password: null
                    })
                    .then((data)=>{
                        res.status(200).json(data.response);
                    })
                    .catch((error)=>{
                        res.status(error.status).json(error.response);
                    })
                }
                else
                {
                    res.status(400).json({
                        message: "Phone Number already registered"
                    })
                }
            })
            .catch((error)=>{
                res.status(500).json({
                    error:error
                })
            })
        }
    }
    
}

function login(req,res)
{
    var req_body = req.body;

    if(req_body.email != null)
    {
        user.findOne({email:req_body.email})
        .then((data1)=>{
            if(data1 == null)
            {
                res.status(400).json({
                    message:"Email is not registered"
                })
            }
            else
            {
                if(data1.password == req_body.password)
                {
                    generate_token(data1._id)
                    .then((token)=>{
                        res.status(200).json({
                            token:token,
                            user_id: data1._id
                        })
                    })
                    .catch((error)=>{
                        res.status(error.status).json(error.response);
                    })
                }
                else
                {
                    res.status(400).json({
                        message:"Entered password is incorrect"
                    })
                }
            }
        })
        .catch((error)=>{
            res.status(500).json({
                error:error
            })
        })
    }
    else
    {
        if(req_body.country_code == null || req_body.phone_number == null)
        {
            res.status(400).json({
                message: "Email and Phone Number both cannot be null"
            })
        }   
        else
        {
            user.findOne({country_code:req_body.country_code, phone_number:req_body.phone_number})
            .then((data1)=>{
                if(data1 == null)
                {
                    res.status(400).json({
                        message:"Phone Number is not registered"
                    })
                }
                else
                {
                    generate_token(data1._id)
                    .then((token)=>{
                        res.status(200).json({
                            token:token,
                            user_id: data1._id
                        })
                    })
                    .catch((error)=>{
                        res.status(error.status).json(error.response);
                    })
                }
            })
            .catch((error)=>{
                res.status(500).json({
                    error:error
                })
            })
        }
    }    
}


function fetch_home(req,res)
{
    var search = {country: req.query.country};
    var temp_store_ids = [];

    store.find(search)
    .sort({index:0})
    .then((data1)=>{
        var numberOfLoop = data1.length;

        syncLoop(numberOfLoop, function(loop1){
            var index1 = loop1.iteration();
            temp_store_ids.push((data1[index1]._id).toString());
            loop1.next();
        },function(){

            deal.find({store:{$in:temp_store_ids}})
            .sort({index:0})
            .then((data2)=>{
                res.status(200).json({message:"Success", stores:data1, deals:data2});
            })
            .catch((error)=>{
                res.status(500).json({
                    error:error
                })
            })
        })
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function fetch_banner(req,res)
{    
    banner.findOne({type: "BANNER"})
    .then((data1)=>{
        res.status(200).json({message:"Success", banner:data1});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}


function fetch_brands(req,res)
{
    var req_body=req.query;
    var search = {country: req_body.country};

    store.find(search)
    .sort({index:0})
    .then((data1)=>{ 
        res.status(200).json({message:"Success", brands:data1});
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function fetch_deals(req,res)
{
    var search = {country: req.query.country};
    var temp_store_ids = [];

    store.find(search)
    .then((data1)=>{
        var numberOfLoop = data1.length;

        syncLoop(numberOfLoop, function(loop1){
            var index1 = loop1.iteration();
            temp_store_ids.push((data1[index1]._id).toString());
            loop1.next();
        },function(){
            deal.find({store:{$in:temp_store_ids}})
            .sort({index:0})
            .then((data2)=>{
                res.status(200).json({message:"Success", deals:data2});
            })
            .catch((error)=>{
                res.status(500).json({
                    error:error
                })
            })
        })
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function fetch_file(req,res)
{
    res.sendFile(path.join(__dirname + process.env.READ_STORAGE_PATH + "/" + req.params.file));
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
    signup, login, fetch_home, fetch_brands, fetch_deals, fetch_file, fetch_country, fetch_banner
}