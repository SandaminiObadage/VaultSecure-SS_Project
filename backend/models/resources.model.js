// backend/models/resource.model.js
import mongoose from 'mongoose';
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: {
        type: String,
        enum: ['like', 'dislike'], // Specify allowed reaction types
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export const Resource = mongoose.model('Resource', resourceSchema);