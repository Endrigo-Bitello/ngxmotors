import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LoadingPanel from '@/pages/components/admin/LoadingPanel';
const Loading = dynamic(() => import('../../frontend/pages/components/Loading'), { ssr: false });

const withAuth = (Component) => {
  return function AuthProtected(props) {
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      // Se não houver token, redireciona para o login
      if (!token) {
        router.push('/admin/login');
      } else {
        setLoading(false); // Finaliza o carregamento após a verificação do token
      }
    }, [router]);

    if (loading) {
      // Exibe um estado de carregamento enquanto verifica a autenticação
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoadingPanel />
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withAuth;
