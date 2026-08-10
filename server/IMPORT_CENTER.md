# Central de Importação

O PWA usa o `FinancialImportService` para criar um rascunho persistente e revisável. No WhatsApp, o documento é extraído localmente, sanitizado como dado não confiável e interpretado pelo agente; ele apresenta uma prévia resumida e somente grava o lote após a resposta explícita “sim”. Em ambos os canais, a confirmação cria todos os lançamentos em uma única transação Prisma.

## Persistência e privacidade

- `financial_imports`: lote, usuário/conta, destino, SHA-256, classificação, ciclo de vida e conciliação.
- `financial_import_items`: linhas editáveis, confiança, classificação especial, duplicidade, fingerprint e transação criada.
- `privacy_audit_events`: auditoria reutilizada para upload, confirmação, falha e cancelamento.

O arquivo original é processado somente em memória. Não são persistidos o arquivo nem o texto integral; apenas metadados, dados estruturados e trecho de até 1.000 caracteres por item. O conteúdo não entra nos logs. No WhatsApp, somente o texto extraído é enviado ao modelo, delimitado como conteúdo não confiável e protegido contra prompt injection; o arquivo original não é enviado nem persistido.

A migration `20260809007000_financial_import_center` é aditiva. Para rollback, desabilite a funcionalidade, preserve os lotes necessários e remova `financial_import_items` antes de `financial_imports`. Transações já criadas permanecem intactas.

## Ativação

```env
IMPORT_CENTER_ENABLED=true
IMPORT_MAX_FILE_BYTES=10485760
IMPORT_MAX_EXTRACTED_CHARS=250000
```

Reinicie API e PWA. A rota visual é `/imports`, com atalhos em Transações e Cartões. `IMPORT_CENTER_ENABLED=false` desabilita os endpoints sem apagar dados.

## Formatos e limitações

São aceitos PDF com camada de texto, CSV UTF-8 separado por vírgula ou ponto e vírgula, XLS e XLSX. PDF escaneado é recusado sem criar transações; não há OCR nesta versão. Documentos acima do limite de texto são recusados integralmente, nunca truncados.

OCR futuro deve ser conectado no parser de PDF somente após avaliação de fornecedor, custo, privacidade e retenção. Uma futura interpretação por IA deve tratar o documento como dado não confiável e validar a saída com schema antes de persistir itens.
