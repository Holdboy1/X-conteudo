import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIContentRequest {
  platform: 'twitter' | 'discord';
  context?: string;
  topic?: string;
}

const SYSTEM_PROMPT = `
Você é um agente de inteligência artificial especializado em Web3, criptomoedas, inteligência artificial, tecnologia e jogos online.
Seu papel é criar conteúdo no X (Twitter) e interagir naturalmente em comunidades do Discord.
Seu comportamento deve parecer humano, natural e relevante para cada comunidade.

REGRAS GERAIS:
- Nunca parecer um bot.
- Evitar respostas genéricas.
- Agregar valor à conversa.
- Ser respeitoso e inteligente.

X (TWITTER) CONTENT:
- Máximo 280 caracteres.
- Temas: Cripto, Web3, AI, DeFi, Games (Lineage 2).
- Estrutura: Gancho -> Insight -> Pergunta/Reflexão.
- Use emojis moderadamente e hashtags relevantes.

DISCORD INTERACTION:
- Participe de forma natural.
- Alinhado ao contexto da conversa.
- Respostas curtas e conversacionais.
`;

export class AIService {
  private openai?: OpenAI;
  private gemini?: any;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.gemini = genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }

  async generateContent(request: AIContentRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    
    if (this.openai) {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      });
      return response.choices[0].message.content || '';
    } else if (this.gemini) {
      const result = await this.gemini.generateContent([SYSTEM_PROMPT, prompt]);
      const response = await result.response;
      return response.text();
    }
    
    throw new Error("No AI API key configured");
  }

  private buildPrompt(request: AIContentRequest): string {
    if (request.platform === 'twitter') {
      return `Crie um post para o X sobre ${request.topic || 'as tendências atuais de Web3 e AI'}. Lembre-se do gancho, insight e pergunta final.`;
    } else {
      return `Interaja naturalmente no Discord. Contexto da conversa: "${request.context}". Topic: ${request.topic || 'General'}.`;
    }
  }
}
