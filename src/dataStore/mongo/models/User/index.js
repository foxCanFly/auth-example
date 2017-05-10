const mongoose = require('mongoose');
const crypto = require('crypto');


const scheme = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  passwordHash: String,
  salt: String
}, {
  timestamps: true
});

scheme.virtual('password')
  .set(function (password) {
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  });

scheme.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;

  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString() === this.passwordHash;
};

module.exports = mongoose.model('User', scheme);
