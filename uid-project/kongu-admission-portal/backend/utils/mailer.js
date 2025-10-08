const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.warn('Mailer: SMTP env vars are missing. Emails will not be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || 'false') === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

async function sendStatusEmail({ to, name, course, status, applicationId }) {
  const tx = getTransporter();
  if (!tx) return { skipped: true, reason: 'missing_smtp_config' };

  const subjectMap = {
    Approved: 'KEC Admission Application Approved',
    Rejected: 'KEC Admission Application Update',
    Pending: 'KEC Admission Application Received',
  };

  const title = status === 'Approved' ? 'Congratulations!' : status === 'Rejected' ? 'Application Update' : 'Application Received';
  const message = status === 'Approved'
    ? `We are pleased to inform you that your admission application has been approved. Our team will contact you with next steps soon.`
    : status === 'Rejected'
      ? `We regret to inform you that your admission application could not be approved at this time. You may contact the admissions office for further information.`
      : `Your admission application has been received and is currently under review. We will notify you once a decision is made.`;

  const html = `
  <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#333">
    <h2 style="color:#2a5298;margin-bottom:4px">${title}</h2>
    <p style="margin:0 0 12px">Dear ${name},</p>
    <p style="margin:0 0 12px">${message}</p>
    <div style="margin:16px 0;padding:12px 16px;background:#f5f7fb;border-radius:8px;border:1px solid #e3e8f0">
      <p style="margin:6px 0"><strong>Application ID:</strong> ${applicationId}</p>
      <p style="margin:6px 0"><strong>Course:</strong> ${course}</p>
      <p style="margin:6px 0"><strong>Status:</strong> ${status}</p>
    </div>
    <p style="margin:0 0 12px">Regards,<br/>Kongu Engineering College Admissions</p>
  </div>`;

  const mail = {
    from: process.env.SMTP_FROM,
    to,
    subject: subjectMap[status] || 'KEC Admission Application Update',
    html,
  };

  try {
    const info = await tx.sendMail(mail);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('Mailer error:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendStatusEmail };
