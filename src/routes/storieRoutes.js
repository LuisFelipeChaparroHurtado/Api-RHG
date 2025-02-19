// kidsRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/jwtUtils");
const { getStories } = require("../controllers/storieController");

router.get("/liststorie", getStories);
module.exports = router;
