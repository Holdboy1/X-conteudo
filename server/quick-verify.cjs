const { TwitterApi } = require('twitter-api-v2');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './server/.env' });

async function quickTest() {
  console.log('--- TESTE RÁPIDO DE CONEXÃO ---');
  try {
    // 1. Testar Gemini
    console.log('Testando Gemini...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Diga 'Gemini OK'");
    console.log('Gemini Resposta:', result.response.text());

    // 2. Testar Twitter
    console.log('Testando Twitter...');
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    // Tenta pegar os dados do próprio bot
    const me = await client.v2.me();
    console.log('Twitter OK! Conectado como:', me.data.username);

  } catch (err) {
    console.error('ERRO NO TESTE:', err.message);
    if (err.data) console.error('Detalhes:', JSON.stringify(err.data));
  }
}

quickTest();
