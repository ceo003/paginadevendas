export default async function handler(req, res) {
  console.log('--- Início da Transação ---');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { method } = req.body;
    console.log('Método solicitado:', method);

    const token = process.env.PAYSUITE_TOKEN;
    if (!token) {
      console.error('ERRO: PAYSUITE_TOKEN não configurado no Vercel');
      return res.status(500).json({ error: 'Erro de configuração no servidor (Token ausente)' });
    }

    const payload = {
      amount: "245.00",
      reference: "REC" + String(Date.now()),
      description: "Receita do Cha Natural",
      method: method === 'emola' ? 'emola' : 'mpesa',
      return_url: "https://lojasolucion.online/obrigado.html",
      callback_url: "https://lojasolucion.online/api/webhook"
    };

    console.log('Chamando PaySuite API...');
    
    const response = await fetch('https://paysuite.tech/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Resposta do PaySuite status:', response.status);
    
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Resposta do gateway não é JSON:', responseText);
      return res.status(500).json({ error: 'O gateway de pagamento retornou uma resposta inválida.' });
    }

    if (data.status === 'success' && data.data && data.data.checkout_url) {
      console.log('Sucesso! Checkout URL gerada.');
      return res.status(200).json({ checkout_url: data.data.checkout_url });
    } else {
      console.error('Erro retornado pelo PaySuite:', data);
      return res.status(400).json({ error: data.message || 'Erro ao processar pagamento no gateway.' });
    }

  } catch (error) {
    console.error('ERRO INTERNO:', error.message);
    return res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
  }
}
