import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const LoadingAdmin = dynamic(() => import('../components/admin/LoadingAdmin'));

export default function AdminIndex() {
  const router = useRouter();

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
