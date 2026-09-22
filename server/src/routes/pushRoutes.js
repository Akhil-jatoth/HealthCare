const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getPublicKey, saveSubscription } = require("../controllers/pushController");

const router = express.Router();

router.get("/public-key", getPublicKey);
router.post("/subscribe", protect, saveSubscription);

module.exports = router;