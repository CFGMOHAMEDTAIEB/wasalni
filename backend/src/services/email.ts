import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@wasalni.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetCode: string, userName: string): Promise<boolean> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${resetCode}&email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="background: white; max-width: 600px; margin: 0 auto; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1A56DB; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>
          
          <p style="color: #333; font-size: 16px;">Bonjour ${userName},</p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Vous avez demandé une réinitialisation de mot de passe pour votre compte WASALNI. 
            Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #1A56DB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>

          <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            Ou copier ce code: <strong>${resetCode}</strong>
          </p>

          <p style="color: #999; font-size: 13px; line-height: 1.6;">
            Ce lien expirera dans 1 heure.<br/>
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.<br/>
            <br/>
            © 2025 WASALNI - Plateforme de covoiturage en Tunisie
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe WASALNI',
      html,
      text: `Cliquez sur le lien pour réinitialiser: ${resetLink}`,
    });
  }

  async sendVerificationEmail(email: string, verificationCode: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="background: white; max-width: 600px; margin: 0 auto; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1A56DB; margin-bottom: 20px;">Vérification de votre email</h2>
          
          <p style="color: #333; font-size: 16px;">Bonjour ${userName},</p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Merci de vous être inscrit sur WASALNI. Votre code de vérification est:
          </p>

          <div style="text-align: center; margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 6px;">
            <p style="font-size: 32px; font-weight: bold; color: #1A56DB; letter-spacing: 5px; margin: 0;">
              ${verificationCode}
            </p>
          </div>

          <p style="color: #999; font-size: 13px; line-height: 1.6;">
            Ce code expirera dans 15 minutes.<br/>
            Ne partagez pas ce code avec d'autres personnes.<br/>
            <br/>
            © 2025 WASALNI - Plateforme de covoiturage en Tunisie
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Code de vérification WASALNI',
      html,
      text: `Votre code de vérification: ${verificationCode}`,
    });
  }

  async sendNotificationEmail(email: string, title: string, message: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="background: white; max-width: 600px; margin: 0 auto; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1A56DB; margin-bottom: 20px;">${title}</h2>
          
          <p style="color: #333; font-size: 16px;">Bonjour ${userName},</p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            ${message}
          </p>

          <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            © 2025 WASALNI
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: title,
      html,
    });
  }
}

export default new EmailService();
