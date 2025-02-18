import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.AI_SERVER_API_KEY) {
  console.log("The api key to connect to Ai server is missing");
  process.exit(0);
}
if (!process.env.AI_MODEL_NAME) {
  console.log("The model name is missing");
  process.exit(0);
}
const genAI = new GoogleGenerativeAI(process.env.AI_SERVER_API_KEY);

const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL_NAME });

export default model;
