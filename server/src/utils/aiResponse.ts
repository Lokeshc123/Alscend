import model from "../config/gemini";
export const aiResponse = async (prompt: string) => {
  const res = await model.generateContent(prompt);
  return res.response.text();
};
