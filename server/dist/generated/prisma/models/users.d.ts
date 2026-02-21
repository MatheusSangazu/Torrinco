import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model users
 *
 */
export type usersModel = runtime.Types.Result.DefaultSelection<Prisma.$usersPayload>;
export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
export type UsersAvgAggregateOutputType = {
    id: number | null;
    account_id: number | null;
};
export type UsersSumAggregateOutputType = {
    id: number | null;
    account_id: number | null;
};
export type UsersMinAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    phone_number: string | null;
    password_hash: string | null;
    name: string | null;
    role: $Enums.users_role | null;
    status: $Enums.users_status | null;
    created_at: Date | null;
    email: string | null;
    google_refresh_token: string | null;
    google_email: string | null;
    google_calendar_id: string | null;
};
export type UsersMaxAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    phone_number: string | null;
    password_hash: string | null;
    name: string | null;
    role: $Enums.users_role | null;
    status: $Enums.users_status | null;
    created_at: Date | null;
    email: string | null;
    google_refresh_token: string | null;
    google_email: string | null;
    google_calendar_id: string | null;
};
export type UsersCountAggregateOutputType = {
    id: number;
    account_id: number;
    phone_number: number;
    password_hash: number;
    name: number;
    role: number;
    status: number;
    created_at: number;
    email: number;
    google_refresh_token: number;
    google_email: number;
    google_calendar_id: number;
    _all: number;
};
export type UsersAvgAggregateInputType = {
    id?: true;
    account_id?: true;
};
export type UsersSumAggregateInputType = {
    id?: true;
    account_id?: true;
};
export type UsersMinAggregateInputType = {
    id?: true;
    account_id?: true;
    phone_number?: true;
    password_hash?: true;
    name?: true;
    role?: true;
    status?: true;
    created_at?: true;
    email?: true;
    google_refresh_token?: true;
    google_email?: true;
    google_calendar_id?: true;
};
export type UsersMaxAggregateInputType = {
    id?: true;
    account_id?: true;
    phone_number?: true;
    password_hash?: true;
    name?: true;
    role?: true;
    status?: true;
    created_at?: true;
    email?: true;
    google_refresh_token?: true;
    google_email?: true;
    google_calendar_id?: true;
};
export type UsersCountAggregateInputType = {
    id?: true;
    account_id?: true;
    phone_number?: true;
    password_hash?: true;
    name?: true;
    role?: true;
    status?: true;
    created_at?: true;
    email?: true;
    google_refresh_token?: true;
    google_email?: true;
    google_calendar_id?: true;
    _all?: true;
};
export type UsersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: Prisma.usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType;
};
export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
    [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUsers[P]> : Prisma.GetScalarType<T[P], AggregateUsers[P]>;
};
export type usersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithAggregationInput | Prisma.usersOrderByWithAggregationInput[];
    by: Prisma.UsersScalarFieldEnum[] | Prisma.UsersScalarFieldEnum;
    having?: Prisma.usersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsersCountAggregateInputType | true;
    _avg?: UsersAvgAggregateInputType;
    _sum?: UsersSumAggregateInputType;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
};
export type UsersGroupByOutputType = {
    id: number;
    account_id: number;
    phone_number: string;
    password_hash: string | null;
    name: string | null;
    role: $Enums.users_role | null;
    status: $Enums.users_status | null;
    created_at: Date | null;
    email: string | null;
    google_refresh_token: string | null;
    google_email: string | null;
    google_calendar_id: string | null;
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UsersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]>;
}>>;
export type usersWhereInput = {
    AND?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    OR?: Prisma.usersWhereInput[];
    NOT?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    id?: Prisma.IntFilter<"users"> | number;
    account_id?: Prisma.IntFilter<"users"> | number;
    phone_number?: Prisma.StringFilter<"users"> | string;
    password_hash?: Prisma.StringNullableFilter<"users"> | string | null;
    name?: Prisma.StringNullableFilter<"users"> | string | null;
    role?: Prisma.Enumusers_roleNullableFilter<"users"> | $Enums.users_role | null;
    status?: Prisma.Enumusers_statusNullableFilter<"users"> | $Enums.users_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"users"> | Date | string | null;
    email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_refresh_token?: Prisma.StringNullableFilter<"users"> | string | null;
    google_email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_calendar_id?: Prisma.StringNullableFilter<"users"> | string | null;
    budgets?: Prisma.BudgetsListRelationFilter;
    categories?: Prisma.CategoriesListRelationFilter;
    events?: Prisma.EventsListRelationFilter;
    financial_entities?: Prisma.Financial_entitiesListRelationFilter;
    income_sources?: Prisma.Income_sourcesListRelationFilter;
    recurring_events?: Prisma.Recurring_eventsListRelationFilter;
    recurring_transactions?: Prisma.Recurring_transactionsListRelationFilter;
    reminder_logs?: Prisma.Reminder_logsListRelationFilter;
    reminders?: Prisma.RemindersListRelationFilter;
    purchase_installments?: Prisma.Purchase_installmentsListRelationFilter;
    transactions?: Prisma.TransactionsListRelationFilter;
    accounts?: Prisma.XOR<Prisma.AccountsScalarRelationFilter, Prisma.accountsWhereInput>;
};
export type usersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    phone_number?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_refresh_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_calendar_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    budgets?: Prisma.budgetsOrderByRelationAggregateInput;
    categories?: Prisma.categoriesOrderByRelationAggregateInput;
    events?: Prisma.eventsOrderByRelationAggregateInput;
    financial_entities?: Prisma.financial_entitiesOrderByRelationAggregateInput;
    income_sources?: Prisma.income_sourcesOrderByRelationAggregateInput;
    recurring_events?: Prisma.recurring_eventsOrderByRelationAggregateInput;
    recurring_transactions?: Prisma.recurring_transactionsOrderByRelationAggregateInput;
    reminder_logs?: Prisma.reminder_logsOrderByRelationAggregateInput;
    reminders?: Prisma.remindersOrderByRelationAggregateInput;
    purchase_installments?: Prisma.purchase_installmentsOrderByRelationAggregateInput;
    transactions?: Prisma.transactionsOrderByRelationAggregateInput;
    accounts?: Prisma.accountsOrderByWithRelationInput;
    _relevance?: Prisma.usersOrderByRelevanceInput;
};
export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    phone_number?: string;
    AND?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    OR?: Prisma.usersWhereInput[];
    NOT?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    account_id?: Prisma.IntFilter<"users"> | number;
    password_hash?: Prisma.StringNullableFilter<"users"> | string | null;
    name?: Prisma.StringNullableFilter<"users"> | string | null;
    role?: Prisma.Enumusers_roleNullableFilter<"users"> | $Enums.users_role | null;
    status?: Prisma.Enumusers_statusNullableFilter<"users"> | $Enums.users_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"users"> | Date | string | null;
    email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_refresh_token?: Prisma.StringNullableFilter<"users"> | string | null;
    google_email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_calendar_id?: Prisma.StringNullableFilter<"users"> | string | null;
    budgets?: Prisma.BudgetsListRelationFilter;
    categories?: Prisma.CategoriesListRelationFilter;
    events?: Prisma.EventsListRelationFilter;
    financial_entities?: Prisma.Financial_entitiesListRelationFilter;
    income_sources?: Prisma.Income_sourcesListRelationFilter;
    recurring_events?: Prisma.Recurring_eventsListRelationFilter;
    recurring_transactions?: Prisma.Recurring_transactionsListRelationFilter;
    reminder_logs?: Prisma.Reminder_logsListRelationFilter;
    reminders?: Prisma.RemindersListRelationFilter;
    purchase_installments?: Prisma.Purchase_installmentsListRelationFilter;
    transactions?: Prisma.TransactionsListRelationFilter;
    accounts?: Prisma.XOR<Prisma.AccountsScalarRelationFilter, Prisma.accountsWhereInput>;
}, "id" | "phone_number">;
export type usersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    phone_number?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_refresh_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_calendar_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.usersCountOrderByAggregateInput;
    _avg?: Prisma.usersAvgOrderByAggregateInput;
    _max?: Prisma.usersMaxOrderByAggregateInput;
    _min?: Prisma.usersMinOrderByAggregateInput;
    _sum?: Prisma.usersSumOrderByAggregateInput;
};
export type usersScalarWhereWithAggregatesInput = {
    AND?: Prisma.usersScalarWhereWithAggregatesInput | Prisma.usersScalarWhereWithAggregatesInput[];
    OR?: Prisma.usersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.usersScalarWhereWithAggregatesInput | Prisma.usersScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"users"> | number;
    account_id?: Prisma.IntWithAggregatesFilter<"users"> | number;
    phone_number?: Prisma.StringWithAggregatesFilter<"users"> | string;
    password_hash?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    name?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    role?: Prisma.Enumusers_roleNullableWithAggregatesFilter<"users"> | $Enums.users_role | null;
    status?: Prisma.Enumusers_statusNullableWithAggregatesFilter<"users"> | $Enums.users_status | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    google_refresh_token?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    google_email?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    google_calendar_id?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
};
export type usersCreateInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersUpdateInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateManyInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
};
export type usersUpdateManyMutationInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type usersUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type UsersListRelationFilter = {
    every?: Prisma.usersWhereInput;
    some?: Prisma.usersWhereInput;
    none?: Prisma.usersWhereInput;
};
export type usersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UsersScalarRelationFilter = {
    is?: Prisma.usersWhereInput;
    isNot?: Prisma.usersWhereInput;
};
export type usersOrderByRelevanceInput = {
    fields: Prisma.usersOrderByRelevanceFieldEnum | Prisma.usersOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type usersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    phone_number?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    google_refresh_token?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    google_calendar_id?: Prisma.SortOrder;
};
export type usersAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
};
export type usersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    phone_number?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    google_refresh_token?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    google_calendar_id?: Prisma.SortOrder;
};
export type usersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    phone_number?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    google_refresh_token?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    google_calendar_id?: Prisma.SortOrder;
};
export type usersSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
};
export type usersCreateNestedManyWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput> | Prisma.usersCreateWithoutAccountsInput[] | Prisma.usersUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutAccountsInput | Prisma.usersCreateOrConnectWithoutAccountsInput[];
    createMany?: Prisma.usersCreateManyAccountsInputEnvelope;
    connect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
};
export type usersUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput> | Prisma.usersCreateWithoutAccountsInput[] | Prisma.usersUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutAccountsInput | Prisma.usersCreateOrConnectWithoutAccountsInput[];
    createMany?: Prisma.usersCreateManyAccountsInputEnvelope;
    connect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
};
export type usersUpdateManyWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput> | Prisma.usersCreateWithoutAccountsInput[] | Prisma.usersUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutAccountsInput | Prisma.usersCreateOrConnectWithoutAccountsInput[];
    upsert?: Prisma.usersUpsertWithWhereUniqueWithoutAccountsInput | Prisma.usersUpsertWithWhereUniqueWithoutAccountsInput[];
    createMany?: Prisma.usersCreateManyAccountsInputEnvelope;
    set?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    disconnect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    delete?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    connect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    update?: Prisma.usersUpdateWithWhereUniqueWithoutAccountsInput | Prisma.usersUpdateWithWhereUniqueWithoutAccountsInput[];
    updateMany?: Prisma.usersUpdateManyWithWhereWithoutAccountsInput | Prisma.usersUpdateManyWithWhereWithoutAccountsInput[];
    deleteMany?: Prisma.usersScalarWhereInput | Prisma.usersScalarWhereInput[];
};
export type usersUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput> | Prisma.usersCreateWithoutAccountsInput[] | Prisma.usersUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutAccountsInput | Prisma.usersCreateOrConnectWithoutAccountsInput[];
    upsert?: Prisma.usersUpsertWithWhereUniqueWithoutAccountsInput | Prisma.usersUpsertWithWhereUniqueWithoutAccountsInput[];
    createMany?: Prisma.usersCreateManyAccountsInputEnvelope;
    set?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    disconnect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    delete?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    connect?: Prisma.usersWhereUniqueInput | Prisma.usersWhereUniqueInput[];
    update?: Prisma.usersUpdateWithWhereUniqueWithoutAccountsInput | Prisma.usersUpdateWithWhereUniqueWithoutAccountsInput[];
    updateMany?: Prisma.usersUpdateManyWithWhereWithoutAccountsInput | Prisma.usersUpdateManyWithWhereWithoutAccountsInput[];
    deleteMany?: Prisma.usersScalarWhereInput | Prisma.usersScalarWhereInput[];
};
export type usersCreateNestedOneWithoutBudgetsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutBudgetsInput, Prisma.usersUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutBudgetsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutBudgetsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutBudgetsInput, Prisma.usersUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutBudgetsInput;
    upsert?: Prisma.usersUpsertWithoutBudgetsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutBudgetsInput, Prisma.usersUpdateWithoutBudgetsInput>, Prisma.usersUncheckedUpdateWithoutBudgetsInput>;
};
export type usersCreateNestedOneWithoutCategoriesInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutCategoriesInput, Prisma.usersUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutCategoriesInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutCategoriesInput, Prisma.usersUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutCategoriesInput;
    upsert?: Prisma.usersUpsertWithoutCategoriesInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutCategoriesInput, Prisma.usersUpdateWithoutCategoriesInput>, Prisma.usersUncheckedUpdateWithoutCategoriesInput>;
};
export type usersCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutEventsInput, Prisma.usersUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutEventsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutEventsInput, Prisma.usersUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.usersUpsertWithoutEventsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutEventsInput, Prisma.usersUpdateWithoutEventsInput>, Prisma.usersUncheckedUpdateWithoutEventsInput>;
};
export type usersCreateNestedOneWithoutFinancial_entitiesInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutFinancial_entitiesInput, Prisma.usersUncheckedCreateWithoutFinancial_entitiesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutFinancial_entitiesInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutFinancial_entitiesNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutFinancial_entitiesInput, Prisma.usersUncheckedCreateWithoutFinancial_entitiesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutFinancial_entitiesInput;
    upsert?: Prisma.usersUpsertWithoutFinancial_entitiesInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutFinancial_entitiesInput, Prisma.usersUpdateWithoutFinancial_entitiesInput>, Prisma.usersUncheckedUpdateWithoutFinancial_entitiesInput>;
};
export type usersCreateNestedOneWithoutIncome_sourcesInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutIncome_sourcesInput, Prisma.usersUncheckedCreateWithoutIncome_sourcesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutIncome_sourcesInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutIncome_sourcesNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutIncome_sourcesInput, Prisma.usersUncheckedCreateWithoutIncome_sourcesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutIncome_sourcesInput;
    upsert?: Prisma.usersUpsertWithoutIncome_sourcesInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutIncome_sourcesInput, Prisma.usersUpdateWithoutIncome_sourcesInput>, Prisma.usersUncheckedUpdateWithoutIncome_sourcesInput>;
};
export type usersCreateNestedOneWithoutRecurring_eventsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRecurring_eventsInput, Prisma.usersUncheckedCreateWithoutRecurring_eventsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRecurring_eventsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutRecurring_eventsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRecurring_eventsInput, Prisma.usersUncheckedCreateWithoutRecurring_eventsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRecurring_eventsInput;
    upsert?: Prisma.usersUpsertWithoutRecurring_eventsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutRecurring_eventsInput, Prisma.usersUpdateWithoutRecurring_eventsInput>, Prisma.usersUncheckedUpdateWithoutRecurring_eventsInput>;
};
export type usersCreateNestedOneWithoutRecurring_transactionsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRecurring_transactionsInput, Prisma.usersUncheckedCreateWithoutRecurring_transactionsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRecurring_transactionsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutRecurring_transactionsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRecurring_transactionsInput, Prisma.usersUncheckedCreateWithoutRecurring_transactionsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRecurring_transactionsInput;
    upsert?: Prisma.usersUpsertWithoutRecurring_transactionsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutRecurring_transactionsInput, Prisma.usersUpdateWithoutRecurring_transactionsInput>, Prisma.usersUncheckedUpdateWithoutRecurring_transactionsInput>;
};
export type usersCreateNestedOneWithoutReminder_logsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutReminder_logsInput, Prisma.usersUncheckedCreateWithoutReminder_logsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutReminder_logsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutReminder_logsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutReminder_logsInput, Prisma.usersUncheckedCreateWithoutReminder_logsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutReminder_logsInput;
    upsert?: Prisma.usersUpsertWithoutReminder_logsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutReminder_logsInput, Prisma.usersUpdateWithoutReminder_logsInput>, Prisma.usersUncheckedUpdateWithoutReminder_logsInput>;
};
export type usersCreateNestedOneWithoutRemindersInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRemindersInput, Prisma.usersUncheckedCreateWithoutRemindersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRemindersInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutRemindersNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRemindersInput, Prisma.usersUncheckedCreateWithoutRemindersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRemindersInput;
    upsert?: Prisma.usersUpsertWithoutRemindersInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutRemindersInput, Prisma.usersUpdateWithoutRemindersInput>, Prisma.usersUncheckedUpdateWithoutRemindersInput>;
};
export type usersCreateNestedOneWithoutPurchase_installmentsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPurchase_installmentsInput, Prisma.usersUncheckedCreateWithoutPurchase_installmentsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPurchase_installmentsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutPurchase_installmentsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPurchase_installmentsInput, Prisma.usersUncheckedCreateWithoutPurchase_installmentsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPurchase_installmentsInput;
    upsert?: Prisma.usersUpsertWithoutPurchase_installmentsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutPurchase_installmentsInput, Prisma.usersUpdateWithoutPurchase_installmentsInput>, Prisma.usersUncheckedUpdateWithoutPurchase_installmentsInput>;
};
export type usersCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTransactionsInput, Prisma.usersUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTransactionsInput, Prisma.usersUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.usersUpsertWithoutTransactionsInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutTransactionsInput, Prisma.usersUpdateWithoutTransactionsInput>, Prisma.usersUncheckedUpdateWithoutTransactionsInput>;
};
export type NullableEnumusers_roleFieldUpdateOperationsInput = {
    set?: $Enums.users_role | null;
};
export type NullableEnumusers_statusFieldUpdateOperationsInput = {
    set?: $Enums.users_status | null;
};
export type usersCreateWithoutAccountsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutAccountsInput = {
    id?: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutAccountsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput>;
};
export type usersCreateManyAccountsInputEnvelope = {
    data: Prisma.usersCreateManyAccountsInput | Prisma.usersCreateManyAccountsInput[];
    skipDuplicates?: boolean;
};
export type usersUpsertWithWhereUniqueWithoutAccountsInput = {
    where: Prisma.usersWhereUniqueInput;
    update: Prisma.XOR<Prisma.usersUpdateWithoutAccountsInput, Prisma.usersUncheckedUpdateWithoutAccountsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutAccountsInput, Prisma.usersUncheckedCreateWithoutAccountsInput>;
};
export type usersUpdateWithWhereUniqueWithoutAccountsInput = {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutAccountsInput, Prisma.usersUncheckedUpdateWithoutAccountsInput>;
};
export type usersUpdateManyWithWhereWithoutAccountsInput = {
    where: Prisma.usersScalarWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateManyMutationInput, Prisma.usersUncheckedUpdateManyWithoutAccountsInput>;
};
export type usersScalarWhereInput = {
    AND?: Prisma.usersScalarWhereInput | Prisma.usersScalarWhereInput[];
    OR?: Prisma.usersScalarWhereInput[];
    NOT?: Prisma.usersScalarWhereInput | Prisma.usersScalarWhereInput[];
    id?: Prisma.IntFilter<"users"> | number;
    account_id?: Prisma.IntFilter<"users"> | number;
    phone_number?: Prisma.StringFilter<"users"> | string;
    password_hash?: Prisma.StringNullableFilter<"users"> | string | null;
    name?: Prisma.StringNullableFilter<"users"> | string | null;
    role?: Prisma.Enumusers_roleNullableFilter<"users"> | $Enums.users_role | null;
    status?: Prisma.Enumusers_statusNullableFilter<"users"> | $Enums.users_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"users"> | Date | string | null;
    email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_refresh_token?: Prisma.StringNullableFilter<"users"> | string | null;
    google_email?: Prisma.StringNullableFilter<"users"> | string | null;
    google_calendar_id?: Prisma.StringNullableFilter<"users"> | string | null;
};
export type usersCreateWithoutBudgetsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutBudgetsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutBudgetsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutBudgetsInput, Prisma.usersUncheckedCreateWithoutBudgetsInput>;
};
export type usersUpsertWithoutBudgetsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutBudgetsInput, Prisma.usersUncheckedUpdateWithoutBudgetsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutBudgetsInput, Prisma.usersUncheckedCreateWithoutBudgetsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutBudgetsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutBudgetsInput, Prisma.usersUncheckedUpdateWithoutBudgetsInput>;
};
export type usersUpdateWithoutBudgetsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutBudgetsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutCategoriesInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutCategoriesInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutCategoriesInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutCategoriesInput, Prisma.usersUncheckedCreateWithoutCategoriesInput>;
};
export type usersUpsertWithoutCategoriesInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutCategoriesInput, Prisma.usersUncheckedUpdateWithoutCategoriesInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutCategoriesInput, Prisma.usersUncheckedCreateWithoutCategoriesInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutCategoriesInput, Prisma.usersUncheckedUpdateWithoutCategoriesInput>;
};
export type usersUpdateWithoutCategoriesInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutCategoriesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutEventsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutEventsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutEventsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutEventsInput, Prisma.usersUncheckedCreateWithoutEventsInput>;
};
export type usersUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutEventsInput, Prisma.usersUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutEventsInput, Prisma.usersUncheckedCreateWithoutEventsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutEventsInput, Prisma.usersUncheckedUpdateWithoutEventsInput>;
};
export type usersUpdateWithoutEventsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutFinancial_entitiesInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutFinancial_entitiesInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutFinancial_entitiesInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutFinancial_entitiesInput, Prisma.usersUncheckedCreateWithoutFinancial_entitiesInput>;
};
export type usersUpsertWithoutFinancial_entitiesInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutFinancial_entitiesInput, Prisma.usersUncheckedUpdateWithoutFinancial_entitiesInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutFinancial_entitiesInput, Prisma.usersUncheckedCreateWithoutFinancial_entitiesInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutFinancial_entitiesInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutFinancial_entitiesInput, Prisma.usersUncheckedUpdateWithoutFinancial_entitiesInput>;
};
export type usersUpdateWithoutFinancial_entitiesInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutFinancial_entitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutIncome_sourcesInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutIncome_sourcesInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutIncome_sourcesInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutIncome_sourcesInput, Prisma.usersUncheckedCreateWithoutIncome_sourcesInput>;
};
export type usersUpsertWithoutIncome_sourcesInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutIncome_sourcesInput, Prisma.usersUncheckedUpdateWithoutIncome_sourcesInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutIncome_sourcesInput, Prisma.usersUncheckedCreateWithoutIncome_sourcesInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutIncome_sourcesInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutIncome_sourcesInput, Prisma.usersUncheckedUpdateWithoutIncome_sourcesInput>;
};
export type usersUpdateWithoutIncome_sourcesInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutIncome_sourcesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutRecurring_eventsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutRecurring_eventsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutRecurring_eventsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutRecurring_eventsInput, Prisma.usersUncheckedCreateWithoutRecurring_eventsInput>;
};
export type usersUpsertWithoutRecurring_eventsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutRecurring_eventsInput, Prisma.usersUncheckedUpdateWithoutRecurring_eventsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutRecurring_eventsInput, Prisma.usersUncheckedCreateWithoutRecurring_eventsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutRecurring_eventsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutRecurring_eventsInput, Prisma.usersUncheckedUpdateWithoutRecurring_eventsInput>;
};
export type usersUpdateWithoutRecurring_eventsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutRecurring_eventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutRecurring_transactionsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutRecurring_transactionsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutRecurring_transactionsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutRecurring_transactionsInput, Prisma.usersUncheckedCreateWithoutRecurring_transactionsInput>;
};
export type usersUpsertWithoutRecurring_transactionsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutRecurring_transactionsInput, Prisma.usersUncheckedUpdateWithoutRecurring_transactionsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutRecurring_transactionsInput, Prisma.usersUncheckedCreateWithoutRecurring_transactionsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutRecurring_transactionsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutRecurring_transactionsInput, Prisma.usersUncheckedUpdateWithoutRecurring_transactionsInput>;
};
export type usersUpdateWithoutRecurring_transactionsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutRecurring_transactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutReminder_logsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutReminder_logsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutReminder_logsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutReminder_logsInput, Prisma.usersUncheckedCreateWithoutReminder_logsInput>;
};
export type usersUpsertWithoutReminder_logsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutReminder_logsInput, Prisma.usersUncheckedUpdateWithoutReminder_logsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutReminder_logsInput, Prisma.usersUncheckedCreateWithoutReminder_logsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutReminder_logsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutReminder_logsInput, Prisma.usersUncheckedUpdateWithoutReminder_logsInput>;
};
export type usersUpdateWithoutReminder_logsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutReminder_logsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutRemindersInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutRemindersInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutRemindersInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutRemindersInput, Prisma.usersUncheckedCreateWithoutRemindersInput>;
};
export type usersUpsertWithoutRemindersInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutRemindersInput, Prisma.usersUncheckedUpdateWithoutRemindersInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutRemindersInput, Prisma.usersUncheckedCreateWithoutRemindersInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutRemindersInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutRemindersInput, Prisma.usersUncheckedUpdateWithoutRemindersInput>;
};
export type usersUpdateWithoutRemindersInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutRemindersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutPurchase_installmentsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutPurchase_installmentsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutPurchase_installmentsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutPurchase_installmentsInput, Prisma.usersUncheckedCreateWithoutPurchase_installmentsInput>;
};
export type usersUpsertWithoutPurchase_installmentsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutPurchase_installmentsInput, Prisma.usersUncheckedUpdateWithoutPurchase_installmentsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutPurchase_installmentsInput, Prisma.usersUncheckedCreateWithoutPurchase_installmentsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutPurchase_installmentsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutPurchase_installmentsInput, Prisma.usersUncheckedUpdateWithoutPurchase_installmentsInput>;
};
export type usersUpdateWithoutPurchase_installmentsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutPurchase_installmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutTransactionsInput = {
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutUsersInput;
    accounts: Prisma.accountsCreateNestedOneWithoutUsersInput;
};
export type usersUncheckedCreateWithoutTransactionsInput = {
    id?: number;
    account_id: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
    budgets?: Prisma.budgetsUncheckedCreateNestedManyWithoutUsersInput;
    categories?: Prisma.categoriesUncheckedCreateNestedManyWithoutUsersInput;
    events?: Prisma.eventsUncheckedCreateNestedManyWithoutUsersInput;
    financial_entities?: Prisma.financial_entitiesUncheckedCreateNestedManyWithoutUsersInput;
    income_sources?: Prisma.income_sourcesUncheckedCreateNestedManyWithoutUsersInput;
    recurring_events?: Prisma.recurring_eventsUncheckedCreateNestedManyWithoutUsersInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput;
    reminder_logs?: Prisma.reminder_logsUncheckedCreateNestedManyWithoutUsersInput;
    reminders?: Prisma.remindersUncheckedCreateNestedManyWithoutUsersInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutTransactionsInput, Prisma.usersUncheckedCreateWithoutTransactionsInput>;
};
export type usersUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutTransactionsInput, Prisma.usersUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutTransactionsInput, Prisma.usersUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutTransactionsInput, Prisma.usersUncheckedUpdateWithoutTransactionsInput>;
};
export type usersUpdateWithoutTransactionsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateManyAccountsInput = {
    id?: number;
    phone_number: string;
    password_hash?: string | null;
    name?: string | null;
    role?: $Enums.users_role | null;
    status?: $Enums.users_status | null;
    created_at?: Date | string | null;
    email?: string | null;
    google_refresh_token?: string | null;
    google_email?: string | null;
    google_calendar_id?: string | null;
};
export type usersUpdateWithoutAccountsInput = {
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutAccountsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    budgets?: Prisma.budgetsUncheckedUpdateManyWithoutUsersNestedInput;
    categories?: Prisma.categoriesUncheckedUpdateManyWithoutUsersNestedInput;
    events?: Prisma.eventsUncheckedUpdateManyWithoutUsersNestedInput;
    financial_entities?: Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput;
    income_sources?: Prisma.income_sourcesUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_events?: Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput;
    reminder_logs?: Prisma.reminder_logsUncheckedUpdateManyWithoutUsersNestedInput;
    reminders?: Prisma.remindersUncheckedUpdateManyWithoutUsersNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateManyWithoutAccountsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    phone_number?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableEnumusers_roleFieldUpdateOperationsInput | $Enums.users_role | null;
    status?: Prisma.NullableEnumusers_statusFieldUpdateOperationsInput | $Enums.users_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_refresh_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_calendar_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
/**
 * Count Type UsersCountOutputType
 */
export type UsersCountOutputType = {
    budgets: number;
    categories: number;
    events: number;
    financial_entities: number;
    income_sources: number;
    recurring_events: number;
    recurring_transactions: number;
    reminder_logs: number;
    reminders: number;
    purchase_installments: number;
    transactions: number;
};
export type UsersCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    budgets?: boolean | UsersCountOutputTypeCountBudgetsArgs;
    categories?: boolean | UsersCountOutputTypeCountCategoriesArgs;
    events?: boolean | UsersCountOutputTypeCountEventsArgs;
    financial_entities?: boolean | UsersCountOutputTypeCountFinancial_entitiesArgs;
    income_sources?: boolean | UsersCountOutputTypeCountIncome_sourcesArgs;
    recurring_events?: boolean | UsersCountOutputTypeCountRecurring_eventsArgs;
    recurring_transactions?: boolean | UsersCountOutputTypeCountRecurring_transactionsArgs;
    reminder_logs?: boolean | UsersCountOutputTypeCountReminder_logsArgs;
    reminders?: boolean | UsersCountOutputTypeCountRemindersArgs;
    purchase_installments?: boolean | UsersCountOutputTypeCountPurchase_installmentsArgs;
    transactions?: boolean | UsersCountOutputTypeCountTransactionsArgs;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: Prisma.UsersCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountBudgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.budgetsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountCategoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.categoriesWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.eventsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountFinancial_entitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.financial_entitiesWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountIncome_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.income_sourcesWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountRecurring_eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_eventsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountRecurring_transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_transactionsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountReminder_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.reminder_logsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountRemindersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.remindersWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountPurchase_installmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.purchase_installmentsWhereInput;
};
/**
 * UsersCountOutputType without action
 */
export type UsersCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transactionsWhereInput;
};
export type usersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    account_id?: boolean;
    phone_number?: boolean;
    password_hash?: boolean;
    name?: boolean;
    role?: boolean;
    status?: boolean;
    created_at?: boolean;
    email?: boolean;
    google_refresh_token?: boolean;
    google_email?: boolean;
    google_calendar_id?: boolean;
    budgets?: boolean | Prisma.users$budgetsArgs<ExtArgs>;
    categories?: boolean | Prisma.users$categoriesArgs<ExtArgs>;
    events?: boolean | Prisma.users$eventsArgs<ExtArgs>;
    financial_entities?: boolean | Prisma.users$financial_entitiesArgs<ExtArgs>;
    income_sources?: boolean | Prisma.users$income_sourcesArgs<ExtArgs>;
    recurring_events?: boolean | Prisma.users$recurring_eventsArgs<ExtArgs>;
    recurring_transactions?: boolean | Prisma.users$recurring_transactionsArgs<ExtArgs>;
    reminder_logs?: boolean | Prisma.users$reminder_logsArgs<ExtArgs>;
    reminders?: boolean | Prisma.users$remindersArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.users$purchase_installmentsArgs<ExtArgs>;
    transactions?: boolean | Prisma.users$transactionsArgs<ExtArgs>;
    accounts?: boolean | Prisma.accountsDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["users"]>;
export type usersSelectScalar = {
    id?: boolean;
    account_id?: boolean;
    phone_number?: boolean;
    password_hash?: boolean;
    name?: boolean;
    role?: boolean;
    status?: boolean;
    created_at?: boolean;
    email?: boolean;
    google_refresh_token?: boolean;
    google_email?: boolean;
    google_calendar_id?: boolean;
};
export type usersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "account_id" | "phone_number" | "password_hash" | "name" | "role" | "status" | "created_at" | "email" | "google_refresh_token" | "google_email" | "google_calendar_id", ExtArgs["result"]["users"]>;
export type usersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    budgets?: boolean | Prisma.users$budgetsArgs<ExtArgs>;
    categories?: boolean | Prisma.users$categoriesArgs<ExtArgs>;
    events?: boolean | Prisma.users$eventsArgs<ExtArgs>;
    financial_entities?: boolean | Prisma.users$financial_entitiesArgs<ExtArgs>;
    income_sources?: boolean | Prisma.users$income_sourcesArgs<ExtArgs>;
    recurring_events?: boolean | Prisma.users$recurring_eventsArgs<ExtArgs>;
    recurring_transactions?: boolean | Prisma.users$recurring_transactionsArgs<ExtArgs>;
    reminder_logs?: boolean | Prisma.users$reminder_logsArgs<ExtArgs>;
    reminders?: boolean | Prisma.users$remindersArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.users$purchase_installmentsArgs<ExtArgs>;
    transactions?: boolean | Prisma.users$transactionsArgs<ExtArgs>;
    accounts?: boolean | Prisma.accountsDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $usersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "users";
    objects: {
        budgets: Prisma.$budgetsPayload<ExtArgs>[];
        categories: Prisma.$categoriesPayload<ExtArgs>[];
        events: Prisma.$eventsPayload<ExtArgs>[];
        financial_entities: Prisma.$financial_entitiesPayload<ExtArgs>[];
        income_sources: Prisma.$income_sourcesPayload<ExtArgs>[];
        recurring_events: Prisma.$recurring_eventsPayload<ExtArgs>[];
        recurring_transactions: Prisma.$recurring_transactionsPayload<ExtArgs>[];
        reminder_logs: Prisma.$reminder_logsPayload<ExtArgs>[];
        reminders: Prisma.$remindersPayload<ExtArgs>[];
        purchase_installments: Prisma.$purchase_installmentsPayload<ExtArgs>[];
        transactions: Prisma.$transactionsPayload<ExtArgs>[];
        accounts: Prisma.$accountsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        account_id: number;
        phone_number: string;
        password_hash: string | null;
        name: string | null;
        role: $Enums.users_role | null;
        status: $Enums.users_status | null;
        created_at: Date | null;
        email: string | null;
        google_refresh_token: string | null;
        google_email: string | null;
        google_calendar_id: string | null;
    }, ExtArgs["result"]["users"]>;
    composites: {};
};
export type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$usersPayload, S>;
export type usersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsersCountAggregateInputType | true;
};
export interface usersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['users'];
        meta: {
            name: 'users';
        };
    };
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: Prisma.SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: Prisma.SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     *
     */
    findMany<T extends usersFindManyArgs>(args?: Prisma.SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     *
     */
    create<T extends usersCreateArgs>(args: Prisma.SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends usersCreateManyArgs>(args?: Prisma.SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     *
     */
    delete<T extends usersDeleteArgs>(args: Prisma.SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends usersUpdateArgs>(args: Prisma.SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: Prisma.SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends usersUpdateManyArgs>(args: Prisma.SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: Prisma.SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(args?: Prisma.Subset<T, usersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UsersCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Prisma.Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>;
    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends usersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: usersGroupByArgs['orderBy'];
    } : {
        orderBy?: usersGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the users model
     */
    readonly fields: usersFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for users.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__usersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    budgets<T extends Prisma.users$budgetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$budgetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$budgetsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    categories<T extends Prisma.users$categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    events<T extends Prisma.users$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    financial_entities<T extends Prisma.users$financial_entitiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$financial_entitiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    income_sources<T extends Prisma.users$income_sourcesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$income_sourcesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recurring_events<T extends Prisma.users$recurring_eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$recurring_eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recurring_transactions<T extends Prisma.users$recurring_transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$recurring_transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reminder_logs<T extends Prisma.users$reminder_logsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$reminder_logsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reminders<T extends Prisma.users$remindersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$remindersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    purchase_installments<T extends Prisma.users$purchase_installmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$purchase_installmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    transactions<T extends Prisma.users$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    accounts<T extends Prisma.accountsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.accountsDefaultArgs<ExtArgs>>): Prisma.Prisma__accountsClient<runtime.Types.Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the users model
 */
export interface usersFieldRefs {
    readonly id: Prisma.FieldRef<"users", 'Int'>;
    readonly account_id: Prisma.FieldRef<"users", 'Int'>;
    readonly phone_number: Prisma.FieldRef<"users", 'String'>;
    readonly password_hash: Prisma.FieldRef<"users", 'String'>;
    readonly name: Prisma.FieldRef<"users", 'String'>;
    readonly role: Prisma.FieldRef<"users", 'users_role'>;
    readonly status: Prisma.FieldRef<"users", 'users_status'>;
    readonly created_at: Prisma.FieldRef<"users", 'DateTime'>;
    readonly email: Prisma.FieldRef<"users", 'String'>;
    readonly google_refresh_token: Prisma.FieldRef<"users", 'String'>;
    readonly google_email: Prisma.FieldRef<"users", 'String'>;
    readonly google_calendar_id: Prisma.FieldRef<"users", 'String'>;
}
/**
 * users findUnique
 */
export type usersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where: Prisma.usersWhereUniqueInput;
};
/**
 * users findUniqueOrThrow
 */
export type usersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where: Prisma.usersWhereUniqueInput;
};
/**
 * users findFirst
 */
export type usersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: Prisma.usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for users.
     */
    cursor?: Prisma.usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of users.
     */
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
/**
 * users findFirstOrThrow
 */
export type usersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: Prisma.usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for users.
     */
    cursor?: Prisma.usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of users.
     */
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
/**
 * users findMany
 */
export type usersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: Prisma.usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing users.
     */
    cursor?: Prisma.usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
/**
 * users create
 */
export type usersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * The data needed to create a users.
     */
    data: Prisma.XOR<Prisma.usersCreateInput, Prisma.usersUncheckedCreateInput>;
};
/**
 * users createMany
 */
export type usersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: Prisma.usersCreateManyInput | Prisma.usersCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * users update
 */
export type usersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * The data needed to update a users.
     */
    data: Prisma.XOR<Prisma.usersUpdateInput, Prisma.usersUncheckedUpdateInput>;
    /**
     * Choose, which users to update.
     */
    where: Prisma.usersWhereUniqueInput;
};
/**
 * users updateMany
 */
export type usersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: Prisma.XOR<Prisma.usersUpdateManyMutationInput, Prisma.usersUncheckedUpdateManyInput>;
    /**
     * Filter which users to update
     */
    where?: Prisma.usersWhereInput;
    /**
     * Limit how many users to update.
     */
    limit?: number;
};
/**
 * users upsert
 */
export type usersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: Prisma.usersWhereUniqueInput;
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: Prisma.XOR<Prisma.usersCreateInput, Prisma.usersUncheckedCreateInput>;
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.usersUpdateInput, Prisma.usersUncheckedUpdateInput>;
};
/**
 * users delete
 */
export type usersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
    /**
     * Filter which users to delete.
     */
    where: Prisma.usersWhereUniqueInput;
};
/**
 * users deleteMany
 */
export type usersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: Prisma.usersWhereInput;
    /**
     * Limit how many users to delete.
     */
    limit?: number;
};
/**
 * users.budgets
 */
export type users$budgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the budgets
     */
    select?: Prisma.budgetsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the budgets
     */
    omit?: Prisma.budgetsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.budgetsInclude<ExtArgs> | null;
    where?: Prisma.budgetsWhereInput;
    orderBy?: Prisma.budgetsOrderByWithRelationInput | Prisma.budgetsOrderByWithRelationInput[];
    cursor?: Prisma.budgetsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetsScalarFieldEnum | Prisma.BudgetsScalarFieldEnum[];
};
/**
 * users.categories
 */
export type users$categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categories
     */
    select?: Prisma.categoriesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the categories
     */
    omit?: Prisma.categoriesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.categoriesInclude<ExtArgs> | null;
    where?: Prisma.categoriesWhereInput;
    orderBy?: Prisma.categoriesOrderByWithRelationInput | Prisma.categoriesOrderByWithRelationInput[];
    cursor?: Prisma.categoriesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoriesScalarFieldEnum | Prisma.CategoriesScalarFieldEnum[];
};
/**
 * users.events
 */
export type users$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the events
     */
    select?: Prisma.eventsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the events
     */
    omit?: Prisma.eventsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.eventsInclude<ExtArgs> | null;
    where?: Prisma.eventsWhereInput;
    orderBy?: Prisma.eventsOrderByWithRelationInput | Prisma.eventsOrderByWithRelationInput[];
    cursor?: Prisma.eventsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventsScalarFieldEnum | Prisma.EventsScalarFieldEnum[];
};
/**
 * users.financial_entities
 */
export type users$financial_entitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the financial_entities
     */
    select?: Prisma.financial_entitiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the financial_entities
     */
    omit?: Prisma.financial_entitiesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.financial_entitiesInclude<ExtArgs> | null;
    where?: Prisma.financial_entitiesWhereInput;
    orderBy?: Prisma.financial_entitiesOrderByWithRelationInput | Prisma.financial_entitiesOrderByWithRelationInput[];
    cursor?: Prisma.financial_entitiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Financial_entitiesScalarFieldEnum | Prisma.Financial_entitiesScalarFieldEnum[];
};
/**
 * users.income_sources
 */
export type users$income_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the income_sources
     */
    select?: Prisma.income_sourcesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the income_sources
     */
    omit?: Prisma.income_sourcesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.income_sourcesInclude<ExtArgs> | null;
    where?: Prisma.income_sourcesWhereInput;
    orderBy?: Prisma.income_sourcesOrderByWithRelationInput | Prisma.income_sourcesOrderByWithRelationInput[];
    cursor?: Prisma.income_sourcesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Income_sourcesScalarFieldEnum | Prisma.Income_sourcesScalarFieldEnum[];
};
/**
 * users.recurring_events
 */
export type users$recurring_eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_events
     */
    select?: Prisma.recurring_eventsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_events
     */
    omit?: Prisma.recurring_eventsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_eventsInclude<ExtArgs> | null;
    where?: Prisma.recurring_eventsWhereInput;
    orderBy?: Prisma.recurring_eventsOrderByWithRelationInput | Prisma.recurring_eventsOrderByWithRelationInput[];
    cursor?: Prisma.recurring_eventsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Recurring_eventsScalarFieldEnum | Prisma.Recurring_eventsScalarFieldEnum[];
};
/**
 * users.recurring_transactions
 */
export type users$recurring_transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_transactions
     */
    select?: Prisma.recurring_transactionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_transactions
     */
    omit?: Prisma.recurring_transactionsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_transactionsInclude<ExtArgs> | null;
    where?: Prisma.recurring_transactionsWhereInput;
    orderBy?: Prisma.recurring_transactionsOrderByWithRelationInput | Prisma.recurring_transactionsOrderByWithRelationInput[];
    cursor?: Prisma.recurring_transactionsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Recurring_transactionsScalarFieldEnum | Prisma.Recurring_transactionsScalarFieldEnum[];
};
/**
 * users.reminder_logs
 */
export type users$reminder_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reminder_logs
     */
    select?: Prisma.reminder_logsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the reminder_logs
     */
    omit?: Prisma.reminder_logsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.reminder_logsInclude<ExtArgs> | null;
    where?: Prisma.reminder_logsWhereInput;
    orderBy?: Prisma.reminder_logsOrderByWithRelationInput | Prisma.reminder_logsOrderByWithRelationInput[];
    cursor?: Prisma.reminder_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Reminder_logsScalarFieldEnum | Prisma.Reminder_logsScalarFieldEnum[];
};
/**
 * users.reminders
 */
export type users$remindersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reminders
     */
    select?: Prisma.remindersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the reminders
     */
    omit?: Prisma.remindersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.remindersInclude<ExtArgs> | null;
    where?: Prisma.remindersWhereInput;
    orderBy?: Prisma.remindersOrderByWithRelationInput | Prisma.remindersOrderByWithRelationInput[];
    cursor?: Prisma.remindersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RemindersScalarFieldEnum | Prisma.RemindersScalarFieldEnum[];
};
/**
 * users.purchase_installments
 */
export type users$purchase_installmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the purchase_installments
     */
    select?: Prisma.purchase_installmentsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the purchase_installments
     */
    omit?: Prisma.purchase_installmentsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.purchase_installmentsInclude<ExtArgs> | null;
    where?: Prisma.purchase_installmentsWhereInput;
    orderBy?: Prisma.purchase_installmentsOrderByWithRelationInput | Prisma.purchase_installmentsOrderByWithRelationInput[];
    cursor?: Prisma.purchase_installmentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Purchase_installmentsScalarFieldEnum | Prisma.Purchase_installmentsScalarFieldEnum[];
};
/**
 * users.transactions
 */
export type users$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the transactions
     */
    select?: Prisma.transactionsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the transactions
     */
    omit?: Prisma.transactionsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.transactionsInclude<ExtArgs> | null;
    where?: Prisma.transactionsWhereInput;
    orderBy?: Prisma.transactionsOrderByWithRelationInput | Prisma.transactionsOrderByWithRelationInput[];
    cursor?: Prisma.transactionsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TransactionsScalarFieldEnum | Prisma.TransactionsScalarFieldEnum[];
};
/**
 * users without action
 */
export type usersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: Prisma.usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: Prisma.usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.usersInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=users.d.ts.map