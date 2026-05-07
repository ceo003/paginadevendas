export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const token = process.env.PAYSUITE_TOKEN?.trim();

    if (!token) {
      return res.status(500).json({
        error: "Token não configurado"
      });
    }

    const { method } = req.body;
    // Referência SEM hífen
    const reference = `REC${Date.now()}`;

    const body = {
      amount: 245,
      reference,
      description: "Compra da Receita do Cha Natural",
      method: method === 'emola' ? 'emola' : 'mpesa',
      // IMPORTANTE: URLs limpas sem caracteres de escape
      return_url: "https://lojasolucion.online/obrigado.html",
      callback_url: "https://lojasolucion.online/api/webhook"
    };

    const response = await fetch("https://paysuite.tech/api/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    console.log("PAYSUITE RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      checkout_url: data.data.checkout_url
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message
    });
  }
}
