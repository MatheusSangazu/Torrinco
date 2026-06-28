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
      <p>Esta Política de Privacidade descreve como o ${APP_NAME} ("nós", "controlador") coleta, usa e protege as informações dos usuários ("titulares"), em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD). Ao usar o ${APP_NAME}, você concorda com as práticas descritas abaixo.</p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li><strong>Identificação e contato:</strong> seu número de telefone (usado como identificador principal da conta) e, quando fornecido, e-mail e nome.</li>
        <li><strong>Dados financeiros informados por você:</strong> receitas, despesas, cartões de crédito, contas, faturas, categorias e recorrências que você cadastra — manualmente pelo app/PWA ou por mensagens ao assistente no WhatsApp.</li>
        <li><strong>Conteúdo das mensagens:</strong> texto, áudio, imagem e documentos (ex.: faturas em PDF) enviados ao assistente são processados para registrar e consultar suas finanças.</li>
        <li><strong>Dados de agenda (opcionais):</strong> se você conectar sua agenda do Google, acessamos eventos apenas para criar, listar e cancelar compromissos a seu pedido.</li>
        <li><strong>Dados técnicos:</strong> endereço IP, user-agent e logs de acesso, para segurança e auditoria.</li>
      </ul>

      <h2>2. Base legal e finalidades (LGPD)</h2>
      <p>Tratamos seus dados com base nas seguintes hipóteses legais e para as finalidades indicadas:</p>
      <ul>
        <li><strong>Execução de contrato (art. 7º, V):</strong> para registrar transações, gerar faturas/relatórios, cumprir o serviço contratado.</li>
        <li><strong>Legítimo interesse (art. 7º, IX):</strong> para segurança, prevenção a fraudes, auditoria e melhorias do serviço.</li>
        <li><strong>Consentimento (art. 8º):</strong> para integrações opcionais (ex.: Google Calendar) e para envio de conteúdo das mensagens a processadores de IA.</li>
        <li><strong>Obrigação legal (art. 7º, II):</strong> para guarda de logs fiscais/contábeis quando aplicável.</li>
      </ul>

      <h2>3. Inteligência artificial e transferência internacional</h2>
      <p>Para interpretar suas mensagens e executar comandos, enviamos o <strong>conteúdo dos textos/áudios/imagens/documentos</strong> que você fornece para a <strong>OpenAI</strong> (Estados Unidos). Esta é uma transferência internacional de dados autorizada pelo seu consentimento e necessária à execução do serviço. Adotamos as seguintes garantias:</p>
      <ul>
        <li>Configuramos a OpenAI para <strong>não utilizar seus dados para treinamento</strong> de modelos.</li>
        <li>O conteúdo é retido pela OpenAI por no máximo 30 dias para fins de moderação/abuso, conforme política deles, e depois excluído.</li>
        <li>Nenhum dado financeiro estruturado (saldos, valores) é enviado além do necessário para responder ao seu pedido.</li>
      </ul>
      <p>Você pode revogar o consentimento a qualquer tempo; em consequência, o assistente no WhatsApp deixará de funcionar, mas o app/PWA continuará disponível.</p>

      <h2>4. Outros processadores</h2>
      <ul>
        <li><strong>Google Calendar API:</strong> usado somente com seu consentimento (OAuth2) para gerenciar eventos; escopo limitado a <em>calendar.events</em> e <em>calendar.readonly</em>.</li>
        <li><strong>Plataforma de mensagens (Evolution API / Meta WhatsApp Business):</strong> roteamento das mensagens entre você e o assistente.</li>
        <li><strong>Infraestrutura de hospedagem:</strong> provedor de nuvem que hospeda o banco de dados e a aplicação.</li>
      </ul>

      <h2>5. Retenção</h2>
      <ul>
        <li><strong>Dados de transação e faturas:</strong> mantidos por toda a vigência da conta e por até 5 anos após o encerramento (obrigação contábil/fiscal).</li>
        <li><strong>Logs de auditoria:</strong> 1 ano.</li>
        <li><strong>Conteúdo de mensagens processado pela IA:</strong> não armazenamos o texto bruto após o processamento (apenas o resultado estruturado).</li>
        <li><strong>Tokens OAuth (Google):</strong> mantidos enquanto a integração estiver ativa; revogados imediatamente ao desconectar.</li>
      </ul>

      <h2>6. Segurança</h2>
      <p>Aplicamos medidas técnicas e organizativas: criptografia de senhas (bcrypt), tokens JWT com expiração curta, validação por assinatura dos webhooks, rate limiting e controle de acesso. Apesar dessas medidas, nenhum sistema é totalmente seguro; não garantimos segurança absoluta.</p>

      <h2>7. Compartilhamento</h2>
      <p>Não vendemos nem alugamos seus dados. Compartilhamos apenas o estritamente necessário (descrito nas seções 3 e 4) ou quando exigido por ordem judicial ou autoridade competente.</p>

      <h2>8. Seus direitos (LGPD — art. 18)</h2>
      <p>Você pode, a qualquer momento, solicitar: confirmação de tratamento, acesso aos dados, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento e revogação de consentimento. As solicitações serão respondidas em até 15 dias úteis pelo nosso encarregado (DPO).</p>

      <h2>9. Encarregado pelo tratamento de dados (DPO)</h2>
      <p>Para exercer seus direitos ou tirar dúvidas sobre privacidade, fale com nosso encarregado: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> (assunto: "LGPD").</p>

      <h2>10. Alterações</h2>
      <p>Podemos atualizar esta política a qualquer tempo. A data no topo indica a última revisão. Mudanças materiais serão comunicadas pelo aplicativo ou e-mail.</p>`;

    res.type('html').send(layout('Política de Privacidade', corpo));
  }

  static terms(_req: Request, res: Response): void {
    const corpo = `
      <p>Estes Termos de Serviço ("Termos") regulam o uso do ${APP_NAME} ("serviço") oferecido por Matheus ("operador"). Ao utilizar o serviço, você concorda integralmente com estes Termos.</p>

      <h2>1. Descrição do serviço</h2>
      <p>O ${APP_NAME} é um aplicativo de finanças pessoais que permite registrar e acompanhar receitas, despesas, faturas de cartão e recorrências, além de gerenciar compromissos na sua agenda do Google, por meio de interface web (PWA) e de um assistente conversacional no WhatsApp baseado em inteligência artificial.</p>

      <h2>2. Elegibilidade</h2>
      <p>O serviço é destinado apenas a pessoas naturais com 18 (dezoito) anos completos ou a menores devidamente assistidos por seus responsáveis legais. Ao se cadastrar, você declara atender a esses requisitos. <strong>O serviço não é voltado a menores de idade sem assistência</strong> e seu uso por crianças e adolescentes deve ser supervisionado.</p>

      <h2>3. Conta e responsabilidades do usuário</h2>
      <ul>
        <li>Você é responsável pela exatidão das informações fornecidas e pela manutenção da confidencialidade do seu número de telefone e de eventuais credenciais.</li>
        <li>É responsável por todas as atividades realizadas com sua conta.</li>
        <li>Deve nos comunicar imediatamente qualquer uso não autorizado.</li>
      </ul>

      <h2>4. Natureza do serviço e limitações da IA</h2>
      <p>O assistente utiliza modelos de inteligência artificial para interpretar comandos em linguagem natural e executar ações (ex.: registrar gastos, agendar eventos). Você reconhece e concorda que:</p>
      <ul>
        <li>Respostas e ações podem conter erros, omissões ou interpretações equivocadas.</li>
        <li>O conteúdo enviado para processamento poderá ser transmitido a provedores externos (como a OpenAI), conforme nossa Política de Privacidade.</li>
        <li>Recomendamos revisar registros importantes antes de confiar neles.</li>
        <li><strong>O serviço não constitui aconselhamento financeiro, jurídico, contábil ou de investimento.</strong> As informações geradas são meramente informativas e não substituem profissionais habilitados.</li>
      </ul>

      <h2>5. Uso aceitável</h2>
      <ul>
        <li>Utilizar o serviço apenas para fins pessoais e lícitos.</li>
        <li>Não tentar burlar limites, invadir, sobrecarregar ou comprometer a segurança do serviço.</li>
        <li>Não enviar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros.</li>
        <li>Não usar o serviço para fins comerciais sem autorização expressa.</li>
        <li>Não automatizar requisições de forma abusiva (bots, scripts de sobrecarga).</li>
      </ul>

      <h2>6. Permissões de terceiros (Google)</h2>
      <p>A integração com o Google Calendar é opcional e exige sua autorização expressa via OAuth2. O acesso limita-se a gerenciar eventos a seu pedido. Você pode revogar o acesso a qualquer momento nas configurações da sua conta Google, em <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">myaccount.google.com/permissions</a>.</p>

      <h2>7. Planos, pagamentos e reembolsos</h2>
      <p>O serviço pode ser oferecido em planos gratuitos e pagos. Valores, funcionalidades e disponibilidade podem mudar mediante aviso prévio. <strong>Planos pagos são cobrados antecipadamente</strong> pelo período contratado. Reembolsos serão analisados caso a caso conforme a legislação aplicável; taxas de terceiros (ex.: processadoras de pagamento) podem ser não reembolsáveis.</p>

      <h2>8. Disponibilidade do serviço</h2>
      <p>O serviço pode sofrer interrupções por manutenção, atualizações, falhas de provedores externos (OpenAI, Google, Meta) ou fatores fora do nosso controle. Não garantimos disponibilidade contínua. Em caso de indisponibilidade material, buscaremos restabelecer o serviço em prazo razoável.</p>

      <h2>9. Propriedade intelectual</h2>
      <p>O código, marcas, layout e demais elementos do serviço são de propriedade do operador. É proibida a cópia, modificação ou redistribuição sem autorização expressa.</p>

      <h2>10. Suspensão e encerramento</h2>
      <p>Podemos suspender ou encerrar contas que violem estes Termos ou que apresentem risco à segurança/estabilidade do serviço. Você pode encerrar sua conta a qualquer momento, sendo os dados tratados conforme a Política de Privacidade.</p>

      <h2>11. Limitação de responsabilidade</h2>
      <p>O serviço é fornecido "como está", sem garantias expressas ou implícitas. Na máxima extensão permitida pela lei, <strong>não nos responsabilizamos por perdas decorrentes do uso ou da impossibilidade de uso do serviço</strong>, inclusive por: (i) erros do assistente de IA; (ii) decisões financeiras tomadas com base nas informações do serviço; (iii) falhas de provedores externos; (iv) perda de dados por problemas na infraestrutura.</p>

      <h2>12. Indenização</h2>
      <p>Você concorda em isentar e indenizar o operador e seus eventuais parceiros de quaisquer reclamações, danos ou prejuízos decorrentes do uso indevido do serviço ou violação destes Termos.</p>

      <h2>13. Legislação aplicável e foro</h2>
      <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca do domicílio do usuário para dirimir quaisquer controvérsias.</p>

      <h2>14. Alterações</h2>
      <p>Estes Termos podem ser atualizados periodicamente. A data no topo indica a última revisão. Mudanças materiais serão comunicadas pelo aplicativo ou e-mail. O uso continuado após a atualização caracteriza concordância.</p>

      <h2>15. Contato</h2>
      <p>Em caso de dúvidas, escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>`;

    res.type('html').send(layout('Termos de Serviço', corpo));
  }
}
