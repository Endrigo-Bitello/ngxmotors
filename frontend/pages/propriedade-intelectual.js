import { useEffect, useState } from 'react';
import axios from 'axios';
import { setSEO } from './../utils/seo';
import dynamic from 'next/dynamic';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });

const PropriedadeIntelectual = () => {
  const [settings, setSettings] = useState(null);

  // Função para buscar os dados da collection settings
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  // Buscando as configurações ao carregar o componente
  useEffect(() => {
    fetchSettings();
  }, []);

  // Atualizando o SEO
  useEffect(() => {
    if (settings) {
      setSEO({
        title: `${settings.name} - Propriedade Intelectual`,
      });
    }
  }, [settings]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 lg:p-16 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Propriedade Intelectual</h1>

        <section className="mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Todo o conteúdo deste site, incluindo, mas não se limitando a, logotipos, textos, gráficos, imagens, vídeos, áudios, ícones, interfaces e software, é de propriedade exclusiva da <strong>{settings?.name || 'EMX Softwares'}</strong>, protegida pelas leis de direitos autorais, marcas comerciais e outras legislações aplicáveis, como a Lei de Direitos Autorais (Lei nº 9.610/1998) e o Código de Propriedade Industrial (Lei nº 9.279/1996), no Brasil.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            Nenhuma parte deste site pode ser copiada, reproduzida, modificada, distribuída, transmitida, publicada, licenciada ou explorada comercialmente sem a permissão expressa da <strong>{settings?.name || 'EMX Softwares'}</strong>. A violação destes direitos poderá resultar em penalidades cíveis e criminais conforme a legislação vigente.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            Caso tenha dúvidas sobre o uso do conteúdo deste site ou deseje solicitar autorização para utilizá-lo, entre em contato conosco pelo e-mail <a href={`mailto:${settings?.email}`} className="text-blue-500 hover:underline">{settings?.email}</a>.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            Qualquer uso não autorizado do conteúdo deste site está sujeito às sanções legais, inclusive ações judiciais e a obrigação de ressarcimento pelos danos causados.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Proteção Legal</h2>
          <p className="text-lg text-gray-700 mb-4">
            O conteúdo deste site está protegido pelas seguintes legislações, entre outras aplicáveis:
          </p>
          <ul className="list-disc ml-6 text-lg text-gray-700">
            <li>Lei de Direitos Autorais (Lei nº 9.610/1998)</li>
            <li>Código de Propriedade Industrial (Lei nº 9.279/1996)</li>
            <li>Lei de Software (Lei nº 9.609/1998)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Penalidades por Violação</h2>
          <p className="text-lg text-gray-700 mb-4">
            A violação de direitos autorais e de propriedade intelectual está sujeita a penalidades legais. Entre as penalidades previstas, destacam-se:
          </p>
          <ul className="list-disc ml-6 text-lg text-gray-700">
            <li>Indenização por danos materiais e morais;</li>
            <li>Sanções administrativas e judiciais;</li>
            <li>Penas criminais, incluindo prisão, conforme previsto na legislação brasileira.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Contato para Autorizações</h2>
          <p className="text-lg text-gray-700">
            Para qualquer questão relativa à propriedade intelectual ou solicitações de autorização, entre em contato com a <strong>{settings?.name || 'EMX Softwares'}</strong> pelo e-mail <a href={`mailto:${settings?.email}`} className="text-blue-500 hover:underline">{settings?.email}</a>.
          </p>
        </section>
      </div>
      <GoogleMaps />
      <Footer />
    </>
  );
};

export default PropriedadeIntelectual;
