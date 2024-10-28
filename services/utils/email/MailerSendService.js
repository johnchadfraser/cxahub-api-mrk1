//require { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

function smtpHandler(obj) {

const mailerSend = new MailerSend({
  apiKey: process.env.SMTP_API_TOKEN,
});

const sentFrom = new Sender(process.env.SMTP_USER, "CXAHub SMTP");

const recipients = [
  new Recipient(process.env.SMTP_EMAIL, "CXAHub SMTP")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject(obj.subject)
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");
  
  try {

    mailerSend.email.send(emailParams);

  } catch (e) {

    console.log(e);

  }

}

module.exports = {
  smtpHandler
};