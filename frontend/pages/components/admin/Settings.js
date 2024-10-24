import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('informacoes'); // Tab ativa
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
  const [taxaValue, setTaxaValue] = useState('');
  const [taxaString, setTaxaString] = useState('');

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      if (data) {
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
        setTaxaValue(data.taxaValue || '');
        setTaxaString(`${data.taxaValue || ''}%`);
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setTaxaString(`${taxaValue}%`);
  }, [taxaValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/update-settings`, {
        address, whatsappNumber, phoneNumber, email, name, instagramUrl, facebookUrl, twitterUrl, linkedinUrl, tiktokUrl, openingHours, whatsappMessage, city, googleMaps, websiteUrl, slogan, about, taxaValue, taxaString,
      });
      alert('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      alert('Erro ao atualizar configurações');
    }
  };

  const renderFormContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite o endereço" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone Fixo</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite o telefone fixo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário de Atendimento</label>
              <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite o horário de atendimento" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite a cidade" />
            </div>
          </>
        );




        case 'redes-sociais':
  return (
    <>
      {/* Instagram */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Instagram</label>
        <div className="relative mt-1">
          {/* Parte fixa da URL */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            https://instagram.com/
          </span>
          {/* Campo para editar apenas o usuário */}
          <input
            type="text"
            value={instagramUrl.replace('https://instagram.com/', '')} // Exibe apenas o usuário, removendo a parte fixa da URL
            onChange={(e) => setInstagramUrl(`https://instagram.com/${e.target.value}`)} // Atualiza a URL completa
            className="block w-full pl-[190px] pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Digite o usuário do Instagram"
          />
        </div>
      </div>


      {/* TikTok */}

      <div>
        <label className="block text-sm font-medium text-gray-700">TikTok</label>
        <div className="relative mt-1">
          {/* Parte fixa da URL */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            https://tiktok.com/@
          </span>
          {/* Campo para editar apenas o usuário */}
          <input
            type="text"
            value={facebookUrl.replace('https://tiktok.com/', '')} // Exibe apenas o usuário
            onChange={(e) => setTiktokUrl(`https://tiktok.com/${e.target.value}`)} // Atualiza a URL completa
            className="block w-full pl-[185px] pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Digite o usuário do TikTok"
          />
        </div>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
        <div className="relative mt-1">
          {/* Parte fixa da URL */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            https://linkedin.com/
          </span>
          {/* Campo para editar apenas o usuário */}
          <input
            type="text"
            value={facebookUrl.replace('https://linkedin.com/', '')} // Exibe apenas o usuário
            onChange={(e) => setTiktokUrl(`https://tiktok.com/${e.target.value}`)} // Atualiza a URL completa
            className="block w-full pl-[185px] pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Digite o usuário do TikTok"
          />
        </div>
      </div>

      {/* Facebook */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Facebook</label>
        <div className="relative mt-1">
          {/* Parte fixa da URL */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            https://facebook.com/
          </span>
          {/* Campo para editar apenas o usuário */}
          <input
            type="text"
            value={facebookUrl.replace('https://facebook.com/', '')} 
            onChange={(e) => setFacebookUrl(`https://facebook.com/${e.target.value}`)}
            className="block w-full pl-[185px] pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Digite o usuário do Facebook"
          />
        </div>
      </div>

      {/* Twitter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">X (Twitter)</label>
        <div className="relative mt-1">
          {/* Parte fixa da URL */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            https://twitter.com/
          </span>
          {/* Campo para editar apenas o usuário */}
          <input
            type="text"
            value={twitterUrl.replace('https://linkedin.com/', '')} 
            onChange={(e) => setLinkedinUrl(`https://linkedin.com/${e.target.value}`)} 
            className="block w-full pl-[155px] pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Digite o usuário do Twitter"
          />
        </div>
      </div>
    </>
  );



      case 'empresa':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Estabelecimento</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite o nome do estabelecimento" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slogan</label>
              <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" placeholder="Digite o slogan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sobre a Empresa</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" rows="5" placeholder="Digite o texto sobre a empresa" />
            </div>
          </>
        );

      case 'taxas':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entrada Mínima para Simulação de Financiamento</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  %
                </span>
                <input
                  type="number"
                  value={taxaValue}
                  onChange={(e) => {
                    if (e.target.value.length <= 3) {
                      setTaxaValue(e.target.value);
                    }
                  }}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Digite a entrada mínima para financiamento"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {taxaValue >= 70 && (
              <div className="mt-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p className="font-bold">Atenção!</p>
                <p>A taxa de entrada mínima inserida está acima de 70%, o que pode ser considerado fora do padrão de mercado. Certifique-se de que está correto.</p>
              </div>
            )}
          </>
        );




      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Configurações Gerais</h1>
      <p className="mb-10 text-gray-600 leading-relaxed text-lg">
        Configure as informações de contato, redes sociais, e outros detalhes da sua empresa. Certifique-se de que os campos estejam preenchidos corretamente antes de salvar.
      </p>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('informacoes')} className={`px-4 py-2 rounded-lg ${activeTab === 'informacoes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Informações Gerais</button>
        <button onClick={() => setActiveTab('redes-sociais')} className={`px-4 py-2 rounded-lg ${activeTab === 'redes-sociais' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Redes Sociais</button>
        <button onClick={() => setActiveTab('empresa')} className={`px-4 py-2 rounded-lg ${activeTab === 'empresa' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Sobre a Empresa</button>
        <button onClick={() => setActiveTab('taxas')} className={`px-4 py-2 rounded-lg ${activeTab === 'taxas' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Taxas</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderFormContent()}

        <div className="flex justify-end mt-8">
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700">
            Atualizar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
