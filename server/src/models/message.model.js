const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: {
      type: String,
    },
    content: String,
  },
  { timestamps: true }
);

const conversationSchema = new Schema({
  participants: [
    {
      type: String,
    },
  ],
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  messages: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Conversation, Message };
