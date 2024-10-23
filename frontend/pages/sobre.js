import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar'; // Certifique-se que o caminho do arquivo esteja correto
import Footer from './components/Footer'; // Certifique-se que o caminho do arquivo esteja correto
import GoogleMaps from './components/GoogleMaps'; // Certifique-se que o caminho do arquivo esteja correto
import axios from 'axios';

const Sobre = () => {
  const [sobreConteudo, setSobreConteudo] = useState(''); // Estado para armazenar o conteúdo "Sobre Nós"

  // Função para buscar as configurações da API
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSobreConteudo(data.about); // Armazena o conteúdo "Sobre Nós"
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  // useEffect para buscar as configurações quando o componente é montado
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo Principal */}
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Sobre Nós</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          {sobreConteudo || 'Carregando...'} {/* Mostra um carregamento enquanto o conteúdo é buscado */}
        </p>
      </div>

      {/* Google Maps e Footer */}
      <GoogleMaps />
      <Footer />
    </div>
  );
};

export default Sobre;
