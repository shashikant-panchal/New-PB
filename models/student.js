const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  address: String,
  gender: String,
  dob: String,
  phone: String,
  branch: String,
  email: String,
  password: String, 
    selected: {
    type: Boolean,
    default: false, 
  }
});

module.exports = mongoose.model('Student', studentSchema);
