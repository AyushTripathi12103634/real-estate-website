import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    identification: {
      type: Object,
      default: {},      
    },
    role: {
      type: Number,
      required: true,
    },
    properties:{
      type: Object,
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", userSchema);
