import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Não esqueça de importar axios

const GoogleMaps = () => {
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data); 
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Verifique se `settings` existe antes de tentar acessar `address`
  if (!settings) {
    return <p>Carregando mapa...</p>;
  }

  const location = encodeURIComponent(settings.address);

  // URL do Google Maps para incorporação sem API Key
  const mapUrl = `https://www.google.com/maps?q=${location}&output=embed`;

  return (
    <div className="w-full h-64 md:h-96 mt-12">
      <iframe
        title="Localização no Google Maps"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default GoogleMaps;
