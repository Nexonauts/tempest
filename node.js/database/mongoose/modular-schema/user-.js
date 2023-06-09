import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from 'validator';


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Account already exists"],
      validate: [validator.isEmail, 'Please enter a valid email'],
      lowercase: true,
    },
    profileURL: {
      type: String,
      default: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', // dummy user profile picture
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Your password must be at least 6 characters long"],
      select: false, // Don't send back password after request
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'moderator','admin'],
      },
    },
    account_type: {
      type: String,
      default: 'free',
      enum: {
        values: ['free', 'premium'],
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    verificationToken: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  }
);


// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};


export default mongoose.models.User || mongoose.model('User', UserSchema)
