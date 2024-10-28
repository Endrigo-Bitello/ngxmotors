const express = require('express');
const router = express.Router();
const Motos = require('../models/Motos'); // Importa o modelo de motocicletas
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { customId } = req.params; // Pega o customId da moto
        const uploadPath = path.join(__dirname, '../../frontend/public/imagens/motos', customId);

        // Cria a pasta para a moto se ela ainda não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Define o caminho onde a imagem será salva
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo (ex: image1.png, image2.png, etc.)
        const imageName = `image${Date.now()}${path.extname(file.originalname)}`;
        cb(null, imageName); // Nomeia o arquivo de forma única
    }
});
const upload = multer({ storage });

// POST - Criar moto no MongoDB
router.post('/', async (req, res) => {
    const {
        marca,
        modelo,
        tipoDeMoto,
        anoFabricacao,
        anoModelo,
        transmissao,
        cor,
        quilometragem,
        combustivel,
        direcao,
        potencia,
        cilindrada,
        torque,
        numeroDeMarchas,
        freios,
        capacidadeTanque,
        peso,
        placa,
        chassi,
        renavam,
        crlv,
        ipva,
        comMultas,
        deLeilao,
        dpvat,
        unicoDono,
        comManual,
        chaveReserva,
        revisoesConcessionaria,
        comGarantia,
        aceitaTroca,
        opcionais,
        valorCompra,
        valorVenda,
        valorFIPE
    } = req.body;

    try {
        // Criar o documento da moto no MongoDB
        const novaMoto = new Motos({
            marca,
            modelo,
            tipoDeMoto,
            anoFabricacao,
            anoModelo,
            transmissao,
            cor,
            quilometragem,
            combustivel,
            direcao,
            potencia,
            cilindrada,
            torque,
            numeroDeMarchas,
            freios,
            capacidadeTanque,
            peso,
            placa,
            chassi,
            renavam,
            crlv,
            ipva,
            comMultas,
            deLeilao,
            dpvat,
            unicoDono,
            comManual,
            chaveReserva,
            revisoesConcessionaria,
            comGarantia,
            aceitaTroca,
            opcionais,
            valorCompra,
            valorVenda,
            valorFIPE
        });

        // Salva a moto no MongoDB e retorna o customId
        const motoSalva = await novaMoto.save();
        res.status(201).json(motoSalva);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/update-images/:customId', upload.single('image'), async (req, res) => {
    try {
        const {customId} = req.params;
        const file = req.file;

        if (!file)
            return res.status(400).json({message: 'Nenhuma imagem enviada'});

        const imagePath = file.path;

        /* Lidando com a URL da imagem */
        const imageURL = `/imagens/motos/${customId}/${imagePath.split('\\').pop()}`;

        /* Atualizando o carro com a nova imagem */
        await Motos.findOneAndUpdate(
            {customId: customId},
            {$push: {imagens: imageURL}},
            {new: true}
        );

        const dir = imagePath.substring(0, imagePath.lastIndexOf('\\'));

        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, {recursive: true});

        return res.status(200).json({message: 'Imagem carregada com sucesso', imageURL});
    } catch (error) {
        return res.status(500).json({message: 'Erro ao carregar imagem', error});
    }
});


router.delete('/delete-image/:customId/', async (req, res) => {
    try {
        const {customId} = req.params;

        const imagesDir = path.resolve(__dirname, '..', '..', 'frontend', 'public', 'imagens', 'motos', customId);

        if (!fs.existsSync(imagesDir))
            return res.status(404).json({message: 'Diretório de imagens não encontrado'});

        const files = fs.readdirSync(imagesDir);

        const imageFiles = files.filter(file => {
            return /\.(jpg|jpeg|png|gif|webp)$/.test(file.toLowerCase());
        });

        const vehicle = await Motos.findOne({customId: customId})

        if (vehicle) {
            const vehicleImages = vehicle.imagens

            for (const file of imageFiles) {
                const imagePath = path.join(imagesDir, file);

                const imageURL = `/imagens/motos/${customId}/${imagePath.split('\\').pop()}`;

                if (!vehicleImages.includes(imageURL))
                    fs.unlinkSync(imagePath)
            }
        }

        return res.status(200).json({message: 'Imagens removidas com sucesso'});
    } catch (error) {
        return res.status(500).json({message: 'Erro ao remover imagens', error});
    }
});

// POST - Enviar imagens para a pasta e atualizar o MongoDB
router.post('/upload/:customId', upload.array('imagens', 50), async (req, res) => {
    const { customId } = req.params;

    try {
        // Pegue os caminhos das imagens salvas
        const imagePaths = req.files.map(file => `/imagens/motos/${customId}/${file.filename}`);

        // Atualize o documento MongoDB com os caminhos das imagens
        const motoAtualizada = await Motos.findOneAndUpdate(
            { customId: customId },
            { imagens: imagePaths },
            { new: true } // Retorna o documento atualizado
        );

        res.status(200).json({
            message: 'Imagens enviadas com sucesso',
            moto: motoAtualizada
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar as imagens', error: error.message });
    }
});

// DELETE - Remover uma moto pelo customId
router.delete('/customId/:customId', async (req, res) => {
    const { customId } = req.params;

    try {
        const motoRemovida = await Motos.findOneAndDelete({ customId });  // Busca e remove pelo customId

        if (!motoRemovida) {
            return res.status(404).json({ message: 'Moto não encontrada' });  // Se a moto não for encontrada, retorna 404
        }

        res.status(200).json({ message: 'Moto removida com sucesso' });  // Retorna sucesso se for removida
    } catch (error) {
        res.status(500).json({ message: error.message });  // Em caso de erro, retorna 500 com a mensagem de erro
    }
});

// DELETE - Remover uma moto pelo _id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const motoRemovida = await Motos.findByIdAndDelete(id);  // Busca e remove pelo _id

        if (!motoRemovida) {
            return res.status(404).json({ message: 'Moto não encontrada' });  // Se a moto não for encontrada, retorna 404
        }

        res.status(200).json({ message: 'Moto removida com sucesso' });  // Retorna sucesso se for removida
    } catch (error) {
        res.status(500).json({ message: error.message });  // Em caso de erro, retorna 500 com a mensagem de erro
    }
});

// GET - Listar todas as motos
router.get('/', async (req, res) => {
    try {
        const motos = await Motos.find(); // Busca todas as motos na coleção
        res.json(motos); // Retorna todas as motos em formato JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Listar todas as motos de uma determinada marca
router.get('/marca/:marca', async (req, res) => {
    const { marca } = req.params; // Extrai a marca da URL

    try {
        // Busca todas as motos que possuem a marca informada
        const motos = await Motos.find({ marca: marca });

        if (motos.length === 0) {
            return res.status(404).json({ message: 'Nenhuma moto encontrada para esta marca' });
        }

        res.json(motos); // Retorna as motos encontradas
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Buscar uma moto por customId
router.get('/:customId', async (req, res) => {
    const { customId } = req.params; // Extrai o customId da URL

    try {
        const moto = await Motos.findOne({ customId }); // Busca uma moto com o customId fornecido

        if (!moto) {
            return res.status(404).json({ message: 'Moto não encontrada' }); // Retorna 404 se a moto não for encontrada
        }

        res.json(moto); // Retorna a moto encontrada
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Atualizar uma moto pelo customId
router.put('/:customId', async (req, res) => {
    const {
        marca,
        modelo,
        tipoDeMoto,
        anoFabricacao,
        anoModelo,
        transmissao,
        cor,
        quilometragem,
        combustivel,
        direcao,
        potencia,
        cilindrada,
        torque,
        numeroDeMarchas,
        freios,
        capacidadeTanque,
        peso,
        placa,
        chassi,
        renavam,
        crlv,
        ipva,
        comMultas,
        deLeilao,
        dpvat,
        unicoDono,
        comManual,
        chaveReserva,
        revisoesConcessionaria,
        comGarantia,
        aceitaTroca,
        opcionais,
        destaque,
        valorCompra,
        valorVenda,
        valorFIPE,
        imagens
    } = req.body;

    try {
        // Encontrar a moto pelo customId e atualizar os campos
        const motoAtualizada = await Motos.findOneAndUpdate(
            { customId: req.params.customId }, // Procurar pelo customId
            {
                marca,
                modelo,
                tipoDeMoto,
                anoFabricacao,
                anoModelo,
                transmissao,
                cor,
                quilometragem,
                combustivel,
                direcao,
                potencia,
                cilindrada,
                torque,
                numeroDeMarchas,
                freios,
                capacidadeTanque,
                peso,
                placa,
                chassi,
                renavam,
                crlv,
                ipva,
                comMultas,
                deLeilao,
                dpvat,
                unicoDono,
                comManual,
                chaveReserva,
                revisoesConcessionaria,
                comGarantia,
                aceitaTroca,
                opcionais,
                destaque,
                valorCompra,
                valorVenda,
                valorFIPE,
                imagens
            },
            { new: true } // Retornar o documento atualizado
        );

        if (!motoAtualizada) {
            return res.status(404).json({ message: 'Moto não encontrada' });
        }

        res.status(200).json(motoAtualizada);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar a moto', error: error.message });
    }
});

module.exports = router;
