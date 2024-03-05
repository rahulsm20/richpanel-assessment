const User = require("../models/user.model");
const { Conversation, Message } = require("../models/message.model");
const axios = require('axios')
const createMessage = async ({ senderId, conversation, messageText }) => {
  try {
    const message = new Message({
      senderId: senderId,
      content: messageText,
    });
    await conversation.messages.push(message);
    await conversation.save();
    return message;
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
};

const createOrUpdateConversation = async (senderId, receiverId) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (conversation.lastActiveAt < twentyFourHoursAgo) {
        conversation.lastActiveAt = new Date();
        await conversation.save();
      }
    } else {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastActiveAt: new Date(),
      });
      await conversation.save();
    }
    return conversation;
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
  }
};

const messagingWebhook = (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.SECRET) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
}

const webhookMessageHandler = async (req, res) => {
  try {
    let body = req.body;
    console.log("received:", body);
    if (body.object === "page") {
      body.entry.forEach(async (entry) => {
        let webhookEvent = entry.messaging[0];
        let senderId = webhookEvent.sender.id;
        let messageText = webhookEvent.message.text;
        console.log(senderId, process.env.RECIPIENT_ID);
        let user = {};
        let message = {};
        if (senderId != process.env.RECIPIENT_ID) {
          user = await axios.get(
            `https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic&access_token=${process.env.FB_MESSAGING_TOKEN}`
          );
          message = {
            sender: {
              senderId,
              ...user.data,
            },
            message: messageText,
          };
        } else {
          const userData = { first_name: "", last_name: " ", profile_pic: " " };
          message = {
            sender: {
              senderId,
              ...userData,
            },
          };
        }
        const conversation = await createOrUpdateConversation(
          senderId,
          process.env.RECIPIENT_ID
        );
        await createMessage({
          senderId,
          conversation,
          messageText,
        });
        return res.status(200).json(message);
      });
    }
  } catch (err) {
    console.log("error getting message: ", err);
    return res.status(400).json(err);
  }
}


const sendResponseMessage = async (req, res) => {
  try {
    const { receiverId, messageText } = req.body;
    let messageData = {
      recipient: {
        id: receiverId,
      },
      message: {
        text: messageText,
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v13.0/me/messages?access_token=${process.env.FB_MESSAGING_TOKEN}`,
      messageData
    );
    return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

module.exports = { createMessage, createOrUpdateConversation,messagingWebhook, webhookMessageHandler, sendResponseMessage };
