import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers["x-webhook-signature"];
    const secret = process.env.PAYSUITE_WEBHOOK_SECRET?.trim();

    if (!secret) {
      console.error("Webhook Secret não configurado!");
      return res.status(500).send("Secret missing");
    }

    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // Validar assinatura para segurança profissional
    if (signature !== calculatedSignature) {
      console.log("Assinatura inválida detectada");
      return res.status(401).send("Invalid signature");
    }

    const data = JSON.parse(rawBody);
    console.log("WEBHOOK DATA:", data);

    // Evento de sucesso
    if (data.event === "payment.success") {
      const payment = data.data;
      console.log(`PAGAMENTO APROVADO: Referência ${payment.reference}`);
      
      // Aqui você pode adicionar lógica para disparar e-mails, etc.
    }

    return res.status(200).send("OK");

  } catch (error) {
    console.error("Erro no Webhook:", error.message);
    return res.status(500).send(error.message);
  }
}
