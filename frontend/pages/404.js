import dynamic from 'next/dynamic';

import React from 'react';
import Link from 'next/link';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
const GoogleMaps = dynamic(() => import('./components/GoogleMaps'));

export default function Custom404() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Página não encontrada</p>
        <Link href="/" legacyBehavior>
          <div className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg cursor-pointer">
            Voltar para a Página Inicial
          </div>
        </Link>
      </div>
      <GoogleMaps />
      <Footer />
    </>
  );
}
