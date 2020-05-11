const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sections: [{ type: Types.ObjectId, required: false, ref: 'Section' }],
});

module.exports = model('User', schema);
