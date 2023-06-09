import mongoose from 'mongoose';
import { v4 as UuID4 } from 'uuid';

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: [],
  }]
  
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled',
    },
    description: String,
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: [
        {
          type: 'paragraph',
          children: [{ text: 'Enter your blog post content here...' }],
        },
      ],
      select: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default: () => UuID4(),
    },
    labels: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      default:'hhttps://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
    state: {
      type: String,
      required: true,
      default: 'draft',
      enum: ['draft', 'published'],
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      profileURL: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    comments: {
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre('save', async function (next) {
  if (!this.isModified('image')) {
    return next();
  }
  this.metadata.image = this.image;
  next();
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default mongoose.models.Post || mongoose.model('Post', postSchema);
