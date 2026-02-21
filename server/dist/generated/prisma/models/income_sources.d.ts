import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model income_sources
 *
 */
export type income_sourcesModel = runtime.Types.Result.DefaultSelection<Prisma.$income_sourcesPayload>;
export type AggregateIncome_sources = {
    _count: Income_sourcesCountAggregateOutputType | null;
    _avg: Income_sourcesAvgAggregateOutputType | null;
    _sum: Income_sourcesSumAggregateOutputType | null;
    _min: Income_sourcesMinAggregateOutputType | null;
    _max: Income_sourcesMaxAggregateOutputType | null;
};
export type Income_sourcesAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Income_sourcesSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Income_sourcesMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    name: string | null;
    color: string | null;
    created_at: Date | null;
};
export type Income_sourcesMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    name: string | null;
    color: string | null;
    created_at: Date | null;
};
export type Income_sourcesCountAggregateOutputType = {
    id: number;
    user_id: number;
    name: number;
    color: number;
    created_at: number;
    _all: number;
};
export type Income_sourcesAvgAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Income_sourcesSumAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Income_sourcesMinAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    color?: true;
    created_at?: true;
};
export type Income_sourcesMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    color?: true;
    created_at?: true;
};
export type Income_sourcesCountAggregateInputType = {
    id?: true;
    user_id?: true;
    name?: true;
    color?: true;
    created_at?: true;
    _all?: true;
};
export type Income_sourcesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which income_sources to aggregate.
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of income_sources to fetch.
     */
    orderBy?: Prisma.income_sourcesOrderByWithRelationInput | Prisma.income_sourcesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.income_sourcesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` income_sources from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` income_sources.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned income_sources
    **/
    _count?: true | Income_sourcesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Income_sourcesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Income_sourcesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Income_sourcesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Income_sourcesMaxAggregateInputType;
};
export type GetIncome_sourcesAggregateType<T extends Income_sourcesAggregateArgs> = {
    [P in keyof T & keyof AggregateIncome_sources]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIncome_sources[P]> : Prisma.GetScalarType<T[P], AggregateIncome_sources[P]>;
};
export type income_sourcesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.income_sourcesWhereInput;
    orderBy?: Prisma.income_sourcesOrderByWithAggregationInput | Prisma.income_sourcesOrderByWithAggregationInput[];
    by: Prisma.Income_sourcesScalarFieldEnum[] | Prisma.Income_sourcesScalarFieldEnum;
    having?: Prisma.income_sourcesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Income_sourcesCountAggregateInputType | true;
    _avg?: Income_sourcesAvgAggregateInputType;
    _sum?: Income_sourcesSumAggregateInputType;
    _min?: Income_sourcesMinAggregateInputType;
    _max?: Income_sourcesMaxAggregateInputType;
};
export type Income_sourcesGroupByOutputType = {
    id: number;
    user_id: number;
    name: string;
    color: string | null;
    created_at: Date | null;
    _count: Income_sourcesCountAggregateOutputType | null;
    _avg: Income_sourcesAvgAggregateOutputType | null;
    _sum: Income_sourcesSumAggregateOutputType | null;
    _min: Income_sourcesMinAggregateOutputType | null;
    _max: Income_sourcesMaxAggregateOutputType | null;
};
type GetIncome_sourcesGroupByPayload<T extends income_sourcesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Income_sourcesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Income_sourcesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Income_sourcesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Income_sourcesGroupByOutputType[P]>;
}>>;
export type income_sourcesWhereInput = {
    AND?: Prisma.income_sourcesWhereInput | Prisma.income_sourcesWhereInput[];
    OR?: Prisma.income_sourcesWhereInput[];
    NOT?: Prisma.income_sourcesWhereInput | Prisma.income_sourcesWhereInput[];
    id?: Prisma.IntFilter<"income_sources"> | number;
    user_id?: Prisma.IntFilter<"income_sources"> | number;
    name?: Prisma.StringFilter<"income_sources"> | string;
    color?: Prisma.StringNullableFilter<"income_sources"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"income_sources"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
};
export type income_sourcesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    transactions?: Prisma.transactionsOrderByRelationAggregateInput;
    _relevance?: Prisma.income_sourcesOrderByRelevanceInput;
};
export type income_sourcesWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    user_id_name?: Prisma.income_sourcesUser_idNameCompoundUniqueInput;
    AND?: Prisma.income_sourcesWhereInput | Prisma.income_sourcesWhereInput[];
    OR?: Prisma.income_sourcesWhereInput[];
    NOT?: Prisma.income_sourcesWhereInput | Prisma.income_sourcesWhereInput[];
    user_id?: Prisma.IntFilter<"income_sources"> | number;
    name?: Prisma.StringFilter<"income_sources"> | string;
    color?: Prisma.StringNullableFilter<"income_sources"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"income_sources"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
    transactions?: Prisma.TransactionsListRelationFilter;
}, "id" | "user_id_name">;
export type income_sourcesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.income_sourcesCountOrderByAggregateInput;
    _avg?: Prisma.income_sourcesAvgOrderByAggregateInput;
    _max?: Prisma.income_sourcesMaxOrderByAggregateInput;
    _min?: Prisma.income_sourcesMinOrderByAggregateInput;
    _sum?: Prisma.income_sourcesSumOrderByAggregateInput;
};
export type income_sourcesScalarWhereWithAggregatesInput = {
    AND?: Prisma.income_sourcesScalarWhereWithAggregatesInput | Prisma.income_sourcesScalarWhereWithAggregatesInput[];
    OR?: Prisma.income_sourcesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.income_sourcesScalarWhereWithAggregatesInput | Prisma.income_sourcesScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"income_sources"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"income_sources"> | number;
    name?: Prisma.StringWithAggregatesFilter<"income_sources"> | string;
    color?: Prisma.StringNullableWithAggregatesFilter<"income_sources"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"income_sources"> | Date | string | null;
};
export type income_sourcesCreateInput = {
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutIncome_sourcesInput;
    transactions?: Prisma.transactionsCreateNestedManyWithoutIncome_sourcesInput;
};
export type income_sourcesUncheckedCreateInput = {
    id?: number;
    user_id: number;
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutIncome_sourcesInput;
};
export type income_sourcesUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutIncome_sourcesNestedInput;
    transactions?: Prisma.transactionsUpdateManyWithoutIncome_sourcesNestedInput;
};
export type income_sourcesUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutIncome_sourcesNestedInput;
};
export type income_sourcesCreateManyInput = {
    id?: number;
    user_id: number;
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
};
export type income_sourcesUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type income_sourcesUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type income_sourcesOrderByRelevanceInput = {
    fields: Prisma.income_sourcesOrderByRelevanceFieldEnum | Prisma.income_sourcesOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type income_sourcesUser_idNameCompoundUniqueInput = {
    user_id: number;
    name: string;
};
export type income_sourcesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type income_sourcesAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type income_sourcesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type income_sourcesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type income_sourcesSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type Income_sourcesNullableScalarRelationFilter = {
    is?: Prisma.income_sourcesWhereInput | null;
    isNot?: Prisma.income_sourcesWhereInput | null;
};
export type Income_sourcesListRelationFilter = {
    every?: Prisma.income_sourcesWhereInput;
    some?: Prisma.income_sourcesWhereInput;
    none?: Prisma.income_sourcesWhereInput;
};
export type income_sourcesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type income_sourcesCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutTransactionsInput, Prisma.income_sourcesUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.income_sourcesWhereUniqueInput;
};
export type income_sourcesUpdateOneWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutTransactionsInput, Prisma.income_sourcesUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.income_sourcesUpsertWithoutTransactionsInput;
    disconnect?: Prisma.income_sourcesWhereInput | boolean;
    delete?: Prisma.income_sourcesWhereInput | boolean;
    connect?: Prisma.income_sourcesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.income_sourcesUpdateToOneWithWhereWithoutTransactionsInput, Prisma.income_sourcesUpdateWithoutTransactionsInput>, Prisma.income_sourcesUncheckedUpdateWithoutTransactionsInput>;
};
export type income_sourcesCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput> | Prisma.income_sourcesCreateWithoutUsersInput[] | Prisma.income_sourcesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutUsersInput | Prisma.income_sourcesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.income_sourcesCreateManyUsersInputEnvelope;
    connect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
};
export type income_sourcesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput> | Prisma.income_sourcesCreateWithoutUsersInput[] | Prisma.income_sourcesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutUsersInput | Prisma.income_sourcesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.income_sourcesCreateManyUsersInputEnvelope;
    connect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
};
export type income_sourcesUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput> | Prisma.income_sourcesCreateWithoutUsersInput[] | Prisma.income_sourcesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutUsersInput | Prisma.income_sourcesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.income_sourcesUpsertWithWhereUniqueWithoutUsersInput | Prisma.income_sourcesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.income_sourcesCreateManyUsersInputEnvelope;
    set?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    disconnect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    delete?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    connect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    update?: Prisma.income_sourcesUpdateWithWhereUniqueWithoutUsersInput | Prisma.income_sourcesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.income_sourcesUpdateManyWithWhereWithoutUsersInput | Prisma.income_sourcesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.income_sourcesScalarWhereInput | Prisma.income_sourcesScalarWhereInput[];
};
export type income_sourcesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput> | Prisma.income_sourcesCreateWithoutUsersInput[] | Prisma.income_sourcesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.income_sourcesCreateOrConnectWithoutUsersInput | Prisma.income_sourcesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.income_sourcesUpsertWithWhereUniqueWithoutUsersInput | Prisma.income_sourcesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.income_sourcesCreateManyUsersInputEnvelope;
    set?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    disconnect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    delete?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    connect?: Prisma.income_sourcesWhereUniqueInput | Prisma.income_sourcesWhereUniqueInput[];
    update?: Prisma.income_sourcesUpdateWithWhereUniqueWithoutUsersInput | Prisma.income_sourcesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.income_sourcesUpdateManyWithWhereWithoutUsersInput | Prisma.income_sourcesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.income_sourcesScalarWhereInput | Prisma.income_sourcesScalarWhereInput[];
};
export type income_sourcesCreateWithoutTransactionsInput = {
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutIncome_sourcesInput;
};
export type income_sourcesUncheckedCreateWithoutTransactionsInput = {
    id?: number;
    user_id: number;
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
};
export type income_sourcesCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.income_sourcesWhereUniqueInput;
    create: Prisma.XOR<Prisma.income_sourcesCreateWithoutTransactionsInput, Prisma.income_sourcesUncheckedCreateWithoutTransactionsInput>;
};
export type income_sourcesUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.income_sourcesUpdateWithoutTransactionsInput, Prisma.income_sourcesUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.income_sourcesCreateWithoutTransactionsInput, Prisma.income_sourcesUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.income_sourcesWhereInput;
};
export type income_sourcesUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.income_sourcesWhereInput;
    data: Prisma.XOR<Prisma.income_sourcesUpdateWithoutTransactionsInput, Prisma.income_sourcesUncheckedUpdateWithoutTransactionsInput>;
};
export type income_sourcesUpdateWithoutTransactionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutIncome_sourcesNestedInput;
};
export type income_sourcesUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type income_sourcesCreateWithoutUsersInput = {
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsCreateNestedManyWithoutIncome_sourcesInput;
};
export type income_sourcesUncheckedCreateWithoutUsersInput = {
    id?: number;
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
    transactions?: Prisma.transactionsUncheckedCreateNestedManyWithoutIncome_sourcesInput;
};
export type income_sourcesCreateOrConnectWithoutUsersInput = {
    where: Prisma.income_sourcesWhereUniqueInput;
    create: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput>;
};
export type income_sourcesCreateManyUsersInputEnvelope = {
    data: Prisma.income_sourcesCreateManyUsersInput | Prisma.income_sourcesCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type income_sourcesUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.income_sourcesWhereUniqueInput;
    update: Prisma.XOR<Prisma.income_sourcesUpdateWithoutUsersInput, Prisma.income_sourcesUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.income_sourcesCreateWithoutUsersInput, Prisma.income_sourcesUncheckedCreateWithoutUsersInput>;
};
export type income_sourcesUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.income_sourcesWhereUniqueInput;
    data: Prisma.XOR<Prisma.income_sourcesUpdateWithoutUsersInput, Prisma.income_sourcesUncheckedUpdateWithoutUsersInput>;
};
export type income_sourcesUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.income_sourcesScalarWhereInput;
    data: Prisma.XOR<Prisma.income_sourcesUpdateManyMutationInput, Prisma.income_sourcesUncheckedUpdateManyWithoutUsersInput>;
};
export type income_sourcesScalarWhereInput = {
    AND?: Prisma.income_sourcesScalarWhereInput | Prisma.income_sourcesScalarWhereInput[];
    OR?: Prisma.income_sourcesScalarWhereInput[];
    NOT?: Prisma.income_sourcesScalarWhereInput | Prisma.income_sourcesScalarWhereInput[];
    id?: Prisma.IntFilter<"income_sources"> | number;
    user_id?: Prisma.IntFilter<"income_sources"> | number;
    name?: Prisma.StringFilter<"income_sources"> | string;
    color?: Prisma.StringNullableFilter<"income_sources"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"income_sources"> | Date | string | null;
};
export type income_sourcesCreateManyUsersInput = {
    id?: number;
    name: string;
    color?: string | null;
    created_at?: Date | string | null;
};
export type income_sourcesUpdateWithoutUsersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUpdateManyWithoutIncome_sourcesNestedInput;
};
export type income_sourcesUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transactions?: Prisma.transactionsUncheckedUpdateManyWithoutIncome_sourcesNestedInput;
};
export type income_sourcesUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type Income_sourcesCountOutputType
 */
export type Income_sourcesCountOutputType = {
    transactions: number;
};
export type Income_sourcesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | Income_sourcesCountOutputTypeCountTransactionsArgs;
};
/**
 * Income_sourcesCountOutputType without action
 */
export type Income_sourcesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Income_sourcesCountOutputType
     */
    select?: Prisma.Income_sourcesCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Income_sourcesCountOutputType without action
 */
export type Income_sourcesCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transactionsWhereInput;
};
export type income_sourcesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    name?: boolean;
    color?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.income_sources$transactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.Income_sourcesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["income_sources"]>;
export type income_sourcesSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    name?: boolean;
    color?: boolean;
    created_at?: boolean;
};
export type income_sourcesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "name" | "color" | "created_at", ExtArgs["result"]["income_sources"]>;
export type income_sourcesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
    transactions?: boolean | Prisma.income_sources$transactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.Income_sourcesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $income_sourcesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "income_sources";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
        transactions: Prisma.$transactionsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        name: string;
        color: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["income_sources"]>;
    composites: {};
};
export type income_sourcesGetPayload<S extends boolean | null | undefined | income_sourcesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload, S>;
export type income_sourcesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<income_sourcesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Income_sourcesCountAggregateInputType | true;
};
export interface income_sourcesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['income_sources'];
        meta: {
            name: 'income_sources';
        };
    };
    /**
     * Find zero or one Income_sources that matches the filter.
     * @param {income_sourcesFindUniqueArgs} args - Arguments to find a Income_sources
     * @example
     * // Get one Income_sources
     * const income_sources = await prisma.income_sources.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends income_sourcesFindUniqueArgs>(args: Prisma.SelectSubset<T, income_sourcesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Income_sources that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {income_sourcesFindUniqueOrThrowArgs} args - Arguments to find a Income_sources
     * @example
     * // Get one Income_sources
     * const income_sources = await prisma.income_sources.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends income_sourcesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, income_sourcesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Income_sources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesFindFirstArgs} args - Arguments to find a Income_sources
     * @example
     * // Get one Income_sources
     * const income_sources = await prisma.income_sources.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends income_sourcesFindFirstArgs>(args?: Prisma.SelectSubset<T, income_sourcesFindFirstArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Income_sources that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesFindFirstOrThrowArgs} args - Arguments to find a Income_sources
     * @example
     * // Get one Income_sources
     * const income_sources = await prisma.income_sources.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends income_sourcesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, income_sourcesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Income_sources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Income_sources
     * const income_sources = await prisma.income_sources.findMany()
     *
     * // Get first 10 Income_sources
     * const income_sources = await prisma.income_sources.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const income_sourcesWithIdOnly = await prisma.income_sources.findMany({ select: { id: true } })
     *
     */
    findMany<T extends income_sourcesFindManyArgs>(args?: Prisma.SelectSubset<T, income_sourcesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Income_sources.
     * @param {income_sourcesCreateArgs} args - Arguments to create a Income_sources.
     * @example
     * // Create one Income_sources
     * const Income_sources = await prisma.income_sources.create({
     *   data: {
     *     // ... data to create a Income_sources
     *   }
     * })
     *
     */
    create<T extends income_sourcesCreateArgs>(args: Prisma.SelectSubset<T, income_sourcesCreateArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Income_sources.
     * @param {income_sourcesCreateManyArgs} args - Arguments to create many Income_sources.
     * @example
     * // Create many Income_sources
     * const income_sources = await prisma.income_sources.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends income_sourcesCreateManyArgs>(args?: Prisma.SelectSubset<T, income_sourcesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Income_sources.
     * @param {income_sourcesDeleteArgs} args - Arguments to delete one Income_sources.
     * @example
     * // Delete one Income_sources
     * const Income_sources = await prisma.income_sources.delete({
     *   where: {
     *     // ... filter to delete one Income_sources
     *   }
     * })
     *
     */
    delete<T extends income_sourcesDeleteArgs>(args: Prisma.SelectSubset<T, income_sourcesDeleteArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Income_sources.
     * @param {income_sourcesUpdateArgs} args - Arguments to update one Income_sources.
     * @example
     * // Update one Income_sources
     * const income_sources = await prisma.income_sources.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends income_sourcesUpdateArgs>(args: Prisma.SelectSubset<T, income_sourcesUpdateArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Income_sources.
     * @param {income_sourcesDeleteManyArgs} args - Arguments to filter Income_sources to delete.
     * @example
     * // Delete a few Income_sources
     * const { count } = await prisma.income_sources.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends income_sourcesDeleteManyArgs>(args?: Prisma.SelectSubset<T, income_sourcesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Income_sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Income_sources
     * const income_sources = await prisma.income_sources.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends income_sourcesUpdateManyArgs>(args: Prisma.SelectSubset<T, income_sourcesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Income_sources.
     * @param {income_sourcesUpsertArgs} args - Arguments to update or create a Income_sources.
     * @example
     * // Update or create a Income_sources
     * const income_sources = await prisma.income_sources.upsert({
     *   create: {
     *     // ... data to create a Income_sources
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Income_sources we want to update
     *   }
     * })
     */
    upsert<T extends income_sourcesUpsertArgs>(args: Prisma.SelectSubset<T, income_sourcesUpsertArgs<ExtArgs>>): Prisma.Prisma__income_sourcesClient<runtime.Types.Result.GetResult<Prisma.$income_sourcesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Income_sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesCountArgs} args - Arguments to filter Income_sources to count.
     * @example
     * // Count the number of Income_sources
     * const count = await prisma.income_sources.count({
     *   where: {
     *     // ... the filter for the Income_sources we want to count
     *   }
     * })
    **/
    count<T extends income_sourcesCountArgs>(args?: Prisma.Subset<T, income_sourcesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Income_sourcesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Income_sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Income_sourcesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Income_sourcesAggregateArgs>(args: Prisma.Subset<T, Income_sourcesAggregateArgs>): Prisma.PrismaPromise<GetIncome_sourcesAggregateType<T>>;
    /**
     * Group by Income_sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {income_sourcesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends income_sourcesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: income_sourcesGroupByArgs['orderBy'];
    } : {
        orderBy?: income_sourcesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, income_sourcesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIncome_sourcesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the income_sources model
     */
    readonly fields: income_sourcesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for income_sources.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__income_sourcesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transactions<T extends Prisma.income_sources$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.income_sources$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transactionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the income_sources model
 */
export interface income_sourcesFieldRefs {
    readonly id: Prisma.FieldRef<"income_sources", 'Int'>;
    readonly user_id: Prisma.FieldRef<"income_sources", 'Int'>;
    readonly name: Prisma.FieldRef<"income_sources", 'String'>;
    readonly color: Prisma.FieldRef<"income_sources", 'String'>;
    readonly created_at: Prisma.FieldRef<"income_sources", 'DateTime'>;
}
/**
 * income_sources findUnique
 */
export type income_sourcesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which income_sources to fetch.
     */
    where: Prisma.income_sourcesWhereUniqueInput;
};
/**
 * income_sources findUniqueOrThrow
 */
export type income_sourcesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which income_sources to fetch.
     */
    where: Prisma.income_sourcesWhereUniqueInput;
};
/**
 * income_sources findFirst
 */
export type income_sourcesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which income_sources to fetch.
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of income_sources to fetch.
     */
    orderBy?: Prisma.income_sourcesOrderByWithRelationInput | Prisma.income_sourcesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for income_sources.
     */
    cursor?: Prisma.income_sourcesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` income_sources from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` income_sources.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of income_sources.
     */
    distinct?: Prisma.Income_sourcesScalarFieldEnum | Prisma.Income_sourcesScalarFieldEnum[];
};
/**
 * income_sources findFirstOrThrow
 */
export type income_sourcesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which income_sources to fetch.
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of income_sources to fetch.
     */
    orderBy?: Prisma.income_sourcesOrderByWithRelationInput | Prisma.income_sourcesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for income_sources.
     */
    cursor?: Prisma.income_sourcesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` income_sources from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` income_sources.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of income_sources.
     */
    distinct?: Prisma.Income_sourcesScalarFieldEnum | Prisma.Income_sourcesScalarFieldEnum[];
};
/**
 * income_sources findMany
 */
export type income_sourcesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which income_sources to fetch.
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of income_sources to fetch.
     */
    orderBy?: Prisma.income_sourcesOrderByWithRelationInput | Prisma.income_sourcesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing income_sources.
     */
    cursor?: Prisma.income_sourcesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` income_sources from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` income_sources.
     */
    skip?: number;
    distinct?: Prisma.Income_sourcesScalarFieldEnum | Prisma.Income_sourcesScalarFieldEnum[];
};
/**
 * income_sources create
 */
export type income_sourcesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a income_sources.
     */
    data: Prisma.XOR<Prisma.income_sourcesCreateInput, Prisma.income_sourcesUncheckedCreateInput>;
};
/**
 * income_sources createMany
 */
export type income_sourcesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many income_sources.
     */
    data: Prisma.income_sourcesCreateManyInput | Prisma.income_sourcesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * income_sources update
 */
export type income_sourcesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a income_sources.
     */
    data: Prisma.XOR<Prisma.income_sourcesUpdateInput, Prisma.income_sourcesUncheckedUpdateInput>;
    /**
     * Choose, which income_sources to update.
     */
    where: Prisma.income_sourcesWhereUniqueInput;
};
/**
 * income_sources updateMany
 */
export type income_sourcesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update income_sources.
     */
    data: Prisma.XOR<Prisma.income_sourcesUpdateManyMutationInput, Prisma.income_sourcesUncheckedUpdateManyInput>;
    /**
     * Filter which income_sources to update
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * Limit how many income_sources to update.
     */
    limit?: number;
};
/**
 * income_sources upsert
 */
export type income_sourcesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the income_sources to update in case it exists.
     */
    where: Prisma.income_sourcesWhereUniqueInput;
    /**
     * In case the income_sources found by the `where` argument doesn't exist, create a new income_sources with this data.
     */
    create: Prisma.XOR<Prisma.income_sourcesCreateInput, Prisma.income_sourcesUncheckedCreateInput>;
    /**
     * In case the income_sources was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.income_sourcesUpdateInput, Prisma.income_sourcesUncheckedUpdateInput>;
};
/**
 * income_sources delete
 */
export type income_sourcesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which income_sources to delete.
     */
    where: Prisma.income_sourcesWhereUniqueInput;
};
/**
 * income_sources deleteMany
 */
export type income_sourcesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which income_sources to delete
     */
    where?: Prisma.income_sourcesWhereInput;
    /**
     * Limit how many income_sources to delete.
     */
    limit?: number;
};
/**
 * income_sources.transactions
 */
export type income_sources$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * income_sources without action
 */
export type income_sourcesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=income_sources.d.ts.map