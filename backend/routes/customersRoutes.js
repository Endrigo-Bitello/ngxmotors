const express = require('express');
const router = express.Router();
const Cliente = require('../models/Clientes');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Rota para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    // Busca todos os clientes e popula o campo 'responsavelLead' com o nome do usuário responsável
    const clientes = await Cliente.find().populate('responsavelLead', 'username');
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  const { nome, telefone, email, estado, cidade, cpf, etapa, fonteLead, responsavelLead } = req.body;

  try {
    // Cria um novo cliente
    const novoCliente = new Cliente({
      nome,
      telefone,
      email,
      cpf,
      etapa, 
      estado,
      cidade,
      fonteLead,
      responsavelLead
    });

    // Salva o cliente no banco
    const clienteSalvo = await novoCliente.save();

    // Popula o campo responsavelLead com o nome do usuário responsável
    const clienteComResponsavel = await Cliente.findById(clienteSalvo._id).populate('responsavelLead', 'nome');

    // Retorna o cliente salvo com o campo populado
    res.status(201).json(clienteComResponsavel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar cliente' });
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

// Rota para mensagens oriundas da página do veículo ([veiculo]/index.js)
router.post('/mensagem-veiculo', async (req, res) => {
  const { nome, telefone, email, etapa, fonteLead, customId } = req.body;


  const novoCliente = new Cliente({
    nome,
    telefone,
    email,
    etapa: etapa || "Novo Lead",
    fonteLead: fonteLead || "Pág. Veículo",
    customId: customId
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

    const novoResponsavel = req.body.responsavelLead;
    const antigoResponsavel = cliente.responsavelLead;

    // Atualizar campos do cliente
    cliente.nome = req.body.nome || cliente.nome;
    cliente.telefone = req.body.telefone || cliente.telefone;
    cliente.email = req.body.email || cliente.email;
    cliente.cpf = req.body.cpf || cliente.cpf;
    cliente.etapa = req.body.etapa || cliente.etapa;
    cliente.estado = req.body.estado || cliente.estado;
    cliente.cidade = req.body.cidade || cliente.cidade;
    cliente.fonteLead = req.body.fonteLead || cliente.fonteLead;
    cliente.responsavelLead = novoResponsavel || cliente.responsavelLead;

    // Se o responsável foi alterado, incrementar leadsAtribuidos
    if (novoResponsavel && novoResponsavel !== antigoResponsavel) {
      // Encontrar o novo responsável e incrementar leadsAtribuidos
      const responsavel = await User.findById(novoResponsavel);
      if (responsavel) {
        responsavel.leadsAtribuidos += 1;
        await responsavel.save();
      }
    }

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

router.patch('/:id/assign', async (req, res) => {
  const { responsavelLead } = req.body; // ID do responsável

  if (!responsavelLead) {
    return res.status(400).json({ message: 'ID do responsável é obrigatório' });
  }

  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Atribui o responsável ao cliente
    cliente.responsavelLead = responsavelLead;
    await cliente.save();

    res.status(200).json({ message: 'Responsável atribuído com sucesso', cliente });
  } catch (error) {
    console.error('Erro ao atribuir responsável:', error);
    res.status(500).json({ message: 'Erro ao atribuir responsável' });
  }
});



router.patch('/:id/update-etapa', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (req.body.etapa) cliente.etapa = req.body.etapa;
    if (req.body.motivoPerda !== undefined) cliente.motivoPerda = req.body.motivoPerda;
    if (req.body.customId) cliente.customId = req.body.customId;
    if (req.body.ultimaInteracao) cliente.ultimaInteracao = req.body.ultimaInteracao;
    if (req.body.obteveResposta !== undefined) cliente.obteveResposta = req.body.obteveResposta;

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
