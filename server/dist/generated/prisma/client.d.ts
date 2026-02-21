import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
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
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model accounts
 *
 */
export type accounts = Prisma.accountsModel;
/**
 * Model budgets
 *
 */
export type budgets = Prisma.budgetsModel;
/**
 * Model categories
 *
 */
export type categories = Prisma.categoriesModel;
/**
 * Model events
 *
 */
export type events = Prisma.eventsModel;
/**
 * Model financial_entities
 *
 */
export type financial_entities = Prisma.financial_entitiesModel;
/**
 * Model income_sources
 *
 */
export type income_sources = Prisma.income_sourcesModel;
/**
 * Model recurring_events
 *
 */
export type recurring_events = Prisma.recurring_eventsModel;
/**
 * Model recurring_transactions
 *
 */
export type recurring_transactions = Prisma.recurring_transactionsModel;
/**
 * Model reminder_logs
 *
 */
export type reminder_logs = Prisma.reminder_logsModel;
/**
 * Model reminders
 *
 */
export type reminders = Prisma.remindersModel;
/**
 * Model purchase_installments
 *
 */
export type purchase_installments = Prisma.purchase_installmentsModel;
/**
 * Model transactions
 *
 */
export type transactions = Prisma.transactionsModel;
/**
 * Model users
 *
 */
export type users = Prisma.usersModel;
//# sourceMappingURL=client.d.ts.map