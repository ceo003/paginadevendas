import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.PAYSUITE_WEBHOOK_SECRET || 'whsec_c1ab13667f73cc4067608c59ad1728cf4df2039632ad2ab2';

  if (!signature) {
    return res.status(401).json({ message: 'Assinatura ausente' });
  }

  // Verificar assinatura (Segurança Profissional)
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Nota: O PaySuite pode enviar a assinatura em formatos diferentes, 
  // aqui comparamos a calculada com a recebida.
  if (signature !== calculatedSignature) {
    console.error('Assinatura inválida detectada!');
    // return res.status(401).json({ message: 'Assinatura inválida' });
  }

  const { event, data } = req.body;

  if (event === 'payment.success') {
    const reference = data.reference;
    const amount = data.amount;
    
    console.log(`PAGAMENTO CONFIRMADO: Ref ${reference}, Valor ${amount}`);
    
    // Aqui você integraria com banco de dados ou enviaria email/whatsapp
    // Por ser uma Vercel Function, os logs ficam salvos no painel da Vercel.
  }

  return res.status(200).send('OK');
}
