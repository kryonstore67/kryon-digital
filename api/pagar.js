export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { amountCents, reference } = req.body;
        const apiKey = process.env.GLADEPAY_KEY;

        if (!apiKey) {
            return res.status(500).json({ 
                error: 'Chave GLADEPAY_KEY não configurada na Vercel.' 
            });
        }

        const response = await fetch('https://app.gladepay.com.br/v1/deposito', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amountCents: Number(amountCents) || 1495,
                reference: reference || ('REF-' + Date.now())
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: 'A Gladepay recusou a solicitação.',
                detalhes: data
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ 
            error: 'Erro interno no servidor Vercel', 
            mensagem: err.message 
        });
    }
}
