const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email_password: String,
  phone: String,
  address: String,
});
module.exports = mongoose.model("User", userSchema);


