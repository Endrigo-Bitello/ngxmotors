import dynamic from 'next/dynamic';
import React from 'react';
import { setSEO } from './../utils/seo';
import { useEffect } from 'react';


import Footer from './components/Footer';
import Navbar from './components/Navbar';
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });


const PoliticaDePrivacidade = () => {
    useEffect(() => {
        setSEO(
          { title: `${process.env.NEXT_PUBLIC_NAME} - Política de Privacidade` });
      }, []);
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8 lg:p-16 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Política de Privacidade</h1>
                
                <section className="mb-10">
                    <p className="text-lg text-gray-700 mb-4">
                        Nós, da {process.env.NEXT_PUBLIC_NAME}, estamos comprometidos em garantir e preservar a sua privacidade. O propósito desta Política de Privacidade é esclarecer como nós coletamos, usamos e armazenamos seus dados, assim como de que forma manipulamos e utilizamos essas informações.
                    </p>
                    <p className="text-lg text-gray-700">
                        A aceitação desta Política de Privacidade é condição indispensável para o uso deste site. Este documento é parte adicional do nosso Termos de Uso, que inclui uma visão geral do nosso site.
                    </p>
                </section>
                
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Informações Recolhidas</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Dados fornecidos pelo usuário:</strong> coletamos informações de identificação pessoal, como nome, e-mail e telefone, por meio do preenchimento dos formulários para proposta dos carros, assinatura para recebimento da newsletter e login para receber as notícias do EMX. Ocasionalmente, a solicitação de algumas informações pode ser feita por meio de contato direto da empresa {process.env.NEXT_PUBLIC_NAME} com os usuários via e-mail, mídias sociais ou telefone.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Dados de navegação no site:</strong> quando você visita nosso site, é inserido um ‘cookie’ no seu navegador por meio do software Google Analytics. São coletadas informações como endereço IP, localização geográfica, fonte de referência, tipo de navegador, duração da visita, páginas visitadas e a quantidade de vezes que você retorna ao nosso endereço.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Caso prefira navegar sem a utilização de cookies, é possível configurar seu browser para rejeitar todos os cookies ou você pode configurar o seu computador para avisar quando um cookie é baixado.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Uso de seus dados pessoais</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Todos os dados que recolhemos são utilizados para a prestação de nossos serviços. Importante ressaltar que todas as informações sobre você são tratadas como confidenciais, e somente as usaremos para os fins aqui descritos e autorizados por você.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Ocasionalmente, poderemos utilizar dados para finalidades não previstas nesta política de privacidade, mas estas estarão dentro das suas reais expectativas. O eventual uso dos seus dados para finalidades que não cumpram com as informações presentes neste documento, será feito mediante sua autorização prévia.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        Além do anterior, utilizaremos seus dados para os seguintes propósitos:
                    </p>
                    <ul className="list-disc ml-6 text-lg text-gray-700">
                        <li>Seu e-mail pode ser utilizado para a resposta da sua proposta no formulário do site, assim como pode ser usado para envio de newsletters.</li>
                        <li>Nos comunicar com você sobre produtos, serviços, promoções, notícias, atualizações, eventos e outros assuntos que possam ser do seu proveito.</li>
                        <li>Elaborar publicidade voltada conforme seus gostos, interesses e outras informações apuradas.</li>
                        <li>Customizar o serviço para este corresponder cada vez mais aos seus gostos e interesses.</li>
                        <li>Para qualquer fim que você concordar na hora da coleta de dados.</li>
                        <li>Respeitar obrigações legais.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Acesso às suas informações pessoais</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Poderão ver suas informações pessoais apenas funcionários da empresa {process.env.NEXT_PUBLIC_NAME} e empresas parceiras para comunicações, dentre estes, somente as pessoas com as devidas autorizações. Nenhum dado pessoal poderá ser divulgado publicamente.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Cancelamento da assinatura de e-mail e alteração/exclusão de dados</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Você pode optar por não receber mais qualquer tipo de e-mail da {process.env.NEXT_PUBLIC_NAME}. Em todos os e-mails que enviamos há um link para excluir a assinatura disponível. Todos os dados coletados serão excluídos de nossos servidores quando você assim requisitar ou quando estes não forem mais necessários.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Alterações na Política de Privacidade</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Essa Política de Privacidade pode passar por atualizações a qualquer momento. Recomendamos visitar periodicamente esta página para que você tenha conhecimento sobre as modificações.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Dúvidas e sugestões</h2>
                    <p className="text-lg text-gray-700">
                        Qualquer dúvida em relação à nossa Política de Privacidade pode ser esclarecida entrando em contato conosco. Envie um e-mail para {process.env.NEXT_PUBLIC_EMAIL}.
                    </p>
                </section>
            </div>
            <GoogleMaps />
            <Footer />
        </>
    );
};

export default PoliticaDePrivacidade;
