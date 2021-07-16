const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");
const { getIo } = require("../../sockets");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const conv = await Conversation.findByPk(conversationId);
      if (conv) {
        if (conv.user1Id === senderId || conv.user2Id === senderId) {
          const message = await Message.create({
            senderId,
            text,
            conversationId,
          });
          return res.json({ message, sender });
        } else {
          return res.status(403).json({});
        }
      }
    }

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers[sender.id]) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const message = await Message.findByPk(req.body.messageId);
    const conversation = await message.getConversation();
    const r = await Message.update(
      { read: true },
      {
        where: {
          createdAt: {
            [Op.lte]: message.createdAt,
          },
          senderId: {
            [Op.ne]: req.user.id,
          },
          conversationId: conversation.id,
        },
      }
    );

    res.status(204).send();

    let recipientId = conversation.user1Id;
    if (recipientId === req.user.id) {
      recipientId = conversation.user2Id;
    }

    const io = getIo();

    io.to("user:" + recipientId).emit("mark-read");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
