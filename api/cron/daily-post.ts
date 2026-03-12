import * as AI from '../../server/src/services/ai.service.js';
import * as Discord from '../../server/src/services/discord.service.js';
import * as Twitter from '../../server/src/services/twitter.service.js';

const { AIService } = AI;
const { DiscordService } = Discord;
const { TwitterService } = Twitter;

export default async function handler(req: any, res: any) {
  // Verificar se a requisição veio do Vercel Cron (Segurança)
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const ai = new AIService();
    const twitter = new TwitterService({
      apiKey: process.env.TWITTER_API_KEY!,
      apiSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // 1. Buscar o que as pessoas estão falando sobre IA agora para dar contexto
    const recentTweets = await twitter.getRecentTweets('AI news OR LLM OR OpenAI OR crypto AI', 3);
    const context = recentTweets.join('\n---\n');

    // 2. Gerar e postar no X (Twitter) baseado no contexto
    const tweet = await ai.generateContent({ 
      platform: 'twitter', 
      context: context || undefined,
      topic: 'últimas notícias e avanços técnicos em IA e Cripto de hoje' 
    });
    await twitter.postTweet(tweet);

    /* 2. Gerar e postar no Discord (Desativado)
    if (process.env.DISCORD_TOKEN && process.env.DISCORD_CHANNEL_ID) {
      const discord = new DiscordService();
      await discord.login(process.env.DISCORD_TOKEN);
      const discordPost = await ai.generateContent({ platform: 'discord', topic: 'Crypto Gaming' });
      await discord.postMessage(process.env.DISCORD_CHANNEL_ID, discordPost);
    } */

    return res.status(200).json({ success: true, message: 'Daily posts completed' });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
