import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';

export interface ValidatedRequestData {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

declare global {
  namespace Express {
    interface Request {
      validated?: ValidatedRequestData;
    }
  }
}

/**
 * Middleware factory de validação com Zod.
 *
 * Valida body, query e/ou params contra schemas Zod.
 * Em caso de falha, retorna HTTP 400 com estrutura padronizada:
 *
 *   { error: "Requisição inválida", details: [{ field, message }] }
 *
 * Nunca expõe stack trace ou detalhes do Prisma.
 *
 * Uso:
 *   router.post('/', validate({ body: createSchema }), handler);
 */
type ValidationTarget = 'body' | 'query' | 'params';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function formatZodError(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sources: ValidationTarget[] = ['params', 'query', 'body'];
    const allDetails: Array<{ field: string; message: string }> = [];

    for (const source of sources) {
      const schema = schemas[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source]);
      if (!result.success) {
        allDetails.push(...formatZodError(result.error));
      } else {
        // Express 5 expõe req.query por um getter sem setter. O resultado
        // normalizado do Zod fica em um local estável para todos os alvos.
        req.validated ??= {};
        req.validated[source] = result.data;

        // body e params são propriedades graváveis no Express 5 e continuam
        // substituídos para preservar a compatibilidade dos handlers existentes.
        // query deve ser lida exclusivamente pelos helpers abaixo.
        if (source === 'body') req.body = result.data;
        if (source === 'params') req.params = result.data as Request['params'];
      }
    }

    if (allDetails.length > 0) {
      res.status(400).json({
        error: 'Requisição inválida',
        details: allDetails,
      });
      return;
    }

    next();
  };
}

export function getValidatedBody<T = Record<string, unknown>>(req: Request): T {
  return (req.validated?.body ?? req.body) as T;
}

export function getValidatedQuery<T = Record<string, any>>(req: Request): T {
  return (req.validated?.query ?? req.query) as T;
}

export function getValidatedParams<T = Record<string, unknown>>(req: Request): T {
  return (req.validated?.params ?? req.params) as T;
}

// ── Helpers reutilizáveis ────────────────────────────────────────

/** Valida apenas que um parâmetro de rota é um inteiro positivo. */
export const idParamSchema = {
  params: createParamsSchema({
    id: 'positiveInt',
  }),
};

/** Cria schema de params com IDs validados como inteiros positivos. */
export function createParamsSchema(fields: Record<string, 'positiveInt'>) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key] of Object.entries(fields)) {
    shape[key] = z.coerce.number().int().positive();
  }
  return z.object(shape);
}
