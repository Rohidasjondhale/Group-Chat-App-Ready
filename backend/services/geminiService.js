const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

function cleanJSON(text){
  return text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();
}

async function generateSuggestions(message){

  try{

    const prompt = `
Suggest 3 short chat replies for this message:
"${message}"

Return only JSON:
["reply1","reply2","reply3"]
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    text = cleanJSON(text);

    return JSON.parse(text);

  }
  catch(err){

    console.log("Gemini error:", err);

    return ["Okay","Sounds good","I'll check"];

  }

}

async function predictiveText(text){

  try{

    const prompt = `
Predict next words for this chat:
"${text}"

Return JSON:
["suggestion1","suggestion2","suggestion3"]
`;

    const result = await model.generateContent(prompt);

    let response = result.response.text();

    response = cleanJSON(response);

    return JSON.parse(response);

  }
  catch(err){

    console.log("Gemini error:", err);

    return [];

  }

}

module.exports = {
  generateSuggestions,
  predictiveText
};