import { AIService } from '../../server/src/services/ai.service';
import { DiscordService } from '../../server/src/services/discord.service';
import { TwitterService } from '../../server/src/services/twitter.service';

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

    // 1. Gerar e postar no X (Twitter)
    const tweet = await ai.generateContent({ platform: 'twitter', topic: 'Web3 & AI Trends' });
    await twitter.postTweet(tweet);

    // 2. Gerar e postar no Discord (Opcional)
    if (process.env.DISCORD_TOKEN && process.env.DISCORD_CHANNEL_ID) {
      const discord = new DiscordService();
      await discord.login(process.env.DISCORD_TOKEN);
      const discordPost = await ai.generateContent({ platform: 'discord', topic: 'Crypto Gaming' });
      await discord.postMessage(process.env.DISCORD_CHANNEL_ID, discordPost);
    }

    return res.status(200).json({ success: true, message: 'Daily posts completed' });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
