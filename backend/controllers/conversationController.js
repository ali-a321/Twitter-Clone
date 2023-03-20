const asyncHandler = require('express-async-handler')
const Conversation = require("../models/conversationModel");

//new conv, POST twetter/conversations
const newConversation = asyncHandler(async (req,res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all conversations of user, GET twetter/conversations/:userId
const getConversation = asyncHandler(async (req,res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET conv includes two userId, twetter/conversations/find/:firstUserId/:secondUserId
const getTwoConversation = asyncHandler(async (req,res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = {getConversation, getTwoConversation, newConversation }