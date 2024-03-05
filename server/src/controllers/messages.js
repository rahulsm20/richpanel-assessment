const { Conversation } = require("../models/message.model.js");
const axios = require("axios");
require("dotenv").config();

const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().populate("messages");
    const data = [];

    for (const conversation of conversations) {
      const { messages } = conversation;
      if (messages && messages.length > 0) {
        const senderId = messages[0].senderId;
        const user = await axios.get(
          `https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic&access_token=${process.env.FB_MESSAGING_TOKEN}`
        );
        const conversationData = {
          conversation: conversation,
          senderData: user.data,
        };
        data.push(conversationData);
      }
    }

    return res.status(200).json(data);
  } catch (err) {
    console.log("error getting conversations: ", err);
    return res.status(400).json(err);
  }
};
module.exports = { getAllConversations };
