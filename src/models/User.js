import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  nickname: { type: String },
  location: { type: String },
  avatarUrl: {
    type: String,
    default: "uploads/avatarUrl/c7074c7d42f0a8ee46db97eb92778096",
  },
  socialOnly: { type: Boolean, default: false },
  diaries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diary",
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
    //비밀번호가 수정되고 저장될 때만 해싱이 실행됨
  }
});

const User = mongoose.model("user", userSchema);

export default User;
