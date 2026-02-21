import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.accounts.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.accounts.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.accounts`: Exposes CRUD operations for the **accounts** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Accounts
  * const accounts = await prisma.accounts.findMany()
  * ```
  */
    get accounts(): Prisma.accountsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.budgets`: Exposes CRUD operations for the **budgets** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Budgets
      * const budgets = await prisma.budgets.findMany()
      * ```
      */
    get budgets(): Prisma.budgetsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.categories`: Exposes CRUD operations for the **categories** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Categories
      * const categories = await prisma.categories.findMany()
      * ```
      */
    get categories(): Prisma.categoriesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.events`: Exposes CRUD operations for the **events** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Events
      * const events = await prisma.events.findMany()
      * ```
      */
    get events(): Prisma.eventsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.financial_entities`: Exposes CRUD operations for the **financial_entities** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Financial_entities
      * const financial_entities = await prisma.financial_entities.findMany()
      * ```
      */
    get financial_entities(): Prisma.financial_entitiesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.income_sources`: Exposes CRUD operations for the **income_sources** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Income_sources
      * const income_sources = await prisma.income_sources.findMany()
      * ```
      */
    get income_sources(): Prisma.income_sourcesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.recurring_events`: Exposes CRUD operations for the **recurring_events** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Recurring_events
      * const recurring_events = await prisma.recurring_events.findMany()
      * ```
      */
    get recurring_events(): Prisma.recurring_eventsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.recurring_transactions`: Exposes CRUD operations for the **recurring_transactions** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Recurring_transactions
      * const recurring_transactions = await prisma.recurring_transactions.findMany()
      * ```
      */
    get recurring_transactions(): Prisma.recurring_transactionsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.reminder_logs`: Exposes CRUD operations for the **reminder_logs** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Reminder_logs
      * const reminder_logs = await prisma.reminder_logs.findMany()
      * ```
      */
    get reminder_logs(): Prisma.reminder_logsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.reminders`: Exposes CRUD operations for the **reminders** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Reminders
      * const reminders = await prisma.reminders.findMany()
      * ```
      */
    get reminders(): Prisma.remindersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchase_installments`: Exposes CRUD operations for the **purchase_installments** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Purchase_installments
      * const purchase_installments = await prisma.purchase_installments.findMany()
      * ```
      */
    get purchase_installments(): Prisma.purchase_installmentsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.transactions`: Exposes CRUD operations for the **transactions** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Transactions
      * const transactions = await prisma.transactions.findMany()
      * ```
      */
    get transactions(): Prisma.transactionsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.users`: Exposes CRUD operations for the **users** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Users
      * const users = await prisma.users.findMany()
      * ```
      */
    get users(): Prisma.usersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map