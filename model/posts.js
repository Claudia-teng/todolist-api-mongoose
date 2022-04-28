const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  tags: {
    type: [ String ],
    required: [true, 'Tags are required']
  },
  type: {
    type: String,
    enum: ['group', 'person'], // enum checks if the value is given in an array
    required: [true, 'Type is required']
  },
  image: {
    type: String,
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
},{
  versionKey: false
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;