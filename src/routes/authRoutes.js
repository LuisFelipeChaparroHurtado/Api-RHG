const express = require("express");
const { register, login, updateUser,getUser, getDateTrial, checkEmailExists, resetPassword, forgotPassword, updateSubscription } = require("../controllers/authController");
const { authenticateToken } = require("../utils/jwtUtils");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", authenticateToken, updateUser);
router.get("/user", authMiddleware, getUser);
router.get("/dateTrial", authenticateToken, getDateTrial);
router.put("/updateSubscription", authenticateToken, updateSubscription);

router.post("/check-email", checkEmailExists);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
