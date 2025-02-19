// kidsRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils/jwtUtils");
const gamesController = require("../controllers/gameController");

router.get("/listgames", authenticateToken, gamesController.getGames);
module.exports = router;
