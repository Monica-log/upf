import mongoose from 'mongoose';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const mongoStatus = mongoose.connection.readyState;
    const isConnected = mongoStatus === 1;

    res.status(200).json({
      status: 'API en ligne',
      mongodb: isConnected ? 'Connecté' : 'Déconnecté',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(200).json({
      status: 'API en ligne',
      mongodb: 'Erreur',
      error: error.message,
    });
  }
}
