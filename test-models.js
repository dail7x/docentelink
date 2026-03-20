const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await response.json();
  console.log("Modelos V1:", data.models?.map(m => m.name));
  
  const responseBeta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const dataBeta = await responseBeta.json();
  console.log("Modelos V1BETA:", dataBeta.models?.map(m => m.name));
}

listModels().catch(console.error);
