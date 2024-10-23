const express = require('express');
const router = express.Router();
const Cliente = require('../models/Clientes'); 

// Rota para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar um novo cliente
router.post('/', async (req, res) => {
  const { nome, telefone, email, cpf, etapa } = req.body;
  const novoCliente = new Cliente({
    nome,
    telefone,
    email,
    cpf,
    etapa, // "Novo Lead", etc
  });

  try {
    const clienteSalvo = await novoCliente.save();
    res.status(201).json(clienteSalvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/contato', async (req, res) => {
  const { nome, telefone, email, etapa, fonteLead } = req.body;
  const novoCliente = new Cliente({
    nome,
    telefone,
    email,
    etapa, // "Novo Lead", etc
    fonteLead: 'Mensagem no site',
    
  });

  try {
    const clienteSalvo = await novoCliente.save();
    res.status(201).json(clienteSalvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/simulacao', async (req, res) => {
  const { nome, telefone, email, etapa, fonteLead, customId } = req.body;
  
  // Criação de um novo lead com o customId incluído
  const novoCliente = new Cliente({
    nome,
    telefone,
    email,
    etapa: etapa || "Novo Lead", // Se não houver uma etapa definida, usamos "Novo Lead"
    fonteLead: fonteLead || "Simulação", // Definimos a fonte do lead como "Simulação"
    customId: customId // Adicionamos o customId ao cliente, caso seja fornecido
  });

  try {
    const clienteSalvo = await novoCliente.save();
    res.status(201).json(clienteSalvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/mensagem-veiculo', async (req, res) => {
  const { nome, telefone, email, etapa, fonteLead, customId } = req.body;
  
  // Criação de um novo lead com o customId incluído
  const novoCliente = new Cliente({
    nome,
    telefone,
    email,
    etapa: etapa || "Novo Lead", // Se não houver uma etapa definida, usamos "Novo Lead"
    fonteLead: fonteLead || "Página do veículo", // Definimos a fonte do lead como "Simulação"
    customId: customId // Adicionamos o customId ao cliente, caso seja fornecido
  });

  try {
    const clienteSalvo = await novoCliente.save();
    res.status(201).json(clienteSalvo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Rota para atualizar as informações de um cliente específico
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Atualizar campos
    cliente.nome = req.body.nome || cliente.nome;
    cliente.telefone = req.body.telefone || cliente.telefone;
    cliente.email = req.body.email || cliente.email;
    cliente.cpf = req.body.cpf || cliente.cpf;
    cliente.etapa = req.body.etapa || cliente.etapa;

    const clienteAtualizado = await cliente.save();
    res.json(clienteAtualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/mover-etapa', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id); // Encontra o cliente pelo ID
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Atualiza a etapa do cliente com a nova etapa enviada no corpo da requisição
    cliente.etapa = req.body.etapa || cliente.etapa; 
    cliente.dataEtapa = Date.now(); // Atualiza a data de mudança de etapa

    const clienteAtualizado = await cliente.save(); // Salva as mudanças no banco de dados
    res.json(clienteAtualizado); // Retorna o cliente atualizado como resposta
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna um erro se algo der errado
  }
});

router.patch('/:id/update-motivo-perda', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }


    // Update the motivoPerda field
    cliente.motivoPerda = req.body.motivoPerda || null; // Set to null if not provided

    // Update the etapa if provided
    if (req.body.etapa) {
      cliente.etapa = req.body.etapa;
      cliente.dataEtapa = Date.now();
    }

    const clienteAtualizado = await cliente.save();
    res.json(clienteAtualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para deletar um cliente específico
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    await cliente.remove();
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
