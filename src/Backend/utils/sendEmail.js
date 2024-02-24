const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1- Create Transporter => Service that will send email like gmail - mailgun - mailtrap - sendGrid
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure = false => 587, is secure = false => 465
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2- Define email options
  await transporter.sendMail({
    from: `E-CommerceApp <${process.env.EMAIL_USER}>`,
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    //html: options.html, // html body
  });
};

module.exports = sendEmail;
