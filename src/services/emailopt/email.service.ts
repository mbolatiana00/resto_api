import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // false pour port 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email: string, code: string) => {
  await transporter.sendMail({
    from: `"Resto API" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Vérification de ton compte",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Confirme ton email</h2>
        <p style="color: #555;">Utilise le code ci-dessous pour vérifier ton compte :</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; padding: 16px 0;">
          ${code}
        </div>
        <p style="color: #999; font-size: 13px;">Ce code expire dans <strong>10 minutes</strong>.</p>
        <p style="color: #999; font-size: 13px;">Si tu n'as pas créé de compte, ignore cet email.</p>
      </div>
    `,
  });
};