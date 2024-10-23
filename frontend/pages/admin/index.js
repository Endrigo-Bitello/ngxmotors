import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { setSEO } from '@/utils/seo';
const LoadingAdmin = dynamic(() => import('../components/admin/LoadingAdmin'));




export default function AdminIndex() {
  const router = useRouter();

  const [settings, setSettings] = useState(null); 

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
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

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Se o token existir, redireciona para o dashboard
      router.push('/admin/dashboard');
    } else {
      // Se não houver token, redireciona para o login
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingAdmin />
    </div>
  );
}
