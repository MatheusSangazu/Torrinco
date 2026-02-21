import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model recurring_transactions
 *
 */
export type recurring_transactionsModel = runtime.Types.Result.DefaultSelection<Prisma.$recurring_transactionsPayload>;
export type AggregateRecurring_transactions = {
    _count: Recurring_transactionsCountAggregateOutputType | null;
    _avg: Recurring_transactionsAvgAggregateOutputType | null;
    _sum: Recurring_transactionsSumAggregateOutputType | null;
    _min: Recurring_transactionsMinAggregateOutputType | null;
    _max: Recurring_transactionsMaxAggregateOutputType | null;
};
export type Recurring_transactionsAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    amount: runtime.Decimal | null;
};
export type Recurring_transactionsSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    amount: runtime.Decimal | null;
};
export type Recurring_transactionsMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    description: string | null;
    amount: runtime.Decimal | null;
    category: string | null;
    type: $Enums.recurring_transactions_type | null;
    frequency: $Enums.recurring_transactions_frequency | null;
    start_date: Date | null;
    next_due_date: Date | null;
    status: $Enums.recurring_transactions_status | null;
    created_at: Date | null;
};
export type Recurring_transactionsMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    description: string | null;
    amount: runtime.Decimal | null;
    category: string | null;
    type: $Enums.recurring_transactions_type | null;
    frequency: $Enums.recurring_transactions_frequency | null;
    start_date: Date | null;
    next_due_date: Date | null;
    status: $Enums.recurring_transactions_status | null;
    created_at: Date | null;
};
export type Recurring_transactionsCountAggregateOutputType = {
    id: number;
    user_id: number;
    description: number;
    amount: number;
    category: number;
    type: number;
    frequency: number;
    start_date: number;
    next_due_date: number;
    status: number;
    created_at: number;
    _all: number;
};
export type Recurring_transactionsAvgAggregateInputType = {
    id?: true;
    user_id?: true;
    amount?: true;
};
export type Recurring_transactionsSumAggregateInputType = {
    id?: true;
    user_id?: true;
    amount?: true;
};
export type Recurring_transactionsMinAggregateInputType = {
    id?: true;
    user_id?: true;
    description?: true;
    amount?: true;
    category?: true;
    type?: true;
    frequency?: true;
    start_date?: true;
    next_due_date?: true;
    status?: true;
    created_at?: true;
};
export type Recurring_transactionsMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    description?: true;
    amount?: true;
    category?: true;
    type?: true;
    frequency?: true;
    start_date?: true;
    next_due_date?: true;
    status?: true;
    created_at?: true;
};
export type Recurring_transactionsCountAggregateInputType = {
    id?: true;
    user_id?: true;
    description?: true;
    amount?: true;
    category?: true;
    type?: true;
    frequency?: true;
    start_date?: true;
    next_due_date?: true;
    status?: true;
    created_at?: true;
    _all?: true;
};
export type Recurring_transactionsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_transactions to aggregate.
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_transactions to fetch.
     */
    orderBy?: Prisma.recurring_transactionsOrderByWithRelationInput | Prisma.recurring_transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.recurring_transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned recurring_transactions
    **/
    _count?: true | Recurring_transactionsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Recurring_transactionsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Recurring_transactionsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Recurring_transactionsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Recurring_transactionsMaxAggregateInputType;
};
export type GetRecurring_transactionsAggregateType<T extends Recurring_transactionsAggregateArgs> = {
    [P in keyof T & keyof AggregateRecurring_transactions]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRecurring_transactions[P]> : Prisma.GetScalarType<T[P], AggregateRecurring_transactions[P]>;
};
export type recurring_transactionsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_transactionsWhereInput;
    orderBy?: Prisma.recurring_transactionsOrderByWithAggregationInput | Prisma.recurring_transactionsOrderByWithAggregationInput[];
    by: Prisma.Recurring_transactionsScalarFieldEnum[] | Prisma.Recurring_transactionsScalarFieldEnum;
    having?: Prisma.recurring_transactionsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Recurring_transactionsCountAggregateInputType | true;
    _avg?: Recurring_transactionsAvgAggregateInputType;
    _sum?: Recurring_transactionsSumAggregateInputType;
    _min?: Recurring_transactionsMinAggregateInputType;
    _max?: Recurring_transactionsMaxAggregateInputType;
};
export type Recurring_transactionsGroupByOutputType = {
    id: number;
    user_id: number;
    description: string;
    amount: runtime.Decimal;
    category: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date;
    next_due_date: Date;
    status: $Enums.recurring_transactions_status | null;
    created_at: Date | null;
    _count: Recurring_transactionsCountAggregateOutputType | null;
    _avg: Recurring_transactionsAvgAggregateOutputType | null;
    _sum: Recurring_transactionsSumAggregateOutputType | null;
    _min: Recurring_transactionsMinAggregateOutputType | null;
    _max: Recurring_transactionsMaxAggregateOutputType | null;
};
type GetRecurring_transactionsGroupByPayload<T extends recurring_transactionsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Recurring_transactionsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Recurring_transactionsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Recurring_transactionsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Recurring_transactionsGroupByOutputType[P]>;
}>>;
export type recurring_transactionsWhereInput = {
    AND?: Prisma.recurring_transactionsWhereInput | Prisma.recurring_transactionsWhereInput[];
    OR?: Prisma.recurring_transactionsWhereInput[];
    NOT?: Prisma.recurring_transactionsWhereInput | Prisma.recurring_transactionsWhereInput[];
    id?: Prisma.IntFilter<"recurring_transactions"> | number;
    user_id?: Prisma.IntFilter<"recurring_transactions"> | number;
    description?: Prisma.StringFilter<"recurring_transactions"> | string;
    amount?: Prisma.DecimalFilter<"recurring_transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.StringNullableFilter<"recurring_transactions"> | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFilter<"recurring_transactions"> | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFilter<"recurring_transactions"> | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    next_due_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    status?: Prisma.Enumrecurring_transactions_statusNullableFilter<"recurring_transactions"> | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_transactions"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
};
export type recurring_transactionsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    _relevance?: Prisma.recurring_transactionsOrderByRelevanceInput;
};
export type recurring_transactionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.recurring_transactionsWhereInput | Prisma.recurring_transactionsWhereInput[];
    OR?: Prisma.recurring_transactionsWhereInput[];
    NOT?: Prisma.recurring_transactionsWhereInput | Prisma.recurring_transactionsWhereInput[];
    user_id?: Prisma.IntFilter<"recurring_transactions"> | number;
    description?: Prisma.StringFilter<"recurring_transactions"> | string;
    amount?: Prisma.DecimalFilter<"recurring_transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.StringNullableFilter<"recurring_transactions"> | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFilter<"recurring_transactions"> | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFilter<"recurring_transactions"> | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    next_due_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    status?: Prisma.Enumrecurring_transactions_statusNullableFilter<"recurring_transactions"> | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_transactions"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
}, "id">;
export type recurring_transactionsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.recurring_transactionsCountOrderByAggregateInput;
    _avg?: Prisma.recurring_transactionsAvgOrderByAggregateInput;
    _max?: Prisma.recurring_transactionsMaxOrderByAggregateInput;
    _min?: Prisma.recurring_transactionsMinOrderByAggregateInput;
    _sum?: Prisma.recurring_transactionsSumOrderByAggregateInput;
};
export type recurring_transactionsScalarWhereWithAggregatesInput = {
    AND?: Prisma.recurring_transactionsScalarWhereWithAggregatesInput | Prisma.recurring_transactionsScalarWhereWithAggregatesInput[];
    OR?: Prisma.recurring_transactionsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.recurring_transactionsScalarWhereWithAggregatesInput | Prisma.recurring_transactionsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"recurring_transactions"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"recurring_transactions"> | number;
    description?: Prisma.StringWithAggregatesFilter<"recurring_transactions"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"recurring_transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.StringNullableWithAggregatesFilter<"recurring_transactions"> | string | null;
    type?: Prisma.Enumrecurring_transactions_typeWithAggregatesFilter<"recurring_transactions"> | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyWithAggregatesFilter<"recurring_transactions"> | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeWithAggregatesFilter<"recurring_transactions"> | Date | string;
    next_due_date?: Prisma.DateTimeWithAggregatesFilter<"recurring_transactions"> | Date | string;
    status?: Prisma.Enumrecurring_transactions_statusNullableWithAggregatesFilter<"recurring_transactions"> | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"recurring_transactions"> | Date | string | null;
};
export type recurring_transactionsCreateInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutRecurring_transactionsInput;
};
export type recurring_transactionsUncheckedCreateInput = {
    id?: number;
    user_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
};
export type recurring_transactionsUpdateInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutRecurring_transactionsNestedInput;
};
export type recurring_transactionsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsCreateManyInput = {
    id?: number;
    user_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
};
export type recurring_transactionsUpdateManyMutationInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsOrderByRelevanceInput = {
    fields: Prisma.recurring_transactionsOrderByRelevanceFieldEnum | Prisma.recurring_transactionsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type recurring_transactionsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_transactionsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type recurring_transactionsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_transactionsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_transactionsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type Recurring_transactionsListRelationFilter = {
    every?: Prisma.recurring_transactionsWhereInput;
    some?: Prisma.recurring_transactionsWhereInput;
    none?: Prisma.recurring_transactionsWhereInput;
};
export type recurring_transactionsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Enumrecurring_transactions_typeFieldUpdateOperationsInput = {
    set?: $Enums.recurring_transactions_type;
};
export type Enumrecurring_transactions_frequencyFieldUpdateOperationsInput = {
    set?: $Enums.recurring_transactions_frequency;
};
export type NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput = {
    set?: $Enums.recurring_transactions_status | null;
};
export type recurring_transactionsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput> | Prisma.recurring_transactionsCreateWithoutUsersInput[] | Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput | Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.recurring_transactionsCreateManyUsersInputEnvelope;
    connect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
};
export type recurring_transactionsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput> | Prisma.recurring_transactionsCreateWithoutUsersInput[] | Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput | Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.recurring_transactionsCreateManyUsersInputEnvelope;
    connect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
};
export type recurring_transactionsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput> | Prisma.recurring_transactionsCreateWithoutUsersInput[] | Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput | Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.recurring_transactionsUpsertWithWhereUniqueWithoutUsersInput | Prisma.recurring_transactionsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.recurring_transactionsCreateManyUsersInputEnvelope;
    set?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    disconnect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    delete?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    connect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    update?: Prisma.recurring_transactionsUpdateWithWhereUniqueWithoutUsersInput | Prisma.recurring_transactionsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.recurring_transactionsUpdateManyWithWhereWithoutUsersInput | Prisma.recurring_transactionsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.recurring_transactionsScalarWhereInput | Prisma.recurring_transactionsScalarWhereInput[];
};
export type recurring_transactionsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput> | Prisma.recurring_transactionsCreateWithoutUsersInput[] | Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput | Prisma.recurring_transactionsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.recurring_transactionsUpsertWithWhereUniqueWithoutUsersInput | Prisma.recurring_transactionsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.recurring_transactionsCreateManyUsersInputEnvelope;
    set?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    disconnect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    delete?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    connect?: Prisma.recurring_transactionsWhereUniqueInput | Prisma.recurring_transactionsWhereUniqueInput[];
    update?: Prisma.recurring_transactionsUpdateWithWhereUniqueWithoutUsersInput | Prisma.recurring_transactionsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.recurring_transactionsUpdateManyWithWhereWithoutUsersInput | Prisma.recurring_transactionsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.recurring_transactionsScalarWhereInput | Prisma.recurring_transactionsScalarWhereInput[];
};
export type recurring_transactionsCreateWithoutUsersInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
};
export type recurring_transactionsUncheckedCreateWithoutUsersInput = {
    id?: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
};
export type recurring_transactionsCreateOrConnectWithoutUsersInput = {
    where: Prisma.recurring_transactionsWhereUniqueInput;
    create: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput>;
};
export type recurring_transactionsCreateManyUsersInputEnvelope = {
    data: Prisma.recurring_transactionsCreateManyUsersInput | Prisma.recurring_transactionsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type recurring_transactionsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.recurring_transactionsWhereUniqueInput;
    update: Prisma.XOR<Prisma.recurring_transactionsUpdateWithoutUsersInput, Prisma.recurring_transactionsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.recurring_transactionsCreateWithoutUsersInput, Prisma.recurring_transactionsUncheckedCreateWithoutUsersInput>;
};
export type recurring_transactionsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.recurring_transactionsWhereUniqueInput;
    data: Prisma.XOR<Prisma.recurring_transactionsUpdateWithoutUsersInput, Prisma.recurring_transactionsUncheckedUpdateWithoutUsersInput>;
};
export type recurring_transactionsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.recurring_transactionsScalarWhereInput;
    data: Prisma.XOR<Prisma.recurring_transactionsUpdateManyMutationInput, Prisma.recurring_transactionsUncheckedUpdateManyWithoutUsersInput>;
};
export type recurring_transactionsScalarWhereInput = {
    AND?: Prisma.recurring_transactionsScalarWhereInput | Prisma.recurring_transactionsScalarWhereInput[];
    OR?: Prisma.recurring_transactionsScalarWhereInput[];
    NOT?: Prisma.recurring_transactionsScalarWhereInput | Prisma.recurring_transactionsScalarWhereInput[];
    id?: Prisma.IntFilter<"recurring_transactions"> | number;
    user_id?: Prisma.IntFilter<"recurring_transactions"> | number;
    description?: Prisma.StringFilter<"recurring_transactions"> | string;
    amount?: Prisma.DecimalFilter<"recurring_transactions"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.StringNullableFilter<"recurring_transactions"> | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFilter<"recurring_transactions"> | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFilter<"recurring_transactions"> | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    next_due_date?: Prisma.DateTimeFilter<"recurring_transactions"> | Date | string;
    status?: Prisma.Enumrecurring_transactions_statusNullableFilter<"recurring_transactions"> | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_transactions"> | Date | string | null;
};
export type recurring_transactionsCreateManyUsersInput = {
    id?: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: string | null;
    type: $Enums.recurring_transactions_type;
    frequency: $Enums.recurring_transactions_frequency;
    start_date: Date | string;
    next_due_date: Date | string;
    status?: $Enums.recurring_transactions_status | null;
    created_at?: Date | string | null;
};
export type recurring_transactionsUpdateWithoutUsersInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.Enumrecurring_transactions_typeFieldUpdateOperationsInput | $Enums.recurring_transactions_type;
    frequency?: Prisma.Enumrecurring_transactions_frequencyFieldUpdateOperationsInput | $Enums.recurring_transactions_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_transactions_statusFieldUpdateOperationsInput | $Enums.recurring_transactions_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_transactionsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    description?: boolean;
    amount?: boolean;
    category?: boolean;
    type?: boolean;
    frequency?: boolean;
    start_date?: boolean;
    next_due_date?: boolean;
    status?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["recurring_transactions"]>;
export type recurring_transactionsSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    description?: boolean;
    amount?: boolean;
    category?: boolean;
    type?: boolean;
    frequency?: boolean;
    start_date?: boolean;
    next_due_date?: boolean;
    status?: boolean;
    created_at?: boolean;
};
export type recurring_transactionsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "description" | "amount" | "category" | "type" | "frequency" | "start_date" | "next_due_date" | "status" | "created_at", ExtArgs["result"]["recurring_transactions"]>;
export type recurring_transactionsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type $recurring_transactionsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "recurring_transactions";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        description: string;
        amount: runtime.Decimal;
        category: string | null;
        type: $Enums.recurring_transactions_type;
        frequency: $Enums.recurring_transactions_frequency;
        start_date: Date;
        next_due_date: Date;
        status: $Enums.recurring_transactions_status | null;
        created_at: Date | null;
    }, ExtArgs["result"]["recurring_transactions"]>;
    composites: {};
};
export type recurring_transactionsGetPayload<S extends boolean | null | undefined | recurring_transactionsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload, S>;
export type recurring_transactionsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<recurring_transactionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Recurring_transactionsCountAggregateInputType | true;
};
export interface recurring_transactionsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['recurring_transactions'];
        meta: {
            name: 'recurring_transactions';
        };
    };
    /**
     * Find zero or one Recurring_transactions that matches the filter.
     * @param {recurring_transactionsFindUniqueArgs} args - Arguments to find a Recurring_transactions
     * @example
     * // Get one Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends recurring_transactionsFindUniqueArgs>(args: Prisma.SelectSubset<T, recurring_transactionsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Recurring_transactions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {recurring_transactionsFindUniqueOrThrowArgs} args - Arguments to find a Recurring_transactions
     * @example
     * // Get one Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends recurring_transactionsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, recurring_transactionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsFindFirstArgs} args - Arguments to find a Recurring_transactions
     * @example
     * // Get one Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends recurring_transactionsFindFirstArgs>(args?: Prisma.SelectSubset<T, recurring_transactionsFindFirstArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_transactions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsFindFirstOrThrowArgs} args - Arguments to find a Recurring_transactions
     * @example
     * // Get one Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends recurring_transactionsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, recurring_transactionsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Recurring_transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findMany()
     *
     * // Get first 10 Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const recurring_transactionsWithIdOnly = await prisma.recurring_transactions.findMany({ select: { id: true } })
     *
     */
    findMany<T extends recurring_transactionsFindManyArgs>(args?: Prisma.SelectSubset<T, recurring_transactionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Recurring_transactions.
     * @param {recurring_transactionsCreateArgs} args - Arguments to create a Recurring_transactions.
     * @example
     * // Create one Recurring_transactions
     * const Recurring_transactions = await prisma.recurring_transactions.create({
     *   data: {
     *     // ... data to create a Recurring_transactions
     *   }
     * })
     *
     */
    create<T extends recurring_transactionsCreateArgs>(args: Prisma.SelectSubset<T, recurring_transactionsCreateArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Recurring_transactions.
     * @param {recurring_transactionsCreateManyArgs} args - Arguments to create many Recurring_transactions.
     * @example
     * // Create many Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends recurring_transactionsCreateManyArgs>(args?: Prisma.SelectSubset<T, recurring_transactionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Recurring_transactions.
     * @param {recurring_transactionsDeleteArgs} args - Arguments to delete one Recurring_transactions.
     * @example
     * // Delete one Recurring_transactions
     * const Recurring_transactions = await prisma.recurring_transactions.delete({
     *   where: {
     *     // ... filter to delete one Recurring_transactions
     *   }
     * })
     *
     */
    delete<T extends recurring_transactionsDeleteArgs>(args: Prisma.SelectSubset<T, recurring_transactionsDeleteArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Recurring_transactions.
     * @param {recurring_transactionsUpdateArgs} args - Arguments to update one Recurring_transactions.
     * @example
     * // Update one Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends recurring_transactionsUpdateArgs>(args: Prisma.SelectSubset<T, recurring_transactionsUpdateArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Recurring_transactions.
     * @param {recurring_transactionsDeleteManyArgs} args - Arguments to filter Recurring_transactions to delete.
     * @example
     * // Delete a few Recurring_transactions
     * const { count } = await prisma.recurring_transactions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends recurring_transactionsDeleteManyArgs>(args?: Prisma.SelectSubset<T, recurring_transactionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Recurring_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends recurring_transactionsUpdateManyArgs>(args: Prisma.SelectSubset<T, recurring_transactionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Recurring_transactions.
     * @param {recurring_transactionsUpsertArgs} args - Arguments to update or create a Recurring_transactions.
     * @example
     * // Update or create a Recurring_transactions
     * const recurring_transactions = await prisma.recurring_transactions.upsert({
     *   create: {
     *     // ... data to create a Recurring_transactions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recurring_transactions we want to update
     *   }
     * })
     */
    upsert<T extends recurring_transactionsUpsertArgs>(args: Prisma.SelectSubset<T, recurring_transactionsUpsertArgs<ExtArgs>>): Prisma.Prisma__recurring_transactionsClient<runtime.Types.Result.GetResult<Prisma.$recurring_transactionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Recurring_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsCountArgs} args - Arguments to filter Recurring_transactions to count.
     * @example
     * // Count the number of Recurring_transactions
     * const count = await prisma.recurring_transactions.count({
     *   where: {
     *     // ... the filter for the Recurring_transactions we want to count
     *   }
     * })
    **/
    count<T extends recurring_transactionsCountArgs>(args?: Prisma.Subset<T, recurring_transactionsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Recurring_transactionsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Recurring_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Recurring_transactionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Recurring_transactionsAggregateArgs>(args: Prisma.Subset<T, Recurring_transactionsAggregateArgs>): Prisma.PrismaPromise<GetRecurring_transactionsAggregateType<T>>;
    /**
     * Group by Recurring_transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_transactionsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends recurring_transactionsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: recurring_transactionsGroupByArgs['orderBy'];
    } : {
        orderBy?: recurring_transactionsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, recurring_transactionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecurring_transactionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the recurring_transactions model
     */
    readonly fields: recurring_transactionsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for recurring_transactions.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__recurring_transactionsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the recurring_transactions model
 */
export interface recurring_transactionsFieldRefs {
    readonly id: Prisma.FieldRef<"recurring_transactions", 'Int'>;
    readonly user_id: Prisma.FieldRef<"recurring_transactions", 'Int'>;
    readonly description: Prisma.FieldRef<"recurring_transactions", 'String'>;
    readonly amount: Prisma.FieldRef<"recurring_transactions", 'Decimal'>;
    readonly category: Prisma.FieldRef<"recurring_transactions", 'String'>;
    readonly type: Prisma.FieldRef<"recurring_transactions", 'recurring_transactions_type'>;
    readonly frequency: Prisma.FieldRef<"recurring_transactions", 'recurring_transactions_frequency'>;
    readonly start_date: Prisma.FieldRef<"recurring_transactions", 'DateTime'>;
    readonly next_due_date: Prisma.FieldRef<"recurring_transactions", 'DateTime'>;
    readonly status: Prisma.FieldRef<"recurring_transactions", 'recurring_transactions_status'>;
    readonly created_at: Prisma.FieldRef<"recurring_transactions", 'DateTime'>;
}
/**
 * recurring_transactions findUnique
 */
export type recurring_transactionsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_transactions to fetch.
     */
    where: Prisma.recurring_transactionsWhereUniqueInput;
};
/**
 * recurring_transactions findUniqueOrThrow
 */
export type recurring_transactionsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_transactions to fetch.
     */
    where: Prisma.recurring_transactionsWhereUniqueInput;
};
/**
 * recurring_transactions findFirst
 */
export type recurring_transactionsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_transactions to fetch.
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_transactions to fetch.
     */
    orderBy?: Prisma.recurring_transactionsOrderByWithRelationInput | Prisma.recurring_transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_transactions.
     */
    cursor?: Prisma.recurring_transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_transactions.
     */
    distinct?: Prisma.Recurring_transactionsScalarFieldEnum | Prisma.Recurring_transactionsScalarFieldEnum[];
};
/**
 * recurring_transactions findFirstOrThrow
 */
export type recurring_transactionsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_transactions to fetch.
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_transactions to fetch.
     */
    orderBy?: Prisma.recurring_transactionsOrderByWithRelationInput | Prisma.recurring_transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_transactions.
     */
    cursor?: Prisma.recurring_transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_transactions.
     */
    distinct?: Prisma.Recurring_transactionsScalarFieldEnum | Prisma.Recurring_transactionsScalarFieldEnum[];
};
/**
 * recurring_transactions findMany
 */
export type recurring_transactionsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_transactions to fetch.
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_transactions to fetch.
     */
    orderBy?: Prisma.recurring_transactionsOrderByWithRelationInput | Prisma.recurring_transactionsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing recurring_transactions.
     */
    cursor?: Prisma.recurring_transactionsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_transactions.
     */
    skip?: number;
    distinct?: Prisma.Recurring_transactionsScalarFieldEnum | Prisma.Recurring_transactionsScalarFieldEnum[];
};
/**
 * recurring_transactions create
 */
export type recurring_transactionsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a recurring_transactions.
     */
    data: Prisma.XOR<Prisma.recurring_transactionsCreateInput, Prisma.recurring_transactionsUncheckedCreateInput>;
};
/**
 * recurring_transactions createMany
 */
export type recurring_transactionsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many recurring_transactions.
     */
    data: Prisma.recurring_transactionsCreateManyInput | Prisma.recurring_transactionsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * recurring_transactions update
 */
export type recurring_transactionsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a recurring_transactions.
     */
    data: Prisma.XOR<Prisma.recurring_transactionsUpdateInput, Prisma.recurring_transactionsUncheckedUpdateInput>;
    /**
     * Choose, which recurring_transactions to update.
     */
    where: Prisma.recurring_transactionsWhereUniqueInput;
};
/**
 * recurring_transactions updateMany
 */
export type recurring_transactionsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update recurring_transactions.
     */
    data: Prisma.XOR<Prisma.recurring_transactionsUpdateManyMutationInput, Prisma.recurring_transactionsUncheckedUpdateManyInput>;
    /**
     * Filter which recurring_transactions to update
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * Limit how many recurring_transactions to update.
     */
    limit?: number;
};
/**
 * recurring_transactions upsert
 */
export type recurring_transactionsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the recurring_transactions to update in case it exists.
     */
    where: Prisma.recurring_transactionsWhereUniqueInput;
    /**
     * In case the recurring_transactions found by the `where` argument doesn't exist, create a new recurring_transactions with this data.
     */
    create: Prisma.XOR<Prisma.recurring_transactionsCreateInput, Prisma.recurring_transactionsUncheckedCreateInput>;
    /**
     * In case the recurring_transactions was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.recurring_transactionsUpdateInput, Prisma.recurring_transactionsUncheckedUpdateInput>;
};
/**
 * recurring_transactions delete
 */
export type recurring_transactionsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which recurring_transactions to delete.
     */
    where: Prisma.recurring_transactionsWhereUniqueInput;
};
/**
 * recurring_transactions deleteMany
 */
export type recurring_transactionsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_transactions to delete
     */
    where?: Prisma.recurring_transactionsWhereInput;
    /**
     * Limit how many recurring_transactions to delete.
     */
    limit?: number;
};
/**
 * recurring_transactions without action
 */
export type recurring_transactionsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=recurring_transactions.d.ts.map