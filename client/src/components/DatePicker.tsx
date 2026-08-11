import { useEffect, useId, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';
import { formatLocalDate, formatLocalDateLong, parseLocalDate } from '../lib/local-date';
import 'react-day-picker/dist/style.css';

interface DatePickerProps { label?:string;value:string;onChange:(date:string)=>void;required?:boolean;className?:string;disabled?:boolean;error?:string;help?:string }
const toDate=(value:string)=>{const parts=parseLocalDate(value);return parts?new Date(parts.year,parts.month-1,parts.day):undefined};

export function DatePicker({label,value,onChange,required,className='',disabled=false,error,help}:DatePickerProps){
  const [open,setOpen]=useState(false);const [selected,setSelected]=useState<Date|undefined>(()=>toDate(value));const triggerRef=useRef<HTMLButtonElement>(null);const id=useId();
  const rootRef=useClickOutside<HTMLDivElement>(()=>setOpen(false));
  useEffect(()=>setSelected(toDate(value)),[value]);
  const close=(restore=false)=>{setOpen(false);if(restore)requestAnimationFrame(()=>triggerRef.current?.focus())};
  const select=(date:Date|undefined)=>{setSelected(date);onChange(date?formatLocalDate(date):'');if(date)close(true)};
  const helpId=`${id}-help`,dialogId=`${id}-dialog`;
  return <div className={`relative space-y-1 ${className}`} ref={rootRef}>{label&&<label id={`${id}-label`} className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}{required&&<span className="text-red-500"> *</span>}</label>}<div className="relative"><button ref={triggerRef} type="button" aria-labelledby={label?`${id}-label`:undefined} aria-haspopup="dialog" aria-expanded={open} aria-controls={dialogId} aria-describedby={(error||help)?helpId:undefined} aria-invalid={Boolean(error)} disabled={disabled} onClick={()=>setOpen(current=>!current)} onKeyDown={event=>{if(event.key==='Escape'&&open){event.preventDefault();close(true)}}} className={`flex min-h-11 w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-left text-sm dark:bg-slate-900 ${error?'border-red-400 focus:ring-red-500':'border-gray-200 focus:ring-torrinco-500 dark:border-slate-700'} focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60`}><span className={selected?'capitalize text-gray-900 dark:text-white':'text-gray-400'}>{selected?formatLocalDateLong(formatLocalDate(selected)):'Selecione uma data'}</span><CalendarIcon aria-hidden="true" className="h-5 w-5 text-gray-400"/></button>{selected&&!disabled&&<button type="button" aria-label="Limpar data" onClick={()=>{setSelected(undefined);onChange('');close()}} className="absolute right-9 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"><X className="h-4 w-4"/></button>}</div>{(error||help)&&<p id={helpId} className={`text-xs ${error?'text-red-600 dark:text-red-400':'text-gray-500'}`}>{error||help}</p>}{open&&<div id={dialogId} role="dialog" aria-label={label?`Escolher ${label}`:'Escolher data'} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close(true)}}} className="absolute z-50 mt-1 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800"><DayPicker autoFocus mode="single" selected={selected} onSelect={select} locale={ptBR} modifiersClassNames={{selected:'bg-torrinco-600 text-white',today:'font-bold text-torrinco-600'}}/></div>}</div>;
}
