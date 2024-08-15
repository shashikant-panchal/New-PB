const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  address: String,
  gender: String,
  dob: String,
  phone: String,
  branch: String,
  batch: String,
  email: String,
  password: String,
  pdf: String,
  selected: {
    type: Boolean,
    default: false,
  },
  selectedCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

module.exports = mongoose.model("Student", studentSchema);
