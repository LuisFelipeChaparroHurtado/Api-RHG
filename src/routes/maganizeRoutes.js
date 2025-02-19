const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/jwtUtils");
const maganizeController = require("../controllers/maganizeController");

router.get("/listmaganizes", authenticateToken, maganizeController.getMaganize);
module.exports = router;
