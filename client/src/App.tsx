import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { InstallPWABadge } from './components/InstallPWABadge';
import { NetworkStatus } from './components/NetworkStatus';
import { PageLoading } from './components/PageState';
import { Toaster } from 'react-hot-toast';
import './App.css';

const page=<T extends Record<string,ComponentType<any>>>(loader:()=>Promise<T>,name:keyof T)=>lazy(()=>loader().then(module=>({default:module[name]})));
const Login=page(()=>import('./pages/Login'),'Login');
const FirstAccess=page(()=>import('./pages/FirstAccess'),'FirstAccess');
const ForgotPassword=page(()=>import('./pages/ForgotPassword'),'ForgotPassword');
const Dashboard=page(()=>import('./pages/Dashboard'),'Dashboard');
const Transactions=page(()=>import('./pages/Transactions'),'Transactions');
const Imports=page(()=>import('./pages/Imports'),'Imports');
const Calendar=page(()=>import('./pages/Calendar'),'Calendar');
const Categories=page(()=>import('./pages/Categories'),'Categories');
const Reports=page(()=>import('./pages/Reports'),'Reports');
const Cards=page(()=>import('./pages/Cards'),'Cards');
const IncomeSources=page(()=>import('./pages/IncomeSources'),'IncomeSources');
const Reminders=page(()=>import('./pages/Reminders'),'Reminders');
const Subscription=page(()=>import('./pages/Subscription'),'Subscription');
const Settings=page(()=>import('./pages/Settings'),'Settings');
const Admin=page(()=>import('./pages/Admin'),'Admin');

export default function App(){return <BrowserRouter><ThemeProvider><Toaster position="top-right" toastOptions={{duration:4000}}/><AuthProvider><NetworkStatus/><InstallPWABadge/><Suspense fallback={<PageLoading label="Carregando página…"/>}><Routes><Route element={<AuthLayout/>}><Route path="/login" element={<Login/>}/><Route path="/first-access" element={<FirstAccess/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/></Route><Route element={<AppLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/imports" element={<Imports/>}/><Route path="/reports" element={<Reports/>}/><Route path="/calendar" element={<Calendar/>}/><Route path="/categories" element={<Categories/>}/><Route path="/cards" element={<Cards/>}/><Route path="/income-sources" element={<IncomeSources/>}/><Route path="/reminders" element={<Reminders/>}/><Route path="/subscription" element={<Subscription/>}/><Route path="/settings" element={<Settings/>}/><Route path="/admin" element={<Admin/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense></AuthProvider></ThemeProvider></BrowserRouter>}
