import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export interface ComboboxOption { value: string | number; label: string }
export interface ComboboxProps {
  label?: string; value: string | number; onChange: (value: string | number) => void;
  options: ComboboxOption[]; placeholder?: string; className?: string; required?: boolean;
  disabled?: boolean; error?: string; help?: string; searchable?: boolean;
}

export function Combobox({ label,value,onChange,options,placeholder='Selecione...',className='',required,disabled=false,error,help,searchable }:ComboboxProps) {
  const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const [active,setActive]=useState(0);
  const triggerRef=useRef<HTMLButtonElement>(null);const searchRef=useRef<HTMLInputElement>(null);const id=useId();
  const rootRef=useClickOutside<HTMLDivElement>(()=>setOpen(false));
  const canSearch=searchable??options.length>8;
  const visible=useMemo(()=>options.filter(option=>option.label.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))),[options,query]);
  const selected=options.find(option=>String(option.value)===String(value));
  const close=(restore=false)=>{setOpen(false);setQuery('');if(restore)requestAnimationFrame(()=>triggerRef.current?.focus())};
  const choose=(option:ComboboxOption)=>{onChange(option.value);close(true)};
  const move=(delta:number)=>{setOpen(true);setActive(index=>Math.max(0,Math.min((open?visible.length:options.length)-1,index+delta)))};
  const keyDown=(event:React.KeyboardEvent)=>{if(event.key==='ArrowDown'){event.preventDefault();move(1)}else if(event.key==='ArrowUp'){event.preventDefault();move(-1)}else if(event.key==='Home'&&open){event.preventDefault();setActive(0)}else if(event.key==='End'&&open){event.preventDefault();setActive(Math.max(0,visible.length-1))}else if(event.key==='Enter'&&open&&visible[active]){event.preventDefault();choose(visible[active])}else if(event.key==='Escape'&&open){event.preventDefault();close(true)}};
  useEffect(()=>{if(open){setActive(Math.max(0,visible.findIndex(option=>String(option.value)===String(value))));if(canSearch)requestAnimationFrame(()=>searchRef.current?.focus())}},[open,canSearch]);
  useEffect(()=>{if(!open)setQuery('')},[open]);
  useEffect(()=>setActive(0),[query]);
  const helpId=`${id}-help`,listId=`${id}-list`;
  return <div className={`relative space-y-1 ${className}`} ref={rootRef}>{label&&<label id={`${id}-label`} className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}{required&&<span className="text-red-500"> *</span>}</label>}<button ref={triggerRef} type="button" role="combobox" aria-labelledby={label?`${id}-label`:undefined} aria-expanded={open} aria-controls={listId} aria-activedescendant={open&&visible[active]?`${id}-option-${active}`:undefined} aria-describedby={(error||help)?helpId:undefined} aria-invalid={Boolean(error)} disabled={disabled} onClick={()=>setOpen(current=>!current)} onKeyDown={keyDown} className={`flex min-h-11 w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-left text-sm transition dark:bg-slate-900 ${error?'border-red-400 focus:ring-red-500':'border-gray-200 focus:ring-torrinco-500 dark:border-slate-700'} focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60`}><span className={`truncate ${selected?'text-gray-900 dark:text-white':'text-gray-400'}`}>{selected?.label||placeholder}</span><ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-gray-400 transition ${open?'rotate-180':''}`}/></button>{(error||help)&&<p id={helpId} className={`text-xs ${error?'text-red-600 dark:text-red-400':'text-gray-500'}`}>{error||help}</p>}{open&&<div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800" onKeyDown={keyDown}>{canSearch&&<div className="relative p-2"><Search aria-hidden="true" className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/><input ref={searchRef} value={query} onChange={event=>setQuery(event.target.value)} aria-label={`Pesquisar ${label||'opções'}`} className="min-h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-900"/></div>}<div id={listId} role="listbox" aria-label={label||'Opções'} className="max-h-60 overflow-y-auto p-1">{visible.length?visible.map((option,index)=><button id={`${id}-option-${index}`} role="option" aria-selected={String(option.value)===String(value)} key={option.value} type="button" onMouseEnter={()=>setActive(index)} onClick={()=>choose(option)} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${index===active?'bg-gray-100 dark:bg-slate-700':''} ${String(option.value)===String(value)?'font-semibold text-torrinco-700 dark:text-torrinco-300':'text-gray-700 dark:text-slate-200'}`}><span className="truncate">{option.label}</span>{String(option.value)===String(value)&&<Check aria-hidden="true" className="h-4 w-4"/>}</button>):<p className="p-4 text-center text-sm text-gray-500">Nenhuma opção encontrada</p>}</div></div>}</div>;
}
