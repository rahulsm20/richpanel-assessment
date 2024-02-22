const { Messenger, Platforms } = require("../utils/messenger.js");
require("dotenv").config();

if (!process.env.PAGE_ID) {
  throw new Error("Missing Page ID");
}
if (!process.env.PAGE_TOKEN) {
  throw new Error("Missing Page Token");
}

async function getLatestConversationMessage(req, res) {
  try {
    const messenger = new Messenger(
      Platforms.Messenger,
      process.env.PAGE_ID,
      process.env.PAGE_TOKEN
    );
    const conversations = await messenger.getConversations();
    console.log(conversations);

    const latestConversation = conversations.data[0];
    const messages = await messenger.getConversationMessages(
      latestConversation.id
    );
    console.log(messages);

    const latestMessage = messages.messages.data[0];
    const message = await messenger.getMessageDetails(latestMessage.id);
    console.log(message);

    return res.status(200).json(messages, message);
  } catch (err) {
    console.log("boo:", err);
    return res.status(400).json(err);
  }
}

// getLatestConversationMessage(facebook).then((message) => {
//   let userId = message.id;
//   if (userId === process.env.PAGE_ID) {
//     userId = message.to.data[0].id;
//   }
//   facebook.sendTextMessage(userId, "Hello!");
// });

// const instagram = new Messenger(
//   Platforms.Instagram,
//   process.env.PAGE_ID,
//   process.env.PAGE_TOKEN
// );
// getLatestConversationMessage(instagram).then((message) => {
//   let userId = message.id;
//   if (message.username === process.env.INSTAGRAM_USERNAME) {
//     userId = message.to.data[0].id;
//   }
//   instagram.sendTextMessage(userId, "Hello!");
// });

module.exports = { getLatestConversationMessage };
