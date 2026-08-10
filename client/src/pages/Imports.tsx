import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronRight, CircleDollarSign,
  Clock3, FileSpreadsheet, FileText, Filter, History as HistoryIcon,
  Loader2, Plus, RefreshCw, SearchX, ShieldCheck, Upload, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { api } from '../services/api';
import { importsService, type FinancialImport, type ImportItem } from '../services/imports.service';
import { getApiErrorMessage } from '../lib/api-error';
import { formatLocalDate } from '../lib/local-date';

type Option = { id: number; name: string };
type HistoryRow = Omit<FinancialImport, 'items' | 'reconciliation'> & { _count?: { items: number } };

const money = (value: unknown) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fieldClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-torrinco-500 focus:ring-2 focus:ring-torrinco-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-white';
const labels: Record<string, string> = {
  uploaded: 'Enviado', processing: 'Processando', review: 'Em conferência', confirmed: 'Confirmado', importing: 'Importando',
  completed: 'Concluída', completed_with_warnings: 'Concluída com avisos', cancelled: 'Cancelada', failed: 'Falhou',
};

function statusStyle(status: string) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
  if (status === 'review') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
  if (status === 'failed' || status === 'cancelled') return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300';
  return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
}

export function Imports() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<FinancialImport | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [entities, setEntities] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [differenceReason, setDifferenceReason] = useState('');

  const loadHistory = async () => {
    setHistoryLoading(true);
    try { setHistory(await importsService.list()); }
    catch (error) { toast.error(getApiErrorMessage(error, 'Não foi possível carregar o histórico.')); }
    finally { setHistoryLoading(false); }
  };

  useEffect(() => {
    void loadHistory();
    Promise.all([api.get('/entities'), api.get('/categories')])
      .then(([entityResponse, categoryResponse]) => {
        setEntities(entityResponse.data.entities || entityResponse.data || []);
        setCategories(categoryResponse.data.categories || categoryResponse.data || []);
      })
      .catch(error => toast.error(getApiErrorMessage(error, 'Não foi possível carregar contas e categorias.')));
  }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true); setProgress(0);
    try {
      setCurrent(await importsService.upload(file, setProgress));
      await loadHistory();
      toast.success('Arquivo processado. Confira os lançamentos antes de importar.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Não foi possível processar o arquivo. Nenhuma transação foi criada.'));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const patchItem = async (item: ImportItem, data: object) => {
    if (!current) return;
    try { setCurrent(await importsService.item(current.id, item.id, data)); }
    catch (error) { toast.error(getApiErrorMessage(error, 'Não foi possível atualizar o lançamento.')); }
  };

  const shown = useMemo(() => current?.items.filter(item => !issuesOnly || item.requires_review || item.duplicate_kind || item.exclusion_reason) || [], [current, issuesOnly]);

  const categorize = async () => {
    if (!current || !bulkCategory) return;
    setBusy(true);
    try {
      let result = current;
      for (const item of current.items.filter(candidate => candidate.included)) {
        result = await importsService.item(current.id, item.id, { category_id: Number(bulkCategory) });
      }
      setCurrent(result);
      toast.success('Categoria aplicada aos itens selecionados.');
    } catch (error) { toast.error(getApiErrorMessage(error)); }
    finally { setBusy(false); }
  };

  const confirmImport = async () => {
    if (!current || busy) return;
    const hasDifference = current.reconciliation.difference !== null && Math.abs(current.reconciliation.difference) >= 0.01;
    if (hasDifference && !differenceReason.trim()) return;
    setBusy(true);
    try {
      await importsService.confirm(current.id, { allow_difference: hasDifference, difference_reason: hasDifference ? differenceReason.trim() : undefined });
      setCurrent(await importsService.get(current.id));
      await loadHistory();
      setConfirmOpen(false);
      toast.success('Importação concluída com sucesso.');
    } catch (error) { toast.error(getApiErrorMessage(error, 'A importação falhou e nenhuma transação foi gravada.')); }
    finally { setBusy(false); }
  };

  const cancelDraft = async () => {
    if (!current) return;
    setBusy(true);
    try {
      await importsService.cancel(current.id); setCurrent(null); setCancelOpen(false); await loadHistory();
      toast.success('Rascunho cancelado.');
    } catch (error) { toast.error(getApiErrorMessage(error, 'Não foi possível cancelar o rascunho.')); }
    finally { setBusy(false); }
  };

  const addLine = async () => {
    if (!current) return;
    try {
      setCurrent(await importsService.add(current.id, {
        description: 'Novo lançamento', transaction_date: formatLocalDate(new Date()), amount: 0.01,
        type: 'expense', entity_id: current.target_entity_id,
      }));
      toast.success('Nova linha adicionada. Edite os dados antes de confirmar.');
    } catch (error) { toast.error(getApiErrorMessage(error)); }
  };

  return (
    <div className="space-y-5 pb-28 lg:space-y-6 lg:pb-24">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">Central de Importação</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-slate-400">Revise faturas, extratos e planilhas antes de criar qualquer transação.</p>
        </div>
        {current && <button onClick={() => setCurrent(null)} className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><ArrowLeft size={16} /> Histórico</button>}
      </header>

      {!current ? (
        <>
          <UploadPanel busy={busy} progress={progress} inputRef={inputRef} upload={upload} />
          <History rows={history} loading={historyLoading} reload={loadHistory} open={async id => setCurrent(await importsService.get(id))} />
        </>
      ) : (
        <>
          <ImportHeader value={current} entities={entities} update={async data => setCurrent(await importsService.update(current.id, data))} />
          {current.warning_message && <Notice tone="warning" icon={<AlertTriangle size={18} />} title="Atenção">{current.warning_message}</Notice>}
          <Totals value={current} />

          <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setIssuesOnly(value => !value)} className={clsx('inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition', issuesOnly ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300' : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200')}><Filter size={16} />{issuesOnly ? 'Mostrando problemas' : 'Somente com problemas'}</button>
                <button onClick={addLine} disabled={current.status !== 'review'} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"><Plus size={16} />Adicionar linha</button>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(190px,1fr)_auto]">
                <select className={fieldClass} value={bulkCategory} onChange={event => setBulkCategory(event.target.value)}><option value="">Categoria em massa</option>{categories.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select>
                <button disabled={!bulkCategory || busy} onClick={categorize} className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-600">Aplicar aos selecionados</button>
              </div>
            </div>
          </section>

          {!shown.length ? <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800"><SearchX className="mx-auto text-gray-400"/><p className="mt-2 font-medium text-gray-700 dark:text-slate-200">Nenhum item corresponde ao filtro.</p></div> : <>
            <DesktopTable items={shown} entities={entities} categories={categories} patch={patchItem} />
            <div className="space-y-3 lg:hidden">{shown.map(item => <MobileItem key={item.id} item={item} entities={entities} categories={categories} patch={data => patchItem(item, data)} />)}</div>
          </>}

          {current.status === 'review' && <div className="fixed inset-x-3 bottom-20 z-30 mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur sm:bottom-5 dark:border-slate-700 dark:bg-slate-800/95"><div className="hidden sm:block"><p className="text-sm font-semibold text-gray-800 dark:text-white">{current.reconciliation.selected} lançamento(s) selecionado(s)</p><p className="text-xs text-gray-500">{money(current.reconciliation.selectedTotal)} para importar</p></div><button onClick={() => setCancelOpen(true)} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 sm:flex-none dark:border-slate-600 dark:text-slate-200">Cancelar</button><button disabled={busy || !current.target_entity_id || !current.reconciliation.selected} onClick={() => { setDifferenceReason(''); setConfirmOpen(true); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-torrinco-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-torrinco-700 disabled:opacity-50 sm:flex-none"><Check size={18}/><span className="sm:hidden">Importar</span><span className="hidden sm:inline">Confirmar importação</span></button></div>}

          <ConfirmImportModal open={confirmOpen} close={() => setConfirmOpen(false)} confirm={confirmImport} busy={busy} value={current} reason={differenceReason} setReason={setDifferenceReason} />
          <SimpleModal open={cancelOpen} close={() => setCancelOpen(false)} confirm={cancelDraft} busy={busy} title="Cancelar este rascunho?" description="O rascunho será encerrado, mas nenhuma transação financeira será removida." confirmLabel="Cancelar rascunho" danger />
        </>
      )}
    </div>
  );
}

function UploadPanel({ busy, progress, inputRef, upload }: { busy: boolean; progress: number; inputRef: React.RefObject<HTMLInputElement | null>; upload: (file?: File) => void }) {
  return <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="grid lg:grid-cols-[1.25fr_.75fr]"><div className="flex flex-col items-center justify-center border-b border-gray-100 p-6 text-center sm:p-10 lg:border-b-0 lg:border-r dark:border-slate-700"><div className="rounded-2xl bg-torrinco-50 p-4 text-torrinco-600 dark:bg-torrinco-950/30 dark:text-torrinco-400">{busy ? <Loader2 size={30} className="animate-spin"/> : <Upload size={30}/>}</div><h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">Envie seu documento financeiro</h2><p className="mt-1 max-w-md text-sm text-gray-500 dark:text-slate-400">Você poderá revisar e editar cada lançamento antes de confirmar.</p><label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-torrinco-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-torrinco-700"><FileSpreadsheet size={18}/>{busy ? `Processando ${progress}%` : 'Escolher arquivo'}<input ref={inputRef} className="hidden" disabled={busy} type="file" accept=".pdf,.csv,.xls,.xlsx" onChange={event => upload(event.target.files?.[0])}/></label>{busy && <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700"><div className="h-full rounded-full bg-torrinco-600 transition-all" style={{ width: `${progress}%` }}/></div>}</div><div className="space-y-4 bg-gray-50/70 p-5 sm:p-7 dark:bg-slate-900/30"><Info icon={<FileText/>} title="Formatos aceitos">PDF com texto, CSV, XLS e XLSX, até 10 MB.</Info><Info icon={<ShieldCheck/>} title="Importação segura">Nada é gravado antes da sua confirmação.</Info><Info icon={<AlertTriangle/>} title="PDF escaneado">Arquivos sem texto ainda não possuem OCR e serão recusados com segurança.</Info></div></div></section>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) { return <div className="flex gap-3 text-gray-500 dark:text-slate-400"><span className="mt-0.5 text-torrinco-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{title}</p><p className="mt-0.5 text-xs leading-5">{children}</p></div></div>; }

function ImportHeader({ value, entities, update }: { value: FinancialImport; entities: Option[]; update: (data: object) => Promise<void> }) { return <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-800"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex items-center gap-3"><span className="rounded-xl bg-torrinco-50 p-2 text-torrinco-600 dark:bg-torrinco-950/30"><FileSpreadsheet size={22}/></span><div className="min-w-0"><h2 className="truncate font-bold text-gray-800 dark:text-white">{value.file_name}</h2><div className="mt-1 flex flex-wrap items-center gap-2"><span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', statusStyle(value.status))}>{labels[value.status] || value.status}</span><span className="text-xs text-gray-500">{value.items.length} itens encontrados</span></div></div></div></div><label className="block w-full lg:max-w-sm"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Destino da importação</span><select className={fieldClass} value={value.target_entity_id || ''} disabled={value.status !== 'review'} onChange={event => void update({ target_entity_id: event.target.value ? Number(event.target.value) : null })}><option value="">Selecione uma conta ou cartão</option>{entities.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label></div></section>; }

function Notice({ icon, title, children, tone }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone: 'warning' | 'danger' }) { return <div role="alert" className={clsx('flex gap-3 rounded-2xl border p-4', tone === 'warning' ? 'border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200' : 'border-red-200 bg-red-50 text-red-900')}><span className="mt-0.5 shrink-0">{icon}</span><div><p className="text-sm font-bold">{title}</p><div className="mt-0.5 text-sm opacity-90">{children}</div></div></div>; }

function Totals({ value }: { value: FinancialImport }) { const r = value.reconciliation; const stats = [['Encontrados', r.found], ['Selecionados', r.selected], ['Ignorados', r.ignored], ['Duplicidades', r.duplicates], ['Despesas', money(r.expenseTotal)], ['Receitas/estornos', money(r.incomeTotal)], ['Tarifas e juros', money(r.feesAndInterest)], ['Total selecionado', money(r.selectedTotal)], ['Total do documento', r.documentTotal === null ? 'Não identificado' : money(r.documentTotal)]]; return <section className="space-y-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{stats.map(([label, value], index) => <div key={String(label)} className={clsx('rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-700 dark:bg-slate-800', index === 7 && 'border-torrinco-200 bg-torrinco-50/50 dark:border-torrinco-800 dark:bg-torrinco-950/20')}><p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-gray-800 sm:text-base dark:text-white">{value}</p></div>)}</div>{r.difference !== null && Math.abs(r.difference) >= .01 && <Notice tone="danger" icon={<AlertTriangle size={18}/>} title="Diferença na conciliação">A soma selecionada difere do total identificado em <strong>{money(Math.abs(r.difference))}</strong>. Será necessário informar um motivo para continuar.</Notice>}</section>; }

function Selector({ value, items, onChange, label = 'Sem vínculo' }: { value?: number | null; items: Option[]; onChange: (value: number | null) => void; label?: string }) { return <select className={fieldClass} value={value || ''} onChange={event => onChange(event.target.value ? Number(event.target.value) : null)}><option value="">{label}</option>{items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>; }

function ItemAlert({ item }: { item: ImportItem }) { const text = item.duplicate_reason || item.exclusion_reason || (item.requires_review ? 'Requer conferência' : 'Pronto para importar'); const warning = Boolean(item.duplicate_reason || item.exclusion_reason || item.requires_review); return <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold', warning ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300')}>{warning ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>} {text}</span>; }

function DesktopTable({ items, entities, categories, patch }: { items: ImportItem[]; entities: Option[]; categories: Option[]; patch: (item: ImportItem, data: object) => void }) { return <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block dark:border-slate-700 dark:bg-slate-800"><div className="overflow-x-auto"><table className="w-full min-w-[1240px] text-sm"><thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-slate-900/50 dark:text-slate-400"><tr>{['Incluir', 'Data', 'Descrição original', 'Descrição salva', 'Valor', 'Tipo', 'Categoria', 'Conta/cartão', 'Situação', 'Conferência'].map(label => <th className="px-3 py-3" key={label}>{label}</th>)}</tr></thead><tbody className="divide-y divide-gray-100 dark:divide-slate-700">{items.map(item => <tr key={item.id} className={clsx('align-top transition', !item.included && 'bg-gray-50/70 opacity-60 dark:bg-slate-900/30')}><td className="px-3 py-3"><input aria-label="Incluir lançamento" className="h-4 w-4 accent-torrinco-600" type="checkbox" checked={item.included} onChange={event => patch(item, { included: event.target.checked })}/></td><td className="w-36 px-2 py-3"><input className={fieldClass} type="date" defaultValue={item.transaction_date.slice(0, 10)} onBlur={event => patch(item, { transaction_date: event.target.value })}/></td><td className="max-w-52 px-3 py-3 text-gray-600 dark:text-slate-300" title={item.original_excerpt}>{item.original_description}</td><td className="w-52 px-2 py-3"><input className={fieldClass} defaultValue={item.description} onBlur={event => event.target.value !== item.description && patch(item, { description: event.target.value })}/></td><td className="w-32 px-2 py-3"><input className={fieldClass} type="number" step=".01" defaultValue={Number(item.amount)} onBlur={event => patch(item, { amount: Number(event.target.value) })}/></td><td className="w-32 px-2 py-3"><select className={fieldClass} value={item.type} onChange={event => patch(item, { type: event.target.value })}><option value="expense">Despesa</option><option value="income">Receita</option></select></td><td className="w-44 px-2 py-3"><Selector value={item.category_id} items={categories} onChange={value => patch(item, { category_id: value })}/></td><td className="w-44 px-2 py-3"><Selector value={item.entity_id} items={entities} onChange={value => patch(item, { entity_id: value })}/></td><td className="w-32 px-2 py-3"><select className={fieldClass} value={item.transaction_status} onChange={event => patch(item, { transaction_status: event.target.value })}><option value="paid">Pago</option><option value="pending">Pendente</option></select></td><td className="max-w-56 px-3 py-3"><p className="mb-2 text-xs text-gray-500">Confiança: {Math.round(Number(item.confidence) * 100)}%</p><ItemAlert item={item}/></td></tr>)}</tbody></table></div></div>; }

function MobileItem({ item, entities, categories, patch }: { item: ImportItem; entities: Option[]; categories: Option[]; patch: (data: object) => void }) { const [expanded, setExpanded] = useState(Boolean(item.requires_review || item.duplicate_kind)); return <article className={clsx('overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-800', item.included ? 'border-gray-100 dark:border-slate-700' : 'border-gray-200 opacity-65 dark:border-slate-700')}><div className="p-4"><div className="flex items-start gap-3"><input aria-label="Incluir lançamento" className="mt-1 h-5 w-5 shrink-0 accent-torrinco-600" type="checkbox" checked={item.included} onChange={event => patch({ included: event.target.checked })}/><button className="min-w-0 flex-1 text-left" onClick={() => setExpanded(value => !value)}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-gray-800 dark:text-white">{item.description}</p><p className="mt-0.5 text-xs text-gray-500">{new Date(`${item.transaction_date.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')} · {item.type === 'expense' ? 'Despesa' : 'Receita'}</p></div><p className={clsx('shrink-0 font-bold', item.type === 'expense' ? 'text-red-600' : 'text-emerald-600')}>{money(item.amount)}</p></div><div className="mt-3 flex items-center justify-between gap-2"><ItemAlert item={item}/><ChevronRight size={18} className={clsx('shrink-0 text-gray-400 transition', expanded && 'rotate-90')}/></div></button></div></div>{expanded && <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/30"><Field label="Descrição original"><p className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.original_description}</p></Field><Field label="Descrição salva"><input className={fieldClass} defaultValue={item.description} onBlur={event => event.target.value !== item.description && patch({ description: event.target.value })}/></Field><div className="grid grid-cols-2 gap-3"><Field label="Data"><input className={fieldClass} type="date" defaultValue={item.transaction_date.slice(0, 10)} onBlur={event => patch({ transaction_date: event.target.value })}/></Field><Field label="Valor"><input className={fieldClass} type="number" step=".01" defaultValue={Number(item.amount)} onBlur={event => patch({ amount: Number(event.target.value) })}/></Field><Field label="Tipo"><select className={fieldClass} value={item.type} onChange={event => patch({ type: event.target.value })}><option value="expense">Despesa</option><option value="income">Receita</option></select></Field><Field label="Situação"><select className={fieldClass} value={item.transaction_status} onChange={event => patch({ transaction_status: event.target.value })}><option value="paid">Pago</option><option value="pending">Pendente</option></select></Field></div><Field label="Categoria"><Selector value={item.category_id} items={categories} onChange={value => patch({ category_id: value })}/></Field><Field label="Conta ou cartão"><Selector value={item.entity_id} items={entities} onChange={value => patch({ entity_id: value })}/></Field><p className="text-xs text-gray-500">Confiança da identificação: {Math.round(Number(item.confidence) * 100)}%</p></div>}</article>; }

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-slate-400">{label}</span>{children}</label>; }

function History({ rows, open, loading, reload }: { rows: HistoryRow[]; open: (id: number) => void; loading: boolean; reload: () => void }) { return <section className="space-y-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><HistoryIcon size={19} className="text-torrinco-600"/><h2 className="font-bold text-gray-800 dark:text-white">Histórico de importações</h2></div><button onClick={reload} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-slate-800" aria-label="Atualizar histórico"><RefreshCw size={17} className={clsx(loading && 'animate-spin')}/></button></div>{loading ? <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white py-12 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-800"><Loader2 size={18} className="mr-2 animate-spin"/>Carregando histórico...</div> : !rows.length ? <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800"><FileSpreadsheet className="mx-auto text-gray-400"/><p className="mt-2 font-semibold text-gray-700 dark:text-slate-200">Nenhuma importação ainda</p><p className="mt-1 text-sm text-gray-500">Seus arquivos revisados aparecerão aqui.</p></div> : <div className="grid gap-3 lg:grid-cols-2">{rows.map(row => <button className="group flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-torrinco-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800" key={row.id} onClick={() => open(row.id)}><span className="rounded-xl bg-gray-100 p-2.5 text-gray-500 group-hover:bg-torrinco-50 group-hover:text-torrinco-600 dark:bg-slate-700"><FileText size={20}/></span><span className="min-w-0 flex-1"><b className="block truncate text-sm text-gray-800 dark:text-white">{row.file_name}</b><small className="mt-1 flex flex-wrap items-center gap-1 text-gray-500"><Clock3 size={12}/>{new Date(row.created_at).toLocaleString('pt-BR')} · {row.target_entity?.name || 'Destino não definido'}</small></span><span className={clsx('hidden rounded-full px-2 py-1 text-xs font-semibold sm:block', statusStyle(row.status))}>{labels[row.status] || row.status}</span><ChevronRight size={18} className="text-gray-400"/></button>)}</div>}</section>; }

function ConfirmImportModal({ open, close, confirm, busy, value, reason, setReason }: { open: boolean; close: () => void; confirm: () => void; busy: boolean; value: FinancialImport; reason: string; setReason: (value: string) => void }) { if (!open) return null; const r = value.reconciliation; const hasDifference = r.difference !== null && Math.abs(r.difference) >= .01; return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl dark:bg-slate-800"><div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-slate-700"><div className="flex items-center gap-3"><span className="rounded-xl bg-torrinco-50 p-2 text-torrinco-600 dark:bg-torrinco-950/30"><CircleDollarSign size={21}/></span><h3 className="font-bold text-gray-800 dark:text-white">Confirmar importação</h3></div><button onClick={close} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"><X size={19}/></button></div><div className="space-y-4 p-5"><p className="text-sm text-gray-600 dark:text-slate-300">Você está prestes a importar <strong>{r.selected} lançamentos</strong> para <strong>{value.target_entity?.name || 'o destino selecionado'}</strong>.</p><div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-50 p-4 text-sm dark:bg-slate-900/40"><span className="text-gray-500">Despesas</span><strong className="text-right text-gray-800 dark:text-white">{money(r.expenseTotal)}</strong><span className="text-gray-500">Receitas/estornos</span><strong className="text-right text-gray-800 dark:text-white">{money(r.incomeTotal)}</strong><span className="text-gray-500">Total selecionado</span><strong className="text-right text-torrinco-600">{money(r.selectedTotal)}</strong><span className="text-gray-500">Duplicidades incluídas</span><strong className="text-right text-gray-800 dark:text-white">{value.items.filter(item => item.included && item.duplicate_kind).length}</strong></div>{hasDifference && <Field label="Motivo para continuar com a diferença"><textarea autoFocus value={reason} onChange={event => setReason(event.target.value)} rows={3} maxLength={500} className={fieldClass} placeholder="Explique por que deseja continuar mesmo com a diferença identificada."/></Field>}<Notice tone="warning" icon={<ShieldCheck size={18}/>} title="Confirmação necessária">As transações só serão criadas depois desta confirmação.</Notice></div><div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4 dark:border-slate-700"><button onClick={close} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-slate-600 dark:text-slate-200">Voltar</button><button onClick={confirm} disabled={busy || (hasDifference && !reason.trim())} className="inline-flex items-center justify-center gap-2 rounded-xl bg-torrinco-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? <Loader2 size={17} className="animate-spin"/> : <Check size={17}/>}Importar agora</button></div></div></div>; }

function SimpleModal({ open, close, confirm, busy, title, description, confirmLabel, danger }: { open: boolean; close: () => void; confirm: () => void; busy: boolean; title: string; description: string; confirmLabel: string; danger?: boolean }) { if (!open) return null; return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-800"><div className="p-6"><div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/30"><AlertTriangle/></div><h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">{description}</p></div><div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4 dark:border-slate-700"><button onClick={close} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-slate-600 dark:text-slate-200">Voltar</button><button onClick={confirm} disabled={busy} className={clsx('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white', danger ? 'bg-red-600' : 'bg-torrinco-600')}>{busy && <Loader2 size={17} className="animate-spin"/>}{confirmLabel}</button></div></div></div>; }
