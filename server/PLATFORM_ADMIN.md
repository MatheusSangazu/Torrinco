# Backoffice da plataforma

Os papéis globais ficam em `platform_user_roles`. `users.role` é exclusivamente interno à conta (`owner`, `admin` ou `member`). Não existe cadastro público de administradores globais.

## Criar o primeiro platform owner

Após `npx prisma migrate deploy`, escolha um usuário existente pelo ID. Não coloque telefone, senha ou dados pessoais no repositório.

```powershell
npm run platform-owner -- 123 promote
```

Também é possível definir `PLATFORM_OWNER_USER_ID=123` e executar `npm run platform-owner`. A operação é idempotente, falha se o usuário não existir e grava auditoria. Para remover: `npm run platform-owner -- 123 remove`. O último owner ativo não pode ser removido.

## Adicionar testador

Entre com um usuário promovido e acesse `/admin`. Informe nome, telefone, e-mail opcional, duração do trial, plano e observação. O `AccountProvisioningService` cria transacionalmente a conta, proprietário sem senha, trial, histórico, categorias e convite.

O token puro existe apenas durante o envio. No banco é persistido somente SHA-256. O convidado recebe pelo WhatsApp o link `/first-access?invite=...`, aceita os documentos legais e cria sua própria senha. Reenvio rotaciona o token; convites expirados, aceitos ou revogados não são reutilizáveis.

## Variáveis novas

- `PUBLIC_APP_URL`: origem pública do PWA para links de convite.
- `PLATFORM_OWNER_USER_ID`: ID opcional usado pelo script.
- `PLATFORM_OWNER_ACTION`: `promote` ou `remove`.
- `PLATFORM_INVITE_EXPIRES_HOURS`: validade do convite, padrão 72.
- `PLATFORM_ADMIN_RECENT_AUTH_SECONDS`: janela de autenticação recente, padrão 900.

Não há gateway de pagamento nesta etapa. Alterações manuais atualizam apenas o estado interno e geram histórico de assinatura e auditoria administrativa.
