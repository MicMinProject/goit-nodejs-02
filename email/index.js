const nodemailer = require("nodemailer");

require("dotenv").config();

const auth = {
  user: process.env.INTERIA_USERNAME,
  pass: process.env.INTERIA_PASSWORD,
};

const client = nodemailer.createTransport({
  host: "poczta.interia.pl",
  port: 465,
  secure: true,
  auth,
});

// const emailOptions = {
//   from: auth.user,
//   to: auth.user,
//   subject: "Nodemailer test",
//   text: "HI. We're testing nodemailer",
// };

// client
//   .sendMail(emailOptions)
//   .then((info) => console.log(info))
//   .catch((err) => console.log(err));

module.exports = {
  client
}