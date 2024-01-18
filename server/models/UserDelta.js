import mongoose from "mongoose";

const userDeltaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episode",
  },
  delta: Number,
});

export default mongoose.model("UserDelta", userDeltaSchema);
