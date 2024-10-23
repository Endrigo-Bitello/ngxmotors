import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  // Definindo os estados para cada variável de configuração
  const [address, setAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [city, setCity] = useState('');
  const [googleMaps, setGoogleMaps] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [slogan, setSlogan] = useState('');
  const [about, setAbout] = useState('');

  // Função para buscar as configurações da API
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      if (data) {
        // Atualizando os estados com os dados vindos do banco
        setAddress(data.address || '');
        setWhatsappNumber(data.whatsappNumber || '');
        setPhoneNumber(data.phoneNumber || '');
        setEmail(data.email || '');
        setName(data.name || '');
        setInstagramUrl(data.instagramUrl || '');
        setFacebookUrl(data.facebookUrl || '');
        setTwitterUrl(data.twitterUrl || '');
        setLinkedinUrl(data.linkedinUrl || '');
        setTiktokUrl(data.tiktokUrl || '');
        setOpeningHours(data.openingHours || '');
        setWhatsappMessage(data.whatsappMessage || '');
        setCity(data.city || '');
        setGoogleMaps(data.googleMaps || '');
        setWebsiteUrl(data.websiteUrl || '');
        setSlogan(data.slogan || '');
        setAbout(data.about || '');
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  // useEffect para buscar as configurações quando o componente é montado
  useEffect(() => {
    fetchSettings();
  }, []);

  // Função para enviar os dados atualizados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviando os dados via POST para a API de atualização de configurações
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/update-settings`, {
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
      });
      alert('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      alert('Erro ao atualizar configurações');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Configurações Gerais</h1>
      <p className="mb-10 text-gray-600 leading-relaxed text-lg">
        Configure as informações de contato, redes sociais, e outros detalhes da sua empresa. Certifique-se de que os campos estejam preenchidos corretamente antes de salvar.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Primeira coluna */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o endereço"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o número de WhatsApp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone Fixo</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o telefone fixo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Estabelecimento</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o nome do estabelecimento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário de Atendimento</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o horário de atendimento"
              />
            </div>
          </div>

          {/* Segunda coluna */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a URL do Instagram"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a URL do Facebook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a URL do Twitter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a URL do LinkedIn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">TikTok URL</label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a URL do TikTok"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem de WhatsApp</label>
              <input
                type="text"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a mensagem padrão do WhatsApp"
              />
            </div>
          </div>
        </div>

        {/* Slogan e Sobre */}
        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Slogan</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Digite o slogan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sobre a Empresa</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="5"
              placeholder="Digite o texto sobre a empresa"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Atualizar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
