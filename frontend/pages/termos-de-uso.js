import { useEffect } from 'react';
import React from 'react';
import { setSEO } from './../utils/seo';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('./components/Navbar'));
const Footer = dynamic(() => import('./components/Footer'));
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });

const TermosDeUso = () => {
    useEffect(() => {
        setSEO(
          { title: `${process.env.NEXT_PUBLIC_NAME} - Termos de Uso` });
      }, []);
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8 lg:p-16 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Termos de Uso</h1>

                <section className="mb-10">
                    <p className="text-lg text-gray-700 mb-4">
                        Por favor, leia estes Termos de Uso cuidadosamente antes de acessar este site e tenha convicção que entende integralmente seu conteúdo. Ao acessar ou usar qualquer parte deste site, você concorda com os presentes Termos de Uso. Se você não concordar, por gentileza, não use este site.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Propriedade Intelectual</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Os direitos sobre as fotografias, logotipos, imagens, ícones, bases de dados e conteúdos são de propriedade da empresa {process.env.NEXT_PUBLIC_NAME}. É proibido vender, licenciar, alugar, modificar, distribuir, copiar, reproduzir, transmitir, exibir publicamente, executar, publicar, adaptar, modificar ou criar obras derivadas, informações ou serviços a partir do conteúdo deste site, exceto quando terminantemente autorizado pela empresa {process.env.NEXT_PUBLIC_NAME}.
                    </p>
                    <p className="text-lg text-gray-700">
                        Sem prejuízo das limitações acima, você pode visualizar ou imprimir páginas individuais somente para uso pessoal. Qualquer uso comercial sem autorização está sujeito às sanções legais.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Responsabilidade</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        O acesso a este site pode ser prejudicado por falhas não atribuídas à empresa {process.env.NEXT_PUBLIC_NAME}. A empresa não garante a ausência de erros ou de interrupções, nem se responsabiliza por imprecisões ou erros tipográficos constantes das informações, software e serviços presentes neste site.
                    </p>
                    <p className="text-lg text-gray-700">
                        A empresa {process.env.NEXT_PUBLIC_NAME} reserva-se o direito de restringir ou suspender temporariamente ou definitivamente o acesso ao site para manutenção ou outros motivos relevantes.
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
                        O site pode fornecer links para outros sites e conteúdos que não são controlados pela empresa {process.env.NEXT_PUBLIC_NAME}. Não nos responsabilizamos pelo conteúdo desses sites e produtos apresentados neles.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Confidencialidade</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        A empresa {process.env.NEXT_PUBLIC_NAME} valoriza sua privacidade. As informações pessoais coletadas são utilizadas para melhorar nossos serviços e manter o relacionamento. Todos os dados são tratados de acordo com nossa Política de Privacidade.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Alterações nos Termos de Uso</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        A empresa {process.env.NEXT_PUBLIC_NAME} reserva-se o direito de modificar estes Termos de Uso a qualquer momento. Recomendamos visitar periodicamente esta página para se manter informado sobre eventuais mudanças.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Dúvidas e sugestões</h2>
                    <p className="text-lg text-gray-700">
                        Qualquer dúvida em relação aos nossos Termos de Uso pode ser esclarecida entrando em contato conosco. Envie um e-mail para {process.env.NEXT_PUBLIC_EMAIL}.
                    </p>
                </section>
            </div>
            <GoogleMaps />
            <Footer />
        </>
    );
};

export default TermosDeUso;
