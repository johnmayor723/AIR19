const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
  sname: String,
  rname: String,
  saddress: String,
  paddress: String,
  pdate: String,
  ddate: String,
  clocation: String,
  slocation:String,
  tnumber:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tracker", trackerSchema);
