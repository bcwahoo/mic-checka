const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  album: { type: String, required: true },
  artist: { type: String, required: true },
  cover: String,
  released: String,
  summary: String,
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
