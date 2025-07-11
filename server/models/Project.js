const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  owner: { type: String, required: true },
  members: [{ type: String }],
});

module.exports = mongoose.model('Project', projectSchema); 