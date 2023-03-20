const asyncHandler = require('express-async-handler')
const Message = require("../models/messageModel");

// POST twetter/messages
const createMessage = asyncHandler(async (req,res) => {
    const newMessage = new Message(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET twetter/messages/:conversationId
  const getMessage = asyncHandler(async (req,res) => {
      try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  module.exports = {getMessage, createMessage}