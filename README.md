# Social Control System

Sistema de automação para Discord e X (Twitter) com IA Generativa.

## Estrutura do Projeto

- `/server`: Backend Node.js/TypeScript.
- `/server/src/services`: Serviços de integração (AI, Discord, Twitter).
- `/client`: Dashboard (em desenvolvimento).

## Como Rodar

1. Entre na pasta `server`.
2. Renomeie o arquivo `.env` e preencha com suas credenciais.
3. Execute `npm install`.
4. Execute `npm run dev`.

### 4. Como Fazer o Primeiro Teste (Twitter/X)

Para não precisar esperar até as 10:00 da manhã, você pode testar agora mesmo:

1. Vá no seu painel do Vercel.
2. Clique na aba **"Cron"**.
3. No job `/api/cron/daily-post`, clique no botão **"Run"**.
4. Verifique se o post apareceu no seu perfil do X e no canal do Discord.

> [!IMPORTANT]
> Se o post não aparecer, verifique o **logs** do Vercel na aba **"Logs"**. Lá aparecerá se faltou alguma chave de API ou se deu erro de permissão no Twitter.

---

## 🚀 O que pode estar faltando? (Checklist Final)

1. **Variáveis de Ambiente**: Garanta que todas as chaves do seu arquivo `.env` local foram copiadas para **Settings > Environment Variables** no Vercel.
2. **Twitter V2 Access**: No portal do desenvolvedor do Twitter, garanta que seu App tem permissão de **"Read and Write"**.
3. **Discord Bot Perms**: Garanta que o bot tem permissão de "Send Messages" no canal configurado (`DISCORD_CHANNEL_ID`).
4. **Persistência**: Lembre-se que o sistema usa `lowdb`, que no Vercel é resetado a cada poucas horas. Para salvar um histórico permanente, futuramente precisaremos conectar um banco como o Supabase.

Tudo pronto! Se precisar de ajuda para ler os logs de erro ou ajustar alguma permissão, é só me chamar.

## Persona da IA
A IA está configurada para atuar como um especialista em Web3, Crypto e Gaming (Lineage 2), seguindo rigorosamente as regras de estilo e tom fornecidas.
