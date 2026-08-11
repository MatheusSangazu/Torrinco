import { useEffect, useId, useRef, useState } from 'react';
import { CalendarClock, X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';
import { formatLocalDateShort, isLocalDate, isLocalTime } from '../lib/local-date';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';

interface DateTimePickerProps { label: string; value: string; onChange: (value: string) => void }
const parts=(value:string)=>{const [date='',timePart='']=value.split('T');const time=timePart.slice(0,5);return {date:isLocalDate(date)?date:'',time:isLocalTime(time)?time:''}};

export function DateTimePicker({label,value,onChange}:DateTimePickerProps){
  const initial=parts(value);const [open,setOpen]=useState(false);const [date,setDate]=useState(initial.date);const [time,setTime]=useState(initial.time);const triggerRef=useRef<HTMLButtonElement>(null);const id=useId();const rootRef=useClickOutside<HTMLDivElement>(()=>setOpen(false));
  useEffect(()=>{const next=parts(value);setDate(next.date);setTime(next.time)},[value]);
  const close=(restore=false)=>{setOpen(false);if(restore)requestAnimationFrame(()=>triggerRef.current?.focus())};
  const selected=isLocalDate(date)&&isLocalTime(time);
  const confirm=()=>{if(selected){onChange(`${date}T${time}`);close(true)}};
  return <div ref={rootRef} className="relative space-y-1"><label id={`${id}-label`} className="block text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label><div className="relative"><button ref={triggerRef} type="button" aria-labelledby={`${id}-label`} aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(current=>!current)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-left text-sm outline-none transition hover:border-gray-300 focus:ring-2 focus:ring-torrinco-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600"><span className={selected?'text-gray-900 dark:text-white':'text-gray-400'}>{selected?`${formatLocalDateShort(date)} às ${time}`:'Selecione data e hora'}</span><CalendarClock aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-400"/></button>{value&&<button type="button" aria-label={`Limpar ${label}`} onClick={()=>{onChange('');setDate('');setTime('');close()}} className="absolute right-10 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-slate-800"><X className="h-4 w-4"/></button>}</div>{open&&<div role="dialog" aria-label={`Escolher ${label}`} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close(true)}}} className="absolute z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800"><div className="space-y-4"><DatePicker label="Data" value={date} onChange={setDate}/><TimePicker label="Horário" value={time} onChange={setTime}/></div><div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-slate-700"><button type="button" onClick={()=>close(true)} className="min-h-11 flex-1 rounded-xl border border-gray-200 px-3 text-sm font-semibold dark:border-slate-600">Cancelar</button><button type="button" disabled={!selected} onClick={confirm} className="min-h-11 flex-1 rounded-xl bg-torrinco-600 px-3 text-sm font-semibold text-white disabled:opacity-50">Aplicar</button></div></div>}</div>;
}
