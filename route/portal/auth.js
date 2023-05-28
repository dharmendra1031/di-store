const express = require('express');
const router = express.Router();
require('dotenv/config');
const common = require("../../common");
const controller_auth = require("../../controller/portal/auth");
const multer = require("multer");
const path = require("path");
const store = require("../../model/store");
const deal = require("../../model/deal");

function upload_store_logo(req,res)
{
    var req_body = req.body;
    
    if(req.response.status == 200)
    {
        store.findOneAndUpdate({_id:req_body.store_id}, {$set:{logo: process.env.READ_FILE_URL + req.response.image_name}})
        .then((data1)=>{
            if(data1 == null)
            {
                res.status(404).json({
                    message:"Store Id does not exists"
                });
            }
            else
            {
                res.status(200).json({
                    message:"Success"
                });
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
        res.status(req.response.status).json({
            message:req.response.description
        })
    }
}


function upload_deal_image(req,res)
{
    var req_body = req.body;
    
    if(req.response.status == 200)
    {
        deal.findOneAndUpdate({_id:req_body.deal_id}, {$set:{image: process.env.READ_FILE_URL + req.response.image_name}})
        .then((data1)=>{
            if(data1 == null)
            {
                res.status(404).json({
                    message:"Deal Id does not exists"
                });
            }
            else
            {
                res.status(200).json({
                    message:"Success"
                });
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
        res.status(req.response.status).json({
            message:req.response.description
        })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var storePath = path.join(__dirname, process.env.WRITE_STORAGE_PATH);
        callback(null,storePath);
    },
    filename: (req, file, callback) => {
        let myFile = file.originalname.split(".")
		const fileType = myFile[myFile.length - 1];
  
        common.generate_name()
        .then((name)=>{
            req.response = {
                status:200,
                message:"Success",
                description:"Profile Image Updated Successfully",
                image_name:name+"."+fileType
            }       
            callback(null, name + '.' + fileType );
        })
        .catch((error)=>{
            req.response = {
                status:500,
                message:"Internal Server Error",
                description:"Error while generating name for image",
            }   
            callback(null,"Error");
        })
    }
});
const upload_file = multer({ storage: storage }).single('file');


router.post('/upload-store-logo', function(req,res,next){
    next();
}, upload_file, upload_store_logo);

router.post('/upload-deal-image', function(req,res,next){
    next();
}, upload_file, upload_deal_image);


router.post("/create-deal", controller_auth.create_deal);
router.post("/create-store", controller_auth.create_store);
router.get("/store", controller_auth.fetch_store);
router.get("/deal", controller_auth.fetch_deal);
router.post("/remove-deal", controller_auth.remove_deal);
router.post("/remove-store", controller_auth.remove_store);
router.post("/create-country", controller_auth.create_country);
router.get("/country", controller_auth.fetch_country);

module.exports = router;