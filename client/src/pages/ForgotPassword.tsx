import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, KeyRound, ChevronLeft } from 'lucide-react';

export function ForgotPassword() {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/request-password-reset', {
        phone_number: phoneNumber,
      });
      setStep('verify');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao solicitar código. Verifique o número.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        phone_number: phoneNumber,
        code,
        new_password: newPassword
      });
      setSuccess('Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao redefinir senha. Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recuperar Senha</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {step === 'phone' 
            ? 'Informe seu telefone para receber o código' 
            : 'Digite o código recebido e sua nova senha'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
          {success}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleRequestCode} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Seu Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-torrinco-500 focus:border-transparent dark:bg-slate-900 dark:text-white sm:text-sm transition-all"
                placeholder="5511999999999"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-torrinco-500/20 text-sm font-bold text-white bg-torrinco-600 hover:bg-torrinco-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-torrinco-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Enviando...
              </>
            ) : (
              <>
                Enviar Código
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Código de Verificação
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-torrinco-500 focus:border-transparent dark:bg-slate-900 dark:text-white sm:text-sm transition-all tracking-widest text-center text-lg font-mono"
                placeholder="000000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
              (Código de teste: Verifique o console do servidor)
            </p>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nova Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-torrinco-500 focus:border-transparent dark:bg-slate-900 dark:text-white sm:text-sm transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-torrinco-500 focus:border-transparent dark:bg-slate-900 dark:text-white sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-torrinco-500/20 text-sm font-bold text-white bg-torrinco-600 hover:bg-torrinco-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-torrinco-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Redefinindo...
              </>
            ) : (
              <>
                Salvar Nova Senha
                <CheckCircle className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full flex justify-center items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
        </form>
      )}

      <div className="text-center mt-4 border-t border-gray-200 dark:border-slate-700 pt-4">
        <Link to="/login" className="text-sm font-medium text-torrinco-600 hover:text-torrinco-500 dark:text-torrinco-400 dark:hover:text-torrinco-300 transition-colors">
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}
