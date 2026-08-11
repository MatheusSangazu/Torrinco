import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Home, PieChart, Calendar, ChevronLeft, ChevronRight, Moon, Sun, Menu, Tag, CreditCard, ArrowRightLeft, Bell, BadgeDollarSign, Shield } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export function AppLayout() {
  const { isAuthenticated, isLoading, logout, user, platformRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileTriggerRef=useRef<HTMLButtonElement>(null);
  const drawerRef=useRef<HTMLDivElement>(null);

  const closeMobileMenu=(restoreFocus=true)=>{setIsMobileMenuOpen(false);if(restoreFocus)requestAnimationFrame(()=>mobileTriggerRef.current?.focus())};
  useEffect(()=>{
    if(!isMobileMenuOpen)return;
    const drawer=drawerRef.current;const focusable=()=>Array.from(drawer?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')??[]);
    focusable()[0]?.focus();
    const keydown=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();closeMobileMenu()}else if(event.key==='Tab'){const items=focusable();if(!items.length)return;const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};
    document.addEventListener('keydown',keydown);return()=>document.removeEventListener('keydown',keydown);
  },[isMobileMenuOpen]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  const financialItems=[{path:'/',label:'INÍCIO',icon:Home},{path:'/transactions',label:'TRANSAÇÕES',icon:ArrowRightLeft},{path:'/categories',label:'CATEGORIAS',icon:Tag},{path:'/cards',label:'CARTÕES',icon:CreditCard},{path:'/reports',label:'RELATÓRIOS',icon:PieChart},{path:'/reminders',label:'LEMBRETES',icon:Bell},{path:'/calendar',label:'AGENDA',icon:Calendar},{path:'/subscription',label:'PLANO',icon:BadgeDollarSign}];
  const platformItems=platformRole==='platform_owner'?[{path:'/admin',label:'ADMINISTRAÇÃO',icon:Shield}]:[];
  const navGroups=[{label:'Finanças pessoais',items:financialItems},...(platformItems.length?[{label:'Ferramentas da plataforma',items:platformItems}]:[])];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-torrinco-600 text-white z-20 flex items-center justify-between px-4 h-16 shadow-md">
         <div className="flex items-center space-x-2">
            <img src="/torrinco.png" alt="Torrinco" className="w-8 h-8 rounded-lg bg-white p-0.5" />
            <span className="text-xl font-bold">Torrinco</span>
         </div>
         <button ref={mobileTriggerRef} onClick={() => isMobileMenuOpen?closeMobileMenu(false):setIsMobileMenuOpen(true)} className="p-2 focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={isMobileMenuOpen?'Fechar menu de navegação':'Abrir menu de navegação'} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation-drawer">
           <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside 
        className={clsx(
          "hidden lg:flex flex-col bg-torrinco-600 text-white transition-all duration-300 ease-in-out fixed h-full z-10",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <img src="/torrinco.png" alt="Torrinco" className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0" />
          {!isSidebarCollapsed && (
            <span className="ml-3 text-2xl font-bold tracking-tight">TORRINCO</span>
          )}
        </div>

        {/* Nav Items */}
        <nav aria-label="Navegação principal" className="flex-1 space-y-5 overflow-y-auto px-3 py-6">
          {navGroups.map(group=><div key={group.label} className="border-t border-torrinco-500/70 pt-3 first:border-0 first:pt-0">{!isSidebarCollapsed&&<p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-torrinco-200">{group.label}</p>}<div className="space-y-1">{group.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive(item.path) 
                  ? "bg-beak-400 text-torrinco-900 font-bold shadow-lg" 
                  : "hover:bg-torrinco-500 text-white"
              )}
            >
              <item.icon className={clsx("w-6 h-6 shrink-0", isActive(item.path) ? "text-torrinco-900" : "text-white")} />
              {!isSidebarCollapsed && (
                <span className="ml-3 text-sm font-bold tracking-wide">{item.label}</span>
              )}
            </Link>
          ))}</div></div>)}
        </nav>

        {/* User & Theme Toggle */}
        <div className="p-4 border-t border-torrinco-500 space-y-4">
           {!isSidebarCollapsed && (
             <div className="flex items-center space-x-3 px-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-torrinco-800 flex items-center justify-center">
                  <span className="font-bold">{user?.name?.[0] || 'U'}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name || 'Usuário'}</p>
                  <button onClick={logout} className="text-xs text-torrinco-200 hover:text-white flex items-center">
                    <LogOut className="w-3 h-3 mr-1" /> Sair
                  </button>
                </div>
             </div>
           )}

           <div className="flex items-center justify-between px-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-torrinco-500 transition-colors text-white"
                title="Alternar Tema"
                aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-torrinco-500 transition-colors text-white"
                aria-label={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center text-xs font-medium"><span className="mr-2">Recolher</span> <ChevronLeft className="w-4 h-4" /></div>}
              </button>
           </div>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => closeMobileMenu()} />
          <div ref={drawerRef} id="mobile-navigation-drawer" role="dialog" aria-modal="true" aria-label="Menu de navegação" className="absolute bottom-0 right-0 top-0 flex w-72 max-w-[88vw] flex-col bg-torrinco-600 p-4 text-white animate-in slide-in-from-right duration-200">
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-torrinco-800 flex items-center justify-center">
                    <span className="font-bold text-sm">{user?.name?.[0] || 'U'}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate max-w-[120px]">{user?.name || 'Usuário'}</p>
                  </div>
               </div>
               <button onClick={() => closeMobileMenu()} aria-label="Fechar menu de navegação" className="rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"><ChevronRight /></button>
             </div>
             <nav aria-label="Navegação principal" className="flex-1 space-y-5 overflow-y-auto">
              {navGroups.map(group=><div key={group.label} className="border-t border-torrinco-500/70 pt-3 first:border-0 first:pt-0"><p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-torrinco-200">{group.label}</p><div className="space-y-1">{group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => closeMobileMenu()}
                  className={clsx(
                    "flex items-center px-4 py-3 rounded-xl",
                    isActive(item.path) ? "bg-beak-400 text-torrinco-900 font-bold" : "text-white"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              ))}</div></div>)}
             </nav>
             <div className="mt-8 border-t border-torrinco-500 pt-4">
                <button onClick={toggleTheme} className="flex items-center w-full px-4 py-2 hover:bg-torrinco-500 rounded-lg">
                  {theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </button>
                <button onClick={logout} className="flex items-center w-full px-4 py-2 mt-2 hover:bg-torrinco-500 rounded-lg text-red-200 hover:text-red-100">
                  <LogOut className="w-5 h-5 mr-3" /> Sair
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={clsx(
        "flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 mt-16 lg:mt-0",
        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <Outlet />
      </main>
    </div>
  );
}
