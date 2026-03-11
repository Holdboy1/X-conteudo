import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

export class DiscordService {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });
  }

  async login(token: string) {
    return this.client.login(token);
  }

  async postMessage(channelId: string, content: string) {
    const channel = await this.client.channels.fetch(channelId) as TextChannel;
    if (channel) {
      return channel.send(content);
    }
    throw new Error("Channel not found");
  }

  onMessage(callback: (message: any) => void) {
    this.client.on('messageCreate', callback);
  }
}
