import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type : String, required : true },
  email: { type : String, required : true, unique : true },
  avatarUrl : String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model("user", userSchema);

export default User;