import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-screen flex items-center justify-center">Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200" style={{ paddingTop: 'max(3rem, var(--app-safe-top))', paddingRight: 'max(1rem, var(--app-safe-right))', paddingBottom: 'max(3rem, var(--app-safe-bottom))', paddingLeft: 'max(1rem, var(--app-safe-left))' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/torrinco.png" 
            alt="Torrinco Logo" 
            className="h-24 w-auto object-contain drop-shadow-lg"
          />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
          Gerencie suas finanças com inteligência
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-700">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
