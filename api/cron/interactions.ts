export default async function handler(req: any, res: any) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Lógica para buscar posts e comentar viria aqui
  // Por enquanto apenas retorna sucesso para teste do Vercel
  return res.status(200).json({ success: true, message: 'Interactions check completed' });
}
