import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
export function NetworkStatus(){
 const [online,setOnline]=useState(()=>navigator.onLine);
 useEffect(()=>{const on=()=>setOnline(true);const off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off)}},[]);
 useEffect(()=>{document.documentElement.dataset.networkOffline=String(!online);return()=>{delete document.documentElement.dataset.networkOffline}},[online]);
 if(online)return null;
 return <div role="status" aria-live="polite" className="app-network-status fixed inset-x-0 bottom-0 z-[100] flex min-h-14 items-center justify-center gap-2 bg-amber-500 py-2 text-center text-sm font-semibold text-amber-950"><WifiOff className="h-4 w-4 shrink-0" aria-hidden="true"/><span>Você está offline. Operações financeiras ficam indisponíveis até a conexão voltar.</span></div>
}
