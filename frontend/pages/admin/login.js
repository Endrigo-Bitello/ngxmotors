import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { setSEO } from '../../utils/seo';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setSEO({ title: 'Login - Acesse sua conta' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/admin/dashboard';
      } else {
        setError('Falha ao obter o token JWT.');
      }
    } catch (error) {
      setError('Login falhou, verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <Image
            src="/logo-light.png"
            alt="Logo"
            width={128} 
            height={0} 
            className="w-24 md:w-32 h-auto mx-auto"
            priority={true} 
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-white">Seja bem-vindo</h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
