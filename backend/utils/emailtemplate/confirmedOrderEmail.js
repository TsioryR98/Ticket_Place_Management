export const orderConfirmedTemplate = ({ userName, orderId, tickets }) => `

  <h3>Bonjour ${userName},</h3>

  <p>Votre commande <strong>#${orderId}</strong> a été validée avec succès !</p>

  <p>Voici vos billets :</p>

  ${tickets
    .map(
      (ticket, index) => `
        <p>
          Billet ${index + 1}:<br/>
          <img src="${ticket.qrCode}" alt="QR Code" />
        </p>
      `,
    )
    .join('')}
`;
