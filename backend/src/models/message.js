const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content cannot be empty'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must belong to a user']
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a recipient']
  },
  isAiResponse: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 