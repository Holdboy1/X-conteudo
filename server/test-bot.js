import dotenv from 'dotenv';
import { AIService } from './src/services/ai.service.js';
import { TwitterService } from './src/services/twitter.service.js';

dotenv.config();

async function manualTest() {
  console.log('--- INICIANDO TESTE MANUAL DO BOT ---');
  
  try {
    const ai = new AIService();
    const twitter = new TwitterService({
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
    });

    console.log('1. Buscando tendências de IA no X...');
    let context = '';
    try {
      const tweets = await twitter.getRecentTweets('AI news OR LLM', 2);
      context = tweets.join('\n---\n');
      console.log('Contexto encontrado:', context ? 'Sim' : 'Não (seguindo sem contexto)');
    } catch (e) {
      console.log('Nota: Busca falhou (limite de API Free), seguindo sem contexto.');
    }

    console.log('2. IA gerando postagem humana...');
    const post = await ai.generateContent({
      platform: 'twitter',
      context: context || undefined,
      topic: 'Novidades de IA de hoje'
    });
    console.log('POST GERADO:', post);

    console.log('3. Enviando para o Twitter...');
    const result = await twitter.postTweet(post);
    console.log('SUCESSO! Post enviado. ID:', result.data.id);

  } catch (error) {
    console.error('ERRO NO TESTE:', error);
  }
}

manualTest();
