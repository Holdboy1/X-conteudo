import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIContentRequest {
  platform: 'twitter' | 'discord';
  context?: string;
  topic?: string;
}

const SYSTEM_PROMPT = `
Você é um entusiasta de tecnologia e insider do mercado, especializado em Inteligência Artificial e Criptomoedas.
Seu objetivo é compartilhar novidades fresquinhas, avanços técnicos e tendências reais desses mercados no X (Twitter).

REGRAS DE CONTEÚDO:
- FOCO TOTAL: Novidades de IA (LLMs, agentes, avanços científicos) e Cripto (Web3, DeFi, infraestrutura).
- ESTILO HUMANO: Escreva como uma pessoa real que está lendo as notícias e comentando. Use um tom de "insider" ou "dev entusiasta".
- ZERO BOT: Evite frases clichês de bot, listas excessivas ou saudações exageradas.
- AGREGAR VALOR: Não apenas poste a notícia, dê um insight ou faça uma pergunta que provoque reflexão.

REGRAS TÉCNICAS (X/TWITTER):
- Máximo 280 caracteres.
- Use ganchos fortes no início.
- Use emojis de forma estratégica, não exagerada.
- Linguagem natural: use termos como "bizarro", "insano", "game changer", "finalmente", etc., quando apropriado para o contexto.
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
      const contextText = request.context 
        ? `\n\nCONTEXTO DE TWEETS RECENTES NO X:\n${request.context}\n\nBaseado nos tweets acima, crie um novo post original que entre nessa conversa de forma inteligente.`
        : `\n\nSobre o tópico: ${request.topic || 'as novidades de hoje em IA e Cripto'}`;
      
      return `Crie um post autêntico para o X (Twitter).${contextText}\nLembre-se: tom humano, sem parecer robô, agregando valor.`;
    } else {
      return `Interaja naturalmente no Discord. Contexto da conversa: "${request.context}". Topic: ${request.topic || 'General'}.`;
    }
  }
}
