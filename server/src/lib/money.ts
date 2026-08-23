export type MoneyInput = string | number | bigint | { toString(): string };

/** Converte um valor decimal em reais para centavos sem somá-lo como float. */
export function toCents(value: MoneyInput): bigint {
  const raw = value.toString().trim();
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(raw);
  if (!match) throw new Error(`INVALID_MONEY_VALUE:${raw}`);

  const sign = match[1] === '-' ? -1n : 1n;
  const units = BigInt(match[2] ?? '0');
  const fraction = BigInt((match[3] ?? '').padEnd(2, '0'));
  return sign * ((units * 100n) + fraction);
}

/** Adaptação para contratos legados que ainda retornam reais como number. */
export function centsToLegacyNumber(value: bigint): number {
  const absolute = value < 0n ? -value : value;
  if (absolute > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('MONEY_VALUE_OUT_OF_SAFE_RANGE');
  return Number(value) / 100;
}

/** Serializa centavos como inteiro seguro para os contratos financeiros novos. */
export function centsToSafeInteger(value: bigint): number {
  const absolute = value < 0n ? -value : value;
  if (absolute > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('MONEY_VALUE_OUT_OF_SAFE_RANGE');
  return Number(value);
}
