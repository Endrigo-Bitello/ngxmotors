import React from 'react';

const GoogleMaps = () => {
  // Obtenha o endereço do ambiente e codifique para URL
  const address = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_MAPS);

  // URL do Google Maps para incorporação sem API Key
  const mapUrl = `https://www.google.com/maps?q=${address}&output=embed`;

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
