import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type Enumaccounts_plan_typeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_plan_type | Prisma.Enumaccounts_plan_typeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_plan_type[] | null;
    notIn?: $Enums.accounts_plan_type[] | null;
    not?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel> | $Enums.accounts_plan_type | null;
};
export type Enumaccounts_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Prisma.Enumaccounts_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_status[] | null;
    notIn?: $Enums.accounts_status[] | null;
    not?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel> | $Enums.accounts_status | null;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type Enumaccounts_plan_typeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_plan_type | Prisma.Enumaccounts_plan_typeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_plan_type[] | null;
    notIn?: $Enums.accounts_plan_type[] | null;
    not?: Prisma.NestedEnumaccounts_plan_typeNullableWithAggregatesFilter<$PrismaModel> | $Enums.accounts_plan_type | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel>;
};
export type Enumaccounts_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Prisma.Enumaccounts_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_status[] | null;
    notIn?: $Enums.accounts_status[] | null;
    not?: Prisma.NestedEnumaccounts_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.accounts_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type Enumfinancial_entities_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.financial_entities_type | Prisma.Enumfinancial_entities_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.financial_entities_type[];
    notIn?: $Enums.financial_entities_type[];
    not?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel> | $Enums.financial_entities_type;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type Enumfinancial_entities_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.financial_entities_type | Prisma.Enumfinancial_entities_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.financial_entities_type[];
    notIn?: $Enums.financial_entities_type[];
    not?: Prisma.NestedEnumfinancial_entities_typeWithAggregatesFilter<$PrismaModel> | $Enums.financial_entities_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type Enumrecurring_events_frequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_frequency | Prisma.Enumrecurring_events_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_events_frequency[];
    notIn?: $Enums.recurring_events_frequency[];
    not?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel> | $Enums.recurring_events_frequency;
};
export type Enumrecurring_events_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_status | Prisma.Enumrecurring_events_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_events_status[] | null;
    notIn?: $Enums.recurring_events_status[] | null;
    not?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel> | $Enums.recurring_events_status | null;
};
export type Enumrecurring_events_frequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_frequency | Prisma.Enumrecurring_events_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_events_frequency[];
    notIn?: $Enums.recurring_events_frequency[];
    not?: Prisma.NestedEnumrecurring_events_frequencyWithAggregatesFilter<$PrismaModel> | $Enums.recurring_events_frequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel>;
};
export type Enumrecurring_events_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_status | Prisma.Enumrecurring_events_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_events_status[] | null;
    notIn?: $Enums.recurring_events_status[] | null;
    not?: Prisma.NestedEnumrecurring_events_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.recurring_events_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel>;
};
export type Enumrecurring_transactions_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_type | Prisma.Enumrecurring_transactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_type[];
    notIn?: $Enums.recurring_transactions_type[];
    not?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel> | $Enums.recurring_transactions_type;
};
export type Enumrecurring_transactions_frequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_frequency | Prisma.Enumrecurring_transactions_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_frequency[];
    notIn?: $Enums.recurring_transactions_frequency[];
    not?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel> | $Enums.recurring_transactions_frequency;
};
export type Enumrecurring_transactions_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_status | Prisma.Enumrecurring_transactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_transactions_status[] | null;
    notIn?: $Enums.recurring_transactions_status[] | null;
    not?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel> | $Enums.recurring_transactions_status | null;
};
export type Enumrecurring_transactions_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_type | Prisma.Enumrecurring_transactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_type[];
    notIn?: $Enums.recurring_transactions_type[];
    not?: Prisma.NestedEnumrecurring_transactions_typeWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel>;
};
export type Enumrecurring_transactions_frequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_frequency | Prisma.Enumrecurring_transactions_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_frequency[];
    notIn?: $Enums.recurring_transactions_frequency[];
    not?: Prisma.NestedEnumrecurring_transactions_frequencyWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_frequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel>;
};
export type Enumrecurring_transactions_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_status | Prisma.Enumrecurring_transactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_transactions_status[] | null;
    notIn?: $Enums.recurring_transactions_status[] | null;
    not?: Prisma.NestedEnumrecurring_transactions_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel>;
};
export type Enumreminder_logs_source_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_source_type | Prisma.Enumreminder_logs_source_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_source_type[];
    notIn?: $Enums.reminder_logs_source_type[];
    not?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel> | $Enums.reminder_logs_source_type;
};
export type Enumreminder_logs_reminder_type_newFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type_new | Prisma.Enumreminder_logs_reminder_type_newFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type_new[];
    notIn?: $Enums.reminder_logs_reminder_type_new[];
    not?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type_new;
};
export type Enumreminder_logs_reminder_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type | Prisma.Enumreminder_logs_reminder_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type[];
    notIn?: $Enums.reminder_logs_reminder_type[];
    not?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type;
};
export type Enumreminder_logs_source_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_source_type | Prisma.Enumreminder_logs_source_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_source_type[];
    notIn?: $Enums.reminder_logs_source_type[];
    not?: Prisma.NestedEnumreminder_logs_source_typeWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_source_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel>;
};
export type Enumreminder_logs_reminder_type_newWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type_new | Prisma.Enumreminder_logs_reminder_type_newFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type_new[];
    notIn?: $Enums.reminder_logs_reminder_type_new[];
    not?: Prisma.NestedEnumreminder_logs_reminder_type_newWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type_new;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel>;
};
export type Enumreminder_logs_reminder_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type | Prisma.Enumreminder_logs_reminder_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type[];
    notIn?: $Enums.reminder_logs_reminder_type[];
    not?: Prisma.NestedEnumreminder_logs_reminder_typeWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel>;
};
export type Enumreminders_frequencyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_frequency | Prisma.Enumreminders_frequencyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_frequency[] | null;
    notIn?: $Enums.reminders_frequency[] | null;
    not?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel> | $Enums.reminders_frequency | null;
};
export type Enumreminders_weekdayNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_weekday | Prisma.Enumreminders_weekdayFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_weekday[] | null;
    notIn?: $Enums.reminders_weekday[] | null;
    not?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel> | $Enums.reminders_weekday | null;
};
export type Enumreminders_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_status | Prisma.Enumreminders_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_status[] | null;
    notIn?: $Enums.reminders_status[] | null;
    not?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel> | $Enums.reminders_status | null;
};
export type Enumreminders_frequencyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_frequency | Prisma.Enumreminders_frequencyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_frequency[] | null;
    notIn?: $Enums.reminders_frequency[] | null;
    not?: Prisma.NestedEnumreminders_frequencyNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_frequency | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel>;
};
export type Enumreminders_weekdayNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_weekday | Prisma.Enumreminders_weekdayFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_weekday[] | null;
    notIn?: $Enums.reminders_weekday[] | null;
    not?: Prisma.NestedEnumreminders_weekdayNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_weekday | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel>;
};
export type Enumreminders_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_status | Prisma.Enumreminders_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_status[] | null;
    notIn?: $Enums.reminders_status[] | null;
    not?: Prisma.NestedEnumreminders_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel>;
};
export type Enumpurchase_installments_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.purchase_installments_status | Prisma.Enumpurchase_installments_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.purchase_installments_status[] | null;
    notIn?: $Enums.purchase_installments_status[] | null;
    not?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel> | $Enums.purchase_installments_status | null;
};
export type Enumpurchase_installments_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.purchase_installments_status | Prisma.Enumpurchase_installments_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.purchase_installments_status[] | null;
    notIn?: $Enums.purchase_installments_status[] | null;
    not?: Prisma.NestedEnumpurchase_installments_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.purchase_installments_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel>;
};
export type Enumtransactions_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_type | Prisma.Enumtransactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.transactions_type[];
    notIn?: $Enums.transactions_type[];
    not?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel> | $Enums.transactions_type;
};
export type Enumtransactions_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Prisma.Enumtransactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.transactions_status[] | null;
    notIn?: $Enums.transactions_status[] | null;
    not?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel> | $Enums.transactions_status | null;
};
export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type Enumtransactions_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_type | Prisma.Enumtransactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.transactions_type[];
    notIn?: $Enums.transactions_type[];
    not?: Prisma.NestedEnumtransactions_typeWithAggregatesFilter<$PrismaModel> | $Enums.transactions_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel>;
};
export type Enumtransactions_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Prisma.Enumtransactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.transactions_status[] | null;
    notIn?: $Enums.transactions_status[] | null;
    not?: Prisma.NestedEnumtransactions_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.transactions_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel>;
};
export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type Enumusers_roleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.users_role | Prisma.Enumusers_roleFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_role[] | null;
    notIn?: $Enums.users_role[] | null;
    not?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel> | $Enums.users_role | null;
};
export type Enumusers_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.users_status | Prisma.Enumusers_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_status[] | null;
    notIn?: $Enums.users_status[] | null;
    not?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel> | $Enums.users_status | null;
};
export type Enumusers_roleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.users_role | Prisma.Enumusers_roleFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_role[] | null;
    notIn?: $Enums.users_role[] | null;
    not?: Prisma.NestedEnumusers_roleNullableWithAggregatesFilter<$PrismaModel> | $Enums.users_role | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel>;
};
export type Enumusers_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.users_status | Prisma.Enumusers_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_status[] | null;
    notIn?: $Enums.users_status[] | null;
    not?: Prisma.NestedEnumusers_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.users_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_plan_type | Prisma.Enumaccounts_plan_typeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_plan_type[] | null;
    notIn?: $Enums.accounts_plan_type[] | null;
    not?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel> | $Enums.accounts_plan_type | null;
};
export type NestedEnumaccounts_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Prisma.Enumaccounts_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_status[] | null;
    notIn?: $Enums.accounts_status[] | null;
    not?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel> | $Enums.accounts_status | null;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumaccounts_plan_typeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_plan_type | Prisma.Enumaccounts_plan_typeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_plan_type[] | null;
    notIn?: $Enums.accounts_plan_type[] | null;
    not?: Prisma.NestedEnumaccounts_plan_typeNullableWithAggregatesFilter<$PrismaModel> | $Enums.accounts_plan_type | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumaccounts_plan_typeNullableFilter<$PrismaModel>;
};
export type NestedEnumaccounts_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.accounts_status | Prisma.Enumaccounts_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.accounts_status[] | null;
    notIn?: $Enums.accounts_status[] | null;
    not?: Prisma.NestedEnumaccounts_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.accounts_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumaccounts_statusNullableFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumfinancial_entities_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.financial_entities_type | Prisma.Enumfinancial_entities_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.financial_entities_type[];
    notIn?: $Enums.financial_entities_type[];
    not?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel> | $Enums.financial_entities_type;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumfinancial_entities_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.financial_entities_type | Prisma.Enumfinancial_entities_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.financial_entities_type[];
    notIn?: $Enums.financial_entities_type[];
    not?: Prisma.NestedEnumfinancial_entities_typeWithAggregatesFilter<$PrismaModel> | $Enums.financial_entities_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumfinancial_entities_typeFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumrecurring_events_frequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_frequency | Prisma.Enumrecurring_events_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_events_frequency[];
    notIn?: $Enums.recurring_events_frequency[];
    not?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel> | $Enums.recurring_events_frequency;
};
export type NestedEnumrecurring_events_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_status | Prisma.Enumrecurring_events_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_events_status[] | null;
    notIn?: $Enums.recurring_events_status[] | null;
    not?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel> | $Enums.recurring_events_status | null;
};
export type NestedEnumrecurring_events_frequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_frequency | Prisma.Enumrecurring_events_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_events_frequency[];
    notIn?: $Enums.recurring_events_frequency[];
    not?: Prisma.NestedEnumrecurring_events_frequencyWithAggregatesFilter<$PrismaModel> | $Enums.recurring_events_frequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_events_frequencyFilter<$PrismaModel>;
};
export type NestedEnumrecurring_events_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_events_status | Prisma.Enumrecurring_events_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_events_status[] | null;
    notIn?: $Enums.recurring_events_status[] | null;
    not?: Prisma.NestedEnumrecurring_events_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.recurring_events_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_events_statusNullableFilter<$PrismaModel>;
};
export type NestedEnumrecurring_transactions_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_type | Prisma.Enumrecurring_transactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_type[];
    notIn?: $Enums.recurring_transactions_type[];
    not?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel> | $Enums.recurring_transactions_type;
};
export type NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_frequency | Prisma.Enumrecurring_transactions_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_frequency[];
    notIn?: $Enums.recurring_transactions_frequency[];
    not?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel> | $Enums.recurring_transactions_frequency;
};
export type NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_status | Prisma.Enumrecurring_transactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_transactions_status[] | null;
    notIn?: $Enums.recurring_transactions_status[] | null;
    not?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel> | $Enums.recurring_transactions_status | null;
};
export type NestedEnumrecurring_transactions_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_type | Prisma.Enumrecurring_transactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_type[];
    notIn?: $Enums.recurring_transactions_type[];
    not?: Prisma.NestedEnumrecurring_transactions_typeWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_typeFilter<$PrismaModel>;
};
export type NestedEnumrecurring_transactions_frequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_frequency | Prisma.Enumrecurring_transactions_frequencyFieldRefInput<$PrismaModel>;
    in?: $Enums.recurring_transactions_frequency[];
    notIn?: $Enums.recurring_transactions_frequency[];
    not?: Prisma.NestedEnumrecurring_transactions_frequencyWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_frequency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_frequencyFilter<$PrismaModel>;
};
export type NestedEnumrecurring_transactions_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.recurring_transactions_status | Prisma.Enumrecurring_transactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.recurring_transactions_status[] | null;
    notIn?: $Enums.recurring_transactions_status[] | null;
    not?: Prisma.NestedEnumrecurring_transactions_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.recurring_transactions_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumrecurring_transactions_statusNullableFilter<$PrismaModel>;
};
export type NestedEnumreminder_logs_source_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_source_type | Prisma.Enumreminder_logs_source_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_source_type[];
    notIn?: $Enums.reminder_logs_source_type[];
    not?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel> | $Enums.reminder_logs_source_type;
};
export type NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type_new | Prisma.Enumreminder_logs_reminder_type_newFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type_new[];
    notIn?: $Enums.reminder_logs_reminder_type_new[];
    not?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type_new;
};
export type NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type | Prisma.Enumreminder_logs_reminder_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type[];
    notIn?: $Enums.reminder_logs_reminder_type[];
    not?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type;
};
export type NestedEnumreminder_logs_source_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_source_type | Prisma.Enumreminder_logs_source_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_source_type[];
    notIn?: $Enums.reminder_logs_source_type[];
    not?: Prisma.NestedEnumreminder_logs_source_typeWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_source_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_source_typeFilter<$PrismaModel>;
};
export type NestedEnumreminder_logs_reminder_type_newWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type_new | Prisma.Enumreminder_logs_reminder_type_newFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type_new[];
    notIn?: $Enums.reminder_logs_reminder_type_new[];
    not?: Prisma.NestedEnumreminder_logs_reminder_type_newWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type_new;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_reminder_type_newFilter<$PrismaModel>;
};
export type NestedEnumreminder_logs_reminder_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminder_logs_reminder_type | Prisma.Enumreminder_logs_reminder_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.reminder_logs_reminder_type[];
    notIn?: $Enums.reminder_logs_reminder_type[];
    not?: Prisma.NestedEnumreminder_logs_reminder_typeWithAggregatesFilter<$PrismaModel> | $Enums.reminder_logs_reminder_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminder_logs_reminder_typeFilter<$PrismaModel>;
};
export type NestedEnumreminders_frequencyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_frequency | Prisma.Enumreminders_frequencyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_frequency[] | null;
    notIn?: $Enums.reminders_frequency[] | null;
    not?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel> | $Enums.reminders_frequency | null;
};
export type NestedEnumreminders_weekdayNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_weekday | Prisma.Enumreminders_weekdayFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_weekday[] | null;
    notIn?: $Enums.reminders_weekday[] | null;
    not?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel> | $Enums.reminders_weekday | null;
};
export type NestedEnumreminders_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_status | Prisma.Enumreminders_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_status[] | null;
    notIn?: $Enums.reminders_status[] | null;
    not?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel> | $Enums.reminders_status | null;
};
export type NestedEnumreminders_frequencyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_frequency | Prisma.Enumreminders_frequencyFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_frequency[] | null;
    notIn?: $Enums.reminders_frequency[] | null;
    not?: Prisma.NestedEnumreminders_frequencyNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_frequency | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_frequencyNullableFilter<$PrismaModel>;
};
export type NestedEnumreminders_weekdayNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_weekday | Prisma.Enumreminders_weekdayFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_weekday[] | null;
    notIn?: $Enums.reminders_weekday[] | null;
    not?: Prisma.NestedEnumreminders_weekdayNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_weekday | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_weekdayNullableFilter<$PrismaModel>;
};
export type NestedEnumreminders_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.reminders_status | Prisma.Enumreminders_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.reminders_status[] | null;
    notIn?: $Enums.reminders_status[] | null;
    not?: Prisma.NestedEnumreminders_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.reminders_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumreminders_statusNullableFilter<$PrismaModel>;
};
export type NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.purchase_installments_status | Prisma.Enumpurchase_installments_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.purchase_installments_status[] | null;
    notIn?: $Enums.purchase_installments_status[] | null;
    not?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel> | $Enums.purchase_installments_status | null;
};
export type NestedEnumpurchase_installments_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.purchase_installments_status | Prisma.Enumpurchase_installments_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.purchase_installments_status[] | null;
    notIn?: $Enums.purchase_installments_status[] | null;
    not?: Prisma.NestedEnumpurchase_installments_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.purchase_installments_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumpurchase_installments_statusNullableFilter<$PrismaModel>;
};
export type NestedEnumtransactions_typeFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_type | Prisma.Enumtransactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.transactions_type[];
    notIn?: $Enums.transactions_type[];
    not?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel> | $Enums.transactions_type;
};
export type NestedEnumtransactions_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Prisma.Enumtransactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.transactions_status[] | null;
    notIn?: $Enums.transactions_status[] | null;
    not?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel> | $Enums.transactions_status | null;
};
export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type NestedEnumtransactions_typeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_type | Prisma.Enumtransactions_typeFieldRefInput<$PrismaModel>;
    in?: $Enums.transactions_type[];
    notIn?: $Enums.transactions_type[];
    not?: Prisma.NestedEnumtransactions_typeWithAggregatesFilter<$PrismaModel> | $Enums.transactions_type;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumtransactions_typeFilter<$PrismaModel>;
};
export type NestedEnumtransactions_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.transactions_status | Prisma.Enumtransactions_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.transactions_status[] | null;
    notIn?: $Enums.transactions_status[] | null;
    not?: Prisma.NestedEnumtransactions_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.transactions_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumtransactions_statusNullableFilter<$PrismaModel>;
};
export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type NestedEnumusers_roleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.users_role | Prisma.Enumusers_roleFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_role[] | null;
    notIn?: $Enums.users_role[] | null;
    not?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel> | $Enums.users_role | null;
};
export type NestedEnumusers_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.users_status | Prisma.Enumusers_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_status[] | null;
    notIn?: $Enums.users_status[] | null;
    not?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel> | $Enums.users_status | null;
};
export type NestedEnumusers_roleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.users_role | Prisma.Enumusers_roleFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_role[] | null;
    notIn?: $Enums.users_role[] | null;
    not?: Prisma.NestedEnumusers_roleNullableWithAggregatesFilter<$PrismaModel> | $Enums.users_role | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumusers_roleNullableFilter<$PrismaModel>;
};
export type NestedEnumusers_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.users_status | Prisma.Enumusers_statusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.users_status[] | null;
    notIn?: $Enums.users_status[] | null;
    not?: Prisma.NestedEnumusers_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.users_status | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumusers_statusNullableFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map