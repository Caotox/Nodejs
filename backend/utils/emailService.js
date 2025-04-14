const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResolutionEmail = async (toEmail, issueTitle, issueId) => {
  const msg = {
    to: toEmail,
    from: 'noreply@cityissues.com',
    subject: 'Votre problème a été résolu !',
    html: `
      <h2>Bonnes nouvelles !</h2>
      <p>Le problème "${issueTitle}" que vous avez signalé a été résolu par nos services.</p>
      <p>Merci pour votre contribution à l'amélioration de notre ville !</p>
      <p>Référence du problème: #${issueId}</p>
    `
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
  }
};

module.exports = {
  sendResolutionEmail
};