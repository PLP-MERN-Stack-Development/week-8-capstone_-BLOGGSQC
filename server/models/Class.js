const { Schema: Schema2, model: model2 } = require('mongoose');
const ClassSchema = new Schema2({
  name: { type: String, required: true },
  subjects: [{ type: String }],
  teacher: { type: Schema2.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
module.exports = model2('Class', ClassSchema);