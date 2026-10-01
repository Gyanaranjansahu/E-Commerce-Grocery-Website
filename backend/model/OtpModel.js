import mongoose from "mongoose";

const createSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model("otp", createSchema);
export default OtpModel;