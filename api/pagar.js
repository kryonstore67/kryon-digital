export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { amountCents, reference } = req.body;

        if (!amountCents || !reference) {
            return res.status(400).json({ error: 'Dados do produto incompletos' });
        }

        // Busca a chave guardada nas Variáveis de Ambiente da Vercel
        const apiKey = process.env.GLADEPAY_KEY;

        if (!apiKey) {
            return res.status(500).json({ 
                error: 'Chave GLADEPAY_KEY não configurada nas variáveis da Vercel.' 
            });
        }

        // Chamada direta para o endpoint oficial da Gladepay
        const respostaGladepay = await fetch('https://app.gladepay.com.br/v1/deposito', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amountCents: Number(amountCents),
                reference: reference,
                callbackUrl: "https://kryondigital.com/api/webhook"
            })
        });

        const dados = await respostaGladepay.json();

        if (!respostaGladepay.ok) {
            return res.status(respostaGladepay.status).json({ 
                error: 'Erro retornado pela Gladepay', 
                detalhes: dados 
            });
        }

        return res.status(200).json(dados);

    } catch (erro) {
        console.error('Erro de servidor:', erro);
        return res.status(500).json({ error: 'Erro interno ao comunicar com a Gladepay' });
    }
}
