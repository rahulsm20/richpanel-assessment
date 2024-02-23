const User = require("../models/user.model");
const { Conversation, Message } = require("../models/message.model");

const createMessage = async ({ senderId, conversation, messageText }) => {
  try {
    console.log("referencing conversation: ", conversation);
    const message = new Message({
      senderId: senderId,
      content: messageText,
    });
    console.log("saving:", message);
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

module.exports = { createMessage, createOrUpdateConversation };
