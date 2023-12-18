import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  starId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Star",
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  episode: {
    type: Number,
    required: true,
  },
});

const Ranking = mongoose.model("Ranking", rankingSchema);

export default Ranking;
