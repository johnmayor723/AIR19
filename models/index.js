const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
  sname: String,
  rname: String,
  saddress: String,
  paddress: String,
  pdate: String,
  ddate: String,
  status: String,
  status2: String,
  clocation: String,
  slocation:String,
  tnumber:String,
  item1: String,
  item2: String,
  item3: String,
  item4: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tracker", trackerSchema);
