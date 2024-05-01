import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    Address: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,  
    },
    Bought: {
      type: Boolean,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Properties", propertySchema);
