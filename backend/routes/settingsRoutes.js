const express = require('express');
const Settings = require('../models/Settings');

const router = express.Router();

// Rota para buscar as configurações
router.get('/get-settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Configurações não encontradas.' });
    }
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
});

// Rota para atualizar as configurações
router.post('/update-settings', async (req, res) => {
  const {
    taxaString,
    taxaValue,
    address,
    whatsappNumber,
    phoneNumber,
    email,
    name,
    instagramUrl,
    facebookUrl,
    twitterUrl,
    linkedinUrl,
    tiktokUrl,
    openingHours,
    whatsappMessage,
    city,
    googleMaps,
    websiteUrl,
    slogan,
    about,
  } = req.body;

  try {
    // Procurar pelas configurações existentes
    let settings = await Settings.findOne();

    if (!settings) {
      // Se não houver configurações, criar novas
      settings = new Settings();
    }

    // Atualizar os valores apenas se estiverem presentes na requisição
    if (taxaString) settings.taxaString = taxaString;
    if (taxaValue) settings.taxaValue = taxaValue;
    if (address) settings.address = address;
    if (whatsappNumber) settings.whatsappNumber = whatsappNumber;
    if (phoneNumber) settings.phoneNumber = phoneNumber;
    if (email) settings.email = email;
    if (name) settings.name = name;
    if (instagramUrl) settings.instagramUrl = instagramUrl;
    if (facebookUrl) settings.facebookUrl = facebookUrl;
    if (twitterUrl) settings.twitterUrl = twitterUrl;
    if (linkedinUrl) settings.linkedinUrl = linkedinUrl;
    if (tiktokUrl) settings.tiktokUrl = tiktokUrl;
    if (openingHours) settings.openingHours = openingHours;
    if (whatsappMessage) settings.whatsappMessage = whatsappMessage;
    if (city) settings.city = city;
    if (googleMaps) settings.googleMaps = googleMaps;
    if (websiteUrl) settings.websiteUrl = websiteUrl;
    if (slogan) settings.slogan = slogan;
    if (about) settings.about = about;

    // Salvar as configurações no banco de dados
    await settings.save();

    return res.status(200).json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar as configurações:', error);
    return res.status(500).json({ message: 'Erro ao atualizar configurações' });
  }
});

// Exportar o router
module.exports = router;
