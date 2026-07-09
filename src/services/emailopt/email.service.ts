import nodemailer from "nodemailer";

const getMailerConfig = () => {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.MAIL_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD;
  const fromAddress = process.env.SMTP_FROM || process.env.MAIL_FROM_ADDRESS || user;
  const fromName = process.env.SMTP_FROM_NAME || process.env.MAIL_FROM_NAME || "Resto API";

  return {
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
    from: `"${fromName}" <${fromAddress}>`,
  };
};

export const sendOtpEmail = async (email: string, code: string) => {
  const { host, port, secure, auth, from } = getMailerConfig();

  if (!host || !auth?.user || !auth?.pass) {
    throw new Error(
      `Configuration SMTP incomplète. Vérifie SMTP_HOST/SMTP_USER/SMTP_PASS ou MAIL_HOST/MAIL_USERNAME/MAIL_PASSWORD.`
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  });

  await transporter.sendMail({
    from,
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