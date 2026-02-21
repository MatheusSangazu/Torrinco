export declare const accounts_plan_type: {
    readonly individual: "individual";
    readonly family: "family";
};
export type accounts_plan_type = (typeof accounts_plan_type)[keyof typeof accounts_plan_type];
export declare const reminder_logs_source_type: {
    readonly event: "event";
    readonly transaction: "transaction";
    readonly reminder: "reminder";
};
export type reminder_logs_source_type = (typeof reminder_logs_source_type)[keyof typeof reminder_logs_source_type];
export declare const financial_entities_type: {
    readonly bank: "bank";
    readonly credit_card: "credit_card";
};
export type financial_entities_type = (typeof financial_entities_type)[keyof typeof financial_entities_type];
export declare const accounts_status: {
    readonly trial: "trial";
    readonly active: "active";
    readonly blocked: "blocked";
    readonly cancelled: "cancelled";
};
export type accounts_status = (typeof accounts_status)[keyof typeof accounts_status];
export declare const reminder_logs_reminder_type_new: {
    readonly h: "h";
    readonly min: "min";
    readonly exact: "exact";
};
export type reminder_logs_reminder_type_new = (typeof reminder_logs_reminder_type_new)[keyof typeof reminder_logs_reminder_type_new];
export declare const reminders_frequency: {
    readonly once: "once";
    readonly daily: "daily";
    readonly weekly: "weekly";
    readonly monthly: "monthly";
};
export type reminders_frequency = (typeof reminders_frequency)[keyof typeof reminders_frequency];
export declare const users_role: {
    readonly admin: "admin";
    readonly member: "member";
};
export type users_role = (typeof users_role)[keyof typeof users_role];
export declare const reminder_logs_reminder_type: {
    readonly h: "h";
    readonly min: "min";
};
export type reminder_logs_reminder_type = (typeof reminder_logs_reminder_type)[keyof typeof reminder_logs_reminder_type];
export declare const users_status: {
    readonly active: "active";
    readonly inactive: "inactive";
};
export type users_status = (typeof users_status)[keyof typeof users_status];
export declare const transactions_type: {
    readonly expense: "expense";
    readonly income: "income";
};
export type transactions_type = (typeof transactions_type)[keyof typeof transactions_type];
export declare const recurring_transactions_type: {
    readonly income: "income";
    readonly expense: "expense";
};
export type recurring_transactions_type = (typeof recurring_transactions_type)[keyof typeof recurring_transactions_type];
export declare const reminders_weekday: {
    readonly Monday: "Monday";
    readonly Tuesday: "Tuesday";
    readonly Wednesday: "Wednesday";
    readonly Thursday: "Thursday";
    readonly Friday: "Friday";
    readonly Saturday: "Saturday";
    readonly Sunday: "Sunday";
};
export type reminders_weekday = (typeof reminders_weekday)[keyof typeof reminders_weekday];
export declare const recurring_transactions_frequency: {
    readonly daily: "daily";
    readonly weekly: "weekly";
    readonly monthly: "monthly";
    readonly yearly: "yearly";
};
export type recurring_transactions_frequency = (typeof recurring_transactions_frequency)[keyof typeof recurring_transactions_frequency];
export declare const transactions_status: {
    readonly paid: "paid";
    readonly pending: "pending";
    readonly overdue: "overdue";
};
export type transactions_status = (typeof transactions_status)[keyof typeof transactions_status];
export declare const recurring_events_frequency: {
    readonly daily: "daily";
    readonly weekly: "weekly";
    readonly monthly: "monthly";
    readonly yearly: "yearly";
};
export type recurring_events_frequency = (typeof recurring_events_frequency)[keyof typeof recurring_events_frequency];
export declare const reminders_status: {
    readonly active: "active";
    readonly inactive: "inactive";
    readonly completed: "completed";
};
export type reminders_status = (typeof reminders_status)[keyof typeof reminders_status];
export declare const recurring_events_status: {
    readonly active: "active";
    readonly paused: "paused";
    readonly cancelled: "cancelled";
};
export type recurring_events_status = (typeof recurring_events_status)[keyof typeof recurring_events_status];
export declare const recurring_transactions_status: {
    readonly active: "active";
    readonly paused: "paused";
    readonly cancelled: "cancelled";
};
export type recurring_transactions_status = (typeof recurring_transactions_status)[keyof typeof recurring_transactions_status];
export declare const purchase_installments_status: {
    readonly active: "active";
    readonly completed: "completed";
    readonly cancelled: "cancelled";
};
export type purchase_installments_status = (typeof purchase_installments_status)[keyof typeof purchase_installments_status];
//# sourceMappingURL=enums.d.ts.map