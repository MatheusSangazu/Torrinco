import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model purchase_installments
 *
 */
export type purchase_installmentsModel = runtime.Types.Result.DefaultSelection<Prisma.$purchase_installmentsPayload>;
export type AggregatePurchase_installments = {
    _count: Purchase_installmentsCountAggregateOutputType | null;
    _avg: Purchase_installmentsAvgAggregateOutputType | null;
    _sum: Purchase_installmentsSumAggregateOutputType | null;
    _min: Purchase_installmentsMinAggregateOutputType | null;
    _max: Purchase_installmentsMaxAggregateOutputType | null;
};
export type Purchase_installmentsAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    installment_count: number | null;
    installment_value: runtime.Decimal | null;
    first_installment: number | null;
};
export type Purchase_installmentsSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    entity_id: number | null;
    amount: runtime.Decimal | null;
    installment_count: number | null;
    installment_value: runtime.Decimal | null;
    first_installment: number | null;
};
export type Purchase_installmentsMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    entity_id: number | null;
    description: string | null;
    amount: runtime.Decimal | null;
    installment_count: number | null;
    installment_value: runtime.Decimal | null;
    first_installment: number | null;
    start_date: Date | null;
    status: $Enums.purchase_installments_status | null;
    created_at: Date | null;
};
export type Purchase_installmentsMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    entity_id: number | null;
    description: string | null;
    amount: runtime.Decimal | null;
    installment_count: number | null;
    installment_value: runtime.Decimal | null;
    first_installment: number | null;
    start_date: Date | null;
    status: $Enums.purchase_installments_status | null;
    created_at: Date | null;
};
export type Purchase_installmentsCountAggregateOutputType = {
    id: number;
    user_id: number;
    entity_id: number;
    description: number;
    amount: number;
    installment_count: number;
    installment_value: number;
    first_installment: number;
    start_date: number;
    status: number;
    created_at: number;
    _all: number;
};
export type Purchase_installmentsAvgAggregateInputType = {
    id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    installment_count?: true;
    installment_value?: true;
    first_installment?: true;
};
export type Purchase_installmentsSumAggregateInputType = {
    id?: true;
    user_id?: true;
    entity_id?: true;
    amount?: true;
    installment_count?: true;
    installment_value?: true;
    first_installment?: true;
};
export type Purchase_installmentsMinAggregateInputType = {
    id?: true;
    user_id?: true;
    entity_id?: true;
    description?: true;
    amount?: true;
    installment_count?: true;
    installment_value?: true;
    first_installment?: true;
    start_date?: true;
    status?: true;
    created_at?: true;
};
export type Purchase_installmentsMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    entity_id?: true;
    description?: true;
    amount?: true;
    installment_count?: true;
    installment_value?: true;
    first_installment?: true;
    start_date?: true;
    status?: true;
    created_at?: true;
};
export type Purchase_installmentsCountAggregateInputType = {
    id?: true;
    user_id?: true;
    entity_id?: true;
    description?: true;
    amount?: true;
    installment_count?: true;
    installment_value?: true;
    first_installment?: true;
    start_date?: true;
    status?: true;
    created_at?: true;
    _all?: true;
};
export type Purchase_installmentsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which purchase_installments to aggregate.
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of purchase_installments to fetch.
     */
    orderBy?: Prisma.purchase_installmentsOrderByWithRelationInput | Prisma.purchase_installmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.purchase_installmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` purchase_installments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` purchase_installments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned purchase_installments
    **/
    _count?: true | Purchase_installmentsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Purchase_installmentsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Purchase_installmentsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Purchase_installmentsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Purchase_installmentsMaxAggregateInputType;
};
export type GetPurchase_installmentsAggregateType<T extends Purchase_installmentsAggregateArgs> = {
    [P in keyof T & keyof AggregatePurchase_installments]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePurchase_installments[P]> : Prisma.GetScalarType<T[P], AggregatePurchase_installments[P]>;
};
export type purchase_installmentsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.purchase_installmentsWhereInput;
    orderBy?: Prisma.purchase_installmentsOrderByWithAggregationInput | Prisma.purchase_installmentsOrderByWithAggregationInput[];
    by: Prisma.Purchase_installmentsScalarFieldEnum[] | Prisma.Purchase_installmentsScalarFieldEnum;
    having?: Prisma.purchase_installmentsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Purchase_installmentsCountAggregateInputType | true;
    _avg?: Purchase_installmentsAvgAggregateInputType;
    _sum?: Purchase_installmentsSumAggregateInputType;
    _min?: Purchase_installmentsMinAggregateInputType;
    _max?: Purchase_installmentsMaxAggregateInputType;
};
export type Purchase_installmentsGroupByOutputType = {
    id: number;
    user_id: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal;
    installment_count: number;
    installment_value: runtime.Decimal;
    first_installment: number;
    start_date: Date;
    status: $Enums.purchase_installments_status | null;
    created_at: Date | null;
    _count: Purchase_installmentsCountAggregateOutputType | null;
    _avg: Purchase_installmentsAvgAggregateOutputType | null;
    _sum: Purchase_installmentsSumAggregateOutputType | null;
    _min: Purchase_installmentsMinAggregateOutputType | null;
    _max: Purchase_installmentsMaxAggregateOutputType | null;
};
type GetPurchase_installmentsGroupByPayload<T extends purchase_installmentsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Purchase_installmentsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Purchase_installmentsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Purchase_installmentsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Purchase_installmentsGroupByOutputType[P]>;
}>>;
export type purchase_installmentsWhereInput = {
    AND?: Prisma.purchase_installmentsWhereInput | Prisma.purchase_installmentsWhereInput[];
    OR?: Prisma.purchase_installmentsWhereInput[];
    NOT?: Prisma.purchase_installmentsWhereInput | Prisma.purchase_installmentsWhereInput[];
    id?: Prisma.IntFilter<"purchase_installments"> | number;
    user_id?: Prisma.IntFilter<"purchase_installments"> | number;
    entity_id?: Prisma.IntFilter<"purchase_installments"> | number;
    description?: Prisma.StringFilter<"purchase_installments"> | string;
    amount?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFilter<"purchase_installments"> | number;
    installment_value?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFilter<"purchase_installments"> | number;
    start_date?: Prisma.DateTimeFilter<"purchase_installments"> | Date | string;
    status?: Prisma.Enumpurchase_installments_statusNullableFilter<"purchase_installments"> | $Enums.purchase_installments_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"purchase_installments"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    financial_entities?: Prisma.XOR<Prisma.Financial_entitiesScalarRelationFilter, Prisma.financial_entitiesWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
};
export type purchase_installmentsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    financial_entities?: Prisma.financial_entitiesOrderByWithRelationInput;
    transactions?: Prisma.transactionsOrderByRelationAggregateInput;
    _relevance?: Prisma.purchase_installmentsOrderByRelevanceInput;
};
export type purchase_installmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.purchase_installmentsWhereInput | Prisma.purchase_installmentsWhereInput[];
    OR?: Prisma.purchase_installmentsWhereInput[];
    NOT?: Prisma.purchase_installmentsWhereInput | Prisma.purchase_installmentsWhereInput[];
    user_id?: Prisma.IntFilter<"purchase_installments"> | number;
    entity_id?: Prisma.IntFilter<"purchase_installments"> | number;
    description?: Prisma.StringFilter<"purchase_installments"> | string;
    amount?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFilter<"purchase_installments"> | number;
    installment_value?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFilter<"purchase_installments"> | number;
    start_date?: Prisma.DateTimeFilter<"purchase_installments"> | Date | string;
    status?: Prisma.Enumpurchase_installments_statusNullableFilter<"purchase_installments"> | $Enums.purchase_installments_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"purchase_installments"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    financial_entities?: Prisma.XOR<Prisma.Financial_entitiesScalarRelationFilter, Prisma.financial_entitiesWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
}, "id">;
export type purchase_installmentsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.purchase_installmentsCountOrderByAggregateInput;
    _avg?: Prisma.purchase_installmentsAvgOrderByAggregateInput;
    _max?: Prisma.purchase_installmentsMaxOrderByAggregateInput;
    _min?: Prisma.purchase_installmentsMinOrderByAggregateInput;
    _sum?: Prisma.purchase_installmentsSumOrderByAggregateInput;
};
export type purchase_installmentsScalarWhereWithAggregatesInput = {
    AND?: Prisma.purchase_installmentsScalarWhereWithAggregatesInput | Prisma.purchase_installmentsScalarWhereWithAggregatesInput[];
    OR?: Prisma.purchase_installmentsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.purchase_installmentsScalarWhereWithAggregatesInput | Prisma.purchase_installmentsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"purchase_installments"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"purchase_installments"> | number;
    entity_id?: Prisma.IntWithAggregatesFilter<"purchase_installments"> | number;
    description?: Prisma.StringWithAggregatesFilter<"purchase_installments"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntWithAggregatesFilter<"purchase_installments"> | number;
    installment_value?: Prisma.DecimalWithAggregatesFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntWithAggregatesFilter<"purchase_installments"> | number;
    start_date?: Prisma.DateTimeWithAggregatesFilter<"purchase_installments"> | Date | string;
    status?: Prisma.Enumpurchase_installments_statusNullableWithAggregatesFilter<"purchase_installments"> | $Enums.purchase_installments_status | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"purchase_installments"> | Date | string | null;
};
export type purchase_installmentsCreateInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutPurchase_installmentsInput;
    financial_entities: Prisma.financial_entitiesCreateNestedOneWithoutPurchase_installmentsInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsUncheckedCreateInput = {
    id?: number;
    user_id: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsUpdateInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsCreateManyInput = {
    id?: number;
    user_id: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
};
export type purchase_installmentsUpdateManyMutationInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type purchase_installmentsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Purchase_installmentsListRelationFilter = {
    every?: Prisma.purchase_installmentsWhereInput;
    some?: Prisma.purchase_installmentsWhereInput;
    none?: Prisma.purchase_installmentsWhereInput;
};
export type purchase_installmentsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type purchase_installmentsOrderByRelevanceInput = {
    fields: Prisma.purchase_installmentsOrderByRelevanceFieldEnum | Prisma.purchase_installmentsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type purchase_installmentsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type purchase_installmentsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
};
export type purchase_installmentsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type purchase_installmentsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type purchase_installmentsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    installment_count?: Prisma.SortOrder;
    installment_value?: Prisma.SortOrder;
    first_installment?: Prisma.SortOrder;
};
export type Purchase_installmentsNullableScalarRelationFilter = {
    is?: Prisma.purchase_installmentsWhereInput | null;
    isNot?: Prisma.purchase_installmentsWhereInput | null;
};
export type purchase_installmentsCreateNestedManyWithoutFinancial_entitiesInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput[];
    createMany?: Prisma.purchase_installmentsCreateManyFinancial_entitiesInputEnvelope;
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
};
export type purchase_installmentsUncheckedCreateNestedManyWithoutFinancial_entitiesInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput[];
    createMany?: Prisma.purchase_installmentsCreateManyFinancial_entitiesInputEnvelope;
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
};
export type purchase_installmentsUpdateManyWithoutFinancial_entitiesNestedInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput[];
    upsert?: Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutFinancial_entitiesInput[];
    createMany?: Prisma.purchase_installmentsCreateManyFinancial_entitiesInputEnvelope;
    set?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    disconnect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    delete?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    update?: Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutFinancial_entitiesInput[];
    updateMany?: Prisma.purchase_installmentsUpdateManyWithWhereWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpdateManyWithWhereWithoutFinancial_entitiesInput[];
    deleteMany?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
};
export type purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesNestedInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput> | Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput | Prisma.purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput[];
    upsert?: Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutFinancial_entitiesInput[];
    createMany?: Prisma.purchase_installmentsCreateManyFinancial_entitiesInputEnvelope;
    set?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    disconnect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    delete?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    update?: Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutFinancial_entitiesInput[];
    updateMany?: Prisma.purchase_installmentsUpdateManyWithWhereWithoutFinancial_entitiesInput | Prisma.purchase_installmentsUpdateManyWithWhereWithoutFinancial_entitiesInput[];
    deleteMany?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
};
export type NullableEnumpurchase_installments_statusFieldUpdateOperationsInput = {
    set?: $Enums.purchase_installments_status | null;
};
export type purchase_installmentsCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.purchase_installmentsWhereUniqueInput;
};
export type purchase_installmentsUpdateOneWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.purchase_installmentsUpsertWithoutTransactionsInput;
    disconnect?: Prisma.purchase_installmentsWhereInput | boolean;
    delete?: Prisma.purchase_installmentsWhereInput | boolean;
    connect?: Prisma.purchase_installmentsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.purchase_installmentsUpdateToOneWithWhereWithoutTransactionsInput, Prisma.purchase_installmentsUpdateWithoutTransactionsInput>, Prisma.purchase_installmentsUncheckedUpdateWithoutTransactionsInput>;
};
export type purchase_installmentsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput> | Prisma.purchase_installmentsCreateWithoutUsersInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput | Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.purchase_installmentsCreateManyUsersInputEnvelope;
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
};
export type purchase_installmentsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput> | Prisma.purchase_installmentsCreateWithoutUsersInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput | Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.purchase_installmentsCreateManyUsersInputEnvelope;
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
};
export type purchase_installmentsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput> | Prisma.purchase_installmentsCreateWithoutUsersInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput | Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutUsersInput | Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.purchase_installmentsCreateManyUsersInputEnvelope;
    set?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    disconnect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    delete?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    update?: Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutUsersInput | Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.purchase_installmentsUpdateManyWithWhereWithoutUsersInput | Prisma.purchase_installmentsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
};
export type purchase_installmentsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput> | Prisma.purchase_installmentsCreateWithoutUsersInput[] | Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput | Prisma.purchase_installmentsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutUsersInput | Prisma.purchase_installmentsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.purchase_installmentsCreateManyUsersInputEnvelope;
    set?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    disconnect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    delete?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    connect?: Prisma.purchase_installmentsWhereUniqueInput | Prisma.purchase_installmentsWhereUniqueInput[];
    update?: Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutUsersInput | Prisma.purchase_installmentsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.purchase_installmentsUpdateManyWithWhereWithoutUsersInput | Prisma.purchase_installmentsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
};
export type purchase_installmentsCreateWithoutFinancial_entitiesInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutPurchase_installmentsInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput = {
    id?: number;
    user_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsCreateOrConnectWithoutFinancial_entitiesInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput>;
};
export type purchase_installmentsCreateManyFinancial_entitiesInputEnvelope = {
    data: Prisma.purchase_installmentsCreateManyFinancial_entitiesInput | Prisma.purchase_installmentsCreateManyFinancial_entitiesInput[];
    skipDuplicates?: boolean;
};
export type purchase_installmentsUpsertWithWhereUniqueWithoutFinancial_entitiesInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedUpdateWithoutFinancial_entitiesInput>;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedCreateWithoutFinancial_entitiesInput>;
};
export type purchase_installmentsUpdateWithWhereUniqueWithoutFinancial_entitiesInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutFinancial_entitiesInput, Prisma.purchase_installmentsUncheckedUpdateWithoutFinancial_entitiesInput>;
};
export type purchase_installmentsUpdateManyWithWhereWithoutFinancial_entitiesInput = {
    where: Prisma.purchase_installmentsScalarWhereInput;
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateManyMutationInput, Prisma.purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesInput>;
};
export type purchase_installmentsScalarWhereInput = {
    AND?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
    OR?: Prisma.purchase_installmentsScalarWhereInput[];
    NOT?: Prisma.purchase_installmentsScalarWhereInput | Prisma.purchase_installmentsScalarWhereInput[];
    id?: Prisma.IntFilter<"purchase_installments"> | number;
    user_id?: Prisma.IntFilter<"purchase_installments"> | number;
    entity_id?: Prisma.IntFilter<"purchase_installments"> | number;
    description?: Prisma.StringFilter<"purchase_installments"> | string;
    amount?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFilter<"purchase_installments"> | number;
    installment_value?: Prisma.DecimalFilter<"purchase_installments"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFilter<"purchase_installments"> | number;
    start_date?: Prisma.DateTimeFilter<"purchase_installments"> | Date | string;
    status?: Prisma.Enumpurchase_installments_statusNullableFilter<"purchase_installments"> | $Enums.purchase_installments_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"purchase_installments"> | Date | string | null;
};
export type purchase_installmentsCreateWithoutTransactionsInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutPurchase_installmentsInput;
    financial_entities: Prisma.financial_entitiesCreateNestedOneWithoutPurchase_installmentsInput;
};
export type purchase_installmentsUncheckedCreateWithoutTransactionsInput = {
    id?: number;
    user_id: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
};
export type purchase_installmentsCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedCreateWithoutTransactionsInput>;
};
export type purchase_installmentsUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.purchase_installmentsWhereInput;
};
export type purchase_installmentsUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.purchase_installmentsWhereInput;
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutTransactionsInput, Prisma.purchase_installmentsUncheckedUpdateWithoutTransactionsInput>;
};
export type purchase_installmentsUpdateWithoutTransactionsInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
    financial_entities?: Prisma.financial_entitiesUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type purchase_installmentsCreateWithoutUsersInput = {
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    financial_entities: Prisma.financial_entitiesCreateNestedOneWithoutPurchase_installmentsInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsUncheckedCreateWithoutUsersInput = {
    id?: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutPurchase_installmentsInput;
};
export type purchase_installmentsCreateOrConnectWithoutUsersInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput>;
};
export type purchase_installmentsCreateManyUsersInputEnvelope = {
    data: Prisma.purchase_installmentsCreateManyUsersInput | Prisma.purchase_installmentsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type purchase_installmentsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutUsersInput, Prisma.purchase_installmentsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.purchase_installmentsCreateWithoutUsersInput, Prisma.purchase_installmentsUncheckedCreateWithoutUsersInput>;
};
export type purchase_installmentsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.purchase_installmentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateWithoutUsersInput, Prisma.purchase_installmentsUncheckedUpdateWithoutUsersInput>;
};
export type purchase_installmentsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.purchase_installmentsScalarWhereInput;
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateManyMutationInput, Prisma.purchase_installmentsUncheckedUpdateManyWithoutUsersInput>;
};
export type purchase_installmentsCreateManyFinancial_entitiesInput = {
    id?: number;
    user_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
};
export type purchase_installmentsUpdateWithoutFinancial_entitiesInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateWithoutFinancial_entitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateManyWithoutFinancial_entitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type purchase_installmentsCreateManyUsersInput = {
    id?: number;
    entity_id: number;
    description: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count: number;
    installment_value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: number;
    start_date: Date | string;
    status?: $Enums.purchase_installments_status | null;
    created_at?: Date | string | null;
};
export type purchase_installmentsUpdateWithoutUsersInput = {
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    financial_entities?: Prisma.financial_entitiesUpdateOneRequiredWithoutPurchase_installmentsNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutPurchase_installmentsNestedInput;
};
export type purchase_installmentsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    entity_id?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    installment_count?: Prisma.IntFieldUpdateOperationsInput | number;
    installment_value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    first_installment?: Prisma.IntFieldUpdateOperationsInput | number;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumpurchase_installments_statusFieldUpdateOperationsInput | $Enums.purchase_installments_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type Purchase_installmentsCountOutputType
 */
export type Purchase_installmentsCountOutputType = {
    transactions: number;
};
export type Purchase_installmentsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | Purchase_installmentsCountOutputTypeCountTransactionsArgs;
};
/**
 * Purchase_installmentsCountOutputType without action
 */
export type Purchase_installmentsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase_installmentsCountOutputType
     */
    select?: Prisma.Purchase_installmentsCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Purchase_installmentsCountOutputType without action
 */
export type Purchase_installmentsCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transactionsWhereInput;
};
export type purchase_installmentsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    entity_id?: boolean;
    description?: boolean;
    amount?: boolean;
    installment_count?: boolean;
    installment_value?: boolean;
    first_installment?: boolean;
    start_date?: boolean;
    status?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    financial_entities?: boolean | Prisma.financial_entitiesDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.purchase_installments$transactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.Purchase_installmentsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["purchase_installments"]>;
export type purchase_installmentsSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    entity_id?: boolean;
    description?: boolean;
    amount?: boolean;
    installment_count?: boolean;
    installment_value?: boolean;
    first_installment?: boolean;
    start_date?: boolean;
    status?: boolean;
    created_at?: boolean;
};
export type purchase_installmentsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "entity_id" | "description" | "amount" | "installment_count" | "installment_value" | "first_installment" | "start_date" | "status" | "created_at", ExtArgs["result"]["purchase_installments"]>;
export type purchase_installmentsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    financial_entities?: boolean | Prisma.financial_entitiesDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.purchase_installments$transactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.Purchase_installmentsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $purchase_installmentsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "purchase_installments";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
        financial_entities: Prisma.$financial_entitiesPayload<ExtArgs>;
        transactions: Prisma.$transactionsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        entity_id: number;
        description: string;
        amount: runtime.Decimal;
        installment_count: number;
        installment_value: runtime.Decimal;
        first_installment: number;
        start_date: Date;
        status: $Enums.purchase_installments_status | null;
        created_at: Date | null;
    }, ExtArgs["result"]["purchase_installments"]>;
    composites: {};
};
export type purchase_installmentsGetPayload<S extends boolean | null | undefined | purchase_installmentsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload, S>;
export type purchase_installmentsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<purchase_installmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Purchase_installmentsCountAggregateInputType | true;
};
export interface purchase_installmentsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['purchase_installments'];
        meta: {
            name: 'purchase_installments';
        };
    };
    /**
     * Find zero or one Purchase_installments that matches the filter.
     * @param {purchase_installmentsFindUniqueArgs} args - Arguments to find a Purchase_installments
     * @example
     * // Get one Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends purchase_installmentsFindUniqueArgs>(args: Prisma.SelectSubset<T, purchase_installmentsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Purchase_installments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {purchase_installmentsFindUniqueOrThrowArgs} args - Arguments to find a Purchase_installments
     * @example
     * // Get one Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends purchase_installmentsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, purchase_installmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Purchase_installments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsFindFirstArgs} args - Arguments to find a Purchase_installments
     * @example
     * // Get one Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends purchase_installmentsFindFirstArgs>(args?: Prisma.SelectSubset<T, purchase_installmentsFindFirstArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Purchase_installments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsFindFirstOrThrowArgs} args - Arguments to find a Purchase_installments
     * @example
     * // Get one Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends purchase_installmentsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, purchase_installmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Purchase_installments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findMany()
     *
     * // Get first 10 Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const purchase_installmentsWithIdOnly = await prisma.purchase_installments.findMany({ select: { id: true } })
     *
     */
    findMany<T extends purchase_installmentsFindManyArgs>(args?: Prisma.SelectSubset<T, purchase_installmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Purchase_installments.
     * @param {purchase_installmentsCreateArgs} args - Arguments to create a Purchase_installments.
     * @example
     * // Create one Purchase_installments
     * const Purchase_installments = await prisma.purchase_installments.create({
     *   data: {
     *     // ... data to create a Purchase_installments
     *   }
     * })
     *
     */
    create<T extends purchase_installmentsCreateArgs>(args: Prisma.SelectSubset<T, purchase_installmentsCreateArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Purchase_installments.
     * @param {purchase_installmentsCreateManyArgs} args - Arguments to create many Purchase_installments.
     * @example
     * // Create many Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends purchase_installmentsCreateManyArgs>(args?: Prisma.SelectSubset<T, purchase_installmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Purchase_installments.
     * @param {purchase_installmentsDeleteArgs} args - Arguments to delete one Purchase_installments.
     * @example
     * // Delete one Purchase_installments
     * const Purchase_installments = await prisma.purchase_installments.delete({
     *   where: {
     *     // ... filter to delete one Purchase_installments
     *   }
     * })
     *
     */
    delete<T extends purchase_installmentsDeleteArgs>(args: Prisma.SelectSubset<T, purchase_installmentsDeleteArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Purchase_installments.
     * @param {purchase_installmentsUpdateArgs} args - Arguments to update one Purchase_installments.
     * @example
     * // Update one Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends purchase_installmentsUpdateArgs>(args: Prisma.SelectSubset<T, purchase_installmentsUpdateArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Purchase_installments.
     * @param {purchase_installmentsDeleteManyArgs} args - Arguments to filter Purchase_installments to delete.
     * @example
     * // Delete a few Purchase_installments
     * const { count } = await prisma.purchase_installments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends purchase_installmentsDeleteManyArgs>(args?: Prisma.SelectSubset<T, purchase_installmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Purchase_installments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends purchase_installmentsUpdateManyArgs>(args: Prisma.SelectSubset<T, purchase_installmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Purchase_installments.
     * @param {purchase_installmentsUpsertArgs} args - Arguments to update or create a Purchase_installments.
     * @example
     * // Update or create a Purchase_installments
     * const purchase_installments = await prisma.purchase_installments.upsert({
     *   create: {
     *     // ... data to create a Purchase_installments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Purchase_installments we want to update
     *   }
     * })
     */
    upsert<T extends purchase_installmentsUpsertArgs>(args: Prisma.SelectSubset<T, purchase_installmentsUpsertArgs<ExtArgs>>): Prisma.Prisma__purchase_installmentsClient<runtime.Types.Result.GetResult<Prisma.$purchase_installmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Purchase_installments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsCountArgs} args - Arguments to filter Purchase_installments to count.
     * @example
     * // Count the number of Purchase_installments
     * const count = await prisma.purchase_installments.count({
     *   where: {
     *     // ... the filter for the Purchase_installments we want to count
     *   }
     * })
    **/
    count<T extends purchase_installmentsCountArgs>(args?: Prisma.Subset<T, purchase_installmentsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Purchase_installmentsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Purchase_installments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Purchase_installmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Purchase_installmentsAggregateArgs>(args: Prisma.Subset<T, Purchase_installmentsAggregateArgs>): Prisma.PrismaPromise<GetPurchase_installmentsAggregateType<T>>;
    /**
     * Group by Purchase_installments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {purchase_installmentsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends purchase_installmentsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: purchase_installmentsGroupByArgs['orderBy'];
    } : {
        orderBy?: purchase_installmentsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, purchase_installmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchase_installmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the purchase_installments model
     */
    readonly fields: purchase_installmentsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for purchase_installments.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__purchase_installmentsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    financial_entities<T extends Prisma.financial_entitiesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.financial_entitiesDefaultArgs<ExtArgs>>): Prisma.Prisma__financial_entitiesClient<runtime.Types.Result.GetResult<Prisma.$financial_entitiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transactions<T extends Prisma.purchase_installments$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.purchase_installments$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the purchase_installments model
 */
export interface purchase_installmentsFieldRefs {
    readonly id: Prisma.FieldRef<"purchase_installments", 'Int'>;
    readonly user_id: Prisma.FieldRef<"purchase_installments", 'Int'>;
    readonly entity_id: Prisma.FieldRef<"purchase_installments", 'Int'>;
    readonly description: Prisma.FieldRef<"purchase_installments", 'String'>;
    readonly amount: Prisma.FieldRef<"purchase_installments", 'Decimal'>;
    readonly installment_count: Prisma.FieldRef<"purchase_installments", 'Int'>;
    readonly installment_value: Prisma.FieldRef<"purchase_installments", 'Decimal'>;
    readonly first_installment: Prisma.FieldRef<"purchase_installments", 'Int'>;
    readonly start_date: Prisma.FieldRef<"purchase_installments", 'DateTime'>;
    readonly status: Prisma.FieldRef<"purchase_installments", 'purchase_installments_status'>;
    readonly created_at: Prisma.FieldRef<"purchase_installments", 'DateTime'>;
}
/**
 * purchase_installments findUnique
 */
export type purchase_installmentsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which purchase_installments to fetch.
     */
    where: Prisma.purchase_installmentsWhereUniqueInput;
};
/**
 * purchase_installments findUniqueOrThrow
 */
export type purchase_installmentsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which purchase_installments to fetch.
     */
    where: Prisma.purchase_installmentsWhereUniqueInput;
};
/**
 * purchase_installments findFirst
 */
export type purchase_installmentsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which purchase_installments to fetch.
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of purchase_installments to fetch.
     */
    orderBy?: Prisma.purchase_installmentsOrderByWithRelationInput | Prisma.purchase_installmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for purchase_installments.
     */
    cursor?: Prisma.purchase_installmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` purchase_installments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` purchase_installments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of purchase_installments.
     */
    distinct?: Prisma.Purchase_installmentsScalarFieldEnum | Prisma.Purchase_installmentsScalarFieldEnum[];
};
/**
 * purchase_installments findFirstOrThrow
 */
export type purchase_installmentsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which purchase_installments to fetch.
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of purchase_installments to fetch.
     */
    orderBy?: Prisma.purchase_installmentsOrderByWithRelationInput | Prisma.purchase_installmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for purchase_installments.
     */
    cursor?: Prisma.purchase_installmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` purchase_installments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` purchase_installments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of purchase_installments.
     */
    distinct?: Prisma.Purchase_installmentsScalarFieldEnum | Prisma.Purchase_installmentsScalarFieldEnum[];
};
/**
 * purchase_installments findMany
 */
export type purchase_installmentsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which purchase_installments to fetch.
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of purchase_installments to fetch.
     */
    orderBy?: Prisma.purchase_installmentsOrderByWithRelationInput | Prisma.purchase_installmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing purchase_installments.
     */
    cursor?: Prisma.purchase_installmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` purchase_installments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` purchase_installments.
     */
    skip?: number;
    distinct?: Prisma.Purchase_installmentsScalarFieldEnum | Prisma.Purchase_installmentsScalarFieldEnum[];
};
/**
 * purchase_installments create
 */
export type purchase_installmentsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a purchase_installments.
     */
    data: Prisma.XOR<Prisma.purchase_installmentsCreateInput, Prisma.purchase_installmentsUncheckedCreateInput>;
};
/**
 * purchase_installments createMany
 */
export type purchase_installmentsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many purchase_installments.
     */
    data: Prisma.purchase_installmentsCreateManyInput | Prisma.purchase_installmentsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * purchase_installments update
 */
export type purchase_installmentsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a purchase_installments.
     */
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateInput, Prisma.purchase_installmentsUncheckedUpdateInput>;
    /**
     * Choose, which purchase_installments to update.
     */
    where: Prisma.purchase_installmentsWhereUniqueInput;
};
/**
 * purchase_installments updateMany
 */
export type purchase_installmentsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update purchase_installments.
     */
    data: Prisma.XOR<Prisma.purchase_installmentsUpdateManyMutationInput, Prisma.purchase_installmentsUncheckedUpdateManyInput>;
    /**
     * Filter which purchase_installments to update
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * Limit how many purchase_installments to update.
     */
    limit?: number;
};
/**
 * purchase_installments upsert
 */
export type purchase_installmentsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the purchase_installments to update in case it exists.
     */
    where: Prisma.purchase_installmentsWhereUniqueInput;
    /**
     * In case the purchase_installments found by the `where` argument doesn't exist, create a new purchase_installments with this data.
     */
    create: Prisma.XOR<Prisma.purchase_installmentsCreateInput, Prisma.purchase_installmentsUncheckedCreateInput>;
    /**
     * In case the purchase_installments was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.purchase_installmentsUpdateInput, Prisma.purchase_installmentsUncheckedUpdateInput>;
};
/**
 * purchase_installments delete
 */
export type purchase_installmentsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which purchase_installments to delete.
     */
    where: Prisma.purchase_installmentsWhereUniqueInput;
};
/**
 * purchase_installments deleteMany
 */
export type purchase_installmentsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which purchase_installments to delete
     */
    where?: Prisma.purchase_installmentsWhereInput;
    /**
     * Limit how many purchase_installments to delete.
     */
    limit?: number;
};
/**
 * purchase_installments.transactions
 */
export type purchase_installments$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * purchase_installments without action
 */
export type purchase_installmentsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=purchase_installments.d.ts.map