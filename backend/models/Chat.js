import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    prompt: { type: String, required: true },
    reply: { type: String, required: true }
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
