import mongoose from "mongoose";

const { Schema } = mongoose;

const betSchema = new mongoose.Schema({
  id: String,
  description: String,
  better: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  odds: Number,
  maxLose: Number,
  eligibleUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  acceptedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  episode: {
    type: Number,
  },
  won: {
    type: Boolean,
  },
});

export default mongoose.model("Bet", betSchema);
