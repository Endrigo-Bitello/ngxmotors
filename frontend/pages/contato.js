import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa';
import { setSEO } from './../utils/seo';
import axios from 'axios';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });

const Contato = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [fonteLead, setFonteLead] = useState('');
  const [settings, setSettings] = useState(null); 

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  useEffect(() => {
    fetchSettings(); // Busca as configurações quando o componente é montado
  }, []);

  useEffect(() => {
    if (settings) {
      setSEO({ title: `${settings.name} - Contato` });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envia a mensagem
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens/contato`, {
        nome,
        email,
        telefone,
        mensagem,
      });

      // Envia o lead para a collection Clientes
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/contato`, {
        nome,
        email,
        telefone,
        etapa: 'Novo Lead', // Define o cliente como Novo Lead
        fonteLead,
      });

      // Limpa os campos do formulário
      setNome('');
      setEmail('');
      setTelefone('');
      setMensagem('');
      setFonteLead('');
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert('Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
    }
  };

  if (!settings) {
    return (
      <div>
        <Navbar /> 
        <Loading /> 
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 lg:p-16 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Entre em Contato com {settings.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Fale Conosco</h2>
            <p className="text-lg text-gray-600">
              Estamos disponíveis para responder suas dúvidas e ajudar no que for necessário.
            </p>

            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-blue-500 text-2xl" />
              <div>
                <h3 className="text-lg font-medium text-gray-700">Telefone</h3>
                <p className="text-gray-600">{settings.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaWhatsapp className="text-green-500 text-2xl" />
              <div>
                <h3 className="text-lg font-medium text-gray-700">WhatsApp</h3>
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-blue-500 hover:underline">
                  {settings.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaInstagram className="text-pink-500 text-2xl" />
              <div>
                <h3 className="text-lg font-medium text-gray-700">Instagram</h3>
                <a href={settings.instagramUrl} className="text-blue-500 hover:underline">
                  {settings.instagramUrl}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaFacebookF className="text-blue-700 text-2xl" />
              <div>
                <h3 className="text-lg font-medium text-gray-700">Facebook</h3>
                <a href={settings.facebookUrl} className="text-blue-500 hover:underline">
                  {settings.facebookUrl}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-blue-500 text-2xl" />
              <div>
                <h3 className="text-lg font-medium text-gray-700">E-mail</h3>
                <p className="text-gray-600">{settings.email}</p>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Envie-nos uma Mensagem</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={nome}
                  className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  placeholder="Digite seu nome"
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Telefone</label>
                <input
                  type="text"
                  className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  placeholder="Digite seu telefone"
                  onChange={(e) => setTelefone(e.target.value)}
                  maxLength="15"
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .replace(/^(\d{2})(\d)/g, "($1) $2")
                      .replace(/(\d{5})(\d)/, "$1-$2")
                      .replace(/(-\d{4})\d+?$/, "$1");
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Mensagem</label>
                <textarea
                  className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  placeholder="Escreva sua mensagem"
                  rows="5"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                ></textarea>
              </div>

              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
      <GoogleMaps />
      <Footer />
    </>
  );
};

export default Contato;
