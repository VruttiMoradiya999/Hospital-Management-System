const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  try {
    const { contactId } = req.query;
    if (!contactId) {
      return res.status(400).json({ message: 'Contact ID required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: contactId },
        { sender: contactId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
