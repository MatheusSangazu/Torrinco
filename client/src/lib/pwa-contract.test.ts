import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const clientRoot = fileURLToPath(new URL('../../', import.meta.url));
const sourceRoot = path.join(clientRoot, 'src');
const read = (relativePath: string) => readFileSync(path.join(clientRoot, relativePath), 'utf8');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(target) : /\.(tsx|css)$/.test(entry.name) ? [target] : [];
  });
}

test('viewport preserva zoom acessível e habilita áreas seguras', () => {
  const html = read('index.html');
  assert.match(html, /viewport-fit=cover/);
  assert.doesNotMatch(html, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);
  assert.match(html, /apple-mobile-web-app-status-bar-style" content="black-translucent/);
  assert.match(html, /apple-touch-icon" href="\/pwa-maskable-512x512\.png/);
});

test('manifest mantém instalação standalone e ícones necessários', () => {
  const config = read('vite.config.ts');
  assert.match(config, /display:\s*'standalone'/);
  assert.match(config, /start_url:\s*'\/'/);
  assert.match(config, /scope:\s*'\/'/);
  assert.match(config, /pwa-192x192\.png/);
  assert.match(config, /pwa-512x512\.png/);
  assert.match(config, /pwa-maskable-512x512\.png/);
  assert.match(config, /purpose:\s*'maskable'/);
});

test('base mobile cobre altura dinâmica, safe area, toque e zoom de inputs', () => {
  const css = read('src/index.css');
  for (const inset of ['top', 'right', 'bottom', 'left']) {
    assert.match(css, new RegExp(`safe-area-inset-${inset}`));
  }
  assert.match(css, /100dvh/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /min-height:\s*2\.75rem/);
  assert.match(css, /font-size:\s*1rem\s*!important/);
  assert.match(css, /body:has\(\.app-scroll-lock\)/);
});

test('sobreposições fixas bloqueiam a rolagem de fundo', () => {
  const uncovered = sourceFiles(sourceRoot)
    .filter(file => file.endsWith('.tsx'))
    .flatMap(file => readFileSync(file, 'utf8').split(/\r?\n/).map((line, index) => ({ file, line, index })))
    .filter(entry => /fixed\s+inset-0/.test(entry.line) && !entry.line.includes('app-scroll-lock'));
  assert.deepEqual(uncovered.map(entry => `${path.relative(clientRoot, entry.file)}:${entry.index + 1}`), []);
});

test('cadastro de transação ocupa o viewport móvel sem perder ações', () => {
  const transactions = read('src/pages/Transactions.tsx');
  const css = read('src/index.css');
  assert.match(transactions, /app-dialog-overlay--fullscreen-mobile/);
  assert.match(transactions, /app-transaction-dialog__body/);
  assert.match(transactions, /app-transaction-dialog__footer/);
  assert.match(transactions, /grid-cols-2 gap-2 sm:grid-cols-4/);
  assert.match(css, /\.app-transaction-dialog\s*\{[^}]*height:\s*100dvh/s);
  assert.match(css, /\.app-dialog-overlay\.app-dialog-overlay--fullscreen-mobile\s*\{[^}]*padding:\s*0/s);
  assert.match(css, /\.app-transaction-dialog__footer\s*\{[^}]*safe-bottom/s);
});

test('interface não usa confirmação nativa nem classes de tela estática', () => {
  const entries = sourceFiles(sourceRoot).map(file => ({ file, content: readFileSync(file, 'utf8') }));
  const nativeConfirm = entries.filter(entry => /(^|[^.\w])confirm\s*\(/m.test(entry.content));
  const staticScreen = entries.filter(entry => entry.file.endsWith('.tsx') && /\b(?:h-screen|min-h-screen)\b/.test(entry.content));
  assert.deepEqual(nativeConfirm.map(entry => path.relative(clientRoot, entry.file)), []);
  assert.deepEqual(staticScreen.map(entry => path.relative(clientRoot, entry.file)), []);
});

test('instalação cobre Chromium e instruções do Safari no iOS', () => {
  const install = read('src/components/InstallPWABadge.tsx');
  const update = read('src/components/PWAUpdatePrompt.tsx');
  assert.match(install, /beforeinstallprompt/);
  assert.match(install, /Compartilhar/);
  assert.match(install, /Adicionar à Tela de Início/);
  assert.match(install, /DISMISS_COOLDOWN_MS/);
  assert.match(update, /registerSW/);
  assert.match(update, /Atualizar Torrinco/);
});
