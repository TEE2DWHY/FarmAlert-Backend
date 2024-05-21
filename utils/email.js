const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: subject,
      html: message,
    };

    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const verifyEmailMessage = (verificationToken, currentUser, name) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            letter-spacing: 0.02rem;
            line-height: 1.2;
          }
          .container {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .welcome{
            text-align: "center"
          }
          .link{
            font-weight: 900
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="welcome">Welcome on Board.</h1>
          <p>Hi ${name},</p>
          <p>Welcome to Farm Alert Animal Identification and Management Application, where you can easily identify, track, and manage your animals.
          <br/> <br/>
          <span class="link">Kindly click this <a href=${process.env.BASE_URL}/${currentUser}-verification?token=${verificationToken}>link</a> to verify your account.</span>
          <br/>
          We are excited to have you on board!.
          <br/> <br/>
          <p>For support, email us at: 
          <a href="mailto:support@farmalert.com.ng">support@farmalert.com.ng</a>
          </p>
          </p>
        </div>
      </body>
    </html>
  `;
};

const resetPasswordMessage = (resetPasswordToken, currentUser) => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .container {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>RESET PASSWORD. </h1>
          <p>Do not fret..We've got you covered.
          <br/> Click this link to reset your password <a href=${process.env.BASE_URL}/${currentUser}-reset-password?token=${resetPasswordToken}>Reset Password</a>. Thank you
          </p>
        </div>
      </body>
    </html>
  `;
};

module.exports = { sendEmail, verifyEmailMessage, resetPasswordMessage };
