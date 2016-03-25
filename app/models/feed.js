var mongoose = require('mongoose');

var FeedSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  by_who: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  create_at: {
    type: Date,
    default: Date.now(),
  },
});

FeedSchema.statics = {
    fetch: function(cb) {
        return this.
        find({}).
        sort("-create_at").
        exec(cb);
    },
}

var Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;
