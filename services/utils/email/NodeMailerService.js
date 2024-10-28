const nodemailer = require("nodemailer");

async function smtpHandler(obj) {
  //Set defaults if missing.
  obj.to ??= process.env.WEBMASTER_EMAIL;
  obj.from ??= process.env.NOREPLY_EMAIL;
  obj.cc ??= "";
  obj.bcc ??= "";
  obj.subject ??= "No Subject Defined";
  obj.html ??= "No html defined";
  obj.text ??= "No text defined";
  obj.attachments ??= "";

  // Create reusable transporter object using the default SMTP transport.
  let transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 465,
    auth: {
      user: "smtp@cxahub.com",
      pass: "WJ0hn@!05GD",
    },
  });

  const mailOptions = {
    from: obj.from,
    to: obj.to,
    cc: obj.cc,
    bcc: obj.bcc,
    subject: obj.subject,
    html: obj.html,
    // Plain text message.
    text: obj.text,
    //Embed images.
    attachments: obj.attachments,
  };

  // Send mail with defined transport object.
  await transporter.sendMail(mailOptions, async (err, res) => {
    if (err) {
      console.log(
        "An error occured sending email - " + err + " Other info: " + obj.from
      );
    } else {
      console.log("Email sent successfully.");
    }
  });
}

module.exports = {
  smtpHandler,
};
