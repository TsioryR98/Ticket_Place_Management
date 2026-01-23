import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"Ticket Platform" <no-reply@tickets.com>',
      to,
      subject,
      html,
    });

    console.log('📧 Email envoyé à', to);
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
};
