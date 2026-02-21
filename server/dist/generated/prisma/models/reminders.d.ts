import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model reminders
 *
 */
export type remindersModel = runtime.Types.Result.DefaultSelection<Prisma.$remindersPayload>;
export type AggregateReminders = {
    _count: RemindersCountAggregateOutputType | null;
    _avg: RemindersAvgAggregateOutputType | null;
    _sum: RemindersSumAggregateOutputType | null;
    _min: RemindersMinAggregateOutputType | null;
    _max: RemindersMaxAggregateOutputType | null;
};
export type RemindersAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type RemindersSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type RemindersMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    content: string | null;
    trigger_time: Date | null;
    frequency: $Enums.reminders_frequency | null;
    specific_date: Date | null;
    weekday: $Enums.reminders_weekday | null;
    status: $Enums.reminders_status | null;
    created_at: Date | null;
};
export type RemindersMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    content: string | null;
    trigger_time: Date | null;
    frequency: $Enums.reminders_frequency | null;
    specific_date: Date | null;
    weekday: $Enums.reminders_weekday | null;
    status: $Enums.reminders_status | null;
    created_at: Date | null;
};
export type RemindersCountAggregateOutputType = {
    id: number;
    user_id: number;
    content: number;
    trigger_time: number;
    frequency: number;
    specific_date: number;
    weekday: number;
    status: number;
    created_at: number;
    _all: number;
};
export type RemindersAvgAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type RemindersSumAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type RemindersMinAggregateInputType = {
    id?: true;
    user_id?: true;
    content?: true;
    trigger_time?: true;
    frequency?: true;
    specific_date?: true;
    weekday?: true;
    status?: true;
    created_at?: true;
};
export type RemindersMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    content?: true;
    trigger_time?: true;
    frequency?: true;
    specific_date?: true;
    weekday?: true;
    status?: true;
    created_at?: true;
};
export type RemindersCountAggregateInputType = {
    id?: true;
    user_id?: true;
    content?: true;
    trigger_time?: true;
    frequency?: true;
    specific_date?: true;
    weekday?: true;
    status?: true;
    created_at?: true;
    _all?: true;
};
export type RemindersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which reminders to aggregate.
     */
    where?: Prisma.remindersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminders to fetch.
     */
    orderBy?: Prisma.remindersOrderByWithRelationInput | Prisma.remindersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.remindersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned reminders
    **/
    _count?: true | RemindersCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: RemindersAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: RemindersSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RemindersMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RemindersMaxAggregateInputType;
};
export type GetRemindersAggregateType<T extends RemindersAggregateArgs> = {
    [P in keyof T & keyof AggregateReminders]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReminders[P]> : Prisma.GetScalarType<T[P], AggregateReminders[P]>;
};
export type remindersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.remindersWhereInput;
    orderBy?: Prisma.remindersOrderByWithAggregationInput | Prisma.remindersOrderByWithAggregationInput[];
    by: Prisma.RemindersScalarFieldEnum[] | Prisma.RemindersScalarFieldEnum;
    having?: Prisma.remindersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RemindersCountAggregateInputType | true;
    _avg?: RemindersAvgAggregateInputType;
    _sum?: RemindersSumAggregateInputType;
    _min?: RemindersMinAggregateInputType;
    _max?: RemindersMaxAggregateInputType;
};
export type RemindersGroupByOutputType = {
    id: number;
    user_id: number;
    content: string;
    trigger_time: Date;
    frequency: $Enums.reminders_frequency | null;
    specific_date: Date | null;
    weekday: $Enums.reminders_weekday | null;
    status: $Enums.reminders_status | null;
    created_at: Date | null;
    _count: RemindersCountAggregateOutputType | null;
    _avg: RemindersAvgAggregateOutputType | null;
    _sum: RemindersSumAggregateOutputType | null;
    _min: RemindersMinAggregateOutputType | null;
    _max: RemindersMaxAggregateOutputType | null;
};
type GetRemindersGroupByPayload<T extends remindersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RemindersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RemindersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RemindersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RemindersGroupByOutputType[P]>;
}>>;
export type remindersWhereInput = {
    AND?: Prisma.remindersWhereInput | Prisma.remindersWhereInput[];
    OR?: Prisma.remindersWhereInput[];
    NOT?: Prisma.remindersWhereInput | Prisma.remindersWhereInput[];
    id?: Prisma.IntFilter<"reminders"> | number;
    user_id?: Prisma.IntFilter<"reminders"> | number;
    content?: Prisma.StringFilter<"reminders"> | string;
    trigger_time?: Prisma.DateTimeFilter<"reminders"> | Date | string;
    frequency?: Prisma.Enumreminders_frequencyNullableFilter<"reminders"> | $Enums.reminders_frequency | null;
    specific_date?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
    weekday?: Prisma.Enumreminders_weekdayNullableFilter<"reminders"> | $Enums.reminders_weekday | null;
    status?: Prisma.Enumreminders_statusNullableFilter<"reminders"> | $Enums.reminders_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
};
export type remindersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    trigger_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrderInput | Prisma.SortOrder;
    specific_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    weekday?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    _relevance?: Prisma.remindersOrderByRelevanceInput;
};
export type remindersWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.remindersWhereInput | Prisma.remindersWhereInput[];
    OR?: Prisma.remindersWhereInput[];
    NOT?: Prisma.remindersWhereInput | Prisma.remindersWhereInput[];
    user_id?: Prisma.IntFilter<"reminders"> | number;
    content?: Prisma.StringFilter<"reminders"> | string;
    trigger_time?: Prisma.DateTimeFilter<"reminders"> | Date | string;
    frequency?: Prisma.Enumreminders_frequencyNullableFilter<"reminders"> | $Enums.reminders_frequency | null;
    specific_date?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
    weekday?: Prisma.Enumreminders_weekdayNullableFilter<"reminders"> | $Enums.reminders_weekday | null;
    status?: Prisma.Enumreminders_statusNullableFilter<"reminders"> | $Enums.reminders_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
}, "id">;
export type remindersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    trigger_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrderInput | Prisma.SortOrder;
    specific_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    weekday?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.remindersCountOrderByAggregateInput;
    _avg?: Prisma.remindersAvgOrderByAggregateInput;
    _max?: Prisma.remindersMaxOrderByAggregateInput;
    _min?: Prisma.remindersMinOrderByAggregateInput;
    _sum?: Prisma.remindersSumOrderByAggregateInput;
};
export type remindersScalarWhereWithAggregatesInput = {
    AND?: Prisma.remindersScalarWhereWithAggregatesInput | Prisma.remindersScalarWhereWithAggregatesInput[];
    OR?: Prisma.remindersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.remindersScalarWhereWithAggregatesInput | Prisma.remindersScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"reminders"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"reminders"> | number;
    content?: Prisma.StringWithAggregatesFilter<"reminders"> | string;
    trigger_time?: Prisma.DateTimeWithAggregatesFilter<"reminders"> | Date | string;
    frequency?: Prisma.Enumreminders_frequencyNullableWithAggregatesFilter<"reminders"> | $Enums.reminders_frequency | null;
    specific_date?: Prisma.DateTimeNullableWithAggregatesFilter<"reminders"> | Date | string | null;
    weekday?: Prisma.Enumreminders_weekdayNullableWithAggregatesFilter<"reminders"> | $Enums.reminders_weekday | null;
    status?: Prisma.Enumreminders_statusNullableWithAggregatesFilter<"reminders"> | $Enums.reminders_status | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"reminders"> | Date | string | null;
};
export type remindersCreateInput = {
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutRemindersInput;
};
export type remindersUncheckedCreateInput = {
    id?: number;
    user_id: number;
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
};
export type remindersUpdateInput = {
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutRemindersNestedInput;
};
export type remindersUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersCreateManyInput = {
    id?: number;
    user_id: number;
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
};
export type remindersUpdateManyMutationInput = {
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersOrderByRelevanceInput = {
    fields: Prisma.remindersOrderByRelevanceFieldEnum | Prisma.remindersOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type remindersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    trigger_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    specific_date?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type remindersAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type remindersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    trigger_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    specific_date?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type remindersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    trigger_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    specific_date?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type remindersSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type RemindersListRelationFilter = {
    every?: Prisma.remindersWhereInput;
    some?: Prisma.remindersWhereInput;
    none?: Prisma.remindersWhereInput;
};
export type remindersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NullableEnumreminders_frequencyFieldUpdateOperationsInput = {
    set?: $Enums.reminders_frequency | null;
};
export type NullableEnumreminders_weekdayFieldUpdateOperationsInput = {
    set?: $Enums.reminders_weekday | null;
};
export type NullableEnumreminders_statusFieldUpdateOperationsInput = {
    set?: $Enums.reminders_status | null;
};
export type remindersCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput> | Prisma.remindersCreateWithoutUsersInput[] | Prisma.remindersUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.remindersCreateOrConnectWithoutUsersInput | Prisma.remindersCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.remindersCreateManyUsersInputEnvelope;
    connect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
};
export type remindersUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput> | Prisma.remindersCreateWithoutUsersInput[] | Prisma.remindersUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.remindersCreateOrConnectWithoutUsersInput | Prisma.remindersCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.remindersCreateManyUsersInputEnvelope;
    connect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
};
export type remindersUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput> | Prisma.remindersCreateWithoutUsersInput[] | Prisma.remindersUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.remindersCreateOrConnectWithoutUsersInput | Prisma.remindersCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.remindersUpsertWithWhereUniqueWithoutUsersInput | Prisma.remindersUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.remindersCreateManyUsersInputEnvelope;
    set?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    disconnect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    delete?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    connect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    update?: Prisma.remindersUpdateWithWhereUniqueWithoutUsersInput | Prisma.remindersUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.remindersUpdateManyWithWhereWithoutUsersInput | Prisma.remindersUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.remindersScalarWhereInput | Prisma.remindersScalarWhereInput[];
};
export type remindersUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput> | Prisma.remindersCreateWithoutUsersInput[] | Prisma.remindersUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.remindersCreateOrConnectWithoutUsersInput | Prisma.remindersCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.remindersUpsertWithWhereUniqueWithoutUsersInput | Prisma.remindersUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.remindersCreateManyUsersInputEnvelope;
    set?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    disconnect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    delete?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    connect?: Prisma.remindersWhereUniqueInput | Prisma.remindersWhereUniqueInput[];
    update?: Prisma.remindersUpdateWithWhereUniqueWithoutUsersInput | Prisma.remindersUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.remindersUpdateManyWithWhereWithoutUsersInput | Prisma.remindersUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.remindersScalarWhereInput | Prisma.remindersScalarWhereInput[];
};
export type remindersCreateWithoutUsersInput = {
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
};
export type remindersUncheckedCreateWithoutUsersInput = {
    id?: number;
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
};
export type remindersCreateOrConnectWithoutUsersInput = {
    where: Prisma.remindersWhereUniqueInput;
    create: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput>;
};
export type remindersCreateManyUsersInputEnvelope = {
    data: Prisma.remindersCreateManyUsersInput | Prisma.remindersCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type remindersUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.remindersWhereUniqueInput;
    update: Prisma.XOR<Prisma.remindersUpdateWithoutUsersInput, Prisma.remindersUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.remindersCreateWithoutUsersInput, Prisma.remindersUncheckedCreateWithoutUsersInput>;
};
export type remindersUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.remindersWhereUniqueInput;
    data: Prisma.XOR<Prisma.remindersUpdateWithoutUsersInput, Prisma.remindersUncheckedUpdateWithoutUsersInput>;
};
export type remindersUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.remindersScalarWhereInput;
    data: Prisma.XOR<Prisma.remindersUpdateManyMutationInput, Prisma.remindersUncheckedUpdateManyWithoutUsersInput>;
};
export type remindersScalarWhereInput = {
    AND?: Prisma.remindersScalarWhereInput | Prisma.remindersScalarWhereInput[];
    OR?: Prisma.remindersScalarWhereInput[];
    NOT?: Prisma.remindersScalarWhereInput | Prisma.remindersScalarWhereInput[];
    id?: Prisma.IntFilter<"reminders"> | number;
    user_id?: Prisma.IntFilter<"reminders"> | number;
    content?: Prisma.StringFilter<"reminders"> | string;
    trigger_time?: Prisma.DateTimeFilter<"reminders"> | Date | string;
    frequency?: Prisma.Enumreminders_frequencyNullableFilter<"reminders"> | $Enums.reminders_frequency | null;
    specific_date?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
    weekday?: Prisma.Enumreminders_weekdayNullableFilter<"reminders"> | $Enums.reminders_weekday | null;
    status?: Prisma.Enumreminders_statusNullableFilter<"reminders"> | $Enums.reminders_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"reminders"> | Date | string | null;
};
export type remindersCreateManyUsersInput = {
    id?: number;
    content: string;
    trigger_time: Date | string;
    frequency?: $Enums.reminders_frequency | null;
    specific_date?: Date | string | null;
    weekday?: $Enums.reminders_weekday | null;
    status?: $Enums.reminders_status | null;
    created_at?: Date | string | null;
};
export type remindersUpdateWithoutUsersInput = {
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    trigger_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.NullableEnumreminders_frequencyFieldUpdateOperationsInput | $Enums.reminders_frequency | null;
    specific_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    weekday?: Prisma.NullableEnumreminders_weekdayFieldUpdateOperationsInput | $Enums.reminders_weekday | null;
    status?: Prisma.NullableEnumreminders_statusFieldUpdateOperationsInput | $Enums.reminders_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type remindersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    content?: boolean;
    trigger_time?: boolean;
    frequency?: boolean;
    specific_date?: boolean;
    weekday?: boolean;
    status?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reminders"]>;
export type remindersSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    content?: boolean;
    trigger_time?: boolean;
    frequency?: boolean;
    specific_date?: boolean;
    weekday?: boolean;
    status?: boolean;
    created_at?: boolean;
};
export type remindersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "content" | "trigger_time" | "frequency" | "specific_date" | "weekday" | "status" | "created_at", ExtArgs["result"]["reminders"]>;
export type remindersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type $remindersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "reminders";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        content: string;
        trigger_time: Date;
        frequency: $Enums.reminders_frequency | null;
        specific_date: Date | null;
        weekday: $Enums.reminders_weekday | null;
        status: $Enums.reminders_status | null;
        created_at: Date | null;
    }, ExtArgs["result"]["reminders"]>;
    composites: {};
};
export type remindersGetPayload<S extends boolean | null | undefined | remindersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$remindersPayload, S>;
export type remindersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<remindersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RemindersCountAggregateInputType | true;
};
export interface remindersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['reminders'];
        meta: {
            name: 'reminders';
        };
    };
    /**
     * Find zero or one Reminders that matches the filter.
     * @param {remindersFindUniqueArgs} args - Arguments to find a Reminders
     * @example
     * // Get one Reminders
     * const reminders = await prisma.reminders.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends remindersFindUniqueArgs>(args: Prisma.SelectSubset<T, remindersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Reminders that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {remindersFindUniqueOrThrowArgs} args - Arguments to find a Reminders
     * @example
     * // Get one Reminders
     * const reminders = await prisma.reminders.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends remindersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, remindersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Reminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersFindFirstArgs} args - Arguments to find a Reminders
     * @example
     * // Get one Reminders
     * const reminders = await prisma.reminders.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends remindersFindFirstArgs>(args?: Prisma.SelectSubset<T, remindersFindFirstArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Reminders that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersFindFirstOrThrowArgs} args - Arguments to find a Reminders
     * @example
     * // Get one Reminders
     * const reminders = await prisma.reminders.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends remindersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, remindersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Reminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reminders
     * const reminders = await prisma.reminders.findMany()
     *
     * // Get first 10 Reminders
     * const reminders = await prisma.reminders.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const remindersWithIdOnly = await prisma.reminders.findMany({ select: { id: true } })
     *
     */
    findMany<T extends remindersFindManyArgs>(args?: Prisma.SelectSubset<T, remindersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Reminders.
     * @param {remindersCreateArgs} args - Arguments to create a Reminders.
     * @example
     * // Create one Reminders
     * const Reminders = await prisma.reminders.create({
     *   data: {
     *     // ... data to create a Reminders
     *   }
     * })
     *
     */
    create<T extends remindersCreateArgs>(args: Prisma.SelectSubset<T, remindersCreateArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Reminders.
     * @param {remindersCreateManyArgs} args - Arguments to create many Reminders.
     * @example
     * // Create many Reminders
     * const reminders = await prisma.reminders.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends remindersCreateManyArgs>(args?: Prisma.SelectSubset<T, remindersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Reminders.
     * @param {remindersDeleteArgs} args - Arguments to delete one Reminders.
     * @example
     * // Delete one Reminders
     * const Reminders = await prisma.reminders.delete({
     *   where: {
     *     // ... filter to delete one Reminders
     *   }
     * })
     *
     */
    delete<T extends remindersDeleteArgs>(args: Prisma.SelectSubset<T, remindersDeleteArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Reminders.
     * @param {remindersUpdateArgs} args - Arguments to update one Reminders.
     * @example
     * // Update one Reminders
     * const reminders = await prisma.reminders.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends remindersUpdateArgs>(args: Prisma.SelectSubset<T, remindersUpdateArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Reminders.
     * @param {remindersDeleteManyArgs} args - Arguments to filter Reminders to delete.
     * @example
     * // Delete a few Reminders
     * const { count } = await prisma.reminders.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends remindersDeleteManyArgs>(args?: Prisma.SelectSubset<T, remindersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reminders
     * const reminders = await prisma.reminders.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends remindersUpdateManyArgs>(args: Prisma.SelectSubset<T, remindersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Reminders.
     * @param {remindersUpsertArgs} args - Arguments to update or create a Reminders.
     * @example
     * // Update or create a Reminders
     * const reminders = await prisma.reminders.upsert({
     *   create: {
     *     // ... data to create a Reminders
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reminders we want to update
     *   }
     * })
     */
    upsert<T extends remindersUpsertArgs>(args: Prisma.SelectSubset<T, remindersUpsertArgs<ExtArgs>>): Prisma.Prisma__remindersClient<runtime.Types.Result.GetResult<Prisma.$remindersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersCountArgs} args - Arguments to filter Reminders to count.
     * @example
     * // Count the number of Reminders
     * const count = await prisma.reminders.count({
     *   where: {
     *     // ... the filter for the Reminders we want to count
     *   }
     * })
    **/
    count<T extends remindersCountArgs>(args?: Prisma.Subset<T, remindersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RemindersCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RemindersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RemindersAggregateArgs>(args: Prisma.Subset<T, RemindersAggregateArgs>): Prisma.PrismaPromise<GetRemindersAggregateType<T>>;
    /**
     * Group by Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {remindersGroupByArgs} args - Group by arguments.
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
    groupBy<T extends remindersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: remindersGroupByArgs['orderBy'];
    } : {
        orderBy?: remindersGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, remindersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRemindersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the reminders model
     */
    readonly fields: remindersFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for reminders.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__remindersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the reminders model
 */
export interface remindersFieldRefs {
    readonly id: Prisma.FieldRef<"reminders", 'Int'>;
    readonly user_id: Prisma.FieldRef<"reminders", 'Int'>;
    readonly content: Prisma.FieldRef<"reminders", 'String'>;
    readonly trigger_time: Prisma.FieldRef<"reminders", 'DateTime'>;
    readonly frequency: Prisma.FieldRef<"reminders", 'reminders_frequency'>;
    readonly specific_date: Prisma.FieldRef<"reminders", 'DateTime'>;
    readonly weekday: Prisma.FieldRef<"reminders", 'reminders_weekday'>;
    readonly status: Prisma.FieldRef<"reminders", 'reminders_status'>;
    readonly created_at: Prisma.FieldRef<"reminders", 'DateTime'>;
}
/**
 * reminders findUnique
 */
export type remindersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminders to fetch.
     */
    where: Prisma.remindersWhereUniqueInput;
};
/**
 * reminders findUniqueOrThrow
 */
export type remindersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminders to fetch.
     */
    where: Prisma.remindersWhereUniqueInput;
};
/**
 * reminders findFirst
 */
export type remindersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminders to fetch.
     */
    where?: Prisma.remindersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminders to fetch.
     */
    orderBy?: Prisma.remindersOrderByWithRelationInput | Prisma.remindersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for reminders.
     */
    cursor?: Prisma.remindersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of reminders.
     */
    distinct?: Prisma.RemindersScalarFieldEnum | Prisma.RemindersScalarFieldEnum[];
};
/**
 * reminders findFirstOrThrow
 */
export type remindersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminders to fetch.
     */
    where?: Prisma.remindersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminders to fetch.
     */
    orderBy?: Prisma.remindersOrderByWithRelationInput | Prisma.remindersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for reminders.
     */
    cursor?: Prisma.remindersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of reminders.
     */
    distinct?: Prisma.RemindersScalarFieldEnum | Prisma.RemindersScalarFieldEnum[];
};
/**
 * reminders findMany
 */
export type remindersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which reminders to fetch.
     */
    where?: Prisma.remindersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of reminders to fetch.
     */
    orderBy?: Prisma.remindersOrderByWithRelationInput | Prisma.remindersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing reminders.
     */
    cursor?: Prisma.remindersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` reminders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` reminders.
     */
    skip?: number;
    distinct?: Prisma.RemindersScalarFieldEnum | Prisma.RemindersScalarFieldEnum[];
};
/**
 * reminders create
 */
export type remindersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a reminders.
     */
    data: Prisma.XOR<Prisma.remindersCreateInput, Prisma.remindersUncheckedCreateInput>;
};
/**
 * reminders createMany
 */
export type remindersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many reminders.
     */
    data: Prisma.remindersCreateManyInput | Prisma.remindersCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * reminders update
 */
export type remindersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a reminders.
     */
    data: Prisma.XOR<Prisma.remindersUpdateInput, Prisma.remindersUncheckedUpdateInput>;
    /**
     * Choose, which reminders to update.
     */
    where: Prisma.remindersWhereUniqueInput;
};
/**
 * reminders updateMany
 */
export type remindersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update reminders.
     */
    data: Prisma.XOR<Prisma.remindersUpdateManyMutationInput, Prisma.remindersUncheckedUpdateManyInput>;
    /**
     * Filter which reminders to update
     */
    where?: Prisma.remindersWhereInput;
    /**
     * Limit how many reminders to update.
     */
    limit?: number;
};
/**
 * reminders upsert
 */
export type remindersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the reminders to update in case it exists.
     */
    where: Prisma.remindersWhereUniqueInput;
    /**
     * In case the reminders found by the `where` argument doesn't exist, create a new reminders with this data.
     */
    create: Prisma.XOR<Prisma.remindersCreateInput, Prisma.remindersUncheckedCreateInput>;
    /**
     * In case the reminders was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.remindersUpdateInput, Prisma.remindersUncheckedUpdateInput>;
};
/**
 * reminders delete
 */
export type remindersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which reminders to delete.
     */
    where: Prisma.remindersWhereUniqueInput;
};
/**
 * reminders deleteMany
 */
export type remindersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which reminders to delete
     */
    where?: Prisma.remindersWhereInput;
    /**
     * Limit how many reminders to delete.
     */
    limit?: number;
};
/**
 * reminders without action
 */
export type remindersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=reminders.d.ts.map