import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  memo: { type: String, required: true, minLength: 20 },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  views: { type: Number, default: 0 },
  imageFile: { type: String },
});

const Diary = mongoose.model("Diary", diarySchema);

export default Diary;
