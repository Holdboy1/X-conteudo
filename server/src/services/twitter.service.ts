import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;

  constructor(config: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessSecret: string;
  }) {
    this.client = new TwitterApi({
      appKey: config.apiKey,
      appSecret: config.apiSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessSecret,
    });
  }

  async postTweet(text: string) {
    return this.client.v2.tweet(text);
  }

  async searchAndReply(query: string, replyText: string) {
    const search = await this.client.v2.search(query, { 'tweet.fields': ['author_id'] });
    for (const tweet of search) {
      // Logic to reply naturally
      await this.client.v2.reply(replyText, tweet.id);
      break; // For safety, only reply once per interaction cycle initially
    }
  }
}
