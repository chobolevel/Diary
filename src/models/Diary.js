import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  memo: { type: String, required: true, minLength: 20 },
  createdAt: { type: Date, default: Date.now },
  author: { type: String, required: true },
  views: { type: Number, default: 0 },
});

const Diary = mongoose.model("diary", diarySchema);

export default Diary;
