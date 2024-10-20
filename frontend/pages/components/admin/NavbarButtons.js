import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCarAlt,
  faMessage,
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons';
import Overview from './Overview';

export default function NavbarButtons() {
  const [view, setView] = useState('overview');
  const [extraSpace, setExtraSpace] = useState(false);

  // Itens de navegação (sem títulos, apenas ícones)
  const navigationItems = [
    { name: 'Visão Geral', view: 'overview', icon: faHome },
    { name: 'Estoque', view: 'stock', icon: faCarAlt },
    { name: 'Simulações', view: 'simulations', icon: faCashRegister },
    { name: 'Mensagens', view: 'mensagens', icon: faMessage },
  ];

  // Função para verificar se a navbar está sobrepondo o conteúdo final
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolledAmount = window.scrollY;

      if (windowHeight + scrolledAmount >= documentHeight - 50) { // Ajuste do valor
        setExtraSpace(true); // Adiciona espaço ao final da página
      } else {
        setExtraSpace(false); // Remove o espaço se não estiver no final
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Renderização condicional baseada no estado `view`
  const renderContent = () => {
    switch (view) {
      case 'overview':
        return <div> </div>;
      case 'stock':
        return <div>Conteúdo do Estoque</div>;
      case 'simulations':
        return <div>Conteúdo das Simulações</div>;
      case 'mensagens':
        return <div>Conteúdo das Mensagens</div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navbar inferior para dispositivos móveis */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 shadow-md p-4 flex justify-around md:hidden text-xs">
        {navigationItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center text-gray-300 hover:bg-gradient-to-r from-purple-600 to-purple-500 p-3 rounded-lg ${view === item.view ? 'bg-gradient-to-r from-purple-600 to-purple-500' : ''
              }`}
          >
            <FontAwesomeIcon icon={item.icon} size="lg" />
          </button>
        ))}
      </nav>

      {/* Renderizar conteúdo com base na navegação */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* Espaço extra ao final da página para evitar sobreposição */}
      {extraSpace && <div className="h-32"></div>} {/* Aumentei o valor para 32 */}
    </>
  );
}
