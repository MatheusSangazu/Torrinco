export declare class EvolutionService {
    /**
     * Envia uma mensagem de texto via WhatsApp
     * @param phoneNumber Número do telefone (com DDI, ex: 5511999999999)
     * @param text Texto da mensagem
     */
    static sendText(phoneNumber: string, text: string): Promise<any>;
    static sendDocument(phoneNumber: string, base64File: string, fileName: string, caption?: string): Promise<any>;
}
//# sourceMappingURL=evolution.service.d.ts.map