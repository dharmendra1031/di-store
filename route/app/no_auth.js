const express = require('express');
const router = express.Router();
require('dotenv/config');

const controller_no_auth = require("../../controller/app/no_auth");


router.post("/signup", controller_no_auth.signup);
router.post("/login", controller_no_auth.login);
router.get("/home", controller_no_auth.fetch_home);
router.get("/brand", controller_no_auth.fetch_brands);
router.get("/deals", controller_no_auth.fetch_deals);
router.get("/file/:file", controller_no_auth.fetch_file)
router.get("/country", controller_no_auth.fetch_country);
router.get("/banner", controller_no_auth.fetch_banner);
router.get("/all-deals", controller_no_auth.fetch_all_deal);

module.exports = router;