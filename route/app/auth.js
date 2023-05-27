const express = require('express');
const router = express.Router();
require('dotenv/config');

const controller_auth = require("../../controller/app/auth");

router.get("/profile", controller_auth.fetch_profile);
router.post("/update-profile", controller_auth.update_profile);

module.exports = router;