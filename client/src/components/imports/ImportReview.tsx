import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, ChevronDown, ChevronRight, FileSpreadsheet, Loader2, Pencil, ShieldCheck, X } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { importsService, type FinancialImport, type ImportItem } from '../../services/imports.service';
import { getApiErrorMessage } from '../../lib/api-error';
import { formatLocalDateShort, localDateFromApi } from '../../lib/local-date';
import { CustomSelect } from '../CustomSelect';
import { ConfirmModal } from '../ConfirmModal';
import { CategorySelect } from '../CategorySelect';
import { DatePicker } from '../DatePicker';

type Option = { id: number; name: string };
type Filter = 'all' | 'ready' | 'review' | 'duplicates' | 'ignored';
type Props = { value: FinancialImport; entities: Option[]; categories: Option[]; onChange: (value: FinancialImport) => void; onExit: () => void; onCompleted: () => Promise<void> };

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format;
const fieldClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-torrinco-500 focus:ring-2 focus:ring-torrinco-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white';
const documentLabels: Record<string, string> = { card_statement: 'Fatura de cartão', bank_statement: 'Extrato bancário', spreadsheet: 'Planilha', boleto: 'Boleto', receipt: 'Comprovante', unknown: 'Documento financeiro' };
const duplicateLabels: Record<string, string> = { existing_transaction: 'Já existe no Torrinco', within_document: 'Repetido neste arquivo', previous_import: 'Importado anteriormente' };

function needsReview(item: ImportItem, target?: number | null) {
  return item.requires_review || Number(item.confidence) < .8 || item.category_id == null || (item.entity_id == null && target === null);
}
function matches(item: ImportItem, filter: Filter, target?: number | null) {
  if (filter === 'all') return true;
  if (filter === 'duplicates') return Boolean(item.duplicate_kind);
  if (filter === 'ignored') return !item.included && !item.duplicate_kind;
  if (filter === 'review') return !item.duplicate_kind && needsReview(item, target);
  return item.included && !item.duplicate_kind && !needsReview(item, target);
}

export function ImportReview({ value, entities, categories, onChange, onExit, onCompleted }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [busy, setBusy] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pendingDuplicate, setPendingDuplicate] = useState<ImportItem | null>(null);
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [differenceReason, setDifferenceReason] = useState('');
  const [confirmDifference, setConfirmDifference] = useState(false);
  const [confirmDuplicates, setConfirmDuplicates] = useState(false);
  const editVersions = useRef(new Map<number, number>());

  const counts = useMemo(() => Object.fromEntries((['all', 'ready', 'review', 'duplicates', 'ignored'] as Filter[]).map(key => [key, value.items.filter(item => matches(item, key, value.target_entity_id)).length])) as Record<Filter, number>, [value]);
  const shown = useMemo(() => value.items.filter(item => matches(item, filter, value.target_entity_id)), [value, filter]);
  const duplicateIncluded = value.items.filter(item => item.included && item.duplicate_kind).length;
  const hasDifference = value.reconciliation.difference != null && Math.abs(value.reconciliation.difference) >= .01;

  const updateBatch = async (data: object) => {
    setBusy(true);
    try { onChange(await importsService.update(value.id, data)); }
    catch (error) { toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o destino.')); }
    finally { setBusy(false); }
  };
  const patchItem = async (item: ImportItem, changes: Partial<ImportItem>) => {
    if (changes.included && item.duplicate_kind) { setPendingDuplicate(item); return; }
    const version = (editVersions.current.get(item.id) || 0) + 1;
    editVersions.current.set(item.id, version);
    onChange({ ...value, items: value.items.map(candidate => candidate.id === item.id ? { ...candidate, ...changes } : candidate) });
    try {
      const updated = await importsService.item(value.id, item.id, changes);
      if (editVersions.current.get(item.id) === version) onChange(updated);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Não foi possível salvar a alteração.'));
      onChange(await importsService.get(value.id));
    }
  };
  const applyBulk = async (changes: object) => {
    const ids = shown.filter(item => !('included' in changes && (changes as { included?: boolean }).included && item.duplicate_kind)).map(item => item.id);
    if (!ids.length) return toast.error('Não há itens compatíveis neste filtro. Duplicados precisam de confirmação individual.');
    setBusy(true);
    try { onChange(await importsService.bulkItems(value.id, ids, changes)); toast.success(`Alteração aplicada a ${ids.length} lançamento(s).`); }
    catch (error) { toast.error(getApiErrorMessage(error)); }
    finally { setBusy(false); }
  };
  const cancel = async () => {
    setBusy(true);
    try { await importsService.cancel(value.id); toast.success('Rascunho descartado.'); onExit(); await onCompleted(); }
    catch (error) { toast.error(getApiErrorMessage(error)); }
    finally { setBusy(false); setCancelOpen(false); }
  };
  const confirm = async () => {
    if ((hasDifference && (!confirmDifference || !differenceReason.trim())) || (duplicateIncluded > 0 && !confirmDuplicates)) return;
    setBusy(true);
    try {
      await importsService.confirm(value.id, { allow_difference: hasDifference, difference_reason: hasDifference ? differenceReason.trim() : undefined, allow_duplicates: duplicateIncluded > 0 && confirmDuplicates });
      toast.success('Importação concluída com sucesso.'); setConfirmOpen(false); onChange(await importsService.get(value.id)); await onCompleted();
    } catch (error) { toast.error(getApiErrorMessage(error, 'A importação falhou. Nenhum lançamento parcial foi criado.')); }
    finally { setBusy(false); }
  };

  return <div className="space-y-4 pb-28">
    <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3"><span className="rounded-xl bg-torrinco-50 p-2.5 text-torrinco-600 dark:bg-torrinco-950/30"><FileSpreadsheet size={22}/></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-torrinco-600">Etapa 2 de 3 · Revisar</p><h2 className="truncate text-lg font-bold text-gray-800 dark:text-white">{value.file_name}</h2><p className="text-sm text-gray-500 dark:text-slate-400">{documentLabels[value.document_type] || documentLabels.unknown} · {value.items.length} lançamentos encontrados</p></div></div>
        <div className="w-full lg:max-w-md"><CustomSelect label="Destino da importação" value={value.target_entity_id || ''} disabled={busy || value.status !== 'review'} onChange={selected => void updateBatch({ target_entity_id: selected === '' ? null : Number(selected) })} placeholder="Escolha uma conta ou cartão" options={entities.map(entity => ({ value: entity.id, label: entity.name }))}/><p className="mt-1 text-xs text-gray-500">Todos os lançamentos herdam este destino, salvo exceções editadas.</p></div>
      </div>
    </header>

    <ImportSummary value={value}/>
    {value.document_type === 'card_statement' && <details className="group rounded-xl bg-blue-50/70 px-4 py-3 text-blue-900 dark:bg-blue-950/25 dark:text-blue-200"><summary className="cursor-pointer list-none text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-torrinco-500">Como funciona a importação de fatura? <ChevronDown className="inline transition group-open:rotate-180" size={16}/></summary><p className="mt-2 text-sm leading-6 opacity-90">As compras mantêm suas datas originais e entram no ciclo do cartão escolhido. Em uma importação posterior, itens já existentes no mesmo cartão serão sinalizados para revisão.</p></details>}

    <section className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filtrar lançamentos" className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-slate-900/60">{([['all','Todos'],['ready','Prontos'],['review','Revisar'],['duplicates','Duplicados'],['ignored','Ignorados']] as [Filter,string][]).map(([key,label]) => <button role="tab" aria-selected={filter === key} key={key} onClick={() => setFilter(key)} className={clsx('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-torrinco-500', filter === key ? 'bg-white text-torrinco-700 shadow-sm dark:bg-slate-700 dark:text-torrinco-300' : 'text-gray-500 hover:text-gray-800 dark:text-slate-400')}>{label} <span className="ml-1 tabular-nums opacity-70">{counts[key]}</span></button>)}</div>
        <button onClick={() => setBulkOpen(open => !open)} aria-expanded={bulkOpen} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500 dark:border-slate-600 dark:text-slate-200"><Pencil size={15}/>Editar em massa</button>
      </div>
      {bulkOpen && <div className="mt-3 grid items-end gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-2 xl:grid-cols-[auto_auto_minmax(180px,1fr)_auto_minmax(180px,1fr)_auto] dark:bg-slate-900/40">
        <p className="sm:col-span-2 xl:col-span-6 text-xs text-gray-500">Aplicar aos {shown.length} itens exibidos. Duplicados só podem ser incluídos individualmente.</p>
        <button disabled={busy} onClick={() => void applyBulk({ included: true })} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold dark:border-slate-600">Incluir</button>
        <button disabled={busy} onClick={() => void applyBulk({ included: false })} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold dark:border-slate-600">Ignorar</button>
        <CategorySelect label="Categoria em massa" value={bulkCategory} onChange={setBulkCategory} options={categories} placeholder="Aplicar categoria"/>
        <button disabled={!bulkCategory || busy} onClick={() => void applyBulk({ category_id: Number(bulkCategory) })} className="rounded-xl bg-slate-700 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Aplicar</button>
        <CustomSelect label="Situação em massa" value={bulkStatus} onChange={value => setBulkStatus(String(value))} placeholder="Alterar situação" options={[{ value: '', label: 'Alterar situação' }, { value: 'paid', label: 'Pago' }, { value: 'pending', label: 'Pendente' }]}/>
        <button disabled={!bulkStatus || busy} onClick={() => void applyBulk({ transaction_status: bulkStatus })} className="rounded-xl bg-slate-700 px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Aplicar</button>
      </div>}
    </section>

    {!shown.length ? <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-800">Nenhum lançamento neste filtro.</div> : <ReviewList items={shown} targetId={value.target_entity_id} entities={entities} categories={categories} patch={patchItem}/>} 

    {value.status === 'review' && <div className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur lg:bottom-5 dark:border-slate-700 dark:bg-slate-800/95"><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="font-semibold text-gray-800 dark:text-white">{value.reconciliation.selected} lançamentos · {money(value.reconciliation.selectedTotal)} para importar</p>{!value.reconciliation.selected && <p className="text-xs text-amber-700 dark:text-amber-300">Nenhum lançamento selecionado. Revise os itens ignorados ou envie outro arquivo.</p>}</div><button onClick={() => setCancelOpen(true)} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold dark:border-slate-600">Descartar rascunho</button><button disabled={!value.reconciliation.selected || !value.target_entity_id || busy} onClick={() => setConfirmOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-torrinco-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continuar <ChevronRight size={17}/></button></div></div>}

    <ImportConfirmModal open={confirmOpen} close={() => setConfirmOpen(false)} confirm={confirm} busy={busy} value={value} reason={differenceReason} setReason={setDifferenceReason} confirmDifference={confirmDifference} setConfirmDifference={setConfirmDifference} confirmDuplicates={confirmDuplicates} setConfirmDuplicates={setConfirmDuplicates}/>
    <ConfirmModal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} onConfirm={cancel} isLoading={busy} title="Descartar este rascunho?" message="Nenhuma transação será criada. Esta ação encerra a revisão atual." confirmLabel="Descartar rascunho" cancelLabel="Voltar" type="danger"/>
    <ConfirmModal isOpen={Boolean(pendingDuplicate)} onClose={() => setPendingDuplicate(null)} onConfirm={async () => { const item = pendingDuplicate; setPendingDuplicate(null); if (!item) return; try { onChange(await importsService.item(value.id, item.id, { included: true })); } catch (error) { toast.error(getApiErrorMessage(error)); } }} title="Importar possível duplicidade?" message="Este lançamento parece já existir. Ele ficará destacado na confirmação final e exigirá uma segunda confirmação." confirmLabel="Importar mesmo assim" cancelLabel="Manter ignorado" type="warning"/>
  </div>;
}

function ImportSummary({ value }: { value: FinancialImport }) {
  const r = value.reconciliation; const review = value.items.filter(item => needsReview(item, value.target_entity_id) && !item.duplicate_kind).length;
  return <section><div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{[['Encontrados',r.found],['Para importar',`${r.selected} · ${money(r.selectedTotal)}`],['Precisam de revisão',review],['Ignorados ou duplicados',r.ignored]].map(([label,total], index) => <div key={String(label)} className={clsx('rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700', index === 1 && 'ring-torrinco-200 dark:ring-torrinco-800')}><p className="text-xs font-semibold text-gray-500 dark:text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">{total}</p></div>)}</div><details className="mt-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"><summary className="cursor-pointer font-semibold text-gray-700 dark:text-slate-200">Ver detalhes da importação</summary><dl className="mt-3 grid grid-cols-2 gap-2 text-gray-500 sm:grid-cols-3">{r.feesAndInterest > 0 && <><dt>Tarifas e juros</dt><dd>{money(r.feesAndInterest)}</dd></>}<dt>Receitas/estornos</dt><dd>{money(r.incomeTotal)}</dd>{r.documentTotal != null && <><dt>Total do documento</dt><dd>{money(r.documentTotal)}</dd></>}</dl></details></section>;
}

function ReviewList({ items, targetId, entities, categories, patch }: { items: ImportItem[]; targetId?: number | null; entities: Option[]; categories: Option[]; patch: (item: ImportItem, changes: Partial<ImportItem>) => void }) {
  return <section className="space-y-2"><div className="hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 xl:block dark:bg-slate-800 dark:ring-slate-700"><div className="grid grid-cols-[44px_minmax(180px,1fr)_110px_120px_minmax(150px,.65fr)_150px] gap-3 border-b border-gray-100 px-4 py-3 text-xs font-semibold text-gray-500 dark:border-slate-700"><span>Incluir</span><span>Descrição</span><span>Data</span><span>Valor</span><span>Categoria</span><span>Situação</span></div>{items.map(item => <ItemRow key={item.id} item={item} targetId={targetId} entities={entities} categories={categories} patch={patch}/>)}</div><div className="space-y-3 xl:hidden">{items.map(item => <ItemCard key={item.id} item={item} targetId={targetId} entities={entities} categories={categories} patch={patch}/>)}</div></section>;
}

function StatusBadge({ item, targetId }: { item: ImportItem; targetId?: number | null }) {
  const label = item.duplicate_kind ? duplicateLabels[item.duplicate_kind] || 'Possível duplicidade' : needsReview(item, targetId) ? 'Precisa de revisão' : item.included ? 'Pronto' : 'Ignorado';
  return <span className={clsx('inline-flex rounded-full px-2 py-1 text-xs font-semibold', item.duplicate_kind || needsReview(item) ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200' : item.included ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300')}>{label}</span>;
}

function Details({ item, targetId, entities, categories, patch }: { item: ImportItem; targetId?: number | null; entities: Option[]; categories: Option[]; patch: (item: ImportItem, changes: Partial<ImportItem>) => void }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <Field label="Descrição"><input defaultValue={item.description} onBlur={event => event.target.value !== item.description && patch(item, { description: event.target.value })} className={fieldClass}/></Field>
    <CustomSelect label="Tipo" value={item.type} onChange={value => patch(item, { type: String(value) as ImportItem['type'] })} options={[{ value: 'expense', label: 'Despesa' }, { value: 'income', label: 'Receita/estorno' }]}/>
    <CustomSelect label="Situação" value={item.transaction_status} onChange={value => patch(item, { transaction_status: String(value) as ImportItem['transaction_status'] })} options={[{ value: 'paid', label: 'Pago' }, { value: 'pending', label: 'Pendente' }]}/>
    <CustomSelect searchable label="Destino individual" value={item.entity_id ?? ''} onChange={value => patch(item, { entity_id: value === '' ? null : Number(value) })} placeholder={targetId ? 'Herdar destino principal' : 'Destino principal não definido'} options={[{ value: '', label: 'Herdar destino principal' }, ...entities.map(entity => ({ value: entity.id, label: entity.name }))]}/>
    <DatePicker label="Data" value={item.transaction_date.slice(0, 10)} onChange={value => patch(item, { transaction_date: value })}/>
    <Field label="Valor"><input type="number" min="0.01" step="0.01" defaultValue={Number(item.amount)} onBlur={event => Number(event.target.value) !== Number(item.amount) && patch(item, { amount: Number(event.target.value) })} className={fieldClass}/></Field>
    <CategorySelect label="Categoria" value={item.category_id ?? ''} onChange={value => patch(item, { category_id: value ? Number(value) : null })} options={categories} placeholder="Selecione uma categoria"/>
    <Field label="Informações"><p className="text-sm text-gray-500">Original: {item.original_description}<br/>Confiança: {Math.round(Number(item.confidence) * 100)}% · {item.payment_method || 'Método não informado'}</p></Field>
    {item.duplicate_evidence && <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-2 lg:col-span-4 dark:bg-amber-950/30 dark:text-amber-200"><b>Comparação:</b> {item.duplicate_evidence.description || 'Descrição não informada'} · {item.duplicate_evidence.date?.slice(0, 10)} · {money(Number(item.duplicate_evidence.amount || 0))}</div>}
  </div>;
}

function ItemRow({ item, targetId, entities, categories, patch }: { item: ImportItem; targetId?: number | null; entities: Option[]; categories: Option[]; patch: (item: ImportItem, changes: Partial<ImportItem>) => void }) {
  const [open,setOpen]=useState(false); return <article className={clsx('border-b border-gray-100 last:border-0 dark:border-slate-700', !item.included && 'bg-gray-50/60 dark:bg-slate-900/20')}><div className="grid grid-cols-[44px_minmax(180px,1fr)_110px_120px_minmax(150px,.65fr)_150px] items-center gap-3 px-4 py-3"><input aria-label={`Incluir ${item.description}`} type="checkbox" checked={item.included} onChange={event => patch(item,{included:event.target.checked})} className="h-5 w-5 accent-torrinco-600"/><button onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-torrinco-500"><span className="block truncate font-semibold text-gray-800 dark:text-white">{item.description}</span><span className="text-xs text-torrinco-600">Editar detalhes</span></button><span className="text-sm text-gray-600 dark:text-slate-300">{formatLocalDateShort(localDateFromApi(item.transaction_date))}</span><span className={clsx('font-semibold',item.type==='expense'?'text-red-600':'text-emerald-600')}>{money(Number(item.amount))}</span><span className="truncate text-sm text-gray-600 dark:text-slate-300">{categories.find(c=>c.id===item.category_id)?.name || 'Sugestão pendente'}</span><button onClick={()=>setOpen(v=>!v)} className="text-left"><StatusBadge item={item}/></button></div>{open&&<div className="border-t border-gray-100 bg-gray-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/30"><Details item={item} targetId={targetId} entities={entities} categories={categories} patch={patch}/></div>}</article>;
}

function ItemCard(props: Parameters<typeof ItemRow>[0]) { const {item,patch}=props; const [open,setOpen]=useState(Boolean(item.duplicate_kind||item.requires_review)); return <article className={clsx('rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700',!item.included&&'opacity-75')}><div className="flex items-start gap-3"><input aria-label={`Incluir ${item.description}`} type="checkbox" checked={item.included} onChange={event=>patch(item,{included:event.target.checked})} className="mt-1 h-5 w-5 accent-torrinco-600"/><button onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="min-w-0 flex-1 text-left"><span className="block font-semibold text-gray-800 dark:text-white">{item.description}</span><span className="mt-1 block text-xs text-gray-500">{formatLocalDateShort(localDateFromApi(item.transaction_date))}</span><span className="mt-2 inline-block"><StatusBadge item={item}/></span></button><div className="text-right"><b className={item.type==='expense'?'text-red-600':'text-emerald-600'}>{money(Number(item.amount))}</b><ChevronDown size={18} className={clsx('ml-auto mt-2 text-gray-400 transition',open&&'rotate-180')}/></div></div>{open&&<div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-700"><Details {...props}/></div>}</article> }
function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-slate-400">{label}</span>{children}</label>; }

function ImportConfirmModal({open,close,confirm,busy,value,reason,setReason,confirmDifference,setConfirmDifference,confirmDuplicates,setConfirmDuplicates}:{open:boolean;close:()=>void;confirm:()=>void;busy:boolean;value:FinancialImport;reason:string;setReason:(v:string)=>void;confirmDifference:boolean;setConfirmDifference:(v:boolean)=>void;confirmDuplicates:boolean;setConfirmDuplicates:(v:boolean)=>void}) {
  if(!open)return null; const r=value.reconciliation; const duplicates=value.items.filter(i=>i.included&&i.duplicate_kind).length; const difference=r.difference!=null&&Math.abs(r.difference)>=.01; const valid=(!duplicates||confirmDuplicates)&&(!difference||(confirmDifference&&reason.trim()));
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 sm:items-center sm:p-4"><div role="dialog" aria-modal="true" aria-labelledby="import-confirm-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl dark:bg-slate-800"><div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-slate-700"><div><p className="text-xs font-bold uppercase text-torrinco-600">Etapa 3 de 3</p><h3 id="import-confirm-title" className="font-bold text-gray-800 dark:text-white">Confirmar importação</h3></div><button aria-label="Fechar confirmação" onClick={close} className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-torrinco-500"><X size={19}/></button></div><div className="space-y-4 p-5"><p className="text-sm text-gray-600 dark:text-slate-300">Destino: <b>{value.target_entity?.name||'não definido'}</b></p><dl className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-50 p-4 text-sm dark:bg-slate-900/40"><dt>Quantidade</dt><dd className="text-right font-bold">{r.selected}</dd><dt>Despesas</dt><dd className="text-right font-bold">{money(r.expenseTotal)}</dd><dt>Receitas/estornos</dt><dd className="text-right font-bold">{money(r.incomeTotal)}</dd><dt>Total líquido</dt><dd className="text-right font-bold text-torrinco-600">{money(r.selectedTotal)}</dd><dt>Itens ignorados</dt><dd className="text-right font-bold">{r.ignored}</dd><dt>Duplicados incluídos</dt><dd className="text-right font-bold">{duplicates}</dd>{difference&&<><dt>Diferença de conciliação</dt><dd className="text-right font-bold text-amber-700">{money(r.difference!)}</dd></>}</dl>{duplicates>0&&<label className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"><input type="checkbox" checked={confirmDuplicates} onChange={e=>setConfirmDuplicates(e.target.checked)} className="mt-0.5 h-5 w-5"/><span>Confirmo que revisei os {duplicates} possível(is) duplicado(s) e quero importá-los.</span></label>}{difference&&<div className="space-y-2"><label className="flex gap-3 text-sm"><input type="checkbox" checked={confirmDifference} onChange={e=>setConfirmDifference(e.target.checked)} className="h-5 w-5"/><span>Confirmo a diferença entre o documento e os itens selecionados.</span></label><textarea aria-label="Motivo da diferença" value={reason} onChange={e=>setReason(e.target.value)} rows={3} maxLength={500} className={fieldClass} placeholder="Explique o motivo da diferença."/></div>}<div className="flex gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/30 dark:text-blue-200"><ShieldCheck size={18}/><span>A operação é atômica: em caso de falha, nenhum lançamento parcial será criado.</span></div></div><div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4 dark:border-slate-700"><button onClick={close} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-600">Voltar à revisão</button><button onClick={confirm} disabled={busy||!valid} className="inline-flex items-center justify-center gap-2 rounded-xl bg-torrinco-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy?<Loader2 className="animate-spin" size={17}/>:<Check size={17}/>}Importar agora</button></div></div></div>;
}
