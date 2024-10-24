import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 p-4 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6 text-gray-700 z-50 transition-all">
      <p className="text-sm md:text-base leading-relaxed">
        Utilizamos cookies para personalizar e melhorar sua experiência em nosso site. Ao continuar navegando, você aceita nossa{' '}
        <a href="/politica-de-privacidade" className="text-blue-600 hover:underline">política de privacidade</a>.
      </p>
      <button
        onClick={handleAcceptCookies}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base w-full md:w-auto"
      >
        Aceitar Cookies
      </button>
    </div>
  );
};

export default CookieConsent;
