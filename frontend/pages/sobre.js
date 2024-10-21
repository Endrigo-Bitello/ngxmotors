import React from 'react';
import Navbar from './components/Navbar'; // Certifique-se que o caminho do arquivo esteja correto
import Footer from './components/Footer'; // Certifique-se que o caminho do arquivo esteja correto
import GoogleMaps from './components/GoogleMaps'; // Certifique-se que o caminho do arquivo esteja correto

const Sobre = () => {
  // Captura a variável de ambiente usando process.env
  const sobreConteudo = process.env.NEXT_PUBLIC_ABOUT;

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo Principal */}
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Sobre Nós</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          {sobreConteudo}
        </p>
      </div>

      {/* Footer */}
      <GoogleMaps />
      <Footer />
    </div>
  );
};

export default Sobre;
