const express = require("express");
const router = express.Router();
const ai = require("../services/geminiService");

router.post("/smart-replies", async (req, res) => {

  const { message } = req.body;

  const replies = await ai.generateSuggestions(message);

  res.json(replies);
});

router.post("/predict", async (req, res) => {

  const { text } = req.body;

  const suggestions = await ai.predictiveText(text);

  res.json(suggestions);
});

module.exports = router;