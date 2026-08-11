import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Building2,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { CustomSelect } from "../components/CustomSelect";
import { DateTimePicker } from "../components/DateTimePicker";
import { getApiErrorMessage } from "../lib/api-error";
import { formatInstantDateTime } from "../lib/local-date";

type AccountUser = {
  id: number;
  name?: string;
  email?: string | null;
  phone_number: string;
  role: string;
  status?: string;
  created_at?: string;
};
type Account = {
  id: number;
  name?: string;
  status: string;
  access_status: "enabled" | "suspended";
  origin: string;
  created_at?: string;
  trial_ends_at?: string;
  plans: { name: string };
  users: AccountUser[];
  _count?: { transactions: number };
};
type AccountDetail = Account & {
  current_period_starts_at?: string | null;
  current_period_ends_at?: string | null;
};
type Summary = {
  accounts: number;
  users: number;
  trials: { active: number; expired: number };
  statuses: Record<string, number>;
};
type Pagination = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};
type AccountFilters = {
  search: string;
  accessStatus: string;
  commercialStatus: string;
  trial: string;
  plan: string;
  origin: string;
  sort: string;
  direction: string;
};
type AuditAction = {
  id: string;
  action: string;
  reason?: string | null;
  outcome: string;
  created_at: string;
  actor: { id: number; name?: string | null };
  target_account?: { id: number; name?: string | null } | null;
  target_user?: { id: number; name?: string | null } | null;
};

const commercialLabels: Record<string, string> = {
  trial: "Período de teste",
  active: "Assinatura ativa",
  expired: "Acesso comercial expirado",
  past_due: "Pagamento pendente",
  cancelled: "Assinatura cancelada",
  suspended: "Suspensa (legado)",
};
const roleLabels: Record<string, string> = {
  owner: "Proprietário",
  admin: "Administrador",
  member: "Membro",
};
const originLabels: Record<string, string> = {
  platform_tester: "Testador convidado",
  whatsapp_onboarding: "Cadastro pelo WhatsApp",
  checkout: "Compra online",
  manual: "Cadastro manual",
  legacy: "Cadastro anterior",
};
const auditLabels: Record<string, string> = {
  "account.access.suspend": "Suspensão de acesso",
  "account.access.enable": "Reativação de acesso",
  "account.commercial.change": "Alteração comercial",
  "tester.create": "Criação de testador",
  "invite.resend": "Reenvio de convite",
  "invite.revoke": "Revogação de convite",
  "sessions.revoke": "Revogação de sessões",
};

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "amber" | "red" | "blue" | "gray";
}) {
  const tones = {
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
    amber:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200",
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300",
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
    gray: "border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function CommercialBadge({ status }: { status: string }) {
  const tone =
    status === "active"
      ? "green"
      : status === "trial"
        ? "blue"
        : status === "past_due"
          ? "amber"
          : "red";
  return (
    <Badge tone={tone}>
      {commercialLabels[status] || "Estado não identificado"}
    </Badge>
  );
}

function AdminSkeleton() {
  return (
    <div aria-label="Carregando backoffice" className="animate-pulse space-y-6">
      <div className="h-16 rounded-2xl bg-gray-100 dark:bg-slate-800" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl bg-gray-100 dark:bg-slate-800"
          />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-gray-100 dark:bg-slate-800" />
    </div>
  );
}

function AccountDetailPanel({
  account,
  loading,
  error,
  onClose,
  onRetry,
}: {
  account: AccountDetail | null;
  loading: boolean;
  error: string;
  onClose: () => void;
  onRetry: () => void;
}) {
  const date = (value?: string | null) =>
    value ? formatInstantDateTime(value) : "Não informado";
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-900">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-torrinco-600">
              Detalhe da conta
            </p>
            <h2
              id="account-detail-title"
              className="text-xl font-bold dark:text-white"
            >
              {account?.name || "Conta da plataforma"}
            </h2>
            {account && (
              <p className="text-sm text-gray-500">ID {account.id}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhe da conta"
            className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <X />
          </button>
        </header>
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">
            <Loader2 className="mr-2 animate-spin" />
            Carregando detalhe...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-red-300 px-3 py-2 font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          account && (
            <div className="space-y-6">
              <section className="grid gap-3 sm:grid-cols-2">
                <Detail label="Criação" value={date(account.created_at)} />
                <Detail
                  label="Origem"
                  value={
                    originLabels[account.origin] || "Origem não identificada"
                  }
                />
                <Detail label="Plano" value={account.plans.name} />
                <Detail
                  label="Estado comercial"
                  value={
                    commercialLabels[account.status] ||
                    "Estado não identificado"
                  }
                />
                <Detail
                  label="Fim do teste"
                  value={date(account.trial_ends_at)}
                />
                <Detail
                  label="Período comercial"
                  value={
                    account.current_period_starts_at ||
                    account.current_period_ends_at
                      ? `${date(account.current_period_starts_at)} — ${date(account.current_period_ends_at)}`
                      : "Não informado"
                  }
                />
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Situação do acesso
                  </p>
                  <Badge
                    tone={
                      account.access_status === "suspended" ? "red" : "green"
                    }
                  >
                    {account.access_status === "suspended"
                      ? "Acesso suspenso"
                      : "Acesso liberado"}
                  </Badge>
                </div>
              </section>
              <section>
                <h3 className="mb-3 font-bold dark:text-white">
                  Usuários ({account.users.length})
                </h3>
                <div className="space-y-2">
                  {account.users.map((user) => (
                    <article
                      key={user.id}
                      className="rounded-xl border border-gray-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold dark:text-white">
                            {user.name || "Usuário sem nome"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.email || "E-mail não informado"} ·{" "}
                            {user.phone_number}
                          </p>
                        </div>
                        <Badge
                          tone={user.status === "inactive" ? "gray" : "blue"}
                        >
                          {roleLabels[user.role] || "Papel não identificado"}
                        </Badge>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )
        )}
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export function Admin() {
  const { platformRole, isLoading } = useAuth();
  const [urlParams, setUrlParams] = useSearchParams();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState(urlParams.get("search") || "");
  const [accessStatus, setAccessStatus] = useState(
    urlParams.get("access") || "",
  );
  const [commercialStatus, setCommercialStatus] = useState(
    urlParams.get("status") || "",
  );
  const [trial, setTrial] = useState(urlParams.get("trial") || "");
  const [plan, setPlan] = useState(urlParams.get("plan") || "");
  const [origin, setOrigin] = useState(urlParams.get("origin") || "");
  const [sort, setSort] = useState(urlParams.get("sort") || "created_at");
  const [direction, setDirection] = useState(
    urlParams.get("direction") || "desc",
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: Number(urlParams.get("page")) || 1,
    page_size: 25,
    total: 0,
    total_pages: 0,
  });
  const [showTester, setShowTester] = useState(false);
  const [pending, setPending] = useState<Account | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AccountDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [auditActions, setAuditActions] = useState<AuditAction[]>([]);
  const [auditPagination, setAuditPagination] = useState<Pagination>({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
  });
  const [auditAccount, setAuditAccount] = useState("");
  const [auditAction, setAuditAction] = useState("");
  const [auditOutcome, setAuditOutcome] = useState("");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  const load = async (
    includeDashboard = false,
    requestedPage = pagination.page,
    overrides: Partial<AccountFilters> = {},
  ) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const applied = {
        search,
        accessStatus,
        commercialStatus,
        trial,
        plan,
        origin,
        sort,
        direction,
        ...overrides,
      };
      const params = {
        search: applied.search || undefined,
        accessStatus: applied.accessStatus || undefined,
        status: applied.commercialStatus || undefined,
        trial: applied.trial || undefined,
        plan: applied.plan || undefined,
        origin: applied.origin || undefined,
        sort: applied.sort,
        direction: applied.direction,
        page: requestedPage,
        pageSize: pagination.page_size,
      };
      const [dashboardResponse, accountsResponse] = await Promise.all([
        includeDashboard
          ? api.get("/platform-admin/dashboard", { signal: controller.signal })
          : Promise.resolve(null),
        api.get("/platform-admin/accounts", {
          params,
          signal: controller.signal,
        }),
      ]);
      if (controller.signal.aborted) return;
      if (dashboardResponse) setSummary(dashboardResponse.data);
      setAccounts(accountsResponse.data.accounts);
      setPagination(accountsResponse.data.pagination);
      const nextUrl = new URLSearchParams();
      Object.entries({
        search: applied.search,
        access: applied.accessStatus,
        status: applied.commercialStatus,
        trial: applied.trial,
        plan: applied.plan,
        origin: applied.origin,
        sort: applied.sort === "created_at" ? "" : applied.sort,
        direction: applied.direction === "desc" ? "" : applied.direction,
        page: requestedPage > 1 ? String(requestedPage) : "",
      }).forEach(([key, value]) => {
        if (value) nextUrl.set(key, value);
      });
      setUrlParams(nextUrl, { replace: true });
    } catch (loadError) {
      if (!controller.signal.aborted)
        setError(
          getApiErrorMessage(
            loadError,
            "Não foi possível carregar o Backoffice.",
          ),
        );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const loadAudit = async (page = 1) => {
    setAuditLoading(true);
    setAuditError("");
    try {
      const response = await api.get("/platform-admin/audit", {
        params: {
          accountId: auditAccount || undefined,
          action: auditAction || undefined,
          outcome: auditOutcome || undefined,
          from: auditFrom ? new Date(auditFrom).toISOString() : undefined,
          to: auditTo ? new Date(auditTo).toISOString() : undefined,
          page,
          pageSize: auditPagination.page_size,
        },
      });
      setAuditActions(response.data.actions);
      setAuditPagination(response.data.pagination);
    } catch (auditLoadError) {
      setAuditError(
        getApiErrorMessage(
          auditLoadError,
          "Não foi possível carregar a auditoria.",
        ),
      );
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (platformRole === "platform_owner") {
      void load(true);
      void loadAudit();
    }
    return () => requestRef.current?.abort();
  }, [platformRole]);
  if (!isLoading && platformRole !== "platform_owner")
    return <Navigate to="/" replace />;
  if (isLoading || (loading && !summary)) return <AdminSkeleton />;

  const suspend = async () => {
    if (!pending || reason.trim().length < 5) return;
    setBusy(true);
    try {
      await api.patch(`/platform-admin/accounts/${pending.id}`, {
        accessStatus:
          pending.access_status === "suspended" ? "enabled" : "suspended",
        reason: reason.trim(),
      });
      toast.success(
        pending.access_status === "suspended"
          ? "Acesso administrativo reativado"
          : "Acesso administrativo suspenso",
      );
      setPending(null);
      setReason("");
      await load(false);
    } catch (changeError) {
      toast.error(
        getApiErrorMessage(
          changeError,
          "Não foi possível alterar o acesso administrativo.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const openDetail = async (id: number) => {
    setDetailId(id);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const response = await api.get(`/platform-admin/accounts/${id}`);
      setDetail(response.data.account);
    } catch (detailLoadError) {
      setDetailError(
        getApiErrorMessage(
          detailLoadError,
          "Não foi possível carregar o detalhe da conta.",
        ),
      );
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <Shield className="text-torrinco-600" />
          <h1 className="text-2xl font-bold dark:text-white">
            Administração da plataforma
          </h1>
        </div>
        <p className="mt-1 text-gray-500">
          Visão operacional de clientes, períodos de teste e acessos
          administrativos.
        </p>
      </header>

      {error && (
        <section
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 sm:flex-row sm:items-center sm:justify-between dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
        >
          <div className="flex gap-3">
            <AlertTriangle className="shrink-0" />
            <div>
              <h2 className="font-bold">Falha ao carregar o Backoffice</h2>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void load(!summary)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold dark:border-red-700"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </button>
        </section>
      )}

      <section
        aria-label="Indicadores da plataforma"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          [Building2, "Contas", summary?.accounts],
          [Users, "Usuários", summary?.users],
          [Clock, "Testes ativos", summary?.trials.active],
          [Clock, "Testes expirados", summary?.trials.expired],
        ].map(([Icon, label, value]) => {
          const MetricIcon = Icon as typeof Building2;
          return (
            <div
              key={String(label)}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <MetricIcon className="mb-2 text-torrinco-600" />
              <p className="text-sm text-gray-500">{String(label)}</p>
              <strong className="text-2xl dark:text-white">
                {String(value ?? "—")}
              </strong>
            </div>
          );
        })}
      </section>

      <section
        aria-labelledby="account-filters-title"
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="account-filters-title"
              className="font-bold text-gray-800 dark:text-white"
            >
              Encontrar contas
            </h2>
            <p className="text-xs text-gray-500">
              Pesquise, filtre e ordene os resultados.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTester((value) => !value)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl sm:w-auto bg-torrinco-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <UserPlus size={18} />
            {showTester ? "Fechar cadastro" : "Adicionar testador"}
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void load(false, 1);
          }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <label className="space-y-1 sm:col-span-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-slate-300">Pesquisar contas</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome, e-mail, telefone ou ID" className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 outline-none transition focus:ring-2 focus:ring-torrinco-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </span>
          </label>
          <CustomSelect label="Acesso administrativo" value={accessStatus} onChange={(value) => setAccessStatus(String(value))} options={[{ value: "", label: "Todos os acessos" }, { value: "enabled", label: "Acesso liberado" }, { value: "suspended", label: "Acesso suspenso" }]}/>
          <CustomSelect label="Estado da assinatura" value={commercialStatus} onChange={(value) => setCommercialStatus(String(value))} options={[{ value: "", label: "Todas as assinaturas" }, ...Object.entries(commercialLabels).filter(([value]) => value !== "suspended").map(([value, label]) => ({ value, label }))]}/>
          <CustomSelect searchable label="Período de teste" value={trial} onChange={(value) => setTrial(String(value))} options={[{ value: "", label: "Todos os testes" }, { value: "active", label: "Teste vigente" }, { value: "expiring", label: "Expira em até 7 dias" }, { value: "expired", label: "Teste expirado" }]}/>
          <label className="space-y-1">
            <span className="block text-sm font-medium text-gray-700 dark:text-slate-300">Plano</span>
            <input value={plan} onChange={(event) => setPlan(event.target.value)} placeholder="Nome do plano" className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-torrinco-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          </label>
          <CustomSelect searchable label="Origem da conta" value={origin} onChange={(value) => setOrigin(String(value))} options={[{ value: "", label: "Todas as origens" }, ...Object.entries(originLabels).map(([value, label]) => ({ value, label }))]}/>
          <CustomSelect
            searchable
            label="Ordenar por"
            value={`${sort}:${direction}`}
            onChange={(value) => {
              const [nextSort, nextDirection] = String(value).split(":");
              setSort(nextSort);
              setDirection(nextDirection);
            }}
            options={[{ value: "created_at:desc", label: "Mais recentes" }, { value: "created_at:asc", label: "Mais antigas" }, { value: "trial_ends_at:asc", label: "Teste terminando primeiro" }, { value: "trial_ends_at:desc", label: "Teste terminando por último" }, { value: "activity:desc", label: "Mais movimentadas" }, { value: "activity:asc", label: "Menos movimentadas" }]}
          />
          <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-4 xl:justify-end">
            <button
              disabled={loading}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 text-white disabled:opacity-50"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}Aplicar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setAccessStatus("");
                setCommercialStatus("");
                setTrial("");
                setPlan("");
                setOrigin("");
                setSort("created_at");
                setDirection("desc");
                void load(false, 1, {
                  search: "",
                  accessStatus: "",
                  commercialStatus: "",
                  trial: "",
                  plan: "",
                  origin: "",
                  sort: "created_at",
                  direction: "desc",
                });
              }}
              className="rounded-xl border px-3 text-sm font-semibold"
            >
              Limpar
            </button>
          </div>
        </form>
        {showTester && (
          <TesterForm
            onDone={() => {
              setShowTester(false);
              void load(false);
            }}
          />
        )}
      </section>

      <section
        aria-labelledby="accounts-title"
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="mb-4">
          <h2
            id="accounts-title"
            className="font-bold text-gray-800 dark:text-white"
          >
            Contas da plataforma
          </h2>
          <p className="text-xs text-gray-500">
            {pagination.total} conta(s) encontrada(s) · página {pagination.page}{" "}
            de {Math.max(1, pagination.total_pages)}
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-500">
            <Loader2 size={18} className="mr-2 animate-spin" />
            Atualizando contas...
          </div>
        ) : !accounts.length ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-14 text-center dark:border-slate-700">
            <Building2 className="mx-auto text-gray-400" />
            <p className="mt-2 font-semibold text-gray-700 dark:text-slate-200">
              Nenhuma conta encontrada
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Altere a pesquisa e tente novamente.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {accounts.map((account) => (
                <article
                  key={account.id}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/70 p-4 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-gray-800 dark:text-white">
                        {account.name || "Conta sem nome"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID {account.id} · {account.plans.name}
                      </p>
                    </div>
                    <Badge
                      tone={
                        account.access_status === "suspended" ? "red" : "green"
                      }
                    >
                      {account.access_status === "suspended"
                        ? "Suspenso"
                        : "Liberado"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <CommercialBadge status={account.status} />
                    <Badge tone="gray">{account.users.length} usuário(s)</Badge>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-gray-500">Origem</dt>
                      <dd className="font-medium">
                        {originLabels[account.origin] || "Não identificada"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Atividade</dt>
                      <dd className="font-medium">
                        {account._count?.transactions ?? 0} transação(ões)
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => void openDetail(account.id)}
                      className="min-h-11 rounded-xl border border-torrinco-200 px-3 text-sm font-semibold text-torrinco-700 dark:text-torrinco-300"
                    >
                      Ver detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPending(account);
                        setReason("");
                      }}
                      className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${account.access_status === "suspended" ? "border border-blue-200 text-blue-700 dark:text-blue-300" : "bg-red-600 text-white"}`}
                    >
                      {account.access_status === "suspended"
                        ? "Reativar"
                        : "Suspender"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden gap-4 md:grid xl:grid-cols-2">
              {accounts.map((account) => (
                <article
                  key={`grid-${account.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/70 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-torrinco-200 hover:shadow-md dark:border-slate-700 dark:from-slate-800 dark:to-slate-900/70"
                >
                  <span className={`absolute inset-y-0 left-0 w-1 ${account.access_status === "suspended" ? "bg-red-500" : "bg-torrinco-500"}`} />
                  <header className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-torrinco-50 p-2 text-torrinco-600 dark:bg-torrinco-950/40 dark:text-torrinco-300">
                          <Building2 size={18} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-gray-900 dark:text-white">{account.name || "Conta sem nome"}</h3>
                          <p className="text-xs text-gray-500">ID {account.id} · {account.plans.name}</p>
                        </div>
                      </div>
                    </div>
                    <Badge tone={account.access_status === "suspended" ? "red" : "green"}>
                      {account.access_status === "suspended" ? "Acesso suspenso" : "Acesso liberado"}
                    </Badge>
                  </header>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <CommercialBadge status={account.status} />
                    <Badge tone="gray">{originLabels[account.origin] || "Origem não identificada"}</Badge>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-100 bg-white/80 py-3 text-center dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="px-2">
                      <dt className="text-[11px] uppercase tracking-wide text-gray-500">Usuários</dt>
                      <dd className="mt-1 font-bold text-gray-800 dark:text-white">{account.users.length}</dd>
                    </div>
                    <div className="px-2">
                      <dt className="text-[11px] uppercase tracking-wide text-gray-500">Transações</dt>
                      <dd className="mt-1 font-bold text-gray-800 dark:text-white">{account._count?.transactions ?? 0}</dd>
                    </div>
                    <div className="px-2">
                      <dt className="text-[11px] uppercase tracking-wide text-gray-500">Teste</dt>
                      <dd className="mt-1 truncate text-xs font-semibold text-gray-800 dark:text-white">{account.trial_ends_at ? formatInstantDateTime(account.trial_ends_at).split(" às ")[0] : "—"}</dd>
                    </div>
                  </dl>

                  <footer className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-slate-700">
                    <button type="button" onClick={() => void openDetail(account.id)} className="min-h-10 rounded-xl border border-torrinco-200 bg-white px-4 text-sm font-semibold text-torrinco-700 transition hover:bg-torrinco-50 dark:border-torrinco-800 dark:bg-slate-800 dark:text-torrinco-300 dark:hover:bg-torrinco-950/30">Ver detalhes</button>
                    <button type="button" onClick={() => { setPending(account); setReason(""); }} className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition ${account.access_status === "suspended" ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300" : "bg-red-600 text-white hover:bg-red-700"}`}>{account.access_status === "suspended" ? "Reativar acesso" : "Suspender acesso"}</button>
                  </footer>
                </article>
              ))}
            </div>
            <div className="hidden">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500 dark:border-slate-700">
                    <th className="p-3">Conta</th>
                    <th>Plano</th>
                    <th>Estado comercial</th>
                    <th>Acesso administrativo</th>
                    <th>Origem</th>
                    <th>Usuários</th>
                    <th>Atividade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b align-top last:border-0 dark:border-slate-700"
                    >
                      <td className="p-3 font-medium text-gray-800 dark:text-white">
                        <span className="block">
                          {account.name || "Conta sem nome"}
                        </span>
                        <span className="text-xs font-normal text-gray-500">
                          ID {account.id}
                          {account.trial_ends_at
                            ? ` · teste até ${formatInstantDateTime(account.trial_ends_at)}`
                            : ""}
                        </span>
                      </td>
                      <td className="py-3">{account.plans.name}</td>
                      <td className="py-3">
                        <CommercialBadge status={account.status} />
                      </td>
                      <td className="py-3">
                        <Badge
                          tone={
                            account.access_status === "suspended"
                              ? "red"
                              : "green"
                          }
                        >
                          {account.access_status === "suspended"
                            ? "× Acesso suspenso"
                            : "✓ Acesso liberado"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {originLabels[account.origin] ||
                          "Origem não identificada"}
                      </td>
                      <td className="py-3">
                        {account.users.length} usuário(s)
                      </td>
                      <td className="py-3">
                        {account._count?.transactions ?? 0} transação(ões)
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            type="button"
                            onClick={() => void openDetail(account.id)}
                            className="min-h-10 rounded-lg px-2 font-semibold text-torrinco-700 hover:bg-torrinco-50 dark:text-torrinco-300"
                          >
                            Ver detalhes
                          </button>
                          <button
                            onClick={() => {
                              setPending(account);
                              setReason("");
                            }}
                            className="min-h-10 rounded-lg px-2 font-semibold text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30"
                          >
                            {account.access_status === "suspended"
                              ? "Reativar acesso"
                              : "Suspender acesso"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {pagination.total_pages > 1 && (
        <nav
          aria-label="Paginação de contas"
          className="flex items-center justify-center gap-3"
        >
          <button
            type="button"
            disabled={loading || pagination.page <= 1}
            onClick={() => void load(false, pagination.page - 1)}
            className="min-h-11 rounded-xl border px-4 text-sm font-semibold disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <button
            type="button"
            disabled={loading || pagination.page >= pagination.total_pages}
            onClick={() => void load(false, pagination.page + 1)}
            className="min-h-11 rounded-xl border px-4 text-sm font-semibold disabled:opacity-40"
          >
            Próxima
          </button>
        </nav>
      )}

      <AuditHistory
        actions={auditActions}
        pagination={auditPagination}
        loading={auditLoading}
        error={auditError}
        account={auditAccount}
        action={auditAction}
        outcome={auditOutcome}
        from={auditFrom}
        to={auditTo}
        onAccount={setAuditAccount}
        onAction={setAuditAction}
        onOutcome={setAuditOutcome}
        onFrom={setAuditFrom}
        onTo={setAuditTo}
        onLoad={loadAudit}
      />

      {detailId !== null && (
        <AccountDetailPanel
          account={detail}
          loading={detailLoading}
          error={detailError}
          onClose={() => {
            setDetailId(null);
            setDetail(null);
            setDetailError("");
          }}
          onRetry={() => void openDetail(detailId)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(pending)}
        onClose={() => {
          setPending(null);
          setReason("");
        }}
        onConfirm={suspend}
        isLoading={busy}
        confirmDisabled={reason.trim().length < 5}
        type={pending?.access_status === "suspended" ? "info" : "danger"}
        confirmLabel={
          pending?.access_status === "suspended"
            ? "Reativar acesso"
            : "Suspender acesso"
        }
        title={
          pending?.access_status === "suspended"
            ? "Reativar acesso administrativo"
            : "Suspender acesso administrativo"
        }
        message={
          pending?.access_status === "suspended"
            ? "Esta ação é reversível e não altera o plano, a assinatura nem o período de teste."
            : "A suspensão é uma ação destrutiva para as sessões atuais, mas pode ser revertida depois."
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-gray-50 p-3 text-center dark:bg-slate-900">
            <div>
              <p className="text-xs text-gray-500">Estado anterior</p>
              <strong className="text-sm">
                {pending?.access_status === "suspended"
                  ? "Suspenso"
                  : "Liberado"}
              </strong>
            </div>
            <span aria-hidden="true">→</span>
            <div>
              <p className="text-xs text-gray-500">Estado resultante</p>
              <strong className="text-sm">
                {pending?.access_status === "suspended"
                  ? "Liberado"
                  : "Suspenso"}
              </strong>
            </div>
          </div>
          <div
            className={`rounded-xl border p-3 text-sm ${pending?.access_status === "suspended" ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200" : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"}`}
          >
            <strong>Impacto:</strong>{" "}
            {pending?.access_status === "suspended"
              ? "os usuários poderão iniciar novas sessões novamente. O estado comercial atual será preservado."
              : "todas as sessões dos usuários desta conta serão encerradas. O estado comercial será preservado."}
          </div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Motivo obrigatório
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              rows={3}
              className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-900"
              placeholder="Descreva o motivo real desta alteração"
            />
            <span className="mt-1 block text-xs font-normal text-gray-500">
              Mínimo de 5 caracteres. O texto será armazenado na auditoria.
            </span>
          </label>
        </div>
      </ConfirmModal>
    </div>
  );
}

type AuditHistoryProps = {
  actions: AuditAction[];
  pagination: Pagination;
  loading: boolean;
  error: string;
  account: string;
  action: string;
  outcome: string;
  from: string;
  to: string;
  onAccount: (value: string) => void;
  onAction: (value: string) => void;
  onOutcome: (value: string) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  onLoad: (page?: number) => Promise<void>;
};
function AuditHistory(props: AuditHistoryProps) {
  return (
    <section
      aria-labelledby="audit-title"
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-4">
        <h2
          id="audit-title"
          className="font-bold text-gray-800 dark:text-white"
        >
          Histórico de auditoria
        </h2>
        <p className="text-xs text-gray-500">
          Ações administrativas rastreáveis, sem metadados técnicos sensíveis.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void props.onLoad(1);
        }}
        className="mb-4 grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-6"
      >
        <label className="space-y-1">
          <span className="block text-sm font-medium text-gray-700 dark:text-slate-300">Conta</span>
          <input type="number" min="1" value={props.account} onChange={(event) => props.onAccount(event.target.value)} placeholder="ID da conta" className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-torrinco-500 dark:border-slate-700 dark:bg-slate-900" />
        </label>
        <CustomSelect
          searchable
          label="Ação"
          value={props.action}
          onChange={(value) => props.onAction(String(value))}
          options={[{ value: "", label: "Todas as ações" }, ...Object.entries(auditLabels).map(([value, label]) => ({ value, label }))]}
        />
        <CustomSelect
          searchable
          label="Resultado"
          value={props.outcome}
          onChange={(value) => props.onOutcome(String(value))}
          options={[{ value: "", label: "Todos os resultados" }, { value: "succeeded", label: "Concluída" }, { value: "failed", label: "Falhou" }]}
        />
        <DateTimePicker label="Desde" value={props.from} onChange={props.onFrom} />
        <DateTimePicker label="Até" value={props.to} onChange={props.onTo} />
        <button
          disabled={props.loading}
          className="min-h-11 rounded-xl bg-slate-700 px-4 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 sm:col-span-2 xl:col-span-1"
        >
          Aplicar filtros
        </button>
      </form>
      {props.error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {props.error}
          <button
            type="button"
            onClick={() => void props.onLoad(props.pagination.page)}
            className="ml-3 font-semibold underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : props.loading ? (
        <div className="flex justify-center py-12 text-gray-500">
          <Loader2 className="mr-2 animate-spin" />
          Carregando auditoria...
        </div>
      ) : !props.actions.length ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
          Nenhuma ação encontrada para os filtros informados.
        </p>
      ) : (
        <div className="space-y-2">
          {props.actions.map((item) => (
            <article
              key={item.id}
              className="grid gap-2 rounded-xl border border-gray-200 p-3 sm:grid-cols-[minmax(0,1fr)_auto] dark:border-slate-700"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="dark:text-white">
                    {auditLabels[item.action] || "Ação administrativa"}
                  </strong>
                  <Badge tone={item.outcome === "succeeded" ? "green" : "red"}>
                    {item.outcome === "succeeded" ? "Concluída" : "Falhou"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  {item.target_account
                    ? `${item.target_account.name || "Conta sem nome"} (ID ${item.target_account.id})`
                    : item.target_user
                      ? `Usuário ${item.target_user.name || item.target_user.id}`
                      : "Alvo não identificado"}
                </p>
                {item.reason && (
                  <p className="mt-1 text-sm text-gray-500">
                    Motivo: {item.reason}
                  </p>
                )}
              </div>
              <div className="text-left text-xs text-gray-500 sm:text-right">
                <p>{formatInstantDateTime(item.created_at)}</p>
                <p>Por {item.actor.name || `usuário ${item.actor.id}`}</p>
              </div>
            </article>
          ))}
        </div>
      )}
      {props.pagination.total_pages > 1 && (
        <nav
          aria-label="Paginação da auditoria"
          className="mt-4 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            disabled={props.loading || props.pagination.page <= 1}
            onClick={() => void props.onLoad(props.pagination.page - 1)}
            className="min-h-10 rounded-xl border px-3 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {props.pagination.page} de {props.pagination.total_pages}
          </span>
          <button
            type="button"
            disabled={
              props.loading ||
              props.pagination.page >= props.pagination.total_pages
            }
            onClick={() => void props.onLoad(props.pagination.page + 1)}
            className="min-h-10 rounded-xl border px-3 disabled:opacity-40"
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  );
}

function TesterForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    email: "",
    trial_days: 14,
    plan: "",
    note: "",
  });
  const [plans, setPlans] = useState<
    Array<{ id: number; name: string; max_users: number }>
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"edit" | "confirm" | "result">("edit");
  const [delivery, setDelivery] = useState<"sent" | "pending" | "failed">(
    "pending",
  );
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void api
      .get("/platform-admin/plans")
      .then((response) => {
        setPlans(response.data.plans);
        setForm((current) => ({
          ...current,
          plan: current.plan || response.data.plans[0]?.name || "",
        }));
      })
      .catch(() =>
        setErrors((current) => ({
          ...current,
          plan: "Não foi possível carregar os planos disponíveis.",
        })),
      );
  }, []);
  const phoneDigits = form.phone_number.replace(/\D/g, "");
  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2)
      next.name = "Informe ao menos 2 caracteres.";
    if (phoneDigits.length < 10 || phoneDigits.length > 13)
      next.phone_number =
        "Informe telefone com DDD e, se necessário, código do país.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Informe um e-mail válido.";
    if (
      !Number.isInteger(form.trial_days) ||
      form.trial_days < 1 ||
      form.trial_days > 365
    )
      next.trial_days = "Use um período entre 1 e 365 dias.";
    if (!plans.some((plan) => plan.name === form.plan))
      next.plan = "Selecione um plano disponível.";
    setErrors(next);
    return !Object.keys(next).length;
  };
  const review = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) setStage("confirm");
  };
  const submit = async () => {
    setBusy(true);
    try {
      const response = await api.post("/platform-admin/testers", {
        ...form,
        name: form.name.trim(),
        phone_number: phoneDigits,
        email: form.email.trim() || undefined,
        note: form.note.trim() || undefined,
      });
      setDelivery(response.data.invitation_delivery);
      setStage("result");
      toast.success("Conta de teste criada");
    } catch (error) {
      setStage("edit");
      const message = getApiErrorMessage(
        error,
        "Não foi possível criar o testador.",
      );
      setErrors((current) => ({ ...current, form: message }));
    } finally {
      setBusy(false);
    }
  };
  const field = (
    name: string,
    label: string,
    help: string,
    input: React.ReactNode,
  ) => (
    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
      {label}
      {input}
      <span
        className={`mt-1 block text-xs font-normal ${errors[name] ? "text-red-600" : "text-gray-500"}`}
      >
        {errors[name] || help}
      </span>
    </label>
  );
  if (stage === "result")
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
        <h3 className="font-bold text-emerald-800 dark:text-emerald-200">
          Testador criado
        </h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
          {delivery === "sent"
            ? "Convite enviado com sucesso pelo WhatsApp."
            : delivery === "pending"
              ? "Convite pendente: o envio não foi confirmado e poderá ser reenviado no detalhe da conta."
              : "Conta criada, mas o envio do convite falhou. O convite permanece pendente para nova tentativa."}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-3 min-h-11 rounded-xl bg-emerald-700 px-4 font-semibold text-white"
        >
          Concluir
        </button>
      </div>
    );
  if (stage === "confirm")
    return (
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <h3 className="font-bold text-blue-900 dark:text-blue-100">
          Revise antes de criar
        </h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Testador</dt>
            <dd className="font-semibold">{form.name.trim()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Telefone</dt>
            <dd className="font-semibold">{phoneDigits}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Plano</dt>
            <dd className="font-semibold">{form.plan}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Período de teste</dt>
            <dd className="font-semibold">{form.trial_days} dias</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-blue-800 dark:text-blue-200">
          A conta e o usuário proprietário serão criados imediatamente. Em
          seguida, o convite de primeiro acesso será enviado pelo WhatsApp.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => setStage("edit")}
            className="min-h-11 rounded-xl border px-4 font-semibold"
          >
            Voltar e editar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="min-h-11 rounded-xl bg-torrinco-600 px-4 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Criando..." : "Confirmar criação"}
          </button>
        </div>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={review}
      className="mt-4 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 dark:bg-slate-900"
    >
      {errors.form && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"
        >
          {errors.form}
        </p>
      )}
      {field(
        "name",
        "Nome do testador",
        "Será também o nome inicial da conta.",
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-800"
        />,
      )}
      {field(
        "phone_number",
        "Telefone com DDD",
        "Aceita código do país; será armazenado somente com números.",
        <input
          inputMode="tel"
          value={form.phone_number}
          onChange={(event) =>
            setForm({
              ...form,
              phone_number: event.target.value
                .replace(/[^\d+()\s-]/g, "")
                .slice(0, 24),
            })
          }
          placeholder="+55 (85) 99999-9999"
          className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-800"
        />,
      )}
      {field(
        "email",
        "E-mail (opcional)",
        "Usado como informação complementar do proprietário.",
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-800"
        />,
      )}
      {field(
        "plan",
        "Plano inicial",
        "Somente planos comerciais ativos estão disponíveis.",
        <CustomSelect
          value={form.plan}
          onChange={(value) => setForm({ ...form, plan: String(value) })}
          className="mt-1"
          placeholder="Selecione um plano"
          options={plans.map((plan) => ({ value: plan.name, label: `${plan.name} · até ${plan.max_users} usuário(s)` }))}
        />,
      )}
      {field(
        "trial_days",
        "Duração do teste em dias",
        "Entre 1 e 365 dias corridos.",
        <input
          type="number"
          min="1"
          max="365"
          value={form.trial_days}
          onChange={(event) =>
            setForm({ ...form, trial_days: Number(event.target.value) })
          }
          className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-800"
        />,
      )}
      {field(
        "note",
        "Observação interna (opcional)",
        "Fica registrada para contexto administrativo.",
        <textarea
          rows={3}
          maxLength={500}
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          className="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-800"
        />,
      )}
      <div className="sm:col-span-2">
        <button className="min-h-11 rounded-xl bg-torrinco-600 px-5 font-semibold text-white">
          Revisar criação
        </button>
      </div>
    </form>
  );
}
