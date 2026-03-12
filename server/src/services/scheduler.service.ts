import cron from 'node-cron';
import { AIService } from './ai.service';
import { DiscordService } from './discord.service';
import { TwitterService } from './twitter.service';

export class SchedulerService {
  constructor(
    private ai: AIService,
    private discord: DiscordService,
    private twitter: TwitterService
  ) {}

  start() {
    // Post every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
      console.log('Running daily post schedule...');
      await this.runDailyPosting();
    });
  }

  async runDailyPosting() {
    try {
      const tweet = await this.ai.generateContent({ 
        platform: 'twitter', 
        topic: 'novidades quentes de IA e o impacto no mercado cripto' 
      });
      await this.twitter.postTweet(tweet);

      // Discord desativado, mas mantendo a estrutura se necessário no futuro
      /* const discordPost = await this.ai.generateContent({ platform: 'discord', topic: 'AI & Crypto' }); */
      // Assuming a default channel ID from env
      /* if (process.env.DISCORD_CHANNEL_ID) {
        await this.discord.postMessage(process.env.DISCORD_CHANNEL_ID, discordPost);
      } */
    } catch (error) {
      console.error('Error in daily posting:', error);
    }
  }

  async runInteractions() {
    // Placeholder for interaction logic
    // Searching for keywords and replying
  }
}
