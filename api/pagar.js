export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // 1. Garantir que o corpo da requisição existe
    const body = req.body || {};
    const selectedMethod = body.method || 'mpesa';

    // 2. Ler o Token com segurança
    const rawToken = process.env.PAYSUITE_TOKEN || "";
    const token = String(rawToken).trim();

    if (!token) {
      return res.status(500).json({ error: 'Erro: Variável PAYSUITE_TOKEN não encontrada no Vercel.' });
    }

    // 3. Montar o payload (Dados da venda)
    const payload = {
      amount: "245.00",
      reference: "REC" + Date.now(),
      description: "Receita de Cha Natural",
      method: selectedMethod,
      return_url: "https://lojasolucion.online/obrigado.html",
      callback_url: "https://lojasolucion.online/api/webhook"
    };

    // 4. Chamada para o PaySuite
    const response = await fetch('https://paysuite.tech/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: 'O PaySuite retornou uma resposta não-JSON: ' + responseText });
    }

    if (data.status === 'success' && data.data && data.data.checkout_url) {
      return res.status(200).json({ checkout_url: data.data.checkout_url });
    } else {
      return res.status(400).json({ 
        error: 'Erro no PaySuite: ' + (data.message || JSON.stringify(data)) 
      });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Falha crítica: ' + error.message });
  }
}
