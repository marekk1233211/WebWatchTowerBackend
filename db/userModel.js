const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  location: String,
  deviceType: String,
  date: Date,
});
// create a user table or collection if there is no table with that name already.
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
