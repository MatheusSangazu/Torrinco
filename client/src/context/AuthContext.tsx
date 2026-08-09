import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, setAccessToken } from '../services/api';

interface User {
  id: number;
  name: string;
  phone_number: string;
  role: string;
  account_id: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  platformRole: 'platform_owner' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformRole, setPlatformRole] = useState<'platform_owner' | null>(null);

  useEffect(() => {
    // Em mount, tenta restaurar sessão via cookie HttpOnly (refresh automático).
    // Access token NÃO é persistido em localStorage.
    const restoreSession = async () => {
      try {
        // Tenta refresh via cookie — se funcionar, acessa /me com o novo token.
        const refreshRes = await api.post('/auth/refresh-token', {});
        if (refreshRes.data?.accessToken) {
          setAccessToken(refreshRes.data.accessToken);
          try {
            const meRes = await api.get('/auth/me');
            setUser(meRes.data.user);
            try { await api.get('/platform-admin/me'); setPlatformRole('platform_owner'); } catch { setPlatformRole(null); }
          } catch {
            setAccessToken(null);
          }
        }
      } catch {
        // Sem cookie válido = não autenticado (silencioso).
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
    api.get('/platform-admin/me').then(()=>setPlatformRole('platform_owner')).catch(()=>setPlatformRole(null));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Mesmo se falhar, limpa localmente.
    }
    setAccessToken(null);
    setUser(null);
    setPlatformRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout, platformRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
