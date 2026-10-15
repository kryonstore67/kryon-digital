export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { amountCents, reference } = req.body;

        const apiKey = process.env.GLADEPAY_KEY;

        if (!apiKey) {
            return res.status(500).json({ 
                error: 'GLADEPAY_KEY não encontrada nas Variáveis da Vercel.' 
            });
        }

        // Tenta enviar a requisição para a Gladepay
        const respostaGladepay = await fetch('https://app.gladepay.com.br/v1/deposito', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amountCents: Number(amountCents),
                reference: reference || ('REF-' + Date.now())
            })
        });

        const dados = await respostaGladepay.json();

        if (!respostaGladepay.ok) {
            return res.status(respostaGladepay.status).json({ 
                error: 'Erro na API da Gladepay', 
                detalhes: dados 
            });
        }

        return res.status(200).json(dados);

    } catch (erro) {
        return res.status(500).json({ 
            error: 'Erro interno no servidor Vercel', 
            mensagem: erro.message 
        });
    }
}

