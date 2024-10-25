// components/Apresentacao.js

import React from 'react';
import styles from './apresentacao.module.css'; // Importando o CSS Module

const Apresentacao = () => {
  return (
    <div className={styles.container}>
      {/* Seção de Headline */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          Sua revenda no próximo nível.
        </h1>
        <p className={styles.subtitle}>
          Plataforma completa para revendas de veículos. Gerencie seu estoque, alcance mais clientes e impulsione suas vendas com facilidade.
        </p>
        {/* Botão Estilizado com TailwindCSS */}
        <div className="relative group">
          <div
            className="relative w-64 h-14 opacity-90 overflow-hidden rounded-xl bg-black z-10"
          >
            <div
              className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"
            ></div>

            <div
              className="absolute flex items-center justify-center text-white z-20 opacity-90 rounded-2xl inset-0.5 bg-black"
            >
              <button
                name="text"
                className="font-semibold text-lg h-full opacity-90 w-full px-16 py-3 rounded-xl bg-black"
              >
                Começar Hoje
              </button>
            </div>
            <div
              className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-green-500 to-yellow-500 blur-[30px]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apresentacao;
