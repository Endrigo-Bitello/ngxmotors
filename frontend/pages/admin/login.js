import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { setSEO } from '../../utils/seo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`
      );
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  useEffect(() => {
    fetchSettings(); // Busca as configurações quando o componente é montado
  }, []);

  useEffect(() => {
    if (settings) {
      setSEO({ title: `${settings.name} - Autenticação` });
    }
  }, [settings]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={0}
            className="mx-auto max-w-xs"
            priority={true}
          />
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600 mt-2">
            Faça login com seu e-mail e senha
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Endereço de e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              ENTRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
