export function addMonths(date, months) {
    const newDate = new Date(date);
    const d = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + months);
    if (newDate.getDate() !== d) {
        newDate.setDate(0);
    }
    return newDate;
}
//# sourceMappingURL=date-utils.js.map