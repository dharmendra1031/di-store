const express = require('express');
const router = express.Router();
require('dotenv/config');

const controller_no_auth = require("../../controller/app/no_auth");


router.post("/signup", controller_no_auth.signup);
router.post("/login", controller_no_auth.login);
router.get("/home", controller_no_auth.fetch_home);
router.get("/brand", controller_no_auth.fetch_brands);

module.exports = router;