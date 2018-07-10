import nodemailer from 'nodemailer';
import { renderFile } from 'pug';
import { fromString } from 'html-to-text';
import juice from 'juice';

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) =>
  juice(renderFile(`${__dirname}/../views/email/${filename}.pug`, options));

export const sendMail = async options => {
  const html = generateHTML(options.filename, options);
  const text = fromString(html);

  return transport.sendMail({
    from: 'Jason Sooter <hello@jasonsooter.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text
  });
};
