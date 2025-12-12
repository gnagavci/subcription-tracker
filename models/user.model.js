import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"], //user name is required and we can get a message to be helpful in debugging later
      trim: true, //trim whitespace
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true, //emails are unique,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 6,
    },
  },
  { timestamps: true }
); //with setting timestamps to true, alongside the schema fields we will also have created_at and updated_at

const User = mongoose.model("User", userSchema); //create a model based on the schema

export default User;
