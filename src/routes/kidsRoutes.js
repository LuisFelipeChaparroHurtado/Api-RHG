// kidsRoutes.js
const express = require("express");
const router = express.Router();
const kidsController = require("../controllers/kidsController");
const { authenticateToken } = require("../utils/jwtUtils");

router.get("/kids", authenticateToken, kidsController.getKids);
router.get("/findById/:id_kid", authenticateToken, kidsController.getKidById);
router.post("/create", authenticateToken, kidsController.createKid);
router.put("/update/:id_kid", authenticateToken, kidsController.updateKid);
router.delete("/delete/:id_kid", authenticateToken, kidsController.deleteKid);
router.get("/parent/:id_parent", authenticateToken, kidsController.getKidsByParent);

module.exports = router;
