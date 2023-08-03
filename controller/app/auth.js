const user = require("../../model/user");
const store = require("../../model/store");
const deal = require("../../model/deal");

var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require("path");
require('dotenv/config');
var common = require("../../common")
var syncLoop = require('sync-loop');
const otp_buffer = require("../../model/otp_buffer");



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
            profile_image: data1.profile_image,
            notifications: data1.notifications
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

function fetch_referral_details(req,res)
{
    user.findOne({_id:req.middleware.user_id})
    .then((data1)=>{
        if(data1 == null)
        {
            res.status(404).json({
                message:"User Not Found"
            })
        }
        else
        {
            res.status(200).json({
                message:"Success",
                referral_details:{
                    referral_code: data1.referral_code,
                    referral_points: data1.referral_points,
                    referral_link: process.env.REFERRAL_LINK + data1.referral_code
                }
            })
        }
        
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    })
}

function update_notifications(req,res)
{
    var req_body = req.body;

    user.findOneAndUpdate({_id:req.middleware.user_id}, {$set:{notifications: req_body.notifications}})
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

function update_device_token(req,res)
{
    var req_body = req.body;

    user.findOneAndUpdate({_id:req.middleware.user_id}, {$set:{device_token: req_body.device_token}})
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

function send_email_otp(req,res)
{
    const req_body = req.body;
   
    user.findOne({email:req_body.email},function(err1,data1){
        if(err1)
        {
            res.json({
                status: 500,
                message: "Server Error"
            });
        }
        else if(data1==null)
        {
            res.json({
                status: 400,
                message: "Entered Email is not Registered"
            });
        }
        else
        {
            
                common.generate_otp().
                then((otp)=>{
                    common.send_otp_email(req_body.email,otp).
                    then(()=>
                    {
                        otp_buffer.findOneAndDelete({secret_id:data1._id},function (err2,data2){
                        
                            if(err2)
                            {
                                res.json({
                                    status: 500,
                                    message: "Server Error"
                                });
                            }
                            else
                            {
                                const obj = new otp_buffer({
                                    secret_id: data1._id,
                                    otp: otp,
                                    created_time: new Date()
                                });         
                                obj.save(function(err3,data3){
                                    if(err3)
                                    {
                                        res.json({
                                            status: 500,
                                            message: "Server Error"
                                        });
                                    }
                                    else
                                    {
                                        res.json({
                                            status: 200,
                                            message: "OTP Sent for Email Verification",
                                            session_id: data3._id
                                        });
                                    }
                                })
                            }
                        })
                    })
                }
                )

            
        }
        }
        );


   

}

function otp_verification_email(req,res)
{
    var req_body = req.body;
    otp_buffer.findOne({_id:req_body.session_id},function(err1,data1){
        if(err1)
        {
            res.json({
                status: 500,
                message: "Server Error"
            });
        }
        else if(data1 == null)
        {
            res.json({
                status: 400,
                message: "Session Expired, Please Retry"
            });
        }
        else
        {
            if(data1.otp == req_body.otp)
            {
            user.findOneAndUpdate({_id:data1.secret_id},{ email_verified:true}, function(err2,data2){
              
                    if(err2)
                    {
                        res.json({
                            status: 500,
                            message: "Server Error"
                        });
                    }
                    else 
                    {
                        res.json({
                            status: 200,
                            message: "Account Verify Successful"
                        });
                    }
            }).then((data)=>{
                otp_buffer.findOneAndDelete({_id:req_body.session_id},);
            })
            .catch((err)=>{
                res.json({
                    status: 500,
                    message: "Server Error"
                });
            });
            }
            else{
                res.json({
                    status: 400,
                    message: "OTP is Wrong."
                });
            }
        }
    });
}
module.exports = {
    fetch_profile, update_profile, fetch_referral_details, update_notifications, update_device_token,send_email_otp,otp_verification_email
}