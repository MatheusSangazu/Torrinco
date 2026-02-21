import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model financial_entities
 *
 */
export type financial_entitiesModel = runtime.Types.Result.DefaultSelection<Prisma.$financial_entitiesPayload>;
export type AggregateFinancial_entities = {
    _count: Financial_entitiesCountAggregateOutputType | null;
    _avg: Financial_entitiesAvgAggregateOutputType | null;
    _sum: Financial_entitiesSumAggregateOutputType | null;
    _min: Financial_entitiesMinAggregateOutputType | null;
    _max: Financial_entitiesMaxAggregateOutputType | null;
};
export type Financial_entitiesAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    balance: runtime.Decimal | null;
    credit_limit: runtime.Decimal | null;
    closing_day: number | null;
    due_day: number | null;
};
export type Financial_entitiesSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    balance: runtime.Decimal | null;
    credit_limit: runtime.Decimal | null;
    closing_day: number | null;
    due_day: number | null;
};
export type Financial_entitiesMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    name: string | null;
    type: $Enums.financial_entities_type | null;
    balance: runtime.Decimal | null;
    credit_limit: runtime.Decimal | null;
    closing_day: number | null;
    due_day: number | null;
    color: string | null;
    created_at: Date | null;
};
export type Financial_entitiesMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    name: string | null;
    type: $Enums.financial_entities_type | null;
    balance: runtime.Decimal | null;
    credit_limit: runtime.Decimal | null;
    closing_day: number | null;
    due_day: number | null;
    color: string | null;
    created_at: Date | null;
};
export type Financial_entitiesCountAggregateOutputType = {
    id: number;
    user_id: number;
    name: number;
    type: number;
    balance: number;
    credit_limit: number;
    closing_day: number;
    due_day: number;
    color: number;
    created_at: number;
    _all: number;
};
export type Financial_entitiesAvgAggregateInputType = {
    id?: true;
    user_id?: true;
    balance?: true;
    credit_limit?: true;
    closing_day?: true;
    due_day?: true;
};
export type Financial_entitiesSumAggregateInputType = {
    id?: true;
    user_id?: true;
    balance?: true;
    credit_limit?: true;
    closing_day?: true;
    due_day?: true;
};
export type Financial_entitiesMinAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    type?: true;
    balance?: true;
    credit_limit?: true;
    closing_day?: true;
    due_day?: true;
    color?: true;
    created_at?: true;
};
export type Financial_entitiesMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    type?: true;
    balance?: true;
    credit_limit?: true;
    closing_day?: true;
    due_day?: true;
    color?: true;
    created_at?: true;
};
export type Financial_entitiesCountAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    type?: true;
    balance?: true;
    credit_limit?: true;
    closing_day?: true;
    due_day?: true;
    color?: true;
    created_at?: true;
    _all?: true;
};
export type Financial_entitiesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which financial_entities to aggregate.
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of financial_entities to fetch.
     */
    orderBy?: Prisma.financial_entitiesOrderByWithRelationInput | Prisma.financial_entitiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.financial_entitiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` financial_entities from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` financial_entities.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned financial_entities
    **/
    _count?: true | Financial_entitiesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Financial_entitiesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Financial_entitiesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Financial_entitiesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Financial_entitiesMaxAggregateInputType;
};
export type GetFinancial_entitiesAggregateType<T extends Financial_entitiesAggregateArgs> = {
    [P in keyof T & keyof AggregateFinancial_entities]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFinancial_entities[P]> : Prisma.GetScalarType<T[P], AggregateFinancial_entities[P]>;
};
export type financial_entitiesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.financial_entitiesWhereInput;
    orderBy?: Prisma.financial_entitiesOrderByWithAggregationInput | Prisma.financial_entitiesOrderByWithAggregationInput[];
    by: Prisma.Financial_entitiesScalarFieldEnum[] | Prisma.Financial_entitiesScalarFieldEnum;
    having?: Prisma.financial_entitiesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Financial_entitiesCountAggregateInputType | true;
    _avg?: Financial_entitiesAvgAggregateInputType;
    _sum?: Financial_entitiesSumAggregateInputType;
    _min?: Financial_entitiesMinAggregateInputType;
    _max?: Financial_entitiesMaxAggregateInputType;
};
export type Financial_entitiesGroupByOutputType = {
    id: number;
    user_id: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance: runtime.Decimal | null;
    credit_limit: runtime.Decimal | null;
    closing_day: number | null;
    due_day: number | null;
    color: string | null;
    created_at: Date | null;
    _count: Financial_entitiesCountAggregateOutputType | null;
    _avg: Financial_entitiesAvgAggregateOutputType | null;
    _sum: Financial_entitiesSumAggregateOutputType | null;
    _min: Financial_entitiesMinAggregateOutputType | null;
    _max: Financial_entitiesMaxAggregateOutputType | null;
};
type GetFinancial_entitiesGroupByPayload<T extends financial_entitiesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Financial_entitiesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Financial_entitiesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Financial_entitiesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Financial_entitiesGroupByOutputType[P]>;
}>>;
export type financial_entitiesWhereInput = {
    AND?: Prisma.financial_entitiesWhereInput | Prisma.financial_entitiesWhereInput[];
    OR?: Prisma.financial_entitiesWhereInput[];
    NOT?: Prisma.financial_entitiesWhereInput | Prisma.financial_entitiesWhereInput[];
    id?: Prisma.IntFilter<"financial_entities"> | number;
    user_id?: Prisma.IntFilter<"financial_entities"> | number;
    name?: Prisma.StringFilter<"financial_entities"> | string;
    type?: Prisma.Enumfinancial_entities_typeFilter<"financial_entities"> | $Enums.financial_entities_type;
    balance?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    due_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    color?: Prisma.StringNullableFilter<"financial_entities"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"financial_entities"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
    purchase_installments?: Prisma.Purchase_installmentsListRelationFilter;
};
export type financial_entitiesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    balance?: Prisma.SortOrderInput | Prisma.SortOrder;
    credit_limit?: Prisma.SortOrderInput | Prisma.SortOrder;
    closing_day?: Prisma.SortOrderInput | Prisma.SortOrder;
    due_day?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    transactions?: Prisma.transactionsOrderByRelationAggregateInput;
    purchase_installments?: Prisma.purchase_installmentsOrderByRelationAggregateInput;
    _relevance?: Prisma.financial_entitiesOrderByRelevanceInput;
};
export type financial_entitiesWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.financial_entitiesWhereInput | Prisma.financial_entitiesWhereInput[];
    OR?: Prisma.financial_entitiesWhereInput[];
    NOT?: Prisma.financial_entitiesWhereInput | Prisma.financial_entitiesWhereInput[];
    user_id?: Prisma.IntFilter<"financial_entities"> | number;
    name?: Prisma.StringFilter<"financial_entities"> | string;
    type?: Prisma.Enumfinancial_entities_typeFilter<"financial_entities"> | $Enums.financial_entities_type;
    balance?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    due_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    color?: Prisma.StringNullableFilter<"financial_entities"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"financial_entities"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
    purchase_installments?: Prisma.Purchase_installmentsListRelationFilter;
}, "id">;
export type financial_entitiesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    balance?: Prisma.SortOrderInput | Prisma.SortOrder;
    credit_limit?: Prisma.SortOrderInput | Prisma.SortOrder;
    closing_day?: Prisma.SortOrderInput | Prisma.SortOrder;
    due_day?: Prisma.SortOrderInput | Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.financial_entitiesCountOrderByAggregateInput;
    _avg?: Prisma.financial_entitiesAvgOrderByAggregateInput;
    _max?: Prisma.financial_entitiesMaxOrderByAggregateInput;
    _min?: Prisma.financial_entitiesMinOrderByAggregateInput;
    _sum?: Prisma.financial_entitiesSumOrderByAggregateInput;
};
export type financial_entitiesScalarWhereWithAggregatesInput = {
    AND?: Prisma.financial_entitiesScalarWhereWithAggregatesInput | Prisma.financial_entitiesScalarWhereWithAggregatesInput[];
    OR?: Prisma.financial_entitiesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.financial_entitiesScalarWhereWithAggregatesInput | Prisma.financial_entitiesScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"financial_entities"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"financial_entities"> | number;
    name?: Prisma.StringWithAggregatesFilter<"financial_entities"> | string;
    type?: Prisma.Enumfinancial_entities_typeWithAggregatesFilter<"financial_entities"> | $Enums.financial_entities_type;
    balance?: Prisma.DecimalNullableWithAggregatesFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.DecimalNullableWithAggregatesFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.IntNullableWithAggregatesFilter<"financial_entities"> | number | null;
    due_day?: Prisma.IntNullableWithAggregatesFilter<"financial_entities"> | number | null;
    color?: Prisma.StringNullableWithAggregatesFilter<"financial_entities"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"financial_entities"> | Date | string | null;
};
export type financial_entitiesCreateInput = {
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutFinancial_entitiesInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutFinancial_entitiesInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesUncheckedCreateInput = {
    id?: number;
    user_id: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutFinancial_entitiesNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutFinancial_entitiesNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesCreateManyInput = {
    id?: number;
    user_id: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
};
export type financial_entitiesUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type financial_entitiesUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type financial_entitiesOrderByRelevanceInput = {
    fields: Prisma.financial_entitiesOrderByRelevanceFieldEnum | Prisma.financial_entitiesOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type financial_entitiesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    credit_limit?: Prisma.SortOrder;
    closing_day?: Prisma.SortOrder;
    due_day?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type financial_entitiesAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    credit_limit?: Prisma.SortOrder;
    closing_day?: Prisma.SortOrder;
    due_day?: Prisma.SortOrder;
};
export type financial_entitiesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    credit_limit?: Prisma.SortOrder;
    closing_day?: Prisma.SortOrder;
    due_day?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type financial_entitiesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    credit_limit?: Prisma.SortOrder;
    closing_day?: Prisma.SortOrder;
    due_day?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type financial_entitiesSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    balance?: Prisma.SortOrder;
    credit_limit?: Prisma.SortOrder;
    closing_day?: Prisma.SortOrder;
    due_day?: Prisma.SortOrder;
};
export type Financial_entitiesScalarRelationFilter = {
    is?: Prisma.financial_entitiesWhereInput;
    isNot?: Prisma.financial_entitiesWhereInput;
};
export type Financial_entitiesNullableScalarRelationFilter = {
    is?: Prisma.financial_entitiesWhereInput | null;
    isNot?: Prisma.financial_entitiesWhereInput | null;
};
export type Financial_entitiesListRelationFilter = {
    every?: Prisma.financial_entitiesWhereInput;
    some?: Prisma.financial_entitiesWhereInput;
    none?: Prisma.financial_entitiesWhereInput;
};
export type financial_entitiesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Enumfinancial_entities_typeFieldUpdateOperationsInput = {
    set?: $Enums.financial_entities_type;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type financial_entitiesCreateNestedOneWithoutPurchase_installmentsInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedCreateWithoutPurchase_installmentsInput>;
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutPurchase_installmentsInput;
    connect?: Prisma.financial_entitiesWhereUniqueInput;
};
export type financial_entitiesUpdateOneRequiredWithoutPurchase_installmentsNestedInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedCreateWithoutPurchase_installmentsInput>;
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutPurchase_installmentsInput;
    upsert?: Prisma.financial_entitiesUpsertWithoutPurchase_installmentsInput;
    connect?: Prisma.financial_entitiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.financial_entitiesUpdateToOneWithWhereWithoutPurchase_installmentsInput, Prisma.financial_entitiesUpdateWithoutPurchase_installmentsInput>, Prisma.financial_entitiesUncheckedUpdateWithoutPurchase_installmentsInput>;
};
export type financial_entitiesCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.financial_entitiesWhereUniqueInput;
};
export type financial_entitiesUpdateOneWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.financial_entitiesUpsertWithoutTransactionsInput;
    disconnect?: Prisma.financial_entitiesWhereInput | boolean;
    delete?: Prisma.financial_entitiesWhereInput | boolean;
    connect?: Prisma.financial_entitiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.financial_entitiesUpdateToOneWithWhereWithoutTransactionsInput, Prisma.financial_entitiesUpdateWithoutTransactionsInput>, Prisma.financial_entitiesUncheckedUpdateWithoutTransactionsInput>;
};
export type financial_entitiesCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput> | Prisma.financial_entitiesCreateWithoutUsersInput[] | Prisma.financial_entitiesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutUsersInput | Prisma.financial_entitiesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.financial_entitiesCreateManyUsersInputEnvelope;
    connect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
};
export type financial_entitiesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput> | Prisma.financial_entitiesCreateWithoutUsersInput[] | Prisma.financial_entitiesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutUsersInput | Prisma.financial_entitiesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.financial_entitiesCreateManyUsersInputEnvelope;
    connect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
};
export type financial_entitiesUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput> | Prisma.financial_entitiesCreateWithoutUsersInput[] | Prisma.financial_entitiesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutUsersInput | Prisma.financial_entitiesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.financial_entitiesUpsertWithWhereUniqueWithoutUsersInput | Prisma.financial_entitiesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.financial_entitiesCreateManyUsersInputEnvelope;
    set?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    disconnect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    delete?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    connect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    update?: Prisma.financial_entitiesUpdateWithWhereUniqueWithoutUsersInput | Prisma.financial_entitiesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.financial_entitiesUpdateManyWithWhereWithoutUsersInput | Prisma.financial_entitiesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.financial_entitiesScalarWhereInput | Prisma.financial_entitiesScalarWhereInput[];
};
export type financial_entitiesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput> | Prisma.financial_entitiesCreateWithoutUsersInput[] | Prisma.financial_entitiesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.financial_entitiesCreateOrConnectWithoutUsersInput | Prisma.financial_entitiesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.financial_entitiesUpsertWithWhereUniqueWithoutUsersInput | Prisma.financial_entitiesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.financial_entitiesCreateManyUsersInputEnvelope;
    set?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    disconnect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    delete?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    connect?: Prisma.financial_entitiesWhereUniqueInput | Prisma.financial_entitiesWhereUniqueInput[];
    update?: Prisma.financial_entitiesUpdateWithWhereUniqueWithoutUsersInput | Prisma.financial_entitiesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.financial_entitiesUpdateManyWithWhereWithoutUsersInput | Prisma.financial_entitiesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.financial_entitiesScalarWhereInput | Prisma.financial_entitiesScalarWhereInput[];
};
export type financial_entitiesCreateWithoutPurchase_installmentsInput = {
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutFinancial_entitiesInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesUncheckedCreateWithoutPurchase_installmentsInput = {
    id?: number;
    user_id: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesCreateOrConnectWithoutPurchase_installmentsInput = {
    where: Prisma.financial_entitiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedCreateWithoutPurchase_installmentsInput>;
};
export type financial_entitiesUpsertWithoutPurchase_installmentsInput = {
    update: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedUpdateWithoutPurchase_installmentsInput>;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedCreateWithoutPurchase_installmentsInput>;
    where?: Prisma.financial_entitiesWhereInput;
};
export type financial_entitiesUpdateToOneWithWhereWithoutPurchase_installmentsInput = {
    where?: Prisma.financial_entitiesWhereInput;
    data: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutPurchase_installmentsInput, Prisma.financial_entitiesUncheckedUpdateWithoutPurchase_installmentsInput>;
};
export type financial_entitiesUpdateWithoutPurchase_installmentsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutFinancial_entitiesNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesUncheckedUpdateWithoutPurchase_installmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesCreateWithoutTransactionsInput = {
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutFinancial_entitiesInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesUncheckedCreateWithoutTransactionsInput = {
    id?: number;
    user_id: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.financial_entitiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedCreateWithoutTransactionsInput>;
};
export type financial_entitiesUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.financial_entitiesWhereInput;
};
export type financial_entitiesUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.financial_entitiesWhereInput;
    data: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutTransactionsInput, Prisma.financial_entitiesUncheckedUpdateWithoutTransactionsInput>;
};
export type financial_entitiesUpdateWithoutTransactionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutFinancial_entitiesNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesCreateWithoutUsersInput = {
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsCreateNestedManyWithoutFinancial_entitiesInput;
    purchase_installments?: Prisma.purchase_installmentsCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesUncheckedCreateWithoutUsersInput = {
    id?: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedCreateNestedManyWithoutFinancial_entitiesInput;
};
export type financial_entitiesCreateOrConnectWithoutUsersInput = {
    where: Prisma.financial_entitiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput>;
};
export type financial_entitiesCreateManyUsersInputEnvelope = {
    data: Prisma.financial_entitiesCreateManyUsersInput | Prisma.financial_entitiesCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type financial_entitiesUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.financial_entitiesWhereUniqueInput;
    update: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutUsersInput, Prisma.financial_entitiesUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.financial_entitiesCreateWithoutUsersInput, Prisma.financial_entitiesUncheckedCreateWithoutUsersInput>;
};
export type financial_entitiesUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.financial_entitiesWhereUniqueInput;
    data: Prisma.XOR<Prisma.financial_entitiesUpdateWithoutUsersInput, Prisma.financial_entitiesUncheckedUpdateWithoutUsersInput>;
};
export type financial_entitiesUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.financial_entitiesScalarWhereInput;
    data: Prisma.XOR<Prisma.financial_entitiesUpdateManyMutationInput, Prisma.financial_entitiesUncheckedUpdateManyWithoutUsersInput>;
};
export type financial_entitiesScalarWhereInput = {
    AND?: Prisma.financial_entitiesScalarWhereInput | Prisma.financial_entitiesScalarWhereInput[];
    OR?: Prisma.financial_entitiesScalarWhereInput[];
    NOT?: Prisma.financial_entitiesScalarWhereInput | Prisma.financial_entitiesScalarWhereInput[];
    id?: Prisma.IntFilter<"financial_entities"> | number;
    user_id?: Prisma.IntFilter<"financial_entities"> | number;
    name?: Prisma.StringFilter<"financial_entities"> | string;
    type?: Prisma.Enumfinancial_entities_typeFilter<"financial_entities"> | $Enums.financial_entities_type;
    balance?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.DecimalNullableFilter<"financial_entities"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    due_day?: Prisma.IntNullableFilter<"financial_entities"> | number | null;
    color?: Prisma.StringNullableFilter<"financial_entities"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"financial_entities"> | Date | string | null;
};
export type financial_entitiesCreateManyUsersInput = {
    id?: number;
    name: string;
    type: $Enums.financial_entities_type;
    balance?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: number | null;
    due_day?: number | null;
    color?: string | null;
    created_at?: Date | string | null;
};
export type financial_entitiesUpdateWithoutUsersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUpdateManyWithoutFinancial_entitiesNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
    purchase_installments?: Prisma.purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput;
};
export type financial_entitiesUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.Enumfinancial_entities_typeFieldUpdateOperationsInput | $Enums.financial_entities_type;
    balance?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    credit_limit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    closing_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    due_day?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type Financial_entitiesCountOutputType
 */
export type Financial_entitiesCountOutputType = {
    transactions: number;
    purchase_installments: number;
};
export type Financial_entitiesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | Financial_entitiesCountOutputTypeCountTransactionsArgs;
    purchase_installments?: boolean | Financial_entitiesCountOutputTypeCountPurchase_installmentsArgs;
};
/**
 * Financial_entitiesCountOutputType without action
 */
export type Financial_entitiesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Financial_entitiesCountOutputType
     */
    select?: Prisma.Financial_entitiesCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Financial_entitiesCountOutputType without action
 */
export type Financial_entitiesCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transactionsWhereInput;
};
/**
 * Financial_entitiesCountOutputType without action
 */
export type Financial_entitiesCountOutputTypeCountPurchase_installmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.purchase_installmentsWhereInput;
};
export type financial_entitiesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    name?: boolean;
    type?: boolean;
    balance?: boolean;
    credit_limit?: boolean;
    closing_day?: boolean;
    due_day?: boolean;
    color?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.financial_entities$transactionsArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.financial_entities$purchase_installmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.Financial_entitiesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["financial_entities"]>;
export type financial_entitiesSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    name?: boolean;
    type?: boolean;
    balance?: boolean;
    credit_limit?: boolean;
    closing_day?: boolean;
    due_day?: boolean;
    color?: boolean;
    created_at?: boolean;
};
export type financial_entitiesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "name" | "type" | "balance" | "credit_limit" | "closing_day" | "due_day" | "color" | "created_at", ExtArgs["result"]["financial_entities"]>;
export type financial_entitiesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.financial_entities$transactionsArgs<ExtArgs>;
    purchase_installments?: boolean | Prisma.financial_entities$purchase_installmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.Financial_entitiesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $financial_entitiesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "financial_entities";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
        transactions: Prisma.$transactionsPayload<ExtArgs>[];
        purchase_installments: Prisma.$purchase_installmentsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        name: string;
        type: $Enums.financial_entities_type;
        balance: runtime.Decimal | null;
        credit_limit: runtime.Decimal | null;
        closing_day: number | null;
        due_day: number | null;
        color: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["financial_entities"]>;
    composites: {};
};
export type financial_entitiesGetPayload<S extends boolean | null | undefined | financial_entitiesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload, S>;
export type financial_entitiesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<financial_entitiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Financial_entitiesCountAggregateInputType | true;
};
export interface financial_entitiesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['financial_entities'];
        meta: {
            name: 'financial_entities';
        };
    };
    /**
     * Find zero or one Financial_entities that matches the filter.
     * @param {financial_entitiesFindUniqueArgs} args - Arguments to find a Financial_entities
     * @example
     * // Get one Financial_entities
     * const financial_entities = await prisma.financial_entities.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends financial_entitiesFindUniqueArgs>(args: Prisma.SelectSubset<T, financial_entitiesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Financial_entities that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {financial_entitiesFindUniqueOrThrowArgs} args - Arguments to find a Financial_entities
     * @example
     * // Get one Financial_entities
     * const financial_entities = await prisma.financial_entities.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends financial_entitiesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, financial_entitiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Financial_entities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesFindFirstArgs} args - Arguments to find a Financial_entities
     * @example
     * // Get one Financial_entities
     * const financial_entities = await prisma.financial_entities.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends financial_entitiesFindFirstArgs>(args?: Prisma.SelectSubset<T, financial_entitiesFindFirstArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Financial_entities that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesFindFirstOrThrowArgs} args - Arguments to find a Financial_entities
     * @example
     * // Get one Financial_entities
     * const financial_entities = await prisma.financial_entities.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends financial_entitiesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, financial_entitiesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Financial_entities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Financial_entities
     * const financial_entities = await prisma.financial_entities.findMany()
     *
     * // Get first 10 Financial_entities
     * const financial_entities = await prisma.financial_entities.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const financial_entitiesWithIdOnly = await prisma.financial_entities.findMany({ select: { id: true } })
     *
     */
    findMany<T extends financial_entitiesFindManyArgs>(args?: Prisma.SelectSubset<T, financial_entitiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Financial_entities.
     * @param {financial_entitiesCreateArgs} args - Arguments to create a Financial_entities.
     * @example
     * // Create one Financial_entities
     * const Financial_entities = await prisma.financial_entities.create({
     *   data: {
     *     // ... data to create a Financial_entities
     *   }
     * })
     *
     */
    create<T extends financial_entitiesCreateArgs>(args: Prisma.SelectSubset<T, financial_entitiesCreateArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Financial_entities.
     * @param {financial_entitiesCreateManyArgs} args - Arguments to create many Financial_entities.
     * @example
     * // Create many Financial_entities
     * const financial_entities = await prisma.financial_entities.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends financial_entitiesCreateManyArgs>(args?: Prisma.SelectSubset<T, financial_entitiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Financial_entities.
     * @param {financial_entitiesDeleteArgs} args - Arguments to delete one Financial_entities.
     * @example
     * // Delete one Financial_entities
     * const Financial_entities = await prisma.financial_entities.delete({
     *   where: {
     *     // ... filter to delete one Financial_entities
     *   }
     * })
     *
     */
    delete<T extends financial_entitiesDeleteArgs>(args: Prisma.SelectSubset<T, financial_entitiesDeleteArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Financial_entities.
     * @param {financial_entitiesUpdateArgs} args - Arguments to update one Financial_entities.
     * @example
     * // Update one Financial_entities
     * const financial_entities = await prisma.financial_entities.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends financial_entitiesUpdateArgs>(args: Prisma.SelectSubset<T, financial_entitiesUpdateArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Financial_entities.
     * @param {financial_entitiesDeleteManyArgs} args - Arguments to filter Financial_entities to delete.
     * @example
     * // Delete a few Financial_entities
     * const { count } = await prisma.financial_entities.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends financial_entitiesDeleteManyArgs>(args?: Prisma.SelectSubset<T, financial_entitiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Financial_entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Financial_entities
     * const financial_entities = await prisma.financial_entities.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends financial_entitiesUpdateManyArgs>(args: Prisma.SelectSubset<T, financial_entitiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Financial_entities.
     * @param {financial_entitiesUpsertArgs} args - Arguments to update or create a Financial_entities.
     * @example
     * // Update or create a Financial_entities
     * const financial_entities = await prisma.financial_entities.upsert({
     *   create: {
     *     // ... data to create a Financial_entities
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Financial_entities we want to update
     *   }
     * })
     */
    upsert<T extends financial_entitiesUpsertArgs>(args: Prisma.SelectSubset<T, financial_entitiesUpsertArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Financial_entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesCountArgs} args - Arguments to filter Financial_entities to count.
     * @example
     * // Count the number of Financial_entities
     * const count = await prisma.financial_entities.count({
     *   where: {
     *     // ... the filter for the Financial_entities we want to count
     *   }
     * })
    **/
    count<T extends financial_entitiesCountArgs>(args?: Prisma.Subset<T, financial_entitiesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Financial_entitiesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Financial_entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Financial_entitiesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Financial_entitiesAggregateArgs>(args: Prisma.Subset<T, Financial_entitiesAggregateArgs>): Prisma.PrismaPromise<GetFinancial_entitiesAggregateType<T>>;
    /**
     * Group by Financial_entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {financial_entitiesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends financial_entitiesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: financial_entitiesGroupByArgs['orderBy'];
    } : {
        orderBy?: financial_entitiesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, financial_entitiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFinancial_entitiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the financial_entities model
     */
    readonly fields: financial_entitiesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for financial_entities.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__financial_entitiesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transactions<T extends Prisma.financial_entities$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.financial_entities$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    purchase_installments<T extends Prisma.financial_entities$purchase_installmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.financial_entities$purchase_installmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the financial_entities model
 */
export interface financial_entitiesFieldRefs {
    readonly id: Prisma.FieldRef<"financial_entities", 'Int'>;
    readonly user_id: Prisma.FieldRef<"financial_entities", 'Int'>;
    readonly name: Prisma.FieldRef<"financial_entities", 'String'>;
    readonly type: Prisma.FieldRef<"financial_entities", 'financial_entities_type'>;
    readonly balance: Prisma.FieldRef<"financial_entities", 'Decimal'>;
    readonly credit_limit: Prisma.FieldRef<"financial_entities", 'Decimal'>;
    readonly closing_day: Prisma.FieldRef<"financial_entities", 'Int'>;
    readonly due_day: Prisma.FieldRef<"financial_entities", 'Int'>;
    readonly color: Prisma.FieldRef<"financial_entities", 'String'>;
    readonly created_at: Prisma.FieldRef<"financial_entities", 'DateTime'>;
}
/**
 * financial_entities findUnique
 */
export type financial_entitiesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which financial_entities to fetch.
     */
    where: Prisma.financial_entitiesWhereUniqueInput;
};
/**
 * financial_entities findUniqueOrThrow
 */
export type financial_entitiesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which financial_entities to fetch.
     */
    where: Prisma.financial_entitiesWhereUniqueInput;
};
/**
 * financial_entities findFirst
 */
export type financial_entitiesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which financial_entities to fetch.
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of financial_entities to fetch.
     */
    orderBy?: Prisma.financial_entitiesOrderByWithRelationInput | Prisma.financial_entitiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for financial_entities.
     */
    cursor?: Prisma.financial_entitiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` financial_entities from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` financial_entities.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of financial_entities.
     */
    distinct?: Prisma.Financial_entitiesScalarFieldEnum | Prisma.Financial_entitiesScalarFieldEnum[];
};
/**
 * financial_entities findFirstOrThrow
 */
export type financial_entitiesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which financial_entities to fetch.
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of financial_entities to fetch.
     */
    orderBy?: Prisma.financial_entitiesOrderByWithRelationInput | Prisma.financial_entitiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for financial_entities.
     */
    cursor?: Prisma.financial_entitiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` financial_entities from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` financial_entities.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of financial_entities.
     */
    distinct?: Prisma.Financial_entitiesScalarFieldEnum | Prisma.Financial_entitiesScalarFieldEnum[];
};
/**
 * financial_entities findMany
 */
export type financial_entitiesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which financial_entities to fetch.
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of financial_entities to fetch.
     */
    orderBy?: Prisma.financial_entitiesOrderByWithRelationInput | Prisma.financial_entitiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing financial_entities.
     */
    cursor?: Prisma.financial_entitiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` financial_entities from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` financial_entities.
     */
    skip?: number;
    distinct?: Prisma.Financial_entitiesScalarFieldEnum | Prisma.Financial_entitiesScalarFieldEnum[];
};
/**
 * financial_entities create
 */
export type financial_entitiesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a financial_entities.
     */
    data: Prisma.XOR<Prisma.financial_entitiesCreateInput, Prisma.financial_entitiesUncheckedCreateInput>;
};
/**
 * financial_entities createMany
 */
export type financial_entitiesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many financial_entities.
     */
    data: Prisma.financial_entitiesCreateManyInput | Prisma.financial_entitiesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * financial_entities update
 */
export type financial_entitiesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a financial_entities.
     */
    data: Prisma.XOR<Prisma.financial_entitiesUpdateInput, Prisma.financial_entitiesUncheckedUpdateInput>;
    /**
     * Choose, which financial_entities to update.
     */
    where: Prisma.financial_entitiesWhereUniqueInput;
};
/**
 * financial_entities updateMany
 */
export type financial_entitiesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update financial_entities.
     */
    data: Prisma.XOR<Prisma.financial_entitiesUpdateManyMutationInput, Prisma.financial_entitiesUncheckedUpdateManyInput>;
    /**
     * Filter which financial_entities to update
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * Limit how many financial_entities to update.
     */
    limit?: number;
};
/**
 * financial_entities upsert
 */
export type financial_entitiesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the financial_entities to update in case it exists.
     */
    where: Prisma.financial_entitiesWhereUniqueInput;
    /**
     * In case the financial_entities found by the `where` argument doesn't exist, create a new financial_entities with this data.
     */
    create: Prisma.XOR<Prisma.financial_entitiesCreateInput, Prisma.financial_entitiesUncheckedCreateInput>;
    /**
     * In case the financial_entities was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.financial_entitiesUpdateInput, Prisma.financial_entitiesUncheckedUpdateInput>;
};
/**
 * financial_entities delete
 */
export type financial_entitiesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which financial_entities to delete.
     */
    where: Prisma.financial_entitiesWhereUniqueInput;
};
/**
 * financial_entities deleteMany
 */
export type financial_entitiesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which financial_entities to delete
     */
    where?: Prisma.financial_entitiesWhereInput;
    /**
     * Limit how many financial_entities to delete.
     */
    limit?: number;
};
/**
 * financial_entities.transactions
 */
export type financial_entities$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * financial_entities.purchase_installments
 */
export type financial_entities$purchase_installmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * financial_entities without action
 */
export type financial_entitiesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=financial_entities.d.ts.map