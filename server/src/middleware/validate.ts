import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';

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
        // Substitui pelo dado validado/normalizado (strip de campos extras).
        (req as any)[source] = result.data;
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
