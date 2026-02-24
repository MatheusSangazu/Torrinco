import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2, Eye, EyeOff, Key, ShieldCheck, RefreshCw } from 'lucide-react';

type Step = 'phone' | 'code' | 'password';

export function FirstAccess() {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await api.post('/auth/request-first-access-code', {
        phone_number: phoneNumber,
      });
      setSuccessMessage('Código enviado via WhatsApp!');
      setStep('code');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Falha ao enviar código. Verifique o número ou entre em contato com o administrador.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/validate-first-access-code', {
        phone_number: phoneNumber,
        code,
      });
      setSuccessMessage('Código validado!');
      setStep('password');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/create-password', {
        phone_number: phoneNumber,
        code,
        password,
      });

      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Falha ao definir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={step === 'phone' ? handleRequestCode : step === 'code' ? handleSubmitCode : handleSubmitPassword}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primeiro Acesso</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {step === 'phone' && 'Informe seu telefone para receber o código de verificação'}
          {step === 'code' && 'Digite o código recebido via WhatsApp'}
          {step === 'password' && 'Crie sua senha para ativar sua conta'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
          {successMessage}
        </div>
      )}
      
      {step === 'phone' && (
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
      )}

      {step === 'code' && (
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Código de Verificação
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-torrinco-500 focus:border-transparent dark:bg-slate-900 dark:text-white sm:text-sm transition-all text-center text-lg tracking-widest font-mono"
              placeholder="000000"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRequestCode({ preventDefault: () => {} } as React.FormEvent)}
            className="mt-2 text-sm text-torrinco-600 hover:text-torrinco-500 dark:text-torrinco-400 dark:hover:text-torrinco-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Reenviar código
          </button>
        </div>
      )}

      {step === 'password' && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nova Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-gray-400" />
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
        </>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-torrinco-500/20 text-sm font-bold text-white bg-torrinco-600 hover:bg-torrinco-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-torrinco-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              {step === 'phone' && 'Enviando código...'}
              {step === 'code' && 'Validando código...'}
              {step === 'password' && 'Criando senha...'}
            </>
          ) : (
            <>
              {step === 'phone' && (
                <>
                  Enviar Código
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
              {step === 'code' && (
                <>
                  Validar Código
                  <ShieldCheck className="ml-2 h-5 w-5" />
                </>
              )}
              {step === 'password' && (
                <>
                  Ativar Conta
                  <ShieldCheck className="ml-2 h-5 w-5" />
                </>
              )}
            </>
          )}
        </button>
      </div>

      <div className="flex justify-between mt-4">
        {step !== 'phone' && (
          <button
            type="button"
            onClick={() => setStep(step === 'code' ? 'phone' : 'code')}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Voltar
          </button>
        )}
        <Link 
          to="/login" 
          className={`text-sm font-medium text-torrinco-600 hover:text-torrinco-500 dark:text-torrinco-400 dark:hover:text-torrinco-300 transition-colors ${step !== 'phone' ? 'ml-auto' : ''}`}
        >
          Já tem senha? Faça login
        </Link>
      </div>
    </form>
  );
}
