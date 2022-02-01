const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
//Schema

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  profileurl: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Populating books the user created it

UserSchema.virtual('books', {
  ref: 'Book',
  foreignField: 'createdBy',
  localField: '_id'
});

UserSchema.set('toJSON', { virtuals: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Verify password
UserSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;