/**
 * Utilitários de data — fonte única de verdade.
 * Convenção: datas são armazenadas e comparadas em UTC (meio-dia para evitar
 * drift de fuso). Conversão para hora local só na borda de entrada/saída.
 */

const FREQ_DAILY = 'daily';
const FREQ_WEEKLY = 'weekly';
const FREQ_MONTHLY = 'monthly';
const FREQ_YEARLY = 'yearly';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Adiciona meses a uma data preservando o dia (corrigindo virada de mês,
 * ex: 31/01 + 1 mês = 28/02).
 */
export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  const d = newDate.getUTCDate();
  newDate.setUTCMonth(newDate.getUTCMonth() + months);
  if (newDate.getUTCDate() !== d) {
    newDate.setUTCDate(0);
  }
  return newDate;
}

/**
 * Avança uma data de acordo com a frequência, em UTC.
 * Função única — não duplicar lógica de avanço em outros lugares.
 */
export function advanceDate(frequency: Frequency, date: Date): Date {
  const next = new Date(date);
  switch (frequency) {
    case FREQ_DAILY:
      next.setUTCDate(next.getUTCDate() + 1);
      break;
    case FREQ_WEEKLY:
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case FREQ_MONTHLY: {
      const day = next.getUTCDate();
      next.setUTCMonth(next.getUTCMonth() + 1);
      if (next.getUTCDate() !== day) next.setUTCDate(0);
      break;
    }
    case FREQ_YEARLY:
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      break;
  }
  return next;
}

/**
 * Faz parse de uma string "YYYY-MM-DD" para um Date em UTC ao meio-dia.
 * O offset de 12h evita que o dia "vire" por drift de fuso horário ao serializar.
 * Aceita também Date ou ISO string.
 */
export function parseDate(dateString: string | Date): Date {
  if (!dateString) return new Date();
  if (dateString instanceof Date) return new Date(dateString);

  const parts = dateString.split('T')[0]?.split('-') ?? [];
  if (parts.length === 3) {
    const year = parseInt(parts[0] || '0', 10);
    const month = parseInt(parts[1] || '0', 10) - 1;
    const day = parseInt(parts[2] || '0', 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }
  }
  return new Date(dateString);
}

/** Início do dia UTC (00:00:00.000). */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Fim do dia UTC (23:59:59.999). */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/** Retorna "hoje" normalizado em UTC ao meio-dia (para comparação justa com datas parseadas). */
export function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
}

/** Formata um período como "YYYY-MM". */
export function formatPeriod(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}
