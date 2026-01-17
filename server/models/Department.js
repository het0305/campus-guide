const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: String,
  contact: String,
  description: String
});

module.exports = mongoose.model('Department', DepartmentSchema);
