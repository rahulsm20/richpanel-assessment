const { getAllConversations } = require("../controllers/messages");

const express = require("express");
const router = express.Router();

router.get("/conversations", getAllConversations);
module.exports = router;
