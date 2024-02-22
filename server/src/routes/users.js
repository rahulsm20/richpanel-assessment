const express = require("express");
const {
  authenticateFBUser,
  signin,
  signup,
  verifyToken,
} = require("../controllers/users.js");
const router = express.Router();

router.post("/login", signin);
router.post("/signup", signup);
router.post("/verify", verifyToken);
router.get("/facebook/verify", authenticateFBUser);
module.exports = router;
