import mongoose from "mongoose";
let Schema = mongoose.Schema;

const user = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = new mongoose.model("users", user);

export default User;
