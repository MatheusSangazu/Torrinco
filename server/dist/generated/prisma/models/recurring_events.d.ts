import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model recurring_events
 *
 */
export type recurring_eventsModel = runtime.Types.Result.DefaultSelection<Prisma.$recurring_eventsPayload>;
export type AggregateRecurring_events = {
    _count: Recurring_eventsCountAggregateOutputType | null;
    _avg: Recurring_eventsAvgAggregateOutputType | null;
    _sum: Recurring_eventsSumAggregateOutputType | null;
    _min: Recurring_eventsMinAggregateOutputType | null;
    _max: Recurring_eventsMaxAggregateOutputType | null;
};
export type Recurring_eventsAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Recurring_eventsSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
};
export type Recurring_eventsMinAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    google_event_id: string | null;
    title: string | null;
    description: string | null;
    event_time: Date | null;
    frequency: $Enums.recurring_events_frequency | null;
    start_date: Date | null;
    next_event_date: Date | null;
    status: $Enums.recurring_events_status | null;
    created_at: Date | null;
    end_date: Date | null;
};
export type Recurring_eventsMaxAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    google_event_id: string | null;
    title: string | null;
    description: string | null;
    event_time: Date | null;
    frequency: $Enums.recurring_events_frequency | null;
    start_date: Date | null;
    next_event_date: Date | null;
    status: $Enums.recurring_events_status | null;
    created_at: Date | null;
    end_date: Date | null;
};
export type Recurring_eventsCountAggregateOutputType = {
    id: number;
    user_id: number;
    google_event_id: number;
    title: number;
    description: number;
    event_time: number;
    frequency: number;
    start_date: number;
    next_event_date: number;
    status: number;
    created_at: number;
    end_date: number;
    _all: number;
};
export type Recurring_eventsAvgAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Recurring_eventsSumAggregateInputType = {
    id?: true;
    user_id?: true;
};
export type Recurring_eventsMinAggregateInputType = {
    id?: true;
    user_id?: true;
    google_event_id?: true;
    title?: true;
    description?: true;
    event_time?: true;
    frequency?: true;
    start_date?: true;
    next_event_date?: true;
    status?: true;
    created_at?: true;
    end_date?: true;
};
export type Recurring_eventsMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    google_event_id?: true;
    title?: true;
    description?: true;
    event_time?: true;
    frequency?: true;
    start_date?: true;
    next_event_date?: true;
    status?: true;
    created_at?: true;
    end_date?: true;
};
export type Recurring_eventsCountAggregateInputType = {
    id?: true;
    user_id?: true;
    google_event_id?: true;
    title?: true;
    description?: true;
    event_time?: true;
    frequency?: true;
    start_date?: true;
    next_event_date?: true;
    status?: true;
    created_at?: true;
    end_date?: true;
    _all?: true;
};
export type Recurring_eventsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_events to aggregate.
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_events to fetch.
     */
    orderBy?: Prisma.recurring_eventsOrderByWithRelationInput | Prisma.recurring_eventsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.recurring_eventsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned recurring_events
    **/
    _count?: true | Recurring_eventsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Recurring_eventsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Recurring_eventsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Recurring_eventsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Recurring_eventsMaxAggregateInputType;
};
export type GetRecurring_eventsAggregateType<T extends Recurring_eventsAggregateArgs> = {
    [P in keyof T & keyof AggregateRecurring_events]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRecurring_events[P]> : Prisma.GetScalarType<T[P], AggregateRecurring_events[P]>;
};
export type recurring_eventsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_eventsWhereInput;
    orderBy?: Prisma.recurring_eventsOrderByWithAggregationInput | Prisma.recurring_eventsOrderByWithAggregationInput[];
    by: Prisma.Recurring_eventsScalarFieldEnum[] | Prisma.Recurring_eventsScalarFieldEnum;
    having?: Prisma.recurring_eventsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Recurring_eventsCountAggregateInputType | true;
    _avg?: Recurring_eventsAvgAggregateInputType;
    _sum?: Recurring_eventsSumAggregateInputType;
    _min?: Recurring_eventsMinAggregateInputType;
    _max?: Recurring_eventsMaxAggregateInputType;
};
export type Recurring_eventsGroupByOutputType = {
    id: number;
    user_id: number;
    google_event_id: string | null;
    title: string;
    description: string | null;
    event_time: Date;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date;
    next_event_date: Date;
    status: $Enums.recurring_events_status | null;
    created_at: Date | null;
    end_date: Date | null;
    _count: Recurring_eventsCountAggregateOutputType | null;
    _avg: Recurring_eventsAvgAggregateOutputType | null;
    _sum: Recurring_eventsSumAggregateOutputType | null;
    _min: Recurring_eventsMinAggregateOutputType | null;
    _max: Recurring_eventsMaxAggregateOutputType | null;
};
type GetRecurring_eventsGroupByPayload<T extends recurring_eventsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Recurring_eventsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Recurring_eventsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Recurring_eventsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Recurring_eventsGroupByOutputType[P]>;
}>>;
export type recurring_eventsWhereInput = {
    AND?: Prisma.recurring_eventsWhereInput | Prisma.recurring_eventsWhereInput[];
    OR?: Prisma.recurring_eventsWhereInput[];
    NOT?: Prisma.recurring_eventsWhereInput | Prisma.recurring_eventsWhereInput[];
    id?: Prisma.IntFilter<"recurring_events"> | number;
    user_id?: Prisma.IntFilter<"recurring_events"> | number;
    google_event_id?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    title?: Prisma.StringFilter<"recurring_events"> | string;
    description?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    event_time?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFilter<"recurring_events"> | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    next_event_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    status?: Prisma.Enumrecurring_events_statusNullableFilter<"recurring_events"> | $Enums.recurring_events_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
};
export type recurring_eventsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    google_event_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    event_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_event_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    _relevance?: Prisma.recurring_eventsOrderByRelevanceInput;
};
export type recurring_eventsWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.recurring_eventsWhereInput | Prisma.recurring_eventsWhereInput[];
    OR?: Prisma.recurring_eventsWhereInput[];
    NOT?: Prisma.recurring_eventsWhereInput | Prisma.recurring_eventsWhereInput[];
    user_id?: Prisma.IntFilter<"recurring_events"> | number;
    google_event_id?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    title?: Prisma.StringFilter<"recurring_events"> | string;
    description?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    event_time?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFilter<"recurring_events"> | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    next_event_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    status?: Prisma.Enumrecurring_events_statusNullableFilter<"recurring_events"> | $Enums.recurring_events_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
}, "id">;
export type recurring_eventsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    google_event_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    event_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_event_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.recurring_eventsCountOrderByAggregateInput;
    _avg?: Prisma.recurring_eventsAvgOrderByAggregateInput;
    _max?: Prisma.recurring_eventsMaxOrderByAggregateInput;
    _min?: Prisma.recurring_eventsMinOrderByAggregateInput;
    _sum?: Prisma.recurring_eventsSumOrderByAggregateInput;
};
export type recurring_eventsScalarWhereWithAggregatesInput = {
    AND?: Prisma.recurring_eventsScalarWhereWithAggregatesInput | Prisma.recurring_eventsScalarWhereWithAggregatesInput[];
    OR?: Prisma.recurring_eventsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.recurring_eventsScalarWhereWithAggregatesInput | Prisma.recurring_eventsScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"recurring_events"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"recurring_events"> | number;
    google_event_id?: Prisma.StringNullableWithAggregatesFilter<"recurring_events"> | string | null;
    title?: Prisma.StringWithAggregatesFilter<"recurring_events"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"recurring_events"> | string | null;
    event_time?: Prisma.DateTimeWithAggregatesFilter<"recurring_events"> | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyWithAggregatesFilter<"recurring_events"> | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeWithAggregatesFilter<"recurring_events"> | Date | string;
    next_event_date?: Prisma.DateTimeWithAggregatesFilter<"recurring_events"> | Date | string;
    status?: Prisma.Enumrecurring_events_statusNullableWithAggregatesFilter<"recurring_events"> | $Enums.recurring_events_status | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"recurring_events"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableWithAggregatesFilter<"recurring_events"> | Date | string | null;
};
export type recurring_eventsCreateInput = {
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
    users: Prisma.usersCreateNestedOneWithoutRecurring_eventsInput;
};
export type recurring_eventsUncheckedCreateInput = {
    id?: number;
    user_id: number;
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
};
export type recurring_eventsUpdateInput = {
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.usersUpdateOneRequiredWithoutRecurring_eventsNestedInput;
};
export type recurring_eventsUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsCreateManyInput = {
    id?: number;
    user_id: number;
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
};
export type recurring_eventsUpdateManyMutationInput = {
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsOrderByRelevanceInput = {
    fields: Prisma.recurring_eventsOrderByRelevanceFieldEnum | Prisma.recurring_eventsOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type recurring_eventsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    google_event_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    event_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_event_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
};
export type recurring_eventsAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type recurring_eventsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    google_event_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    event_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_event_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
};
export type recurring_eventsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    google_event_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    event_time?: Prisma.SortOrder;
    frequency?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    next_event_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
};
export type recurring_eventsSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type Recurring_eventsListRelationFilter = {
    every?: Prisma.recurring_eventsWhereInput;
    some?: Prisma.recurring_eventsWhereInput;
    none?: Prisma.recurring_eventsWhereInput;
};
export type recurring_eventsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Enumrecurring_events_frequencyFieldUpdateOperationsInput = {
    set?: $Enums.recurring_events_frequency;
};
export type NullableEnumrecurring_events_statusFieldUpdateOperationsInput = {
    set?: $Enums.recurring_events_status | null;
};
export type recurring_eventsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput> | Prisma.recurring_eventsCreateWithoutUsersInput[] | Prisma.recurring_eventsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_eventsCreateOrConnectWithoutUsersInput | Prisma.recurring_eventsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.recurring_eventsCreateManyUsersInputEnvelope;
    connect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
};
export type recurring_eventsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput> | Prisma.recurring_eventsCreateWithoutUsersInput[] | Prisma.recurring_eventsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_eventsCreateOrConnectWithoutUsersInput | Prisma.recurring_eventsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.recurring_eventsCreateManyUsersInputEnvelope;
    connect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
};
export type recurring_eventsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput> | Prisma.recurring_eventsCreateWithoutUsersInput[] | Prisma.recurring_eventsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_eventsCreateOrConnectWithoutUsersInput | Prisma.recurring_eventsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.recurring_eventsUpsertWithWhereUniqueWithoutUsersInput | Prisma.recurring_eventsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.recurring_eventsCreateManyUsersInputEnvelope;
    set?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    disconnect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    delete?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    connect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    update?: Prisma.recurring_eventsUpdateWithWhereUniqueWithoutUsersInput | Prisma.recurring_eventsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.recurring_eventsUpdateManyWithWhereWithoutUsersInput | Prisma.recurring_eventsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.recurring_eventsScalarWhereInput | Prisma.recurring_eventsScalarWhereInput[];
};
export type recurring_eventsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput> | Prisma.recurring_eventsCreateWithoutUsersInput[] | Prisma.recurring_eventsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.recurring_eventsCreateOrConnectWithoutUsersInput | Prisma.recurring_eventsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.recurring_eventsUpsertWithWhereUniqueWithoutUsersInput | Prisma.recurring_eventsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.recurring_eventsCreateManyUsersInputEnvelope;
    set?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    disconnect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    delete?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    connect?: Prisma.recurring_eventsWhereUniqueInput | Prisma.recurring_eventsWhereUniqueInput[];
    update?: Prisma.recurring_eventsUpdateWithWhereUniqueWithoutUsersInput | Prisma.recurring_eventsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.recurring_eventsUpdateManyWithWhereWithoutUsersInput | Prisma.recurring_eventsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.recurring_eventsScalarWhereInput | Prisma.recurring_eventsScalarWhereInput[];
};
export type recurring_eventsCreateWithoutUsersInput = {
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
};
export type recurring_eventsUncheckedCreateWithoutUsersInput = {
    id?: number;
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
};
export type recurring_eventsCreateOrConnectWithoutUsersInput = {
    where: Prisma.recurring_eventsWhereUniqueInput;
    create: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput>;
};
export type recurring_eventsCreateManyUsersInputEnvelope = {
    data: Prisma.recurring_eventsCreateManyUsersInput | Prisma.recurring_eventsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type recurring_eventsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.recurring_eventsWhereUniqueInput;
    update: Prisma.XOR<Prisma.recurring_eventsUpdateWithoutUsersInput, Prisma.recurring_eventsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.recurring_eventsCreateWithoutUsersInput, Prisma.recurring_eventsUncheckedCreateWithoutUsersInput>;
};
export type recurring_eventsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.recurring_eventsWhereUniqueInput;
    data: Prisma.XOR<Prisma.recurring_eventsUpdateWithoutUsersInput, Prisma.recurring_eventsUncheckedUpdateWithoutUsersInput>;
};
export type recurring_eventsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.recurring_eventsScalarWhereInput;
    data: Prisma.XOR<Prisma.recurring_eventsUpdateManyMutationInput, Prisma.recurring_eventsUncheckedUpdateManyWithoutUsersInput>;
};
export type recurring_eventsScalarWhereInput = {
    AND?: Prisma.recurring_eventsScalarWhereInput | Prisma.recurring_eventsScalarWhereInput[];
    OR?: Prisma.recurring_eventsScalarWhereInput[];
    NOT?: Prisma.recurring_eventsScalarWhereInput | Prisma.recurring_eventsScalarWhereInput[];
    id?: Prisma.IntFilter<"recurring_events"> | number;
    user_id?: Prisma.IntFilter<"recurring_events"> | number;
    google_event_id?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    title?: Prisma.StringFilter<"recurring_events"> | string;
    description?: Prisma.StringNullableFilter<"recurring_events"> | string | null;
    event_time?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFilter<"recurring_events"> | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    next_event_date?: Prisma.DateTimeFilter<"recurring_events"> | Date | string;
    status?: Prisma.Enumrecurring_events_statusNullableFilter<"recurring_events"> | $Enums.recurring_events_status | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_events"> | Date | string | null;
};
export type recurring_eventsCreateManyUsersInput = {
    id?: number;
    google_event_id?: string | null;
    title: string;
    description?: string | null;
    event_time: Date | string;
    frequency: $Enums.recurring_events_frequency;
    start_date: Date | string;
    next_event_date: Date | string;
    status?: $Enums.recurring_events_status | null;
    created_at?: Date | string | null;
    end_date?: Date | string | null;
};
export type recurring_eventsUpdateWithoutUsersInput = {
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    google_event_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event_time?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frequency?: Prisma.Enumrecurring_events_frequencyFieldUpdateOperationsInput | $Enums.recurring_events_frequency;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    next_event_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableEnumrecurring_events_statusFieldUpdateOperationsInput | $Enums.recurring_events_status | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_eventsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    google_event_id?: boolean;
    title?: boolean;
    description?: boolean;
    event_time?: boolean;
    frequency?: boolean;
    start_date?: boolean;
    next_event_date?: boolean;
    status?: boolean;
    created_at?: boolean;
    end_date?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["recurring_events"]>;
export type recurring_eventsSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    google_event_id?: boolean;
    title?: boolean;
    description?: boolean;
    event_time?: boolean;
    frequency?: boolean;
    start_date?: boolean;
    next_event_date?: boolean;
    status?: boolean;
    created_at?: boolean;
    end_date?: boolean;
};
export type recurring_eventsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "google_event_id" | "title" | "description" | "event_time" | "frequency" | "start_date" | "next_event_date" | "status" | "created_at" | "end_date", ExtArgs["result"]["recurring_events"]>;
export type recurring_eventsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type $recurring_eventsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "recurring_events";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        user_id: number;
        google_event_id: string | null;
        title: string;
        description: string | null;
        event_time: Date;
        frequency: $Enums.recurring_events_frequency;
        start_date: Date;
        next_event_date: Date;
        status: $Enums.recurring_events_status | null;
        created_at: Date | null;
        end_date: Date | null;
    }, ExtArgs["result"]["recurring_events"]>;
    composites: {};
};
export type recurring_eventsGetPayload<S extends boolean | null | undefined | recurring_eventsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload, S>;
export type recurring_eventsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<recurring_eventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Recurring_eventsCountAggregateInputType | true;
};
export interface recurring_eventsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['recurring_events'];
        meta: {
            name: 'recurring_events';
        };
    };
    /**
     * Find zero or one Recurring_events that matches the filter.
     * @param {recurring_eventsFindUniqueArgs} args - Arguments to find a Recurring_events
     * @example
     * // Get one Recurring_events
     * const recurring_events = await prisma.recurring_events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends recurring_eventsFindUniqueArgs>(args: Prisma.SelectSubset<T, recurring_eventsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Recurring_events that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {recurring_eventsFindUniqueOrThrowArgs} args - Arguments to find a Recurring_events
     * @example
     * // Get one Recurring_events
     * const recurring_events = await prisma.recurring_events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends recurring_eventsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, recurring_eventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsFindFirstArgs} args - Arguments to find a Recurring_events
     * @example
     * // Get one Recurring_events
     * const recurring_events = await prisma.recurring_events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends recurring_eventsFindFirstArgs>(args?: Prisma.SelectSubset<T, recurring_eventsFindFirstArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsFindFirstOrThrowArgs} args - Arguments to find a Recurring_events
     * @example
     * // Get one Recurring_events
     * const recurring_events = await prisma.recurring_events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends recurring_eventsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, recurring_eventsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Recurring_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recurring_events
     * const recurring_events = await prisma.recurring_events.findMany()
     *
     * // Get first 10 Recurring_events
     * const recurring_events = await prisma.recurring_events.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const recurring_eventsWithIdOnly = await prisma.recurring_events.findMany({ select: { id: true } })
     *
     */
    findMany<T extends recurring_eventsFindManyArgs>(args?: Prisma.SelectSubset<T, recurring_eventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Recurring_events.
     * @param {recurring_eventsCreateArgs} args - Arguments to create a Recurring_events.
     * @example
     * // Create one Recurring_events
     * const Recurring_events = await prisma.recurring_events.create({
     *   data: {
     *     // ... data to create a Recurring_events
     *   }
     * })
     *
     */
    create<T extends recurring_eventsCreateArgs>(args: Prisma.SelectSubset<T, recurring_eventsCreateArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Recurring_events.
     * @param {recurring_eventsCreateManyArgs} args - Arguments to create many Recurring_events.
     * @example
     * // Create many Recurring_events
     * const recurring_events = await prisma.recurring_events.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends recurring_eventsCreateManyArgs>(args?: Prisma.SelectSubset<T, recurring_eventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Recurring_events.
     * @param {recurring_eventsDeleteArgs} args - Arguments to delete one Recurring_events.
     * @example
     * // Delete one Recurring_events
     * const Recurring_events = await prisma.recurring_events.delete({
     *   where: {
     *     // ... filter to delete one Recurring_events
     *   }
     * })
     *
     */
    delete<T extends recurring_eventsDeleteArgs>(args: Prisma.SelectSubset<T, recurring_eventsDeleteArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Recurring_events.
     * @param {recurring_eventsUpdateArgs} args - Arguments to update one Recurring_events.
     * @example
     * // Update one Recurring_events
     * const recurring_events = await prisma.recurring_events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends recurring_eventsUpdateArgs>(args: Prisma.SelectSubset<T, recurring_eventsUpdateArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Recurring_events.
     * @param {recurring_eventsDeleteManyArgs} args - Arguments to filter Recurring_events to delete.
     * @example
     * // Delete a few Recurring_events
     * const { count } = await prisma.recurring_events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends recurring_eventsDeleteManyArgs>(args?: Prisma.SelectSubset<T, recurring_eventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Recurring_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recurring_events
     * const recurring_events = await prisma.recurring_events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends recurring_eventsUpdateManyArgs>(args: Prisma.SelectSubset<T, recurring_eventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Recurring_events.
     * @param {recurring_eventsUpsertArgs} args - Arguments to update or create a Recurring_events.
     * @example
     * // Update or create a Recurring_events
     * const recurring_events = await prisma.recurring_events.upsert({
     *   create: {
     *     // ... data to create a Recurring_events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recurring_events we want to update
     *   }
     * })
     */
    upsert<T extends recurring_eventsUpsertArgs>(args: Prisma.SelectSubset<T, recurring_eventsUpsertArgs<ExtArgs>>): Prisma.Prisma__recurring_eventsClient<runtime.Types.Result.GetResult<Prisma.$recurring_eventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Recurring_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsCountArgs} args - Arguments to filter Recurring_events to count.
     * @example
     * // Count the number of Recurring_events
     * const count = await prisma.recurring_events.count({
     *   where: {
     *     // ... the filter for the Recurring_events we want to count
     *   }
     * })
    **/
    count<T extends recurring_eventsCountArgs>(args?: Prisma.Subset<T, recurring_eventsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Recurring_eventsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Recurring_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Recurring_eventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Recurring_eventsAggregateArgs>(args: Prisma.Subset<T, Recurring_eventsAggregateArgs>): Prisma.PrismaPromise<GetRecurring_eventsAggregateType<T>>;
    /**
     * Group by Recurring_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_eventsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends recurring_eventsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: recurring_eventsGroupByArgs['orderBy'];
    } : {
        orderBy?: recurring_eventsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, recurring_eventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecurring_eventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the recurring_events model
     */
    readonly fields: recurring_eventsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for recurring_events.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__recurring_eventsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the recurring_events model
 */
export interface recurring_eventsFieldRefs {
    readonly id: Prisma.FieldRef<"recurring_events", 'Int'>;
    readonly user_id: Prisma.FieldRef<"recurring_events", 'Int'>;
    readonly google_event_id: Prisma.FieldRef<"recurring_events", 'String'>;
    readonly title: Prisma.FieldRef<"recurring_events", 'String'>;
    readonly description: Prisma.FieldRef<"recurring_events", 'String'>;
    readonly event_time: Prisma.FieldRef<"recurring_events", 'DateTime'>;
    readonly frequency: Prisma.FieldRef<"recurring_events", 'recurring_events_frequency'>;
    readonly start_date: Prisma.FieldRef<"recurring_events", 'DateTime'>;
    readonly next_event_date: Prisma.FieldRef<"recurring_events", 'DateTime'>;
    readonly status: Prisma.FieldRef<"recurring_events", 'recurring_events_status'>;
    readonly created_at: Prisma.FieldRef<"recurring_events", 'DateTime'>;
    readonly end_date: Prisma.FieldRef<"recurring_events", 'DateTime'>;
}
/**
 * recurring_events findUnique
 */
export type recurring_eventsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_events to fetch.
     */
    where: Prisma.recurring_eventsWhereUniqueInput;
};
/**
 * recurring_events findUniqueOrThrow
 */
export type recurring_eventsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_events to fetch.
     */
    where: Prisma.recurring_eventsWhereUniqueInput;
};
/**
 * recurring_events findFirst
 */
export type recurring_eventsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_events to fetch.
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_events to fetch.
     */
    orderBy?: Prisma.recurring_eventsOrderByWithRelationInput | Prisma.recurring_eventsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_events.
     */
    cursor?: Prisma.recurring_eventsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_events.
     */
    distinct?: Prisma.Recurring_eventsScalarFieldEnum | Prisma.Recurring_eventsScalarFieldEnum[];
};
/**
 * recurring_events findFirstOrThrow
 */
export type recurring_eventsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_events to fetch.
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_events to fetch.
     */
    orderBy?: Prisma.recurring_eventsOrderByWithRelationInput | Prisma.recurring_eventsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_events.
     */
    cursor?: Prisma.recurring_eventsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_events.
     */
    distinct?: Prisma.Recurring_eventsScalarFieldEnum | Prisma.Recurring_eventsScalarFieldEnum[];
};
/**
 * recurring_events findMany
 */
export type recurring_eventsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which recurring_events to fetch.
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_events to fetch.
     */
    orderBy?: Prisma.recurring_eventsOrderByWithRelationInput | Prisma.recurring_eventsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing recurring_events.
     */
    cursor?: Prisma.recurring_eventsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_events.
     */
    skip?: number;
    distinct?: Prisma.Recurring_eventsScalarFieldEnum | Prisma.Recurring_eventsScalarFieldEnum[];
};
/**
 * recurring_events create
 */
export type recurring_eventsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a recurring_events.
     */
    data: Prisma.XOR<Prisma.recurring_eventsCreateInput, Prisma.recurring_eventsUncheckedCreateInput>;
};
/**
 * recurring_events createMany
 */
export type recurring_eventsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many recurring_events.
     */
    data: Prisma.recurring_eventsCreateManyInput | Prisma.recurring_eventsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * recurring_events update
 */
export type recurring_eventsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a recurring_events.
     */
    data: Prisma.XOR<Prisma.recurring_eventsUpdateInput, Prisma.recurring_eventsUncheckedUpdateInput>;
    /**
     * Choose, which recurring_events to update.
     */
    where: Prisma.recurring_eventsWhereUniqueInput;
};
/**
 * recurring_events updateMany
 */
export type recurring_eventsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update recurring_events.
     */
    data: Prisma.XOR<Prisma.recurring_eventsUpdateManyMutationInput, Prisma.recurring_eventsUncheckedUpdateManyInput>;
    /**
     * Filter which recurring_events to update
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * Limit how many recurring_events to update.
     */
    limit?: number;
};
/**
 * recurring_events upsert
 */
export type recurring_eventsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the recurring_events to update in case it exists.
     */
    where: Prisma.recurring_eventsWhereUniqueInput;
    /**
     * In case the recurring_events found by the `where` argument doesn't exist, create a new recurring_events with this data.
     */
    create: Prisma.XOR<Prisma.recurring_eventsCreateInput, Prisma.recurring_eventsUncheckedCreateInput>;
    /**
     * In case the recurring_events was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.recurring_eventsUpdateInput, Prisma.recurring_eventsUncheckedUpdateInput>;
};
/**
 * recurring_events delete
 */
export type recurring_eventsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which recurring_events to delete.
     */
    where: Prisma.recurring_eventsWhereUniqueInput;
};
/**
 * recurring_events deleteMany
 */
export type recurring_eventsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_events to delete
     */
    where?: Prisma.recurring_eventsWhereInput;
    /**
     * Limit how many recurring_events to delete.
     */
    limit?: number;
};
/**
 * recurring_events without action
 */
export type recurring_eventsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=recurring_events.d.ts.map