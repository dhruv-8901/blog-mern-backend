import mongoose from "mongoose";
let Schema = mongoose.Schema;
const blog = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    title: {
      type: String,
      required: false,
      default: null,
    },
    content: {
      type: String,
      required: false,
      default: null,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Blog = new mongoose.model("blogs", blog);

export default Blog;
