const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_jwt_secret_key_123"
        );
        req.user = decoded;
        return next();
      } catch (err) {
        // Fall through to fallback check
      }
    }

    // Fallback: If requesting by specific doctorId or patientId in URL or body
    if (req.params?.doctorId || req.body?.doctor) {
      req.user = {
        userId: req.params?.doctorId || req.body?.doctor,
        role: "doctor",
      };
      return next();
    }

    if (req.params?.patientId || req.body?.patient) {
      req.user = {
        userId: req.params?.patientId || req.body?.patient,
        role: "patient",
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in or select a demo account.",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication session",
    });
  }
};

module.exports = protect;