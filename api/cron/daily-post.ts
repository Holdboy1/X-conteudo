import * as AI from '../../server/src/services/ai.service.js';
import * as Discord from '../../server/src/services/discord.service.js';
import * as Twitter from '../../server/src/services/twitter.service.js';

const { AIService } = AI;
const { DiscordService } = Discord;
const { TwitterService } = Twitter;

export default async function handler(req: any, res: any) {
  // 1. Verificar Autenticação (Header ou Query Param)
  const authHeader = req.headers['authorization'];
  const querySecret = req.query?.secret;
  const secret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${secret}` && querySecret !== secret) {
    console.log('Cron Auth Failed: Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Validar Chaves de Ambiente antes de começar
  const requiredEnvs = [
    'TWITTER_API_KEY', 'TWITTER_API_SECRET', 
    'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET',
    'GEMINI_API_KEY'
  ];
  
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  if (missingEnvs.length > 0) {
    const errorMsg = `Missing environment variables: ${missingEnvs.join(', ')}`;
    console.error(errorMsg);
    return res.status(500).json({ error: errorMsg });
  }

  try {
    const ai = new AIService();
    const twitter = new TwitterService({
      apiKey: process.env.TWITTER_API_KEY!,
      apiSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    console.log('Cron: Searching for trends...');
    let context = '';
    try {
      // Tenta buscar tweets, mas não trava se falhar (pode ser limite de API Free)
      const recentTweets = await twitter.getRecentTweets('AI news OR LLM OR OpenAI OR crypto AI', 3);
      context = recentTweets.join('\n---\n');
      console.log('Cron: Trends found.');
    } catch (searchError: any) {
      console.warn('Search failed (likely API Free limit):', searchError.message);
      // Continua sem contexto se falhar
    }

    console.log('Cron: Generating content...');
    const tweet = await ai.generateContent({ 
      platform: 'twitter', 
      context: context || undefined,
      topic: 'últimas notícias e avanços técnicos em IA e Cripto de hoje' 
    });

    console.log('Cron: Posting to X...');
    await twitter.postTweet(tweet);

    console.log('Cron: Success!');
    return res.status(200).json({ success: true, message: 'Hourly post completed' });
  } catch (error: any) {
    console.error('CRITICAL CRON ERROR:', error);
    
    // Sanitização de erro para produção: Não vazar detalhes internos
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({ 
      error: 'Execution failed', 
      message: isDev ? error.message : 'An internal error occurred during post processing.',
      stack: isDev ? error.stack : undefined
    });
  }
}
