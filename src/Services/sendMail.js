const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendMail (to, subject, html) {
  await transporter.sendMail({
    from: `"ULP Juego" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
