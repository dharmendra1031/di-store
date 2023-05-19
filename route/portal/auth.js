const express = require('express');
const router = express.Router();
require('dotenv/config');

const controller_auth = require("../../controller/portal/auth");


router.post("/create-deal", controller_auth.create_deal);
router.post("/create-store", controller_auth.create_store);
router.get("/store", controller_auth.fetch_store);
router.get("/deal", controller_auth.fetch_deal);

module.exports = router;