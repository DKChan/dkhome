var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  username: String,
  passwd: String,
  permission: {
    type: Number,
    default: 0,
  },
  last_login: {
    type: Date,
    default: Date.now(),
  },
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(!this.isNew) {
    next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.passwd, salt, function(err, hash) {
      if (err) return next(err);
      user.passwd = hash;
      next();
    });
  });
});

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.passwd, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  },
};

UserSchema.statics = {
  fetch: function(cb) {
    return this
    .find({})
    .sort('create_at')
    .select("_id username permission create_at last_login")
    .exec(cb);
  }
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
