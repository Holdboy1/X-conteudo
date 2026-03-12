import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AIService } from './services/ai.service.js';
import { TwitterService } from './services/twitter.service.js';
import { DiscordService } from './services/discord.service.js';
import { SchedulerService } from './services/scheduler.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializar serviços e agendador
const ai = new AIService();
const twitter = new TwitterService({
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});
const discord = new DiscordService();
const scheduler = new SchedulerService(ai, discord, twitter);

scheduler.start();

app.get('/status', (req, res) => {
  res.json({ status: 'Social Control System is running with active scheduler' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Automated scheduler started.');
});
