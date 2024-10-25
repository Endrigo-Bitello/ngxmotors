import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import axios from 'axios'; // Certifique-se de que o axios está importado
import { setSEO } from './../utils/seo';
import Loading from './components/Loading';
import Footer from './components/Footer';

const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });

const LGPD = () => {
  const [settings, setSettings] = useState(null);

  // Função para buscar os dados da collection settings
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data); // Armazena os dados da configuração
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  // Buscando os dados ao carregar o componente
  useEffect(() => {
    fetchSettings();
  }, []);

  // Atualizando SEO somente quando settings for carregado
  useEffect(() => {
    if (settings) {
      setSEO({
        title: `${settings.name} - LGPD`,
        metaDescription: `${settings.name} está comprometida com a proteção dos seus dados. Saiba mais sobre como seguimos as diretrizes da Lei Geral de Proteção de Dados (LGPD) no Brasil.`,
      });
    }
  }, [settings]);

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
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Lei Geral de Proteção de Dados (LGPD)</h1>

        <section className="mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Na <strong>{settings.name}</strong>, estamos comprometidos com a proteção dos seus dados pessoais. Esta página explica como coletamos, usamos, e armazenamos suas informações em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, conhecida como <strong>LGPD</strong>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Coleta e uso de dados</h2>
          <p className="text-lg text-gray-700 mb-4">
            Coletamos dados pessoais, como nome, e-mail, telefone e outras informações fornecidas voluntariamente por você. Esses dados são usados para personalizar e melhorar sua experiência em nosso site, assim como para finalidades comerciais legítimas, tais como:
          </p>
          <ul className="list-disc ml-6 text-lg text-gray-700">
            <li>Responder a consultas ou solicitações.</li>
            <li>Enviar comunicações sobre produtos, serviços ou promoções.</li>
            <li>Realizar transações ou fornecer serviços contratados.</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Compartilhamento de dados</h2>
          <p className="text-lg text-gray-700 mb-4">
            Seus dados podem ser compartilhados com parceiros comerciais ou prestadores de serviços, sempre em conformidade com a LGPD, garantindo a confidencialidade e proteção adequada.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Seus direitos</h2>
          <p className="text-lg text-gray-700 mb-4">
            A LGPD assegura que você, como titular de dados, tenha uma série de direitos, incluindo:
          </p>
          <ul className="list-disc ml-6 text-lg text-gray-700">
            <li>Acesso aos seus dados pessoais armazenados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Exclusão ou anonimização de dados pessoais desnecessários ou excessivos.</li>
            <li>Revogação de consentimento, quando aplicável.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Segurança dos dados</h2>
          <p className="text-lg text-gray-700 mb-4">
            Implementamos medidas de segurança apropriadas para proteger seus dados pessoais contra acessos não autorizados, perdas, ou alterações indevidas. Seguimos rigorosamente as diretrizes da LGPD para garantir que seus dados estejam protegidos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contato</h2>
          <p className="text-lg text-gray-700 mb-4">
            Caso tenha dúvidas sobre nossa política de privacidade ou deseje exercer seus direitos como titular de dados, entre em contato conosco pelo e-mail: <strong>{settings.email}</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Alterações na Política de Privacidade</h2>
          <p className="text-lg text-gray-700">
            Podemos atualizar esta política de tempos em tempos. Recomendamos que você a revise periodicamente para se manter informado sobre como estamos protegendo seus dados pessoais.
          </p>
        </section>
      </div>
      <GoogleMaps />
      <Footer />
    </>
  );
};

export default LGPD;
