const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");

const { host, port, user, pass } = emailConfig;
const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user, // generated ethereal user
    pass, // generated ethereal password
  },
});

// generate html
const generateHTML = (file, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${file}.pug`,
    options
  );

  return juice(html);
};

exports.send = async (options) => {
  const html = generateHTML(options.file, options);
  const text = htmlToText.fromString(html);
  const mailOption = {
    from: "UpTask <no-reply@uptask.com>", // sender address
    to: options.user.email, // list of receivers
    subject: options.subject, // Subject line
    text, // plain text body
    html, // html body
  };

  const sendEmail = util.promisify(transport.sendMail, transport);
  return sendEmail.call(transport, mailOption);
};
