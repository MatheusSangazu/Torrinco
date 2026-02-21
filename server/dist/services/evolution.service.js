import axios from 'axios';
const config = {
    baseUrl: process.env.EVOLUTION_API_URL || '',
    apiKey: process.env.EVOLUTION_API_KEY || '',
    instanceName: process.env.EVOLUTION_INSTANCE_NAME || ''
};
export class EvolutionService {
    /**
     * Envia uma mensagem de texto via WhatsApp
     * @param phoneNumber Número do telefone (com DDI, ex: 5511999999999)
     * @param text Texto da mensagem
     */
    static async sendText(phoneNumber, text) {
        try {
            if (!config.baseUrl || !config.apiKey || !config.instanceName) {
                console.warn('⚠️ Evolution API não configurada corretamente no .env');
                return null;
            }
            // Remove caracteres não numéricos do telefone
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            const url = `${config.baseUrl}/message/sendText/${config.instanceName}`;
            const response = await axios.post(url, {
                number: cleanPhone,
                text: text,
                delay: 1200,
                linkPreview: true
            }, {
                headers: {
                    'apikey': config.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Mensagem enviada para ${cleanPhone} via Evolution API`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Erro ao enviar mensagem via Evolution API:', error.message);
            if (error.response) {
                console.error('Detalhes do erro:', error.response.data);
            }
            // Não lança erro para não quebrar o fluxo principal, apenas loga
            return null;
        }
    }
    static async sendDocument(phoneNumber, base64File, fileName, caption) {
        try {
            if (!config.baseUrl || !config.apiKey || !config.instanceName) {
                console.warn('⚠️ Evolution API não configurada corretamente no .env');
                return null;
            }
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            const url = `${config.baseUrl}/message/sendMedia/${config.instanceName}`;
            const payload = {
                number: cleanPhone,
                mediatype: 'document',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                media: base64File, // Tentar enviar apenas o base64 sem o prefixo data:URI se o endpoint esperar isso, ou manter com prefixo.
                // Evolution API v2 costuma aceitar base64 puro ou url. Vamos tentar ajustar.
                // Se falhar, pode ser que precise do prefixo data:application/....
                // Vamos manter o prefixo mas adicionar o campo mimetype explicitamente.
                fileName: fileName,
                caption: caption || ''
            };
            // Ajuste: A Evolution API retornou erro "Owned media must be a url or base64" ao usar Data URI.
            // Vamos tentar enviar apenas a string Base64 pura.
            const body = {
                number: cleanPhone,
                mediatype: 'document',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                media: base64File, // Envia apenas o conteúdo base64 sem o prefixo data:application/...
                fileName: fileName,
                caption: caption || ''
            };
            console.log(`📤 Enviando documento para ${cleanPhone}. Tamanho base64: ${base64File.length}`);
            const response = await axios.post(url, body, {
                headers: {
                    'apikey': config.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Documento enviado para ${cleanPhone} via Evolution API`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Erro ao enviar documento via Evolution API:', error.message);
            if (error.response) {
                console.error('Detalhes do erro:', error.response.data);
            }
            return null;
        }
    }
}
//# sourceMappingURL=evolution.service.js.map