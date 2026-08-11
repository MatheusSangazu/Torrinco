import type { NextFunction, Response } from 'express';
import { z } from 'zod';
import type { JwtRequest } from '../middleware/jwt.js';
import { FinancialImportError, FinancialImportService, ImportFileError } from '../services/financial-import.service.js';

const optionalId = z.preprocess(v => v === '' ? undefined : v, z.coerce.number().int().positive().optional());
const itemSchema = z.object({
  included: z.boolean().optional(), transaction_date: z.iso.date().optional(), description: z.string().trim().min(1).max(255).optional(),
  amount: z.coerce.number().positive().max(9999999999).optional(), type: z.enum(['expense', 'income']).optional(), category_id: optionalId.nullable().optional(),
  entity_id: optionalId.nullable().optional(), payment_method: z.string().trim().max(30).optional(), transaction_status: z.enum(['paid', 'pending']).optional(), requires_review: z.boolean().optional()
});
const newItemSchema = itemSchema.extend({ transaction_date: z.iso.date(), description: z.string().trim().min(1).max(255), amount: z.coerce.number().positive(), type: z.enum(['expense', 'income']) });
const bulkItemSchema = z.object({
  item_ids: z.array(z.coerce.number().int().positive()).min(1).max(500).refine(ids => new Set(ids).size === ids.length, 'Os itens da operação em massa não podem se repetir.'),
  changes: z.object({
    category_id: optionalId.nullable().optional(), entity_id: optionalId.nullable().optional(), included: z.boolean().optional(),
    transaction_status: z.enum(['paid', 'pending']).optional()
  }).strict().refine(changes => Object.keys(changes).length > 0, 'Informe ao menos uma alteração.')
}).strict();
const importStatuses = ['uploaded', 'processing', 'review', 'confirmed', 'importing', 'completed', 'completed_with_warnings', 'failed', 'cancelled'] as const;
const listSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(), limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().max(100).optional(), status: z.enum(importStatuses).optional(),
  from: z.iso.date().optional(), to: z.iso.date().optional()
}).refine(value => !value.from || !value.to || value.from <= value.to, { message: 'O período inicial não pode ser posterior ao período final.', path: ['from'] });

function scope(req: JwtRequest) { return { accountId: req.accountId!, userId: req.userId! }; }
function id(value: string | string[] | undefined): number { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw new FinancialImportError('INVALID_ID', 'Identificador inválido.'); return parsed; }

export class ImportsController {
  static async upload(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new ImportFileError('FILE_REQUIRED', 'Selecione um arquivo para importar.');
      const allowReimport = req.body?.allow_reimport === 'true';
      const result = await FinancialImportService.upload({ ...scope(req), buffer: req.file.buffer, fileName: req.file.originalname, mimeType: req.file.mimetype, fileSize: req.file.size, allowReimport });
      res.status('reimport_blocked' in result || 'resumed' in result ? 200 : 201).json(result);
    } catch (error) { next(error); }
  }
  static async list(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await FinancialImportService.list(scope(req), listSchema.parse(req.query))); } catch (e) { next(e); } }
  static async get(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await FinancialImportService.get(scope(req), id(req.params.id))); } catch (e) { next(e); } }
  static async update(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const body = z.object({ target_entity_id: optionalId.nullable().optional(), document_type: z.enum(['card_statement', 'bank_statement', 'spreadsheet', 'boleto', 'receipt', 'unknown']).optional() }).parse(req.body);
      res.json(await FinancialImportService.update(scope(req), id(req.params.id), body));
    } catch (e) { next(e); }
  }
  static async updateItem(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await FinancialImportService.updateItem(scope(req), id(req.params.id), id(req.params.itemId), itemSchema.parse(req.body))); } catch (e) { next(e); } }
  static async updateItemsBulk(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await FinancialImportService.updateItemsBulk(scope(req), id(req.params.id), bulkItemSchema.parse(req.body))); } catch (e) { next(e); } }
  static async addItem(req: JwtRequest, res: Response, next: NextFunction) { try { res.status(201).json(await FinancialImportService.addItem(scope(req), id(req.params.id), newItemSchema.parse(req.body))); } catch (e) { next(e); } }
  static async confirm(req: JwtRequest, res: Response, next: NextFunction) { try { const body = z.object({ allow_difference: z.boolean().optional(), allow_duplicates: z.boolean().optional(), difference_reason: z.string().trim().max(500).optional() }).parse(req.body); res.json(await FinancialImportService.confirm(scope(req), id(req.params.id), body)); } catch (e) { next(e); } }
  static async cancel(req: JwtRequest, res: Response, next: NextFunction) { try { res.json(await FinancialImportService.cancel(scope(req), id(req.params.id))); } catch (e) { next(e); } }
}
