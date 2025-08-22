import OpenAI from "openai";

export const unli = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.BASE_URL,
});