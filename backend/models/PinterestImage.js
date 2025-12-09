const mongoose = require('mongoose');

const pinterestImageSchema = new mongoose.Schema({
  pinId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
  board: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PinterestImage', pinterestImageSchema);
