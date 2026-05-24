import Message from '../models/Message.js';

export async function saveMessage(senderId, receiverId, message) {
  return await Message.create({ senderId, receiverId, message });
}

export async function getHistory(req, res) {
  try {
    const peerId = req.params.peerId;
    const userId = req.user.id;
    const msgs = await Message.find({
      $or: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 }).limit(200);
    res.json({ messages: msgs });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
}
