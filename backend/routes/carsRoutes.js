const express = require('express');
const router = express.Router();
const Carros = require('../models/Carros');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {customId} = req.params; // Pega o customId do veículo
        const uploadPath = path.join(__dirname, '../../frontend/public/imagens/carros', customId);

        // Cria a pasta para o veículo se ela ainda não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath); // Define o caminho onde a imagem será salva
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo (ex: image1.png, image2.png, etc.)
        const imageName = `image${Date.now()}${path.extname(file.originalname)}`;
        cb(null, imageName); // Nomeia o arquivo de forma única
    }
});
const upload = multer({storage});

// POST - Criar veículo no MongoDB (primeira requisição)
router.post('/', async (req, res) => {
    const {
        marca,
        modelo,
        tipoDeCarro,
        anoFabricacao,
        anoModelo,
        transmissao,
        cor,
        quilometragem,
        combustivel,
        direcao,
        potencia,
        motor,
        torque,
        numeroDePortas,
        tracao,
        freios,
        capacidadePortaMalas,
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
        // Criar o documento do carro no MongoDB
        const novoCarro = new Carros({
            marca,
            modelo,
            tipoDeCarro,
            anoFabricacao,
            anoModelo,
            transmissao,
            cor,
            quilometragem,
            combustivel,
            direcao,
            potencia,
            motor,
            torque,
            numeroDePortas,
            tracao,
            freios,
            capacidadePortaMalas,
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

        // Salva o carro no MongoDB e retorna o customId
        const carroSalvo = await novoCarro.save();
        res.status(201).json(carroSalvo);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/carros/upload/:customId', upload.single('image'), async (req, res) => {
    try {
        const { customId } = req.params;
        const file = req.file; // Arquivo de imagem enviado

        // Verifica se o arquivo foi enviado
        if (!file) {
            return res.status(400).json({ message: 'Nenhuma imagem enviada' });
        }

        const imagePath = file.path; // Caminho da imagem salva no servidor

        console.log(`Caminho: ${imagePath}`);

        if (!fs.existsSync(imagePath)) {
            console.log(`Salvando em caminho: ${imagePath}`)

            fs.mkdirSync(imagePath);

            return res.status(200).json({message: 'Imagem adicionada com sucesso'})
        }

        // Aqui você pode salvar a referência da imagem no banco de dados associado ao `customId` do carro

        return res.status(200).json({ message: 'Imagem carregada com sucesso', imagePath });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao carregar imagem', error });
    }
});

router.delete('/carros/remove-image/:customId/:filename', async (req, res) => {
    try {
        const {customId, filename} = req.params;
        const imagePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'carros', customId, filename); // Caminho completo da imagem

        console.log(`Caminho da imagem: ${imagePath}`)

        // Verifica se a imagem existe
        if (fs.existsSync(imagePath)) {
            // Remove a imagem do sistema de arquivos
            fs.unlinkSync(imagePath);
            return res.status(200).json({message: 'Imagem removida com sucesso'});
        } else {
            return res.status(404).json({message: 'Imagem não encontrada'});
        }
    } catch (error) {
        return res.status(500).json({message: 'Erro ao remover imagem', error});
    }
});

// POST - Enviar imagens para a pasta e atualizar o MongoDB (segunda requisição)
// router.post('/upload/:customId', upload.array('imagens', 30), async (req, res) => {
//     const {customId} = req.params;
//
//     try {
//         // Pegue os caminhos das imagens salvas
//         const imagePaths = req.files.map(file => `/imagens/carros/${customId}/${file.filename}`);
//
//         // Atualize o documento MongoDB com os caminhos das imagens
//         const carroAtualizado = await Carros.findOneAndUpdate(
//             {customId: customId},
//             {imagens: imagePaths},
//             {new: true} // Retorna o documento atualizado
//         );
//
//         res.status(200).json({
//             message: 'Imagens enviadas com sucesso',
//             carro: carroAtualizado
//         });
//     } catch (error) {
//         res.status(500).json({message: 'Erro ao salvar as imagens', error: error.message});
//     }
// });

router.delete('/customId/:customId', async (req, res) => {
    const {customId} = req.params;

    try {
        const carroRemovido = await Carros.findOneAndDelete({customId});  // Busca e remove pelo customId

        if (!carroRemovido) {
            return res.status(404).json({message: 'Carro não encontrado'});  // Se o carro não for encontrado, retorna 404
        }

        res.status(200).json({message: 'Carro removido com sucesso'});  // Retorna sucesso se for removido
    } catch (error) {
        res.status(500).json({message: error.message});  // Em caso de erro, retorna 500 com a mensagem de erro
    }
});

router.post('/carros/add-image/:customId', upload.array('imagens', 10), async (req, res) => {
    try {
        const {customId} = req.params;
        const vehicle = await Vehicle.findOne({customId});

        if (!vehicle) {
            return res.status(404).json({message: 'Veículo não encontrado'});
        }

        // Adiciona os caminhos das novas imagens ao veículo
        const imagePaths = req.files.map((file) => `/imagens/carros/${customId}/${file.filename}`);
        vehicle.imagens.push(...imagePaths);

        await vehicle.save();

        res.status(200).json({message: 'Imagens adicionadas com sucesso', imagens: imagePaths});
    } catch (error) {
        console.error('Erro ao adicionar imagens:', error);
        res.status(500).json({message: 'Erro ao adicionar imagens'});
    }
});

// DELETE - Remover um carro pelo _id
router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const carroRemovido = await Carros.findByIdAndDelete(id);  // Busca e remove pelo _id

        if (!carroRemovido) {
            return res.status(404).json({message: 'Carro não encontrado'});  // Se o carro não for encontrado, retorna 404
        }

        res.status(200).json({message: 'Carro removido com sucesso'});  // Retorna sucesso se for removido
    } catch (error) {
        res.status(500).json({message: error.message});  // Em caso de erro, retorna 500 com a mensagem de erro
    }
});


// GET - Listar todos os carros
router.get('/', async (req, res) => {
    try {
        const carros = await Carros.find(); // Busca todos os carros na coleção
        res.json(carros); // Retorna todos os carros em formato JSON
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// GET - Listar todos os carros de uma determinada marca
router.get('/marca/:marca', async (req, res) => {
    const {marca} = req.params; // Extrai a marca da URL

    try {
        // Busca todos os carros que possuem a marca informada
        const carros = await Carros.find({marca: marca});

        if (carros.length === 0) {
            return res.status(404).json({message: 'Nenhum carro encontrado para esta marca'});
        }

        res.json(carros); // Retorna os carros encontrados
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// GET - Buscar um carro por customId
router.get('/:customId', async (req, res) => {
    const {customId} = req.params; // Extrai o customId da URL

    try {
        const carro = await Carros.findOne({customId}); // Busca um carro com o customId fornecido

        if (!carro) {
            return res.status(404).json({message: 'Carro não encontrado'}); // Retorna 404 se o carro não for encontrado
        }

        res.json(carro); // Retorna o carro encontrado
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:customId', async (req, res) => {
    const {
        marca,
        modelo,
        tipoDeCarro,
        anoFabricacao,
        anoModelo,
        transmissao,
        cor,
        quilometragem,
        combustivel,
        direcao,
        potencia,
        motor,
        torque,
        numeroDePortas,
        tracao,
        freios,
        capacidadePortaMalas,
        placa,
        placaFormat,
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
        // Encontrar o carro pelo customId e atualizar os campos
        const carroAtualizado = await Carros.findOneAndUpdate(
            {customId: req.params.customId}, // Procurar pelo customId
            {
                marca,
                modelo,
                tipoDeCarro,
                anoFabricacao,
                anoModelo,
                transmissao,
                cor,
                quilometragem,
                combustivel,
                direcao,
                potencia,
                motor,
                torque,
                numeroDePortas,
                tracao,
                freios,
                capacidadePortaMalas,
                placa,
                placaFormat,
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
            {new: true} // Retornar o documento atualizado
        );

        if (!carroAtualizado) {
            return res.status(404).json({message: 'Carro não encontrado'});
        }

        res.status(200).json(carroAtualizado);
    } catch (error) {
        res.status(400).json({message: 'Erro ao atualizar o carro', error: error.message});
    }
});


module.exports = router;
