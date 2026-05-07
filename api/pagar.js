export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { method } = req.body; // 'mpesa' ou 'emola'
  const token = process.env.PAYSUITE_TOKEN; // Você configurará isso no Vercel

  const metodoMap = {
    'mpesa': 'mpesa',
    'emola': 'emola'
  };

  if (!token) {
    return res.status(500).json({ error: 'Token da API não configurado no servidor.' });
  }

  try {
    const response = await fetch('https://paysuite.tech/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: "245.00",
        reference: `REC${Date.now()}`,
        description: "Receita do Cha Natural",
        method: metodoMap[method] || method
        // return_url removido temporariamente para teste de diagnóstico
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      return res.status(200).json({ checkout_url: data.data.checkout_url });
    } else {
      return res.status(400).json({ error: data.message || 'Erro ao gerar pagamento.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro de conexão com o gateway.' });
  }
}
