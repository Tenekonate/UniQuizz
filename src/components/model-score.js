const { Schema, model } = require("mongoose");

const scoreSchema = new Schema({
  email: { type: String, required: true },
  response: { type: [String], required: true },
  score: { type: Number, required: true },
  questionQuizz: { type: [String], required: true },
});

exports.ScoreModel = model("scores", scoreSchema);
