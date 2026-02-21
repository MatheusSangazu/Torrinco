import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model reminder_logs
 *
 */
export type reminder_logsModel = runtime.Types.Result.DefaultSelection<Prisma.$reminder_logsPayload>;
export type AggregateReminder_logs = {
    _count: Reminder_logsCountAggregateOutputType | null;
    _avg: Reminder_logsAvgAggregateOutputType | null;
    _sum: Reminder_logsSumAggregateOutputType | null;
    _min: Reminder_logsMinAggregateOutputType | null;
    _max: Reminder_logsMaxAggregateOutputType | null;
};
export type Reminder_logsAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Reminder_logsSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Reminder_logsMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    event_identifier: string | null;
    source_type: $Enums.reminder_logs_source_type | null;
    reminder_type_new: $Enums.reminder_logs_reminder_type_new | null;
    reminder_type: $Enums.reminder_logs_reminder_type | null;
    sent_at: Date | null;
};
export type Reminder_logsMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    event_identifier: string | null;
    source_type: $Enums.reminder_logs_source_type | null;
    reminder_type_new: $Enums.reminder_logs_reminder_type_new | null;
    reminder_type: $Enums.reminder_logs_reminder_type | null;
    sent_at: Date | null;
};
export type Reminder_logsCountAggregateOutputType = {
    id: number;
    user_id: number;
    event_identifier: number;
    source_type: number;
    reminder_type_new: number;
    reminder_type: number;
    sent_at: number;
    _all: number;
};
export type Reminder_logsAvgAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Reminder_logsSumAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Reminder_logsMinAggregateInputType = {
    id?: true;
    user_id?: true;
    event_identifier?: true;
    source_type?: true;
    reminder_type_new?: true;
    reminder_type?: true;
    sent_at?: true;
};
export type Reminder_logsMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    event_identifier?: true;
    source_type?: true;
    reminder_type_new?: true;
    reminder_type?: true;
    sent_at?: true;
};
export type Reminder_logsCountAggregateInputType = {
    id?: true;
    user_id?: true;
    event_identifier?: true;
    source_type?: true;
    reminder_type_new?: true;
    reminder_type?: true;
    sent_at?: true;
    _all?: true;
};
export type Reminder_logsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which reminder_logs to aggregate.
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminder_logs to fetch.
     */
    orderBy?: Prisma.reminder_logsOrderByWithRelationInput | Prisma.reminder_logsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.reminder_logsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminder_logs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminder_logs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned reminder_logs
    **/
    _count?: true | Reminder_logsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Reminder_logsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Reminder_logsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Reminder_logsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Reminder_logsMaxAggregateInputType;
};
export type GetReminder_logsAggregateType<T extends Reminder_logsAggregateArgs> = {
    [P in keyof T & keyof AggregateReminder_logs]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReminder_logs[P]> : Prisma.GetScalarType<T[P], AggregateReminder_logs[P]>;
};
export type reminder_logsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.reminder_logsWhereInput;
    orderBy?: Prisma.reminder_logsOrderByWithAggregationInput | Prisma.reminder_logsOrderByWithAggregationInput[];
    by: Prisma.Reminder_logsScalarFieldEnum[] | Prisma.Reminder_logsScalarFieldEnum;
    having?: Prisma.reminder_logsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Reminder_logsCountAggregateInputType | true;
    _avg?: Reminder_logsAvgAggregateInputType;
    _sum?: Reminder_logsSumAggregateInputType;
    _min?: Reminder_logsMinAggregateInputType;
    _max?: Reminder_logsMaxAggregateInputType;
};
export type Reminder_logsGroupByOutputType = {
    id: number;
    user_id: number;
    event_identifier: string;
    source_type: $Enums.reminder_logs_source_type;
    reminder_type_new: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at: Date | null;
    _count: Reminder_logsCountAggregateOutputType | null;
    _avg: Reminder_logsAvgAggregateOutputType | null;
    _sum: Reminder_logsSumAggregateOutputType | null;
    _min: Reminder_logsMinAggregateOutputType | null;
    _max: Reminder_logsMaxAggregateOutputType | null;
};
type GetReminder_logsGroupByPayload<T extends reminder_logsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Reminder_logsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Reminder_logsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Reminder_logsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Reminder_logsGroupByOutputType[P]>;
}>>;
export type reminder_logsWhereInput = {
    AND?: Prisma.reminder_logsWhereInput | Prisma.reminder_logsWhereInput[];
    OR?: Prisma.reminder_logsWhereInput[];
    NOT?: Prisma.reminder_logsWhereInput | Prisma.reminder_logsWhereInput[];
    id?: Prisma.IntFilter<"reminder_logs"> | number;
    user_id?: Prisma.IntFilter<"reminder_logs"> | number;
    event_identifier?: Prisma.StringFilter<"reminder_logs"> | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFilter<"reminder_logs"> | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.DateTimeNullableFilter<"reminder_logs"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
};
export type reminder_logsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    event_identifier?: Prisma.SortOrder;
    source_type?: Prisma.SortOrder;
    reminder_type_new?: Prisma.SortOrder;
    reminder_type?: Prisma.SortOrder;
    sent_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    _relevance?: Prisma.reminder_logsOrderByRelevanceInput;
};
export type reminder_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    user_id_event_identifier_source_type_reminder_type_new_sent_at?: Prisma.reminder_logsUser_idEvent_identifierSource_typeReminder_type_newSent_atCompoundUniqueInput;
    AND?: Prisma.reminder_logsWhereInput | Prisma.reminder_logsWhereInput[];
    OR?: Prisma.reminder_logsWhereInput[];
    NOT?: Prisma.reminder_logsWhereInput | Prisma.reminder_logsWhereInput[];
    user_id?: Prisma.IntFilter<"reminder_logs"> | number;
    event_identifier?: Prisma.StringFilter<"reminder_logs"> | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFilter<"reminder_logs"> | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.DateTimeNullableFilter<"reminder_logs"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
}, "id" | "user_id_event_identifier_source_type_reminder_type_new_sent_at">;
export type reminder_logsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    event_identifier?: Prisma.SortOrder;
    source_type?: Prisma.SortOrder;
    reminder_type_new?: Prisma.SortOrder;
    reminder_type?: Prisma.SortOrder;
    sent_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.reminder_logsCountOrderByAggregateInput;
    _avg?: Prisma.reminder_logsAvgOrderByAggregateInput;
    _max?: Prisma.reminder_logsMaxOrderByAggregateInput;
    _min?: Prisma.reminder_logsMinOrderByAggregateInput;
    _sum?: Prisma.reminder_logsSumOrderByAggregateInput;
};
export type reminder_logsScalarWhereWithAggregatesInput = {
    AND?: Prisma.reminder_logsScalarWhereWithAggregatesInput | Prisma.reminder_logsScalarWhereWithAggregatesInput[];
    OR?: Prisma.reminder_logsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.reminder_logsScalarWhereWithAggregatesInput | Prisma.reminder_logsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"reminder_logs"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"reminder_logs"> | number;
    event_identifier?: Prisma.StringWithAggregatesFilter<"reminder_logs"> | string;
    source_type?: Prisma.Enumreminder_logs_source_typeWithAggregatesFilter<"reminder_logs"> | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newWithAggregatesFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeWithAggregatesFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.DateTimeNullableWithAggregatesFilter<"reminder_logs"> | Date | string | null;
};
export type reminder_logsCreateInput = {
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutReminder_logsInput;
};
export type reminder_logsUncheckedCreateInput = {
    id?: number;
    user_id: number;
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
};
export type reminder_logsUpdateInput = {
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutReminder_logsNestedInput;
};
export type reminder_logsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsCreateManyInput = {
    id?: number;
    user_id: number;
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
};
export type reminder_logsUpdateManyMutationInput = {
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsOrderByRelevanceInput = {
    fields: Prisma.reminder_logsOrderByRelevanceFieldEnum | Prisma.reminder_logsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type reminder_logsUser_idEvent_identifierSource_typeReminder_type_newSent_atCompoundUniqueInput = {
    user_id: number;
    event_identifier: string;
    source_type: $Enums.reminder_logs_source_type;
    reminder_type_new: $Enums.reminder_logs_reminder_type_new;
    sent_at: Date | string;
};
export type reminder_logsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    event_identifier?: Prisma.SortOrder;
    source_type?: Prisma.SortOrder;
    reminder_type_new?: Prisma.SortOrder;
    reminder_type?: Prisma.SortOrder;
    sent_at?: Prisma.SortOrder;
};
export type reminder_logsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type reminder_logsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    event_identifier?: Prisma.SortOrder;
    source_type?: Prisma.SortOrder;
    reminder_type_new?: Prisma.SortOrder;
    reminder_type?: Prisma.SortOrder;
    sent_at?: Prisma.SortOrder;
};
export type reminder_logsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    event_identifier?: Prisma.SortOrder;
    source_type?: Prisma.SortOrder;
    reminder_type_new?: Prisma.SortOrder;
    reminder_type?: Prisma.SortOrder;
    sent_at?: Prisma.SortOrder;
};
export type reminder_logsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type Reminder_logsListRelationFilter = {
    every?: Prisma.reminder_logsWhereInput;
    some?: Prisma.reminder_logsWhereInput;
    none?: Prisma.reminder_logsWhereInput;
};
export type reminder_logsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Enumreminder_logs_source_typeFieldUpdateOperationsInput = {
    set?: $Enums.reminder_logs_source_type;
};
export type Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput = {
    set?: $Enums.reminder_logs_reminder_type_new;
};
export type Enumreminder_logs_reminder_typeFieldUpdateOperationsInput = {
    set?: $Enums.reminder_logs_reminder_type;
};
export type reminder_logsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput> | Prisma.reminder_logsCreateWithoutUsersInput[] | Prisma.reminder_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.reminder_logsCreateOrConnectWithoutUsersInput | Prisma.reminder_logsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.reminder_logsCreateManyUsersInputEnvelope;
    connect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
};
export type reminder_logsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput> | Prisma.reminder_logsCreateWithoutUsersInput[] | Prisma.reminder_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.reminder_logsCreateOrConnectWithoutUsersInput | Prisma.reminder_logsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.reminder_logsCreateManyUsersInputEnvelope;
    connect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
};
export type reminder_logsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput> | Prisma.reminder_logsCreateWithoutUsersInput[] | Prisma.reminder_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.reminder_logsCreateOrConnectWithoutUsersInput | Prisma.reminder_logsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.reminder_logsUpsertWithWhereUniqueWithoutUsersInput | Prisma.reminder_logsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.reminder_logsCreateManyUsersInputEnvelope;
    set?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    disconnect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    delete?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    connect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    update?: Prisma.reminder_logsUpdateWithWhereUniqueWithoutUsersInput | Prisma.reminder_logsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.reminder_logsUpdateManyWithWhereWithoutUsersInput | Prisma.reminder_logsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.reminder_logsScalarWhereInput | Prisma.reminder_logsScalarWhereInput[];
};
export type reminder_logsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput> | Prisma.reminder_logsCreateWithoutUsersInput[] | Prisma.reminder_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.reminder_logsCreateOrConnectWithoutUsersInput | Prisma.reminder_logsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.reminder_logsUpsertWithWhereUniqueWithoutUsersInput | Prisma.reminder_logsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.reminder_logsCreateManyUsersInputEnvelope;
    set?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    disconnect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    delete?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    connect?: Prisma.reminder_logsWhereUniqueInput | Prisma.reminder_logsWhereUniqueInput[];
    update?: Prisma.reminder_logsUpdateWithWhereUniqueWithoutUsersInput | Prisma.reminder_logsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.reminder_logsUpdateManyWithWhereWithoutUsersInput | Prisma.reminder_logsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.reminder_logsScalarWhereInput | Prisma.reminder_logsScalarWhereInput[];
};
export type reminder_logsCreateWithoutUsersInput = {
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
};
export type reminder_logsUncheckedCreateWithoutUsersInput = {
    id?: number;
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
};
export type reminder_logsCreateOrConnectWithoutUsersInput = {
    where: Prisma.reminder_logsWhereUniqueInput;
    create: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput>;
};
export type reminder_logsCreateManyUsersInputEnvelope = {
    data: Prisma.reminder_logsCreateManyUsersInput | Prisma.reminder_logsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type reminder_logsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.reminder_logsWhereUniqueInput;
    update: Prisma.XOR<Prisma.reminder_logsUpdateWithoutUsersInput, Prisma.reminder_logsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.reminder_logsCreateWithoutUsersInput, Prisma.reminder_logsUncheckedCreateWithoutUsersInput>;
};
export type reminder_logsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.reminder_logsWhereUniqueInput;
    data: Prisma.XOR<Prisma.reminder_logsUpdateWithoutUsersInput, Prisma.reminder_logsUncheckedUpdateWithoutUsersInput>;
};
export type reminder_logsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.reminder_logsScalarWhereInput;
    data: Prisma.XOR<Prisma.reminder_logsUpdateManyMutationInput, Prisma.reminder_logsUncheckedUpdateManyWithoutUsersInput>;
};
export type reminder_logsScalarWhereInput = {
    AND?: Prisma.reminder_logsScalarWhereInput | Prisma.reminder_logsScalarWhereInput[];
    OR?: Prisma.reminder_logsScalarWhereInput[];
    NOT?: Prisma.reminder_logsScalarWhereInput | Prisma.reminder_logsScalarWhereInput[];
    id?: Prisma.IntFilter<"reminder_logs"> | number;
    user_id?: Prisma.IntFilter<"reminder_logs"> | number;
    event_identifier?: Prisma.StringFilter<"reminder_logs"> | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFilter<"reminder_logs"> | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFilter<"reminder_logs"> | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.DateTimeNullableFilter<"reminder_logs"> | Date | string | null;
};
export type reminder_logsCreateManyUsersInput = {
    id?: number;
    event_identifier: string;
    source_type?: $Enums.reminder_logs_source_type;
    reminder_type_new?: $Enums.reminder_logs_reminder_type_new;
    reminder_type: $Enums.reminder_logs_reminder_type;
    sent_at?: Date | string | null;
};
export type reminder_logsUpdateWithoutUsersInput = {
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    event_identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    source_type?: Prisma.Enumreminder_logs_source_typeFieldUpdateOperationsInput | $Enums.reminder_logs_source_type;
    reminder_type_new?: Prisma.Enumreminder_logs_reminder_type_newFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type_new;
    reminder_type?: Prisma.Enumreminder_logs_reminder_typeFieldUpdateOperationsInput | $Enums.reminder_logs_reminder_type;
    sent_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type reminder_logsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    event_identifier?: boolean;
    source_type?: boolean;
    reminder_type_new?: boolean;
    reminder_type?: boolean;
    sent_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reminder_logs"]>;
export type reminder_logsSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    event_identifier?: boolean;
    source_type?: boolean;
    reminder_type_new?: boolean;
    reminder_type?: boolean;
    sent_at?: boolean;
};
export type reminder_logsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "event_identifier" | "source_type" | "reminder_type_new" | "reminder_type" | "sent_at", ExtArgs["result"]["reminder_logs"]>;
export type reminder_logsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type $reminder_logsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "reminder_logs";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        event_identifier: string;
        source_type: $Enums.reminder_logs_source_type;
        reminder_type_new: $Enums.reminder_logs_reminder_type_new;
        reminder_type: $Enums.reminder_logs_reminder_type;
        sent_at: Date | null;
    }, ExtArgs["result"]["reminder_logs"]>;
    composites: {};
};
export type reminder_logsGetPayload<S extends boolean | null | undefined | reminder_logsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload, S>;
export type reminder_logsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<reminder_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Reminder_logsCountAggregateInputType | true;
};
export interface reminder_logsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['reminder_logs'];
        meta: {
            name: 'reminder_logs';
        };
    };
    /**
     * Find zero or one Reminder_logs that matches the filter.
     * @param {reminder_logsFindUniqueArgs} args - Arguments to find a Reminder_logs
     * @example
     * // Get one Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reminder_logsFindUniqueArgs>(args: Prisma.SelectSubset<T, reminder_logsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Reminder_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reminder_logsFindUniqueOrThrowArgs} args - Arguments to find a Reminder_logs
     * @example
     * // Get one Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reminder_logsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, reminder_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Reminder_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsFindFirstArgs} args - Arguments to find a Reminder_logs
     * @example
     * // Get one Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reminder_logsFindFirstArgs>(args?: Prisma.SelectSubset<T, reminder_logsFindFirstArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Reminder_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsFindFirstOrThrowArgs} args - Arguments to find a Reminder_logs
     * @example
     * // Get one Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reminder_logsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, reminder_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Reminder_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findMany()
     *
     * // Get first 10 Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const reminder_logsWithIdOnly = await prisma.reminder_logs.findMany({ select: { id: true } })
     *
     */
    findMany<T extends reminder_logsFindManyArgs>(args?: Prisma.SelectSubset<T, reminder_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Reminder_logs.
     * @param {reminder_logsCreateArgs} args - Arguments to create a Reminder_logs.
     * @example
     * // Create one Reminder_logs
     * const Reminder_logs = await prisma.reminder_logs.create({
     *   data: {
     *     // ... data to create a Reminder_logs
     *   }
     * })
     *
     */
    create<T extends reminder_logsCreateArgs>(args: Prisma.SelectSubset<T, reminder_logsCreateArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Reminder_logs.
     * @param {reminder_logsCreateManyArgs} args - Arguments to create many Reminder_logs.
     * @example
     * // Create many Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends reminder_logsCreateManyArgs>(args?: Prisma.SelectSubset<T, reminder_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Reminder_logs.
     * @param {reminder_logsDeleteArgs} args - Arguments to delete one Reminder_logs.
     * @example
     * // Delete one Reminder_logs
     * const Reminder_logs = await prisma.reminder_logs.delete({
     *   where: {
     *     // ... filter to delete one Reminder_logs
     *   }
     * })
     *
     */
    delete<T extends reminder_logsDeleteArgs>(args: Prisma.SelectSubset<T, reminder_logsDeleteArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Reminder_logs.
     * @param {reminder_logsUpdateArgs} args - Arguments to update one Reminder_logs.
     * @example
     * // Update one Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends reminder_logsUpdateArgs>(args: Prisma.SelectSubset<T, reminder_logsUpdateArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Reminder_logs.
     * @param {reminder_logsDeleteManyArgs} args - Arguments to filter Reminder_logs to delete.
     * @example
     * // Delete a few Reminder_logs
     * const { count } = await prisma.reminder_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends reminder_logsDeleteManyArgs>(args?: Prisma.SelectSubset<T, reminder_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Reminder_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends reminder_logsUpdateManyArgs>(args: Prisma.SelectSubset<T, reminder_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Reminder_logs.
     * @param {reminder_logsUpsertArgs} args - Arguments to update or create a Reminder_logs.
     * @example
     * // Update or create a Reminder_logs
     * const reminder_logs = await prisma.reminder_logs.upsert({
     *   create: {
     *     // ... data to create a Reminder_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reminder_logs we want to update
     *   }
     * })
     */
    upsert<T extends reminder_logsUpsertArgs>(args: Prisma.SelectSubset<T, reminder_logsUpsertArgs<ExtArgs>>): Prisma.Prisma__reminder_logsClient<runtime.Types.Result.GetResult<Prisma.$reminder_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Reminder_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsCountArgs} args - Arguments to filter Reminder_logs to count.
     * @example
     * // Count the number of Reminder_logs
     * const count = await prisma.reminder_logs.count({
     *   where: {
     *     // ... the filter for the Reminder_logs we want to count
     *   }
     * })
    **/
    count<T extends reminder_logsCountArgs>(args?: Prisma.Subset<T, reminder_logsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Reminder_logsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Reminder_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Reminder_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Reminder_logsAggregateArgs>(args: Prisma.Subset<T, Reminder_logsAggregateArgs>): Prisma.PrismaPromise<GetReminder_logsAggregateType<T>>;
    /**
     * Group by Reminder_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reminder_logsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends reminder_logsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: reminder_logsGroupByArgs['orderBy'];
    } : {
        orderBy?: reminder_logsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, reminder_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReminder_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the reminder_logs model
     */
    readonly fields: reminder_logsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for reminder_logs.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__reminder_logsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the reminder_logs model
 */
export interface reminder_logsFieldRefs {
    readonly id: Prisma.FieldRef<"reminder_logs", 'Int'>;
    readonly user_id: Prisma.FieldRef<"reminder_logs", 'Int'>;
    readonly event_identifier: Prisma.FieldRef<"reminder_logs", 'String'>;
    readonly source_type: Prisma.FieldRef<"reminder_logs", 'reminder_logs_source_type'>;
    readonly reminder_type_new: Prisma.FieldRef<"reminder_logs", 'reminder_logs_reminder_type_new'>;
    readonly reminder_type: Prisma.FieldRef<"reminder_logs", 'reminder_logs_reminder_type'>;
    readonly sent_at: Prisma.FieldRef<"reminder_logs", 'DateTime'>;
}
/**
 * reminder_logs findUnique
 */
export type reminder_logsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminder_logs to fetch.
     */
    where: Prisma.reminder_logsWhereUniqueInput;
};
/**
 * reminder_logs findUniqueOrThrow
 */
export type reminder_logsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminder_logs to fetch.
     */
    where: Prisma.reminder_logsWhereUniqueInput;
};
/**
 * reminder_logs findFirst
 */
export type reminder_logsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminder_logs to fetch.
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminder_logs to fetch.
     */
    orderBy?: Prisma.reminder_logsOrderByWithRelationInput | Prisma.reminder_logsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for reminder_logs.
     */
    cursor?: Prisma.reminder_logsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminder_logs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminder_logs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of reminder_logs.
     */
    distinct?: Prisma.Reminder_logsScalarFieldEnum | Prisma.Reminder_logsScalarFieldEnum[];
};
/**
 * reminder_logs findFirstOrThrow
 */
export type reminder_logsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminder_logs to fetch.
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminder_logs to fetch.
     */
    orderBy?: Prisma.reminder_logsOrderByWithRelationInput | Prisma.reminder_logsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for reminder_logs.
     */
    cursor?: Prisma.reminder_logsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminder_logs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminder_logs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of reminder_logs.
     */
    distinct?: Prisma.Reminder_logsScalarFieldEnum | Prisma.Reminder_logsScalarFieldEnum[];
};
/**
 * reminder_logs findMany
 */
export type reminder_logsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminder_logs to fetch.
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminder_logs to fetch.
     */
    orderBy?: Prisma.reminder_logsOrderByWithRelationInput | Prisma.reminder_logsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing reminder_logs.
     */
    cursor?: Prisma.reminder_logsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminder_logs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminder_logs.
     */
    skip?: number;
    distinct?: Prisma.Reminder_logsScalarFieldEnum | Prisma.Reminder_logsScalarFieldEnum[];
};
/**
 * reminder_logs create
 */
export type reminder_logsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a reminder_logs.
     */
    data: Prisma.XOR<Prisma.reminder_logsCreateInput, Prisma.reminder_logsUncheckedCreateInput>;
};
/**
 * reminder_logs createMany
 */
export type reminder_logsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many reminder_logs.
     */
    data: Prisma.reminder_logsCreateManyInput | Prisma.reminder_logsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * reminder_logs update
 */
export type reminder_logsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a reminder_logs.
     */
    data: Prisma.XOR<Prisma.reminder_logsUpdateInput, Prisma.reminder_logsUncheckedUpdateInput>;
    /**
     * Choose, which reminder_logs to update.
     */
    where: Prisma.reminder_logsWhereUniqueInput;
};
/**
 * reminder_logs updateMany
 */
export type reminder_logsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update reminder_logs.
     */
    data: Prisma.XOR<Prisma.reminder_logsUpdateManyMutationInput, Prisma.reminder_logsUncheckedUpdateManyInput>;
    /**
     * Filter which reminder_logs to update
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * Limit how many reminder_logs to update.
     */
    limit?: number;
};
/**
 * reminder_logs upsert
 */
export type reminder_logsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the reminder_logs to update in case it exists.
     */
    where: Prisma.reminder_logsWhereUniqueInput;
    /**
     * In case the reminder_logs found by the `where` argument doesn't exist, create a new reminder_logs with this data.
     */
    create: Prisma.XOR<Prisma.reminder_logsCreateInput, Prisma.reminder_logsUncheckedCreateInput>;
    /**
     * In case the reminder_logs was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.reminder_logsUpdateInput, Prisma.reminder_logsUncheckedUpdateInput>;
};
/**
 * reminder_logs delete
 */
export type reminder_logsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which reminder_logs to delete.
     */
    where: Prisma.reminder_logsWhereUniqueInput;
};
/**
 * reminder_logs deleteMany
 */
export type reminder_logsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which reminder_logs to delete
     */
    where?: Prisma.reminder_logsWhereInput;
    /**
     * Limit how many reminder_logs to delete.
     */
    limit?: number;
};
/**
 * reminder_logs without action
 */
export type reminder_logsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=reminder_logs.d.ts.map