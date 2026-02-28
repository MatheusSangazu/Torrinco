import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { FirstAccess } from './pages/FirstAccess';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Calendar } from './pages/Calendar';
import { Categories } from './pages/Categories';
import { Reports } from './pages/Reports';
import { Cards } from './pages/Cards';
import { IncomeSources } from './pages/IncomeSources';
import { Reminders } from './pages/Reminders';
import { InstallPWABadge } from './components/InstallPWABadge';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <AuthProvider>
          <InstallPWABadge />
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/first-access" element={<FirstAccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/income-sources" element={<IncomeSources />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/settings" element={<div className="p-4 text-gray-900 dark:text-white">Configurações (Em breve)</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
