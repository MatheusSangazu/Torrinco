import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model transactions
 *
 */
export type transactionsModel = runtime.Types.Result.DefaultSelection<Prisma.$transactionsPayload>;
export type AggregateTransactions = {
    _count: TransactionsCountAggregateOutputType | null;
    _avg: TransactionsAvgAggregateOutputType | null;
    _sum: TransactionsSumAggregateOutputType | null;
    _min: TransactionsMinAggregateOutputType | null;
    _max: TransactionsMaxAggregateOutputType | null;
};
export type TransactionsAvgAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    category_id: number | null;
    income_source_id: number | null;
    installment_id: number | null;
    installment_number: number | null;
    recurring_transaction_id: number | null;
};
export type TransactionsSumAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    category_id: number | null;
    income_source_id: number | null;
    installment_id: number | null;
    installment_number: number | null;
    recurring_transaction_id: number | null;
};
export type TransactionsMinAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    type: $Enums.transactions_type | null;
    status: $Enums.transactions_status | null;
    category: string | null;
    description: string | null;
    transaction_date: Date | null;
    created_at: Date | null;
    is_recurring: boolean | null;
    deleted_at: Date | null;
    payment_method: string | null;
    category_id: number | null;
    income_source_id: number | null;
    installment_id: number | null;
    installment_number: number | null;
    recurring_transaction_id: number | null;
};
export type TransactionsMaxAggregateOutputType = {
    id: number | null;
    account_id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    type: $Enums.transactions_type | null;
    status: $Enums.transactions_status | null;
    category: string | null;
    description: string | null;
    transaction_date: Date | null;
    created_at: Date | null;
    is_recurring: boolean | null;
    deleted_at: Date | null;
    payment_method: string | null;
    category_id: number | null;
    income_source_id: number | null;
    installment_id: number | null;
    installment_number: number | null;
    recurring_transaction_id: number | null;
};
export type TransactionsCountAggregateOutputType = {
    id: number;
    account_id: number;
    user_id: number;
    entity_id: number;
    amount: number;
    type: number;
    status: number;
    category: number;
    description: number;
    transaction_date: number;
    created_at: number;
    is_recurring: number;
    deleted_at: number;
    payment_method: number;
    category_id: number;
    income_source_id: number;
    installment_id: number;
    installment_number: number;
    recurring_transaction_id: number;
    _all: number;
};
export type TransactionsAvgAggregateInputType = {
    id?: true;
    account_id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    category_id?: true;
    income_source_id?: true;
    installment_id?: true;
    installment_number?: true;
    recurring_transaction_id?: true;
};
export type TransactionsSumAggregateInputType = {
    id?: true;
    account_id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    category_id?: true;
    income_source_id?: true;
    installment_id?: true;
    installment_number?: true;
    recurring_transaction_id?: true;
};
export type TransactionsMinAggregateInputType = {
    id?: true;
    account_id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    type?: true;
    status?: true;
    category?: true;
    description?: true;
    transaction_date?: true;
    created_at?: true;
    is_recurring?: true;
    deleted_at?: true;
    payment_method?: true;
    category_id?: true;
    income_source_id?: true;
    installment_id?: true;
    installment_number?: true;
    recurring_transaction_id?: true;
};
export type TransactionsMaxAggregateInputType = {
    id?: true;
    account_id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    type?: true;
    status?: true;
    category?: true;
    description?: true;
    transaction_date?: true;
    created_at?: true;
    is_recurring?: true;
    deleted_at?: true;
    payment_method?: true;
    category_id?: true;
    income_source_id?: true;
    installment_id?: true;
    installment_number?: true;
    recurring_transaction_id?: true;
};
export type TransactionsCountAggregateInputType = {
    id?: true;
    account_id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    type?: true;
    status?: true;
    category?: true;
    description?: true;
    transaction_date?: true;
    created_at?: true;
    is_recurring?: true;
    deleted_at?: true;
    payment_method?: true;
    category_id?: true;
    income_source_id?: true;
    installment_id?: true;
    installment_number?: true;
    recurring_transaction_id?: true;
    _all?: true;
};
export type TransactionsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which transactions to aggregate.
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of transactions to fetch.
     */
    orderBy?: Prisma.transactionsOrderByWithRelationInput | Prisma.transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned transactions
    **/
    _count?: true | TransactionsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TransactionsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TransactionsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TransactionsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TransactionsMaxAggregateInputType;
};
export type GetTransactionsAggregateType<T extends TransactionsAggregateArgs> = {
    [P in keyof T & keyof AggregateTransactions]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTransactions[P]> : Prisma.GetScalarType<T[P], AggregateTransactions[P]>;
};
export type transactionsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transactionsWhereInput;
    orderBy?: Prisma.transactionsOrderByWithAggregationInput | Prisma.transactionsOrderByWithAggregationInput[];
    by: Prisma.TransactionsScalarFieldEnum[] | Prisma.TransactionsScalarFieldEnum;
    having?: Prisma.transactionsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TransactionsCountAggregateInputType | true;
    _avg?: TransactionsAvgAggregateInputType;
    _sum?: TransactionsSumAggregateInputType;
    _min?: TransactionsMinAggregateInputType;
    _max?: TransactionsMaxAggregateInputType;
};
export type TransactionsGroupByOutputType = {
    id: number;
    account_id: number;
    user_id: number;
    entity_id: number | null;
    amount: runtime.Decimal;
    type: $Enums.transactions_type;
    status: $Enums.transactions_status | null;
    category: string | null;
    description: string | null;
    transaction_date: Date;
    created_at: Date | null;
    is_recurring: boolean | null;
    deleted_at: Date | null;
    payment_method: string | null;
    category_id: number | null;
    income_source_id: number | null;
    installment_id: number | null;
    installment_number: number | null;
    recurring_transaction_id: number | null;
    _count: TransactionsCountAggregateOutputType | null;
    _avg: TransactionsAvgAggregateOutputType | null;
    _sum: TransactionsSumAggregateOutputType | null;
    _min: TransactionsMinAggregateOutputType | null;
    _max: TransactionsMaxAggregateOutputType | null;
};
type GetTransactionsGroupByPayload<T extends transactionsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TransactionsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TransactionsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TransactionsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TransactionsGroupByOutputType[P]>;
}>>;
export type transactionsWhereInput = {
    AND?: Prisma.transactionsWhereInput | Prisma.transactionsWhereInput[];
    OR?: Prisma.transactionsWhereInput[];
    NOT?: Prisma.transactionsWhereInput | Prisma.transactionsWhereInput[];
    id?: Prisma.IntFilter<"transactions"> | number;
    account_id?: Prisma.IntFilter<"transactions"> | number;
    user_id?: Prisma.IntFilter<"transactions"> | number;
    entity_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    amount?: Prisma.DecimalFilter<"transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFilter<"transactions"> | $Enums.transactions_type;
    status?: Prisma.Enumtransactions_statusNullableFilter<"transactions"> | $Enums.transactions_status | null;
    category?: Prisma.StringNullableFilter<"transactions"> | string | null;
    description?: Prisma.StringNullableFilter<"transactions"> | string | null;
    transaction_date?: Prisma.DateTimeFilter<"transactions"> | Date | string;
    created_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    is_recurring?: Prisma.BoolNullableFilter<"transactions"> | boolean | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    payment_method?: Prisma.StringNullableFilter<"transactions"> | string | null;
    category_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    income_source_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_number?: Prisma.IntNullableFilter<"transactions"> | number | null;
    recurring_transaction_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    financial_entities?: Prisma.XOR<Prisma.Financial_entitiesNullableScalarRelationFilter, Prisma.financial_entitiesWhereInput> | null;
    accounts?: Prisma.XOR<Prisma.AccountsScalarRelationFilter, Prisma.accountsWhereInput>;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    categories?: Prisma.XOR<Prisma.CategoriesNullableScalarRelationFilter, Prisma.categoriesWhereInput> | null;
    income_sources?: Prisma.XOR<Prisma.Income_sourcesNullableScalarRelationFilter, Prisma.income_sourcesWhereInput> | null;
    purchase_installments?: Prisma.XOR<Prisma.Purchase_installmentsNullableScalarRelationFilter, Prisma.purchase_installmentsWhereInput> | null;
    recurring_transactions?: Prisma.XOR<Prisma.Recurring_transactionsNullableScalarRelationFilter, Prisma.recurring_transactionsWhereInput> | null;
};
export type transactionsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    transaction_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_recurring?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    payment_method?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    income_source_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    installment_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    installment_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    financial_entities?: Prisma.financial_entitiesOrderByWithRelationInput;
    accounts?: Prisma.accountsOrderByWithRelationInput;
    users?: Prisma.usersOrderByWithRelationInput;
    categories?: Prisma.categoriesOrderByWithRelationInput;
    income_sources?: Prisma.income_sourcesOrderByWithRelationInput;
    purchase_installments?: Prisma.purchase_installmentsOrderByWithRelationInput;
    recurring_transactions?: Prisma.recurring_transactionsOrderByWithRelationInput;
    _relevance?: Prisma.transactionsOrderByRelevanceInput;
};
export type transactionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.transactionsWhereInput | Prisma.transactionsWhereInput[];
    OR?: Prisma.transactionsWhereInput[];
    NOT?: Prisma.transactionsWhereInput | Prisma.transactionsWhereInput[];
    account_id?: Prisma.IntFilter<"transactions"> | number;
    user_id?: Prisma.IntFilter<"transactions"> | number;
    entity_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    amount?: Prisma.DecimalFilter<"transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFilter<"transactions"> | $Enums.transactions_type;
    status?: Prisma.Enumtransactions_statusNullableFilter<"transactions"> | $Enums.transactions_status | null;
    category?: Prisma.StringNullableFilter<"transactions"> | string | null;
    description?: Prisma.StringNullableFilter<"transactions"> | string | null;
    transaction_date?: Prisma.DateTimeFilter<"transactions"> | Date | string;
    created_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    is_recurring?: Prisma.BoolNullableFilter<"transactions"> | boolean | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    payment_method?: Prisma.StringNullableFilter<"transactions"> | string | null;
    category_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    income_source_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_number?: Prisma.IntNullableFilter<"transactions"> | number | null;
    recurring_transaction_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    financial_entities?: Prisma.XOR<Prisma.Financial_entitiesNullableScalarRelationFilter, Prisma.financial_entitiesWhereInput> | null;
    accounts?: Prisma.XOR<Prisma.AccountsScalarRelationFilter, Prisma.accountsWhereInput>;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    categories?: Prisma.XOR<Prisma.CategoriesNullableScalarRelationFilter, Prisma.categoriesWhereInput> | null;
    income_sources?: Prisma.XOR<Prisma.Income_sourcesNullableScalarRelationFilter, Prisma.income_sourcesWhereInput> | null;
    purchase_installments?: Prisma.XOR<Prisma.Purchase_installmentsNullableScalarRelationFilter, Prisma.purchase_installmentsWhereInput> | null;
    recurring_transactions?: Prisma.XOR<Prisma.Recurring_transactionsNullableScalarRelationFilter, Prisma.recurring_transactionsWhereInput> | null;
}, "id">;
export type transactionsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    transaction_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_recurring?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    payment_method?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    income_source_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    installment_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    installment_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.transactionsCountOrderByAggregateInput;
    _avg?: Prisma.transactionsAvgOrderByAggregateInput;
    _max?: Prisma.transactionsMaxOrderByAggregateInput;
    _min?: Prisma.transactionsMinOrderByAggregateInput;
    _sum?: Prisma.transactionsSumOrderByAggregateInput;
};
export type transactionsScalarWhereWithAggregatesInput = {
    AND?: Prisma.transactionsScalarWhereWithAggregatesInput | Prisma.transactionsScalarWhereWithAggregatesInput[];
    OR?: Prisma.transactionsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.transactionsScalarWhereWithAggregatesInput | Prisma.transactionsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"transactions"> | number;
    account_id?: Prisma.IntWithAggregatesFilter<"transactions"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"transactions"> | number;
    entity_id?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
    amount?: Prisma.DecimalWithAggregatesFilter<"transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeWithAggregatesFilter<"transactions"> | $Enums.transactions_type;
    status?: Prisma.Enumtransactions_statusNullableWithAggregatesFilter<"transactions"> | $Enums.transactions_status | null;
    category?: Prisma.StringNullableWithAggregatesFilter<"transactions"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"transactions"> | string | null;
    transaction_date?: Prisma.DateTimeWithAggregatesFilter<"transactions"> | Date | string;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"transactions"> | Date | string | null;
    is_recurring?: Prisma.BoolNullableWithAggregatesFilter<"transactions"> | boolean | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"transactions"> | Date | string | null;
    payment_method?: Prisma.StringNullableWithAggregatesFilter<"transactions"> | string | null;
    category_id?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
    income_source_id?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
    installment_id?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
    installment_number?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
    recurring_transaction_id?: Prisma.IntNullableWithAggregatesFilter<"transactions"> | number | null;
};
export type transactionsCreateInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateManyMutationInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TransactionsListRelationFilter = {
    every?: Prisma.transactionsWhereInput;
    some?: Prisma.transactionsWhereInput;
    none?: Prisma.transactionsWhereInput;
};
export type transactionsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type transactionsOrderByRelevanceInput = {
    fields: Prisma.transactionsOrderByRelevanceFieldEnum | Prisma.transactionsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type transactionsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    transaction_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    is_recurring?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    payment_method?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    income_source_id?: Prisma.SortOrder;
    installment_id?: Prisma.SortOrder;
    installment_number?: Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrder;
};
export type transactionsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    income_source_id?: Prisma.SortOrder;
    installment_id?: Prisma.SortOrder;
    installment_number?: Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrder;
};
export type transactionsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    transaction_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    is_recurring?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    payment_method?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    income_source_id?: Prisma.SortOrder;
    installment_id?: Prisma.SortOrder;
    installment_number?: Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrder;
};
export type transactionsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    transaction_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    is_recurring?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    payment_method?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    income_source_id?: Prisma.SortOrder;
    installment_id?: Prisma.SortOrder;
    installment_number?: Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrder;
};
export type transactionsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    account_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    income_source_id?: Prisma.SortOrder;
    installment_id?: Prisma.SortOrder;
    installment_number?: Prisma.SortOrder;
    recurring_transaction_id?: Prisma.SortOrder;
};
export type transactionsCreateNestedManyWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput> | Prisma.transactionsCreateWithoutAccountsInput[] | Prisma.transactionsUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutAccountsInput | Prisma.transactionsCreateOrConnectWithoutAccountsInput[];
    createMany?: Prisma.transactionsCreateManyAccountsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput> | Prisma.transactionsCreateWithoutAccountsInput[] | Prisma.transactionsUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutAccountsInput | Prisma.transactionsCreateOrConnectWithoutAccountsInput[];
    createMany?: Prisma.transactionsCreateManyAccountsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput> | Prisma.transactionsCreateWithoutAccountsInput[] | Prisma.transactionsUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutAccountsInput | Prisma.transactionsCreateOrConnectWithoutAccountsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutAccountsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutAccountsInput[];
    createMany?: Prisma.transactionsCreateManyAccountsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutAccountsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutAccountsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutAccountsInput | Prisma.transactionsUpdateManyWithWhereWithoutAccountsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput> | Prisma.transactionsCreateWithoutAccountsInput[] | Prisma.transactionsUncheckedCreateWithoutAccountsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutAccountsInput | Prisma.transactionsCreateOrConnectWithoutAccountsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutAccountsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutAccountsInput[];
    createMany?: Prisma.transactionsCreateManyAccountsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutAccountsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutAccountsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutAccountsInput | Prisma.transactionsUpdateManyWithWhereWithoutAccountsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateNestedManyWithoutCategoriesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput> | Prisma.transactionsCreateWithoutCategoriesInput[] | Prisma.transactionsUncheckedCreateWithoutCategoriesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutCategoriesInput | Prisma.transactionsCreateOrConnectWithoutCategoriesInput[];
    createMany?: Prisma.transactionsCreateManyCategoriesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutCategoriesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput> | Prisma.transactionsCreateWithoutCategoriesInput[] | Prisma.transactionsUncheckedCreateWithoutCategoriesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutCategoriesInput | Prisma.transactionsCreateOrConnectWithoutCategoriesInput[];
    createMany?: Prisma.transactionsCreateManyCategoriesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutCategoriesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput> | Prisma.transactionsCreateWithoutCategoriesInput[] | Prisma.transactionsUncheckedCreateWithoutCategoriesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutCategoriesInput | Prisma.transactionsCreateOrConnectWithoutCategoriesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutCategoriesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutCategoriesInput[];
    createMany?: Prisma.transactionsCreateManyCategoriesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutCategoriesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutCategoriesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutCategoriesInput | Prisma.transactionsUpdateManyWithWhereWithoutCategoriesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutCategoriesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput> | Prisma.transactionsCreateWithoutCategoriesInput[] | Prisma.transactionsUncheckedCreateWithoutCategoriesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutCategoriesInput | Prisma.transactionsCreateOrConnectWithoutCategoriesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutCategoriesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutCategoriesInput[];
    createMany?: Prisma.transactionsCreateManyCategoriesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutCategoriesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutCategoriesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutCategoriesInput | Prisma.transactionsUpdateManyWithWhereWithoutCategoriesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateNestedManyWithoutFinancial_entitiesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.transactionsCreateWithoutFinancial_entitiesInput[] | Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput[];
    createMany?: Prisma.transactionsCreateManyFinancial_entitiesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutFinancial_entitiesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.transactionsCreateWithoutFinancial_entitiesInput[] | Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput[];
    createMany?: Prisma.transactionsCreateManyFinancial_entitiesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutFinancial_entitiesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.transactionsCreateWithoutFinancial_entitiesInput[] | Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutFinancial_entitiesInput[];
    createMany?: Prisma.transactionsCreateManyFinancial_entitiesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutFinancial_entitiesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutFinancial_entitiesInput | Prisma.transactionsUpdateManyWithWhereWithoutFinancial_entitiesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.transactionsCreateWithoutFinancial_entitiesInput[] | Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.transactionsCreateOrConnectWithoutFinancial_entitiesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutFinancial_entitiesInput[];
    createMany?: Prisma.transactionsCreateManyFinancial_entitiesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutFinancial_entitiesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutFinancial_entitiesInput | Prisma.transactionsUpdateManyWithWhereWithoutFinancial_entitiesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateNestedManyWithoutIncome_sourcesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput> | Prisma.transactionsCreateWithoutIncome_sourcesInput[] | Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput | Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput[];
    createMany?: Prisma.transactionsCreateManyIncome_sourcesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutIncome_sourcesInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput> | Prisma.transactionsCreateWithoutIncome_sourcesInput[] | Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput | Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput[];
    createMany?: Prisma.transactionsCreateManyIncome_sourcesInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutIncome_sourcesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput> | Prisma.transactionsCreateWithoutIncome_sourcesInput[] | Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput | Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutIncome_sourcesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutIncome_sourcesInput[];
    createMany?: Prisma.transactionsCreateManyIncome_sourcesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutIncome_sourcesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutIncome_sourcesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutIncome_sourcesInput | Prisma.transactionsUpdateManyWithWhereWithoutIncome_sourcesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutIncome_sourcesNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput> | Prisma.transactionsCreateWithoutIncome_sourcesInput[] | Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput | Prisma.transactionsCreateOrConnectWithoutIncome_sourcesInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutIncome_sourcesInput | Prisma.transactionsUpsertWithWhereUniqueWithoutIncome_sourcesInput[];
    createMany?: Prisma.transactionsCreateManyIncome_sourcesInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutIncome_sourcesInput | Prisma.transactionsUpdateWithWhereUniqueWithoutIncome_sourcesInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutIncome_sourcesInput | Prisma.transactionsUpdateManyWithWhereWithoutIncome_sourcesInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateNestedManyWithoutRecurring_transactionsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput> | Prisma.transactionsCreateWithoutRecurring_transactionsInput[] | Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput | Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput[];
    createMany?: Prisma.transactionsCreateManyRecurring_transactionsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutRecurring_transactionsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput> | Prisma.transactionsCreateWithoutRecurring_transactionsInput[] | Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput | Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput[];
    createMany?: Prisma.transactionsCreateManyRecurring_transactionsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutRecurring_transactionsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput> | Prisma.transactionsCreateWithoutRecurring_transactionsInput[] | Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput | Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutRecurring_transactionsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutRecurring_transactionsInput[];
    createMany?: Prisma.transactionsCreateManyRecurring_transactionsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutRecurring_transactionsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutRecurring_transactionsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutRecurring_transactionsInput | Prisma.transactionsUpdateManyWithWhereWithoutRecurring_transactionsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutRecurring_transactionsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput> | Prisma.transactionsCreateWithoutRecurring_transactionsInput[] | Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput | Prisma.transactionsCreateOrConnectWithoutRecurring_transactionsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutRecurring_transactionsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutRecurring_transactionsInput[];
    createMany?: Prisma.transactionsCreateManyRecurring_transactionsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutRecurring_transactionsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutRecurring_transactionsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutRecurring_transactionsInput | Prisma.transactionsUpdateManyWithWhereWithoutRecurring_transactionsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateNestedManyWithoutPurchase_installmentsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput> | Prisma.transactionsCreateWithoutPurchase_installmentsInput[] | Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput | Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput[];
    createMany?: Prisma.transactionsCreateManyPurchase_installmentsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutPurchase_installmentsInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput> | Prisma.transactionsCreateWithoutPurchase_installmentsInput[] | Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput | Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput[];
    createMany?: Prisma.transactionsCreateManyPurchase_installmentsInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutPurchase_installmentsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput> | Prisma.transactionsCreateWithoutPurchase_installmentsInput[] | Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput | Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutPurchase_installmentsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutPurchase_installmentsInput[];
    createMany?: Prisma.transactionsCreateManyPurchase_installmentsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutPurchase_installmentsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutPurchase_installmentsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutPurchase_installmentsInput | Prisma.transactionsUpdateManyWithWhereWithoutPurchase_installmentsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutPurchase_installmentsNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput> | Prisma.transactionsCreateWithoutPurchase_installmentsInput[] | Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput | Prisma.transactionsCreateOrConnectWithoutPurchase_installmentsInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutPurchase_installmentsInput | Prisma.transactionsUpsertWithWhereUniqueWithoutPurchase_installmentsInput[];
    createMany?: Prisma.transactionsCreateManyPurchase_installmentsInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutPurchase_installmentsInput | Prisma.transactionsUpdateWithWhereUniqueWithoutPurchase_installmentsInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutPurchase_installmentsInput | Prisma.transactionsUpdateManyWithWhereWithoutPurchase_installmentsInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type Enumtransactions_typeFieldUpdateOperationsInput = {
    set?: $Enums.transactions_type;
};
export type NullableEnumtransactions_statusFieldUpdateOperationsInput = {
    set?: $Enums.transactions_status | null;
};
export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
};
export type transactionsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput> | Prisma.transactionsCreateWithoutUsersInput[] | Prisma.transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutUsersInput | Prisma.transactionsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.transactionsCreateManyUsersInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput> | Prisma.transactionsCreateWithoutUsersInput[] | Prisma.transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutUsersInput | Prisma.transactionsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.transactionsCreateManyUsersInputEnvelope;
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
};
export type transactionsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput> | Prisma.transactionsCreateWithoutUsersInput[] | Prisma.transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutUsersInput | Prisma.transactionsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutUsersInput | Prisma.transactionsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.transactionsCreateManyUsersInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutUsersInput | Prisma.transactionsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutUsersInput | Prisma.transactionsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput> | Prisma.transactionsCreateWithoutUsersInput[] | Prisma.transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.transactionsCreateOrConnectWithoutUsersInput | Prisma.transactionsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.transactionsUpsertWithWhereUniqueWithoutUsersInput | Prisma.transactionsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.transactionsCreateManyUsersInputEnvelope;
    set?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    disconnect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    delete?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    connect?: Prisma.transactionsWhereUniqueInput | Prisma.transactionsWhereUniqueInput[];
    update?: Prisma.transactionsUpdateWithWhereUniqueWithoutUsersInput | Prisma.transactionsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.transactionsUpdateManyWithWhereWithoutUsersInput | Prisma.transactionsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
};
export type transactionsCreateWithoutAccountsInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutAccountsInput = {
    id?: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutAccountsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput>;
};
export type transactionsCreateManyAccountsInputEnvelope = {
    data: Prisma.transactionsCreateManyAccountsInput | Prisma.transactionsCreateManyAccountsInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutAccountsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutAccountsInput, Prisma.transactionsUncheckedUpdateWithoutAccountsInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutAccountsInput, Prisma.transactionsUncheckedCreateWithoutAccountsInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutAccountsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutAccountsInput, Prisma.transactionsUncheckedUpdateWithoutAccountsInput>;
};
export type transactionsUpdateManyWithWhereWithoutAccountsInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutAccountsInput>;
};
export type transactionsScalarWhereInput = {
    AND?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
    OR?: Prisma.transactionsScalarWhereInput[];
    NOT?: Prisma.transactionsScalarWhereInput | Prisma.transactionsScalarWhereInput[];
    id?: Prisma.IntFilter<"transactions"> | number;
    account_id?: Prisma.IntFilter<"transactions"> | number;
    user_id?: Prisma.IntFilter<"transactions"> | number;
    entity_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    amount?: Prisma.DecimalFilter<"transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFilter<"transactions"> | $Enums.transactions_type;
    status?: Prisma.Enumtransactions_statusNullableFilter<"transactions"> | $Enums.transactions_status | null;
    category?: Prisma.StringNullableFilter<"transactions"> | string | null;
    description?: Prisma.StringNullableFilter<"transactions"> | string | null;
    transaction_date?: Prisma.DateTimeFilter<"transactions"> | Date | string;
    created_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    is_recurring?: Prisma.BoolNullableFilter<"transactions"> | boolean | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"transactions"> | Date | string | null;
    payment_method?: Prisma.StringNullableFilter<"transactions"> | string | null;
    category_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    income_source_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
    installment_number?: Prisma.IntNullableFilter<"transactions"> | number | null;
    recurring_transaction_id?: Prisma.IntNullableFilter<"transactions"> | number | null;
};
export type transactionsCreateWithoutCategoriesInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutCategoriesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutCategoriesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput>;
};
export type transactionsCreateManyCategoriesInputEnvelope = {
    data: Prisma.transactionsCreateManyCategoriesInput | Prisma.transactionsCreateManyCategoriesInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutCategoriesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutCategoriesInput, Prisma.transactionsUncheckedUpdateWithoutCategoriesInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutCategoriesInput, Prisma.transactionsUncheckedCreateWithoutCategoriesInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutCategoriesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutCategoriesInput, Prisma.transactionsUncheckedUpdateWithoutCategoriesInput>;
};
export type transactionsUpdateManyWithWhereWithoutCategoriesInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutCategoriesInput>;
};
export type transactionsCreateWithoutFinancial_entitiesInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutFinancial_entitiesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutFinancial_entitiesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput>;
};
export type transactionsCreateManyFinancial_entitiesInputEnvelope = {
    data: Prisma.transactionsCreateManyFinancial_entitiesInput | Prisma.transactionsCreateManyFinancial_entitiesInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutFinancial_entitiesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedUpdateWithoutFinancial_entitiesInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedCreateWithoutFinancial_entitiesInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutFinancial_entitiesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutFinancial_entitiesInput, Prisma.transactionsUncheckedUpdateWithoutFinancial_entitiesInput>;
};
export type transactionsUpdateManyWithWhereWithoutFinancial_entitiesInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutFinancial_entitiesInput>;
};
export type transactionsCreateWithoutIncome_sourcesInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutIncome_sourcesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutIncome_sourcesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput>;
};
export type transactionsCreateManyIncome_sourcesInputEnvelope = {
    data: Prisma.transactionsCreateManyIncome_sourcesInput | Prisma.transactionsCreateManyIncome_sourcesInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutIncome_sourcesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedUpdateWithoutIncome_sourcesInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedCreateWithoutIncome_sourcesInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutIncome_sourcesInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutIncome_sourcesInput, Prisma.transactionsUncheckedUpdateWithoutIncome_sourcesInput>;
};
export type transactionsUpdateManyWithWhereWithoutIncome_sourcesInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutIncome_sourcesInput>;
};
export type transactionsCreateWithoutRecurring_transactionsInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutRecurring_transactionsInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
};
export type transactionsCreateOrConnectWithoutRecurring_transactionsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput>;
};
export type transactionsCreateManyRecurring_transactionsInputEnvelope = {
    data: Prisma.transactionsCreateManyRecurring_transactionsInput | Prisma.transactionsCreateManyRecurring_transactionsInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutRecurring_transactionsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedUpdateWithoutRecurring_transactionsInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedCreateWithoutRecurring_transactionsInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutRecurring_transactionsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutRecurring_transactionsInput, Prisma.transactionsUncheckedUpdateWithoutRecurring_transactionsInput>;
};
export type transactionsUpdateManyWithWhereWithoutRecurring_transactionsInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutRecurring_transactionsInput>;
};
export type transactionsCreateWithoutPurchase_installmentsInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    users: Prisma.usersCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutPurchase_installmentsInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutPurchase_installmentsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput>;
};
export type transactionsCreateManyPurchase_installmentsInputEnvelope = {
    data: Prisma.transactionsCreateManyPurchase_installmentsInput | Prisma.transactionsCreateManyPurchase_installmentsInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutPurchase_installmentsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedUpdateWithoutPurchase_installmentsInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedCreateWithoutPurchase_installmentsInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutPurchase_installmentsInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutPurchase_installmentsInput, Prisma.transactionsUncheckedUpdateWithoutPurchase_installmentsInput>;
};
export type transactionsUpdateManyWithWhereWithoutPurchase_installmentsInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutPurchase_installmentsInput>;
};
export type transactionsCreateWithoutUsersInput = {
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    installment_number?: number | null;
    financial_entities?: Prisma.financial_entitiesCreateNestedOneWithoutTransactionsInput;
    accounts: Prisma.accountsCreateNestedOneWithoutTransactionsInput;
    categories?: Prisma.categoriesCreateNestedOneWithoutTransactionsInput;
    income_sources?: Prisma.income_sourcesCreateNestedOneWithoutTransactionsInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedOneWithoutTransactionsInput;
    recurring_transactions?: Prisma.recurring_transactionsCreateNestedOneWithoutTransactionsInput;
};
export type transactionsUncheckedCreateWithoutUsersInput = {
    id?: number;
    account_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsCreateOrConnectWithoutUsersInput = {
    where: Prisma.transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput>;
};
export type transactionsCreateManyUsersInputEnvelope = {
    data: Prisma.transactionsCreateManyUsersInput | Prisma.transactionsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type transactionsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.transactionsUpdateWithoutUsersInput, Prisma.transactionsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.transactionsCreateWithoutUsersInput, Prisma.transactionsUncheckedCreateWithoutUsersInput>;
};
export type transactionsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.transactionsUpdateWithoutUsersInput, Prisma.transactionsUncheckedUpdateWithoutUsersInput>;
};
export type transactionsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyWithoutUsersInput>;
};
export type transactionsCreateManyAccountsInput = {
    id?: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutAccountsInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutAccountsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutAccountsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyCategoriesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutCategoriesInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutCategoriesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutCategoriesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyFinancial_entitiesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutFinancial_entitiesInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutFinancial_entitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutFinancial_entitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyIncome_sourcesInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutIncome_sourcesInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutIncome_sourcesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutIncome_sourcesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyRecurring_transactionsInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
};
export type transactionsUpdateWithoutRecurring_transactionsInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutRecurring_transactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutRecurring_transactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyPurchase_installmentsInput = {
    id?: number;
    account_id: number;
    user_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutPurchase_installmentsInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    users?: Prisma.usersUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutPurchase_installmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutPurchase_installmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsCreateManyUsersInput = {
    id?: number;
    account_id: number;
    entity_id?: number | null;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    type: $Enums.transactions_type;
    status?: $Enums.transactions_status | null;
    category?: string | null;
    description?: string | null;
    transaction_date: Date | string;
    created_at?: Date | string | null;
    is_recurring?: boolean | null;
    deleted_at?: Date | string | null;
    payment_method?: string | null;
    category_id?: number | null;
    income_source_id?: number | null;
    installment_id?: number | null;
    installment_number?: number | null;
    recurring_transaction_id?: number | null;
};
export type transactionsUpdateWithoutUsersInput = {
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneWithoutTransactionsNestedInput;
    accounts?: Prisma.accountsUpdateOneRequiredWithoutTransactionsNestedInput;
    categories?: Prisma.categoriesUpdateOneWithoutTransactionsNestedInput;
    income_sources?: Prisma.income_sourcesUpdateOneWithoutTransactionsNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateOneWithoutTransactionsNestedInput;
    recurring_transactions?: Prisma.recurring_transactionsUpdateOneWithoutTransactionsNestedInput;
};
export type transactionsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    account_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    type?: Prisma.Enumtransactions_typeFieldUpdateOperationsInput | $Enums.transactions_type;
    status?: Prisma.NullableEnumtransactions_statusFieldUpdateOperationsInput | $Enums.transactions_status | null;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    transaction_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    is_recurring?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    payment_method?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    income_source_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    installment_number?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    recurring_transaction_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type transactionsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    account_id?: boolean;
    user_id?: boolean;
    entity_id?: boolean;
    amount?: boolean;
    type?: boolean;
    status?: boolean;
    category?: boolean;
    description?: boolean;
    transaction_date?: boolean;
    created_at?: boolean;
    is_recurring?: boolean;
    deleted_at?: boolean;
    payment_method?: boolean;
    category_id?: boolean;
    income_source_id?: boolean;
    installment_id?: boolean;
    installment_number?: boolean;
    recurring_transaction_id?: boolean;
    financial_entities?: boolean | Prisma.transactions$financial_entitiesArgs<ExtArgs>;
    accounts?: boolean | Prisma.accountsDefaultArgs<ExtArgs>;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    categories?: boolean | Prisma.transactions$categoriesArgs<ExtArgs>;
    income_sources?: boolean | Prisma.transactions$income_sourcesArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.transactions$purchase_installmentsArgs<ExtArgs>;
    recurring_transactions?: boolean | Prisma.transactions$recurring_transactionsArgs<ExtArgs>;
}, ExtArgs["result"]["transactions"]>;
export type transactionsSelectScalar = {
    id?: boolean;
    account_id?: boolean;
    user_id?: boolean;
    entity_id?: boolean;
    amount?: boolean;
    type?: boolean;
    status?: boolean;
    category?: boolean;
    description?: boolean;
    transaction_date?: boolean;
    created_at?: boolean;
    is_recurring?: boolean;
    deleted_at?: boolean;
    payment_method?: boolean;
    category_id?: boolean;
    income_source_id?: boolean;
    installment_id?: boolean;
    installment_number?: boolean;
    recurring_transaction_id?: boolean;
};
export type transactionsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "account_id" | "user_id" | "entity_id" | "amount" | "type" | "status" | "category" | "description" | "transaction_date" | "created_at" | "is_recurring" | "deleted_at" | "payment_method" | "category_id" | "income_source_id" | "installment_id" | "installment_number" | "recurring_transaction_id", ExtArgs["result"]["transactions"]>;
export type transactionsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    financial_entities?: boolean | Prisma.transactions$financial_entitiesArgs<ExtArgs>;
    accounts?: boolean | Prisma.accountsDefaultArgs<ExtArgs>;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    categories?: boolean | Prisma.transactions$categoriesArgs<ExtArgs>;
    income_sources?: boolean | Prisma.transactions$income_sourcesArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.transactions$purchase_installmentsArgs<ExtArgs>;
    recurring_transactions?: boolean | Prisma.transactions$recurring_transactionsArgs<ExtArgs>;
};
export type $transactionsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "transactions";
    objects: {
        financial_entities: Prisma.$financial_entitiesPayload<ExtArgs> | null;
        accounts: Prisma.$accountsPayload<ExtArgs>;
        users: Prisma.$usersPayload<ExtArgs>;
        categories: Prisma.$categoriesPayload<ExtArgs> | null;
        income_sources: Prisma.$income_sourcesPayload<ExtArgs> | null;
        purchase_installments: Prisma.$purchase_installmentsPayload<ExtArgs> | null;
        recurring_transactions: Prisma.$recurring_transactionsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        account_id: number;
        user_id: number;
        entity_id: number | null;
        amount: runtime.Decimal;
        type: $Enums.transactions_type;
        status: $Enums.transactions_status | null;
        category: string | null;
        description: string | null;
        transaction_date: Date;
        created_at: Date | null;
        is_recurring: boolean | null;
        deleted_at: Date | null;
        payment_method: string | null;
        category_id: number | null;
        income_source_id: number | null;
        installment_id: number | null;
        installment_number: number | null;
        recurring_transaction_id: number | null;
    }, ExtArgs["result"]["transactions"]>;
    composites: {};
};
export type transactionsGetPayload<S extends boolean | null | undefined | transactionsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$transactionsPayload, S>;
export type transactionsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<transactionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TransactionsCountAggregateInputType | true;
};
export interface transactionsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['transactions'];
        meta: {
            name: 'transactions';
        };
    };
    /**
     * Find zero or one Transactions that matches the filter.
     * @param {transactionsFindUniqueArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends transactionsFindUniqueArgs>(args: Prisma.SelectSubset<T, transactionsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Transactions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {transactionsFindUniqueOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends transactionsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, transactionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindFirstArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends transactionsFindFirstArgs>(args?: Prisma.SelectSubset<T, transactionsFindFirstArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Transactions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindFirstOrThrowArgs} args - Arguments to find a Transactions
     * @example
     * // Get one Transactions
     * const transactions = await prisma.transactions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends transactionsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, transactionsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transactions.findMany()
     *
     * // Get first 10 Transactions
     * const transactions = await prisma.transactions.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const transactionsWithIdOnly = await prisma.transactions.findMany({ select: { id: true } })
     *
     */
    findMany<T extends transactionsFindManyArgs>(args?: Prisma.SelectSubset<T, transactionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Transactions.
     * @param {transactionsCreateArgs} args - Arguments to create a Transactions.
     * @example
     * // Create one Transactions
     * const Transactions = await prisma.transactions.create({
     *   data: {
     *     // ... data to create a Transactions
     *   }
     * })
     *
     */
    create<T extends transactionsCreateArgs>(args: Prisma.SelectSubset<T, transactionsCreateArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Transactions.
     * @param {transactionsCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transactions = await prisma.transactions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends transactionsCreateManyArgs>(args?: Prisma.SelectSubset<T, transactionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Transactions.
     * @param {transactionsDeleteArgs} args - Arguments to delete one Transactions.
     * @example
     * // Delete one Transactions
     * const Transactions = await prisma.transactions.delete({
     *   where: {
     *     // ... filter to delete one Transactions
     *   }
     * })
     *
     */
    delete<T extends transactionsDeleteArgs>(args: Prisma.SelectSubset<T, transactionsDeleteArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Transactions.
     * @param {transactionsUpdateArgs} args - Arguments to update one Transactions.
     * @example
     * // Update one Transactions
     * const transactions = await prisma.transactions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends transactionsUpdateArgs>(args: Prisma.SelectSubset<T, transactionsUpdateArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Transactions.
     * @param {transactionsDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transactions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends transactionsDeleteManyArgs>(args?: Prisma.SelectSubset<T, transactionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transactions = await prisma.transactions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends transactionsUpdateManyArgs>(args: Prisma.SelectSubset<T, transactionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Transactions.
     * @param {transactionsUpsertArgs} args - Arguments to update or create a Transactions.
     * @example
     * // Update or create a Transactions
     * const transactions = await prisma.transactions.upsert({
     *   create: {
     *     // ... data to create a Transactions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transactions we want to update
     *   }
     * })
     */
    upsert<T extends transactionsUpsertArgs>(args: Prisma.SelectSubset<T, transactionsUpsertArgs<ExtArgs>>): Prisma.Prisma__transactionsClient<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transactions.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends transactionsCountArgs>(args?: Prisma.Subset<T, transactionsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TransactionsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionsAggregateArgs>(args: Prisma.Subset<T, TransactionsAggregateArgs>): Prisma.PrismaPromise<GetTransactionsAggregateType<T>>;
    /**
     * Group by Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {transactionsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends transactionsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: transactionsGroupByArgs['orderBy'];
    } : {
        orderBy?: transactionsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, transactionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the transactions model
     */
    readonly fields: transactionsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for transactions.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__transactionsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    financial_entities<T extends Prisma.transactions$financial_entitiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transactions$financial_entitiesArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    accounts<T extends Prisma.accountsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.accountsDefaultArgs<ExtArgs>>): Prisma.Prisma__accountsClient<runtime.Types.Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    categories<T extends Prisma.transactions$categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transactions$categoriesArgs<ExtArgs>>): Prisma.Prisma__categoriesClient<runtime.Types.Result.GetResult<Prisma.$categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    income_sources<T extends Prisma.transactions$income_sourcesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transactions$income_sourcesArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    purchase_installments<T extends Prisma.transactions$purchase_installmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transactions$purchase_installmentsArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    recurring_transactions<T extends Prisma.transactions$recurring_transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transactions$recurring_transactionsArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the transactions model
 */
export interface transactionsFieldRefs {
    readonly id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly account_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly user_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly entity_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly amount: Prisma.FieldRef<"transactions", 'Decimal'>;
    readonly type: Prisma.FieldRef<"transactions", 'transactions_type'>;
    readonly status: Prisma.FieldRef<"transactions", 'transactions_status'>;
    readonly category: Prisma.FieldRef<"transactions", 'String'>;
    readonly description: Prisma.FieldRef<"transactions", 'String'>;
    readonly transaction_date: Prisma.FieldRef<"transactions", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"transactions", 'DateTime'>;
    readonly is_recurring: Prisma.FieldRef<"transactions", 'Boolean'>;
    readonly deleted_at: Prisma.FieldRef<"transactions", 'DateTime'>;
    readonly payment_method: Prisma.FieldRef<"transactions", 'String'>;
    readonly category_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly income_source_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly installment_id: Prisma.FieldRef<"transactions", 'Int'>;
    readonly installment_number: Prisma.FieldRef<"transactions", 'Int'>;
    readonly recurring_transaction_id: Prisma.FieldRef<"transactions", 'Int'>;
}
/**
 * transactions findUnique
 */
export type transactionsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which transactions to fetch.
     */
    where: Prisma.transactionsWhereUniqueInput;
};
/**
 * transactions findUniqueOrThrow
 */
export type transactionsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which transactions to fetch.
     */
    where: Prisma.transactionsWhereUniqueInput;
};
/**
 * transactions findFirst
 */
export type transactionsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which transactions to fetch.
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of transactions to fetch.
     */
    orderBy?: Prisma.transactionsOrderByWithRelationInput | Prisma.transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for transactions.
     */
    cursor?: Prisma.transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of transactions.
     */
    distinct?: Prisma.TransactionsScalarFieldEnum | Prisma.TransactionsScalarFieldEnum[];
};
/**
 * transactions findFirstOrThrow
 */
export type transactionsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which transactions to fetch.
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of transactions to fetch.
     */
    orderBy?: Prisma.transactionsOrderByWithRelationInput | Prisma.transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for transactions.
     */
    cursor?: Prisma.transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of transactions.
     */
    distinct?: Prisma.TransactionsScalarFieldEnum | Prisma.TransactionsScalarFieldEnum[];
};
/**
 * transactions findMany
 */
export type transactionsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which transactions to fetch.
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of transactions to fetch.
     */
    orderBy?: Prisma.transactionsOrderByWithRelationInput | Prisma.transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing transactions.
     */
    cursor?: Prisma.transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` transactions.
     */
    skip?: number;
    distinct?: Prisma.TransactionsScalarFieldEnum | Prisma.TransactionsScalarFieldEnum[];
};
/**
 * transactions create
 */
export type transactionsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a transactions.
     */
    data: Prisma.XOR<Prisma.transactionsCreateInput, Prisma.transactionsUncheckedCreateInput>;
};
/**
 * transactions createMany
 */
export type transactionsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many transactions.
     */
    data: Prisma.transactionsCreateManyInput | Prisma.transactionsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * transactions update
 */
export type transactionsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a transactions.
     */
    data: Prisma.XOR<Prisma.transactionsUpdateInput, Prisma.transactionsUncheckedUpdateInput>;
    /**
     * Choose, which transactions to update.
     */
    where: Prisma.transactionsWhereUniqueInput;
};
/**
 * transactions updateMany
 */
export type transactionsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update transactions.
     */
    data: Prisma.XOR<Prisma.transactionsUpdateManyMutationInput, Prisma.transactionsUncheckedUpdateManyInput>;
    /**
     * Filter which transactions to update
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * Limit how many transactions to update.
     */
    limit?: number;
};
/**
 * transactions upsert
 */
export type transactionsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the transactions to update in case it exists.
     */
    where: Prisma.transactionsWhereUniqueInput;
    /**
     * In case the transactions found by the `where` argument doesn't exist, create a new transactions with this data.
     */
    create: Prisma.XOR<Prisma.transactionsCreateInput, Prisma.transactionsUncheckedCreateInput>;
    /**
     * In case the transactions was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.transactionsUpdateInput, Prisma.transactionsUncheckedUpdateInput>;
};
/**
 * transactions delete
 */
export type transactionsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which transactions to delete.
     */
    where: Prisma.transactionsWhereUniqueInput;
};
/**
 * transactions deleteMany
 */
export type transactionsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which transactions to delete
     */
    where?: Prisma.transactionsWhereInput;
    /**
     * Limit how many transactions to delete.
     */
    limit?: number;
};
/**
 * transactions.financial_entities
 */
export type transactions$financial_entitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * transactions.categories
 */
export type transactions$categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * transactions.income_sources
 */
export type transactions$income_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * transactions.purchase_installments
 */
export type transactions$purchase_installmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * transactions.recurring_transactions
 */
export type transactions$recurring_transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * transactions without action
 */
export type transactionsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=transactions.d.ts.map