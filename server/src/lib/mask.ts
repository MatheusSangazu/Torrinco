/**
 * Utilitários de mascaramento de dados sensíveis para logs.
 *
 * Regra: logs só devem conter metadados seguros. Telefones, documentos,
 * tokens e mensagens nunca devem aparecer por completo.
 */

/**
 * Mascara um telefone, mantendo apenas DDI+DDD e os últimos dígitos.
 * Ex.: "5511999990001" -> "5511*****01", "11999999999" -> "1199****99".
 */
export function maskPhone(phone: string): string {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length <= 6) return '*'.repeat(digits.length || 1);
  const head = digits.slice(0, 4);
  const tail = digits.slice(-2);
  return `${head}${'*'.repeat(digits.length - 6)}${tail}`;
}
