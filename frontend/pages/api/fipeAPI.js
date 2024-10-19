// pages/api/fipeAPI.js

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
            // Verifique se os parâmetros de busca foram passados corretamente
            const { marca, modelo, ano } = req.query;

            if (!marca || !modelo || !ano) {
                return res.status(400).json({ error: 'Por favor, forneça marca, modelo e ano do veículo.' });
            }

            // URL base da API de consulta FIPE
            const baseUrl = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/${ano}`;

            // Fetch para buscar os dados da API FIPE
            const response = await fetch(baseUrl);

            if (!response.ok) {
                return res.status(response.status).json({ error: 'Erro ao buscar dados da FIPE.' });
            }

            const data = await response.json();

            // Retorna os dados da FIPE no formato JSON
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro no servidor.', details: error.message });
        }
    } else {
        // Método não permitido
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Método ${method} não permitido.` });
    }
}
