export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // O PaySuite envia o evento no formato JSON conforme a documentação
  const { event, data } = req.body;

  if (event === 'payment.success') {
    console.log(`Pagamento aprovado para a referência: ${data.reference}`);
    // Aqui você pode adicionar lógica para enviar email se quiser
  }

  return res.status(200).json({ status: 'success' });
}
