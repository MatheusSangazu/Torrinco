import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly accounts: "accounts";
    readonly budgets: "budgets";
    readonly categories: "categories";
    readonly events: "events";
    readonly financial_entities: "financial_entities";
    readonly income_sources: "income_sources";
    readonly recurring_events: "recurring_events";
    readonly recurring_transactions: "recurring_transactions";
    readonly reminder_logs: "reminder_logs";
    readonly reminders: "reminders";
    readonly purchase_installments: "purchase_installments";
    readonly transactions: "transactions";
    readonly refresh_tokens: "refresh_tokens";
    readonly users: "users";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const AccountsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly plan_type: "plan_type";
    readonly status: "status";
    readonly created_at: "created_at";
};
export type AccountsScalarFieldEnum = (typeof AccountsScalarFieldEnum)[keyof typeof AccountsScalarFieldEnum];
export declare const BudgetsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly category: "category";
    readonly amount_limit: "amount_limit";
    readonly month_ref: "month_ref";
    readonly created_at: "created_at";
};
export type BudgetsScalarFieldEnum = (typeof BudgetsScalarFieldEnum)[keyof typeof BudgetsScalarFieldEnum];
export declare const CategoriesScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly name: "name";
    readonly type: "type";
    readonly color: "color";
    readonly created_at: "created_at";
};
export type CategoriesScalarFieldEnum = (typeof CategoriesScalarFieldEnum)[keyof typeof CategoriesScalarFieldEnum];
export declare const EventsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly google_event_id: "google_event_id";
    readonly title: "title";
    readonly event_date: "event_date";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type EventsScalarFieldEnum = (typeof EventsScalarFieldEnum)[keyof typeof EventsScalarFieldEnum];
export declare const Financial_entitiesScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly name: "name";
    readonly type: "type";
    readonly balance: "balance";
    readonly credit_limit: "credit_limit";
    readonly closing_day: "closing_day";
    readonly due_day: "due_day";
    readonly color: "color";
    readonly created_at: "created_at";
};
export type Financial_entitiesScalarFieldEnum = (typeof Financial_entitiesScalarFieldEnum)[keyof typeof Financial_entitiesScalarFieldEnum];
export declare const Income_sourcesScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly name: "name";
    readonly color: "color";
    readonly created_at: "created_at";
};
export type Income_sourcesScalarFieldEnum = (typeof Income_sourcesScalarFieldEnum)[keyof typeof Income_sourcesScalarFieldEnum];
export declare const Recurring_eventsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly google_event_id: "google_event_id";
    readonly title: "title";
    readonly description: "description";
    readonly event_time: "event_time";
    readonly frequency: "frequency";
    readonly start_date: "start_date";
    readonly next_event_date: "next_event_date";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly end_date: "end_date";
};
export type Recurring_eventsScalarFieldEnum = (typeof Recurring_eventsScalarFieldEnum)[keyof typeof Recurring_eventsScalarFieldEnum];
export declare const Recurring_transactionsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly description: "description";
    readonly amount: "amount";
    readonly category: "category";
    readonly type: "type";
    readonly frequency: "frequency";
    readonly start_date: "start_date";
    readonly next_due_date: "next_due_date";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly entity_id: "entity_id";
    readonly payment_method: "payment_method";
};
export type Recurring_transactionsScalarFieldEnum = (typeof Recurring_transactionsScalarFieldEnum)[keyof typeof Recurring_transactionsScalarFieldEnum];
export declare const Reminder_logsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly event_identifier: "event_identifier";
    readonly source_type: "source_type";
    readonly reminder_type_new: "reminder_type_new";
    readonly reminder_type: "reminder_type";
    readonly sent_at: "sent_at";
};
export type Reminder_logsScalarFieldEnum = (typeof Reminder_logsScalarFieldEnum)[keyof typeof Reminder_logsScalarFieldEnum];
export declare const RemindersScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly content: "content";
    readonly trigger_time: "trigger_time";
    readonly frequency: "frequency";
    readonly specific_date: "specific_date";
    readonly weekday: "weekday";
    readonly status: "status";
    readonly created_at: "created_at";
};
export type RemindersScalarFieldEnum = (typeof RemindersScalarFieldEnum)[keyof typeof RemindersScalarFieldEnum];
export declare const Purchase_installmentsScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly entity_id: "entity_id";
    readonly description: "description";
    readonly amount: "amount";
    readonly installment_count: "installment_count";
    readonly installment_value: "installment_value";
    readonly first_installment: "first_installment";
    readonly start_date: "start_date";
    readonly status: "status";
    readonly created_at: "created_at";
};
export type Purchase_installmentsScalarFieldEnum = (typeof Purchase_installmentsScalarFieldEnum)[keyof typeof Purchase_installmentsScalarFieldEnum];
export declare const TransactionsScalarFieldEnum: {
    readonly id: "id";
    readonly account_id: "account_id";
    readonly user_id: "user_id";
    readonly entity_id: "entity_id";
    readonly amount: "amount";
    readonly type: "type";
    readonly status: "status";
    readonly category: "category";
    readonly description: "description";
    readonly transaction_date: "transaction_date";
    readonly created_at: "created_at";
    readonly is_recurring: "is_recurring";
    readonly deleted_at: "deleted_at";
    readonly payment_method: "payment_method";
    readonly category_id: "category_id";
    readonly income_source_id: "income_source_id";
    readonly installment_id: "installment_id";
    readonly installment_number: "installment_number";
    readonly recurring_transaction_id: "recurring_transaction_id";
};
export type TransactionsScalarFieldEnum = (typeof TransactionsScalarFieldEnum)[keyof typeof TransactionsScalarFieldEnum];
export declare const Refresh_tokensScalarFieldEnum: {
    readonly id: "id";
    readonly token: "token";
    readonly user_id: "user_id";
    readonly expires_at: "expires_at";
    readonly created_at: "created_at";
    readonly revoked_at: "revoked_at";
};
export type Refresh_tokensScalarFieldEnum = (typeof Refresh_tokensScalarFieldEnum)[keyof typeof Refresh_tokensScalarFieldEnum];
export declare const UsersScalarFieldEnum: {
    readonly id: "id";
    readonly account_id: "account_id";
    readonly phone_number: "phone_number";
    readonly password_hash: "password_hash";
    readonly name: "name";
    readonly role: "role";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly email: "email";
    readonly google_refresh_token: "google_refresh_token";
    readonly google_email: "google_email";
    readonly google_calendar_id: "google_calendar_id";
};
export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const accountsOrderByRelevanceFieldEnum: {
    readonly name: "name";
};
export type accountsOrderByRelevanceFieldEnum = (typeof accountsOrderByRelevanceFieldEnum)[keyof typeof accountsOrderByRelevanceFieldEnum];
export declare const budgetsOrderByRelevanceFieldEnum: {
    readonly category: "category";
    readonly month_ref: "month_ref";
};
export type budgetsOrderByRelevanceFieldEnum = (typeof budgetsOrderByRelevanceFieldEnum)[keyof typeof budgetsOrderByRelevanceFieldEnum];
export declare const categoriesOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly type: "type";
    readonly color: "color";
};
export type categoriesOrderByRelevanceFieldEnum = (typeof categoriesOrderByRelevanceFieldEnum)[keyof typeof categoriesOrderByRelevanceFieldEnum];
export declare const eventsOrderByRelevanceFieldEnum: {
    readonly google_event_id: "google_event_id";
    readonly title: "title";
    readonly description: "description";
};
export type eventsOrderByRelevanceFieldEnum = (typeof eventsOrderByRelevanceFieldEnum)[keyof typeof eventsOrderByRelevanceFieldEnum];
export declare const financial_entitiesOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly color: "color";
};
export type financial_entitiesOrderByRelevanceFieldEnum = (typeof financial_entitiesOrderByRelevanceFieldEnum)[keyof typeof financial_entitiesOrderByRelevanceFieldEnum];
export declare const income_sourcesOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly color: "color";
};
export type income_sourcesOrderByRelevanceFieldEnum = (typeof income_sourcesOrderByRelevanceFieldEnum)[keyof typeof income_sourcesOrderByRelevanceFieldEnum];
export declare const recurring_eventsOrderByRelevanceFieldEnum: {
    readonly google_event_id: "google_event_id";
    readonly title: "title";
    readonly description: "description";
};
export type recurring_eventsOrderByRelevanceFieldEnum = (typeof recurring_eventsOrderByRelevanceFieldEnum)[keyof typeof recurring_eventsOrderByRelevanceFieldEnum];
export declare const recurring_transactionsOrderByRelevanceFieldEnum: {
    readonly description: "description";
    readonly category: "category";
    readonly payment_method: "payment_method";
};
export type recurring_transactionsOrderByRelevanceFieldEnum = (typeof recurring_transactionsOrderByRelevanceFieldEnum)[keyof typeof recurring_transactionsOrderByRelevanceFieldEnum];
export declare const reminder_logsOrderByRelevanceFieldEnum: {
    readonly event_identifier: "event_identifier";
};
export type reminder_logsOrderByRelevanceFieldEnum = (typeof reminder_logsOrderByRelevanceFieldEnum)[keyof typeof reminder_logsOrderByRelevanceFieldEnum];
export declare const remindersOrderByRelevanceFieldEnum: {
    readonly content: "content";
};
export type remindersOrderByRelevanceFieldEnum = (typeof remindersOrderByRelevanceFieldEnum)[keyof typeof remindersOrderByRelevanceFieldEnum];
export declare const purchase_installmentsOrderByRelevanceFieldEnum: {
    readonly description: "description";
};
export type purchase_installmentsOrderByRelevanceFieldEnum = (typeof purchase_installmentsOrderByRelevanceFieldEnum)[keyof typeof purchase_installmentsOrderByRelevanceFieldEnum];
export declare const transactionsOrderByRelevanceFieldEnum: {
    readonly category: "category";
    readonly description: "description";
    readonly payment_method: "payment_method";
};
export type transactionsOrderByRelevanceFieldEnum = (typeof transactionsOrderByRelevanceFieldEnum)[keyof typeof transactionsOrderByRelevanceFieldEnum];
export declare const refresh_tokensOrderByRelevanceFieldEnum: {
    readonly token: "token";
};
export type refresh_tokensOrderByRelevanceFieldEnum = (typeof refresh_tokensOrderByRelevanceFieldEnum)[keyof typeof refresh_tokensOrderByRelevanceFieldEnum];
export declare const usersOrderByRelevanceFieldEnum: {
    readonly phone_number: "phone_number";
    readonly password_hash: "password_hash";
    readonly name: "name";
    readonly email: "email";
    readonly google_refresh_token: "google_refresh_token";
    readonly google_email: "google_email";
    readonly google_calendar_id: "google_calendar_id";
};
export type usersOrderByRelevanceFieldEnum = (typeof usersOrderByRelevanceFieldEnum)[keyof typeof usersOrderByRelevanceFieldEnum];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map