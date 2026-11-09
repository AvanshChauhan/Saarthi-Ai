import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  agentName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  knowledgeBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "knowledgeBase",
  },
  instructions: {
    type: String,
    required: true,
  },
  tools: [
    {
      type: {
        type: String,
        trim: true,
      },
      // Add other tool properties as needed, e.g.:
      // config: { type: Object, default: {} }
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;