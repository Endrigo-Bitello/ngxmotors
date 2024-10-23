import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { setSEO } from './../utils/seo';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });

const TermosDeUso = () => {
  const [settings, setSettings] = useState(null); // Estado para armazenar os dados da collection settings

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

  // Atualizando SEO com base nas configurações
  useEffect(() => {
    if (settings) {
      setSEO({
        title: `${settings.name} - Termos de Uso`,
      });
    }
  }, [settings]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 lg:p-16 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Termos de Uso</h1>

        {settings && (
          <>
            <section className="mb-10">
              <p className="text-lg text-gray-700 mb-4">
                Por favor, leia estes Termos de Uso cuidadosamente antes de acessar este site e tenha convicção que entende integralmente seu conteúdo. Ao acessar ou usar qualquer parte deste site, você concorda com os presentes Termos de Uso. Se você não concordar, por gentileza, não use este site.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Propriedade Intelectual</h2>
              <p className="text-lg text-gray-700 mb-4">
                Os direitos sobre as fotografias, logotipos, imagens, ícones, bases de dados e conteúdos são de propriedade da empresa {settings.name}. É proibido vender, licenciar, alugar, modificar, distribuir, copiar, reproduzir, transmitir, exibir publicamente, executar, publicar, adaptar, modificar ou criar obras derivadas, informações ou serviços a partir do conteúdo deste site, exceto quando terminantemente autorizado pela empresa {settings.name}.
              </p>
              <p className="text-lg text-gray-700">
                Sem prejuízo das limitações acima, você pode visualizar ou imprimir páginas individuais somente para uso pessoal. Qualquer uso comercial sem autorização está sujeito às sanções legais.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Responsabilidade</h2>
              <p className="text-lg text-gray-700 mb-4">
                O acesso a este site pode ser prejudicado por falhas não atribuídas à empresa {settings.name}. A empresa não garante a ausência de erros ou de interrupções, nem se responsabiliza por imprecisões ou erros tipográficos constantes das informações, software e serviços presentes neste site.
              </p>
              <p className="text-lg text-gray-700">
                A empresa {settings.name} reserva-se o direito de restringir ou suspender temporariamente ou definitivamente o acesso ao site para manutenção ou outros motivos relevantes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Produtos e Serviços</h2>
              <p className="text-lg text-gray-700 mb-4">
                O conteúdo deste site deve ser usado apenas para fins informativos. As cores dos produtos podem sofrer variações de acordo com a configuração do monitor. Para informações detalhadas, recomendamos visitar a loja fisicamente.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Links</h2>
              <p className="text-lg text-gray-700 mb-4">
                O site pode fornecer links para outros sites e conteúdos que não são controlados pela empresa {settings.name}. Não nos responsabilizamos pelo conteúdo desses sites e produtos apresentados neles.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Confidencialidade</h2>
              <p className="text-lg text-gray-700 mb-4">
                A empresa {settings.name} valoriza sua privacidade. As informações pessoais coletadas são utilizadas para melhorar nossos serviços e manter o relacionamento. Todos os dados são tratados de acordo com nossa Política de Privacidade.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Alterações nos Termos de Uso</h2>
              <p className="text-lg text-gray-700 mb-4">
                A empresa {settings.name} reserva-se o direito de modificar estes Termos de Uso a qualquer momento. Recomendamos visitar periodicamente esta página para se manter informado sobre eventuais mudanças.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Dúvidas e sugestões</h2>
              <p className="text-lg text-gray-700">
                Qualquer dúvida em relação aos nossos Termos de Uso pode ser esclarecida entrando em contato conosco. Envie um e-mail para {settings.email}.
              </p>
            </section>
          </>
        )}
      </div>
      <GoogleMaps />
      <Footer />
    </>
  );
};

export default TermosDeUso;
