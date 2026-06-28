import type { Request, Response } from 'express';

/**
 * Páginas legais públicas (Política de Privacidade e Termos de Serviço).
 *
 * Servidas pelo próprio backend para atender ao requisito do Google OAuth
 * consent screen (URLs publicamente acessíveis). Devem cobrir o que o app
 * coleta, como usa, com quem compartilha e como o usuário pode excluir dados.
 */

const APP_NAME = 'Torrinco';
const CONTACT_EMAIL = 'contato@forjacorp.com';
const UPDATED = '28/06/2026';

function layout(titulo: string, corpo: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME} — ${titulo}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; line-height: 1.6; }
    .wrap { max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    header { border-bottom: 2px solid #6366f1; padding-bottom: 1rem; margin-bottom: 2rem; }
    h1 { font-size: 1.8rem; color: #312e81; margin: 0 0 .25rem; }
    h2 { font-size: 1.2rem; color: #4338ca; margin-top: 1.75rem; }
    .updated { color: #64748b; font-size: .9rem; }
    p, li { color: #334155; }
    a { color: #4f46e5; }
    ul { padding-left: 1.25rem; }
    .muted { color: #64748b; font-size: .9rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>${titulo}</h1>
      <p class="updated">${APP_NAME} • Última atualização: ${UPDATED}</p>
    </header>
    ${corpo}
  </div>
</body>
</html>`;
}

export class LegalController {
  static privacy(_req: Request, res: Response): void {
    const corpo = `
      <p>Esta Política de Privacidade descreve como o ${APP_NAME} ("nós", "aplicativo") coleta, usa e protege as informações dos usuários. Ao usar o ${APP_NAME}, você concorda com as práticas descritas abaixo.</p>

      <h2>1. Informações que coletamos</h2>
      <ul>
        <li><strong>Dados financeiros informados por você:</strong> receitas, despesas, cartões de crédito, contas, faturas, categorias e recorrências que você cadastra — manualmente pelo app/PWA ou por mensagens enviadas ao assistente no WhatsApp.</li>
        <li><strong>Conteúdo das mensagens:</strong> o texto, áudio, imagem e documentos (ex.: faturas em PDF) que você envia ao assistente são processados para registrar e consultar suas finanças.</li>
        <li><strong>Identificador e contato:</strong> seu número de telefone (usado como identificador da conta) e, quando fornecido, e-mail.</li>
        <li><strong>Dados de agenda (opcional):</strong> se você conectar sua agenda do Google, acessamos eventos do Google Calendar apenas para criar, listar e cancelar compromissos a seu pedido.</li>
      </ul>

      <h2>2. Como usamos suas informações</h2>
      <ul>
        <li>Registrar, organizar e exibir suas transações e faturas.</li>
        <li>Processar comandos em linguagem natural por meio de inteligência artificial (OpenAI) para responder e executar ações no app via WhatsApp.</li>
        <li>Gerar resumos, relatórios e previsões financeiras.</li>
        <li>Gerenciar eventos na sua agenda do Google quando solicitado.</li>
      </ul>

      <h2>3. Processamento por terceiros</h2>
      <ul>
        <li><strong>OpenAI:</strong> processa o texto das suas mensagens (e transcrições/imagens) para gerar respostas e executar ações. Não utilizamos seus dados para treinar modelos de terceiros.</li>
        <li><strong>Google Calendar API:</strong> usada apenas com o seu consentimento explícito (OAuth2) para gerenciar eventos, com escopo limitado a <em>calendar.events</em>.</li>
        <li><strong>Plataforma de mensagens (WhatsApp via Evolution API):</strong> usada apenas para troca de mensagens com você.</li>
      </ul>
      <p class="muted">Cada processamento ocorre com o propósito exclusivo de fornecer as funcionalidades solicitadas.</p>

      <h2>4. Armazenamento e segurança</h2>
      <p>Seus dados são armazenados em banco de dados sob nosso controle. Aplicamos medidas técnicas razoáveis (controle de acesso, criptografia de senhas e tokens). Nenhum sistema é totalmente seguro; não garantimos segurança absoluta.</p>

      <h2>5. Retenção e exclusão</h2>
      <p>Mantemos seus dados enquanto sua conta estiver ativa. Você pode solicitar a exclusão da conta e de todos os dados a qualquer momento pelo e-mail de contato abaixo. Exclusões podem levar até 30 dias para serem concluídas.</p>

      <h2>6. Compartilhamento</h2>
      <p>Não vendemos nem alugamos seus dados. Compartilhamos apenas o estritamente necessário para o funcionamento (descrito na seção 3) ou quando exigido por lei.</p>

      <h2>7. Seus direitos (LGPD)</h2>
      <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados. Para isso, escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>

      <h2>8. Alterações</h2>
      <p>Podemos atualizar esta política a qualquer tempo. A data no topo indica a última revisão. Recomendamos revisá-la periodicamente.</p>

      <h2>9. Contato</h2>
      <p>Dúvidas? Escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>`;

    res.type('html').send(layout('Política de Privacidade', corpo));
  }

  static terms(_req: Request, res: Response): void {
    const corpo = `
      <p>Estes Termos de Serviço ("Termos") regulam o uso do ${APP_NAME} ("serviço"). Ao utilizá-lo, você concorda com o que está descrito aqui.</p>

      <h2>1. Descrição do serviço</h2>
      <p>O ${APP_NAME} é um aplicativo de finanças pessoais que permite registrar e acompanhar receitas, despesas, faturas de cartão e recorrências, além de gerenciar compromissos na sua agenda do Google, por meio de interface web (PWA) e de assistente conversacional no WhatsApp.</p>

      <h2>2. Elegibilidade e conta</h2>
      <p>O serviço destina-se a usuários com capacidade legal. Você é responsável pela exatidão das informações que fornece e pela manutenção da confidencialidade do seu número de telefone e de eventuais credenciais.</p>

      <h2>3. Uso aceitável</h2>
      <ul>
        <li>Utilizar o serviço apenas para fins pessoais e lícitos.</li>
        <li>Não tentar burlar limites, invadir, sobrecarregar ou comprometer a segurança do serviço.</li>
        <li>Não enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros.</li>
      </ul>

      <h2>4. Inteligência artificial</h2>
      <p>O assistente utiliza IA para interpretar comandos e executar ações (ex.: registrar gastos). Respostas e ações podem conter erros. Recomendamos revisar registros importantes. O serviço não constitui aconselhamento financeiro, jurídico ou de investimento.</p>

      <h2>5. Permissões do Google</h2>
      <p>A integração com o Google Calendar é opcional e exige sua autorização explícita. O acesso limita-se a gerenciar eventos a seu pedido. Você pode revogar o acesso a qualquer momento nas configurações da sua conta Google.</p>

      <h2>6. Pagamentos e disponibilidade</h2>
      <p>Podemos oferecer planos pagos no futuro. Recursos, preços e disponibilidade podem mudar. O serviço pode sofrer interrupções por manutenção ou fatores fora do nosso controle.</p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>O serviço é fornecido "como está", sem garantias. Na máxima extensão permitida pela lei, não nos responsabilizamos por perdas decorrentes do uso ou da impossibilidade de uso do serviço, inclusive por erros de registro feitos pelo assistente.</p>

      <h2>8. Suspensão</h2>
      <p>Podemos suspender ou encerrar contas que violem estes Termos.</p>

      <h2>9. Alterações</h2>
      <p>Estes Termos podem ser atualizados periodicamente. A data no topo indica a última revisão.</p>

      <h2>10. Contato</h2>
      <p>Em caso de dúvidas, escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>`;

    res.type('html').send(layout('Termos de Serviço', corpo));
  }
}
