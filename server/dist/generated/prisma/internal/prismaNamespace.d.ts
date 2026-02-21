import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.4.0
 * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
    readonly users: "users";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "accounts" | "budgets" | "categories" | "events" | "financial_entities" | "income_sources" | "recurring_events" | "recurring_transactions" | "reminder_logs" | "reminders" | "purchase_installments" | "transactions" | "users";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        accounts: {
            payload: Prisma.$accountsPayload<ExtArgs>;
            fields: Prisma.accountsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.accountsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.accountsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                findFirst: {
                    args: Prisma.accountsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.accountsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                findMany: {
                    args: Prisma.accountsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>[];
                };
                create: {
                    args: Prisma.accountsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                createMany: {
                    args: Prisma.accountsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.accountsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                update: {
                    args: Prisma.accountsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                deleteMany: {
                    args: Prisma.accountsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.accountsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.accountsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$accountsPayload>;
                };
                aggregate: {
                    args: Prisma.AccountsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAccounts>;
                };
                groupBy: {
                    args: Prisma.accountsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AccountsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.accountsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AccountsCountAggregateOutputType> | number;
                };
            };
        };
        budgets: {
            payload: Prisma.$budgetsPayload<ExtArgs>;
            fields: Prisma.budgetsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.budgetsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.budgetsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                findFirst: {
                    args: Prisma.budgetsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.budgetsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                findMany: {
                    args: Prisma.budgetsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>[];
                };
                create: {
                    args: Prisma.budgetsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                createMany: {
                    args: Prisma.budgetsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.budgetsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                update: {
                    args: Prisma.budgetsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                deleteMany: {
                    args: Prisma.budgetsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.budgetsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.budgetsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$budgetsPayload>;
                };
                aggregate: {
                    args: Prisma.BudgetsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBudgets>;
                };
                groupBy: {
                    args: Prisma.budgetsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BudgetsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.budgetsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BudgetsCountAggregateOutputType> | number;
                };
            };
        };
        categories: {
            payload: Prisma.$categoriesPayload<ExtArgs>;
            fields: Prisma.categoriesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.categoriesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.categoriesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                findFirst: {
                    args: Prisma.categoriesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.categoriesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                findMany: {
                    args: Prisma.categoriesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>[];
                };
                create: {
                    args: Prisma.categoriesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                createMany: {
                    args: Prisma.categoriesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.categoriesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                update: {
                    args: Prisma.categoriesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                deleteMany: {
                    args: Prisma.categoriesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.categoriesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.categoriesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$categoriesPayload>;
                };
                aggregate: {
                    args: Prisma.CategoriesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCategories>;
                };
                groupBy: {
                    args: Prisma.categoriesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CategoriesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.categoriesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CategoriesCountAggregateOutputType> | number;
                };
            };
        };
        events: {
            payload: Prisma.$eventsPayload<ExtArgs>;
            fields: Prisma.eventsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.eventsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.eventsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                findFirst: {
                    args: Prisma.eventsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.eventsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                findMany: {
                    args: Prisma.eventsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>[];
                };
                create: {
                    args: Prisma.eventsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                createMany: {
                    args: Prisma.eventsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.eventsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                update: {
                    args: Prisma.eventsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                deleteMany: {
                    args: Prisma.eventsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.eventsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.eventsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$eventsPayload>;
                };
                aggregate: {
                    args: Prisma.EventsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEvents>;
                };
                groupBy: {
                    args: Prisma.eventsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.eventsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventsCountAggregateOutputType> | number;
                };
            };
        };
        financial_entities: {
            payload: Prisma.$financial_entitiesPayload<ExtArgs>;
            fields: Prisma.financial_entitiesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.financial_entitiesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.financial_entitiesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                findFirst: {
                    args: Prisma.financial_entitiesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.financial_entitiesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                findMany: {
                    args: Prisma.financial_entitiesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>[];
                };
                create: {
                    args: Prisma.financial_entitiesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                createMany: {
                    args: Prisma.financial_entitiesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.financial_entitiesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                update: {
                    args: Prisma.financial_entitiesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                deleteMany: {
                    args: Prisma.financial_entitiesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.financial_entitiesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.financial_entitiesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$financial_entitiesPayload>;
                };
                aggregate: {
                    args: Prisma.Financial_entitiesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFinancial_entities>;
                };
                groupBy: {
                    args: Prisma.financial_entitiesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Financial_entitiesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.financial_entitiesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Financial_entitiesCountAggregateOutputType> | number;
                };
            };
        };
        income_sources: {
            payload: Prisma.$income_sourcesPayload<ExtArgs>;
            fields: Prisma.income_sourcesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.income_sourcesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.income_sourcesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                findFirst: {
                    args: Prisma.income_sourcesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.income_sourcesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                findMany: {
                    args: Prisma.income_sourcesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>[];
                };
                create: {
                    args: Prisma.income_sourcesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                createMany: {
                    args: Prisma.income_sourcesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.income_sourcesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                update: {
                    args: Prisma.income_sourcesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                deleteMany: {
                    args: Prisma.income_sourcesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.income_sourcesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.income_sourcesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$income_sourcesPayload>;
                };
                aggregate: {
                    args: Prisma.Income_sourcesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIncome_sources>;
                };
                groupBy: {
                    args: Prisma.income_sourcesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Income_sourcesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.income_sourcesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Income_sourcesCountAggregateOutputType> | number;
                };
            };
        };
        recurring_events: {
            payload: Prisma.$recurring_eventsPayload<ExtArgs>;
            fields: Prisma.recurring_eventsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.recurring_eventsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.recurring_eventsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                findFirst: {
                    args: Prisma.recurring_eventsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.recurring_eventsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                findMany: {
                    args: Prisma.recurring_eventsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>[];
                };
                create: {
                    args: Prisma.recurring_eventsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                createMany: {
                    args: Prisma.recurring_eventsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.recurring_eventsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                update: {
                    args: Prisma.recurring_eventsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                deleteMany: {
                    args: Prisma.recurring_eventsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.recurring_eventsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.recurring_eventsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_eventsPayload>;
                };
                aggregate: {
                    args: Prisma.Recurring_eventsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRecurring_events>;
                };
                groupBy: {
                    args: Prisma.recurring_eventsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_eventsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.recurring_eventsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_eventsCountAggregateOutputType> | number;
                };
            };
        };
        recurring_transactions: {
            payload: Prisma.$recurring_transactionsPayload<ExtArgs>;
            fields: Prisma.recurring_transactionsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.recurring_transactionsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.recurring_transactionsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                findFirst: {
                    args: Prisma.recurring_transactionsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.recurring_transactionsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                findMany: {
                    args: Prisma.recurring_transactionsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>[];
                };
                create: {
                    args: Prisma.recurring_transactionsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                createMany: {
                    args: Prisma.recurring_transactionsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.recurring_transactionsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                update: {
                    args: Prisma.recurring_transactionsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                deleteMany: {
                    args: Prisma.recurring_transactionsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.recurring_transactionsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.recurring_transactionsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_transactionsPayload>;
                };
                aggregate: {
                    args: Prisma.Recurring_transactionsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRecurring_transactions>;
                };
                groupBy: {
                    args: Prisma.recurring_transactionsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_transactionsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.recurring_transactionsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_transactionsCountAggregateOutputType> | number;
                };
            };
        };
        reminder_logs: {
            payload: Prisma.$reminder_logsPayload<ExtArgs>;
            fields: Prisma.reminder_logsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.reminder_logsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.reminder_logsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                findFirst: {
                    args: Prisma.reminder_logsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.reminder_logsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                findMany: {
                    args: Prisma.reminder_logsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>[];
                };
                create: {
                    args: Prisma.reminder_logsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                createMany: {
                    args: Prisma.reminder_logsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.reminder_logsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                update: {
                    args: Prisma.reminder_logsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                deleteMany: {
                    args: Prisma.reminder_logsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.reminder_logsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.reminder_logsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$reminder_logsPayload>;
                };
                aggregate: {
                    args: Prisma.Reminder_logsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReminder_logs>;
                };
                groupBy: {
                    args: Prisma.reminder_logsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Reminder_logsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.reminder_logsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Reminder_logsCountAggregateOutputType> | number;
                };
            };
        };
        reminders: {
            payload: Prisma.$remindersPayload<ExtArgs>;
            fields: Prisma.remindersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.remindersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.remindersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                findFirst: {
                    args: Prisma.remindersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.remindersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                findMany: {
                    args: Prisma.remindersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>[];
                };
                create: {
                    args: Prisma.remindersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                createMany: {
                    args: Prisma.remindersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.remindersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                update: {
                    args: Prisma.remindersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                deleteMany: {
                    args: Prisma.remindersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.remindersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.remindersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$remindersPayload>;
                };
                aggregate: {
                    args: Prisma.RemindersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReminders>;
                };
                groupBy: {
                    args: Prisma.remindersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RemindersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.remindersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RemindersCountAggregateOutputType> | number;
                };
            };
        };
        purchase_installments: {
            payload: Prisma.$purchase_installmentsPayload<ExtArgs>;
            fields: Prisma.purchase_installmentsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.purchase_installmentsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.purchase_installmentsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                findFirst: {
                    args: Prisma.purchase_installmentsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.purchase_installmentsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                findMany: {
                    args: Prisma.purchase_installmentsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>[];
                };
                create: {
                    args: Prisma.purchase_installmentsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                createMany: {
                    args: Prisma.purchase_installmentsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.purchase_installmentsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                update: {
                    args: Prisma.purchase_installmentsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                deleteMany: {
                    args: Prisma.purchase_installmentsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.purchase_installmentsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.purchase_installmentsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$purchase_installmentsPayload>;
                };
                aggregate: {
                    args: Prisma.Purchase_installmentsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePurchase_installments>;
                };
                groupBy: {
                    args: Prisma.purchase_installmentsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Purchase_installmentsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.purchase_installmentsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Purchase_installmentsCountAggregateOutputType> | number;
                };
            };
        };
        transactions: {
            payload: Prisma.$transactionsPayload<ExtArgs>;
            fields: Prisma.transactionsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.transactionsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.transactionsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                findFirst: {
                    args: Prisma.transactionsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.transactionsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                findMany: {
                    args: Prisma.transactionsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>[];
                };
                create: {
                    args: Prisma.transactionsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                createMany: {
                    args: Prisma.transactionsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.transactionsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                update: {
                    args: Prisma.transactionsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                deleteMany: {
                    args: Prisma.transactionsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.transactionsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.transactionsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transactionsPayload>;
                };
                aggregate: {
                    args: Prisma.TransactionsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTransactions>;
                };
                groupBy: {
                    args: Prisma.transactionsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TransactionsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.transactionsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TransactionsCountAggregateOutputType> | number;
                };
            };
        };
        users: {
            payload: Prisma.$usersPayload<ExtArgs>;
            fields: Prisma.usersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.usersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                findFirst: {
                    args: Prisma.usersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                findMany: {
                    args: Prisma.usersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>[];
                };
                create: {
                    args: Prisma.usersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                createMany: {
                    args: Prisma.usersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.usersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                update: {
                    args: Prisma.usersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                deleteMany: {
                    args: Prisma.usersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.usersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.usersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                aggregate: {
                    args: Prisma.UsersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUsers>;
                };
                groupBy: {
                    args: Prisma.usersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.usersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
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
};
export type TransactionsScalarFieldEnum = (typeof TransactionsScalarFieldEnum)[keyof typeof TransactionsScalarFieldEnum];
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
/**
 * Field references
 */
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'accounts_plan_type'
 */
export type Enumaccounts_plan_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'accounts_plan_type'>;
/**
 * Reference to a field of type 'accounts_status'
 */
export type Enumaccounts_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'accounts_status'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'financial_entities_type'
 */
export type Enumfinancial_entities_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'financial_entities_type'>;
/**
 * Reference to a field of type 'recurring_events_frequency'
 */
export type Enumrecurring_events_frequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'recurring_events_frequency'>;
/**
 * Reference to a field of type 'recurring_events_status'
 */
export type Enumrecurring_events_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'recurring_events_status'>;
/**
 * Reference to a field of type 'recurring_transactions_type'
 */
export type Enumrecurring_transactions_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'recurring_transactions_type'>;
/**
 * Reference to a field of type 'recurring_transactions_frequency'
 */
export type Enumrecurring_transactions_frequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'recurring_transactions_frequency'>;
/**
 * Reference to a field of type 'recurring_transactions_status'
 */
export type Enumrecurring_transactions_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'recurring_transactions_status'>;
/**
 * Reference to a field of type 'reminder_logs_source_type'
 */
export type Enumreminder_logs_source_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminder_logs_source_type'>;
/**
 * Reference to a field of type 'reminder_logs_reminder_type_new'
 */
export type Enumreminder_logs_reminder_type_newFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminder_logs_reminder_type_new'>;
/**
 * Reference to a field of type 'reminder_logs_reminder_type'
 */
export type Enumreminder_logs_reminder_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminder_logs_reminder_type'>;
/**
 * Reference to a field of type 'reminders_frequency'
 */
export type Enumreminders_frequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminders_frequency'>;
/**
 * Reference to a field of type 'reminders_weekday'
 */
export type Enumreminders_weekdayFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminders_weekday'>;
/**
 * Reference to a field of type 'reminders_status'
 */
export type Enumreminders_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'reminders_status'>;
/**
 * Reference to a field of type 'purchase_installments_status'
 */
export type Enumpurchase_installments_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'purchase_installments_status'>;
/**
 * Reference to a field of type 'transactions_type'
 */
export type Enumtransactions_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transactions_type'>;
/**
 * Reference to a field of type 'transactions_status'
 */
export type Enumtransactions_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'transactions_status'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'users_role'
 */
export type Enumusers_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'users_role'>;
/**
 * Reference to a field of type 'users_status'
 */
export type Enumusers_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'users_status'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    accounts?: Prisma.accountsOmit;
    budgets?: Prisma.budgetsOmit;
    categories?: Prisma.categoriesOmit;
    events?: Prisma.eventsOmit;
    financial_entities?: Prisma.financial_entitiesOmit;
    income_sources?: Prisma.income_sourcesOmit;
    recurring_events?: Prisma.recurring_eventsOmit;
    recurring_transactions?: Prisma.recurring_transactionsOmit;
    reminder_logs?: Prisma.reminder_logsOmit;
    reminders?: Prisma.remindersOmit;
    purchase_installments?: Prisma.purchase_installmentsOmit;
    transactions?: Prisma.transactionsOmit;
    users?: Prisma.usersOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map