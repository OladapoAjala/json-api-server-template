const nodemailer = require('nodemailer');

/**
 * A function for sending token to user upon password reset
 * using nodemailer.
 */
const sendEmail = async (options) => {
  /**
   * Nodemailer settings
   */
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  /**
   *  Mail Information
   */
  const mailOptions = {
    from: 'Oladapo Ajala <d@drapze.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
