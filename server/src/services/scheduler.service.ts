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
    // Post every hour at minute 30 (09:30, 10:30, 11:30...)
    cron.schedule('30 * * * *', async () => {
      console.log('Running hourly engagement post...');
      await this.runDailyPosting();
    });
  }

  async runDailyPosting() {
    try {
      // 1. Buscar o que as pessoas estão falando sobre IA agora
      console.log('Searching for AI trends on X...');
      const recentTweets = await this.twitter.getRecentTweets('AI news OR LLM OR OpenAI OR crypto AI', 3);
      const context = recentTweets.join('\n---\n');

      // 2. Gerar conteúdo baseado no que foi encontrado
      const tweet = await this.ai.generateContent({ 
        platform: 'twitter', 
        context: context || undefined,
        topic: 'últimas novidades de IA e tecnologia'
      });

      // 3. Postar no X
      await this.twitter.postTweet(tweet);
      console.log('Hourly post completed successfully.');
    } catch (error) {
      console.error('Error in hourly posting:', error);
    }
  }

  async runInteractions() {
    // Placeholder for interaction logic
    // Searching for keywords and replying
  }
}
