const express = require('express');
const router = express.Router();
require('dotenv/config');

const controller_auth = require("../../controller/portal/auth");


router.post("/create-deal", controller_auth.create_deal);
router.post("/create-store", controller_auth.create_store);

module.exports = router;