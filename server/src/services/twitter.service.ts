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

  async getRecentTweets(query: string, limit: number = 5) {
    const search = await this.client.v2.search(query, {
      'tweet.fields': ['text', 'author_id', 'created_at'],
      max_results: 10 // Pega um pouco mais para filtrar se necessário
    });
    
    const tweets = [];
    for (const tweet of search) {
      tweets.push(tweet.text);
      if (tweets.length >= limit) break;
    }
    return tweets;
  }

  }
}
