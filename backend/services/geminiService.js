const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

async function generateSuggestions(message) {

  const prompt = `
  Suggest 3 short chat replies for this message:
  "${message}"

  Return only the replies in JSON format like:
  ["reply1","reply2","reply3"]
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}

async function predictiveText(text) {

  const prompt = `
  Predict the next word or phrase for this message:
  "${text}"

  Return 3 short suggestions as JSON:
  ["suggestion1","suggestion2","suggestion3"]
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return JSON.parse(response);
}

module.exports = {
  generateSuggestions,
  predictiveText
};