const { Schema: Schema3, model: model3 } = require('mongoose');
const NoteSchema = new Schema3({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: Schema3.Types.ObjectId, ref: 'User' },
  classId: { type: Schema3.Types.ObjectId, ref: 'Class' },
}, { timestamps: true });
module.exports = model3('Note', NoteSchema);