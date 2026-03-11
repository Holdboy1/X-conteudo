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

    // Check for social interactions every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      console.log('Running interaction check...');
      await this.runInteractions();
    });
  }

  async runDailyPosting() {
    try {
      const tweet = await this.ai.generateContent({ platform: 'twitter', topic: 'Web3 & AI' });
      await this.twitter.postTweet(tweet);

      const discordPost = await this.ai.generateContent({ platform: 'discord', topic: 'Crypto Gaming' });
      // Assuming a default channel ID from env
      if (process.env.DISCORD_CHANNEL_ID) {
        await this.discord.postMessage(process.env.DISCORD_CHANNEL_ID, discordPost);
      }
    } catch (error) {
      console.error('Error in daily posting:', error);
    }
  }

  async runInteractions() {
    // Placeholder for interaction logic
    // Searching for keywords and replying
  }
}
