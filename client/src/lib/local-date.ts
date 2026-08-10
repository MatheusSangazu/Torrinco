/** Formata uma data usando seus componentes locais, sem conversão para UTC. */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDashboardDateRanges(now: Date = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const chartStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  return {
    today: formatLocalDate(today),
    nextWeek: formatLocalDate(nextWeek),
    monthStart: formatLocalDate(firstDayOfMonth),
    chartStart: formatLocalDate(chartStart),
    chartEnd: formatLocalDate(today),
  };
}
