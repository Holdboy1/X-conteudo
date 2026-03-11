export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Chamar o serviço de postagem aqui
  // Como estamos no Vercel, precisamos de uma arquitetura leve (Edge functions ou Serverless)
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
