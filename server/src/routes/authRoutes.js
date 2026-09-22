const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  authController.registerUser
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  authController.loginUser
);


// =====================================================
// PROFILE
// =====================================================

router.get(
  "/profile",
  protect,
  authController.getProfile
);

router.put(
  "/profile",
  protect,
  authController.updateProfile
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
  "/reset-password",
  authController.resetPassword
);


// =====================================================
// GOOGLE SIGN-IN
// =====================================================

router.post(
  "/google",
  authController.googleSignIn
);


module.exports = router;