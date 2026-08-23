import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, hasProjection, sumGroupTotals } from './monthly-overview.ts';

test('formata centavos como reais sem perder o sinal', () => {
  assert.equal(formatCents(12_345).replace(/\s/g, ' '), 'R$ 123,45');
  assert.equal(formatCents(-1_234).replace(/\s/g, ' '), '-R$ 12,34');
  assert.equal(formatCents(0).replace(/\s/g, ' '), 'R$ 0,00');
});

test('identifica quando o valor possui composição projetada', () => {
  assert.equal(hasProjection({ registered: 10_000, projected: 0, total: 10_000 }), false);
  assert.equal(hasProjection({ registered: 10_000, projected: 5_000, total: 15_000 }), true);
  assert.equal(hasProjection({ registered: 10_000, projected: -500, total: 9_500 }), true);
});

test('soma subtotais dos grupos usando a unidade em centavos', () => {
  const total = sumGroupTotals([
    { subtotal: { registered: 1_000, projected: 500, total: 1_500 } },
    { subtotal: { registered: 2_000, projected: 0, total: 2_000 } },
    { subtotal: { registered: 0, projected: -250, total: -250 } },
  ]);

  assert.equal(total, 3_250);
});
