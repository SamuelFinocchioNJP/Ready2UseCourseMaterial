import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleError, ValidationError } from "../errors";

// The request parts a route may validate. Each is an independent Zod schema so a
// handler validates only the parts it actually reads (params / query / body).
export interface ValidationSchemas {
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
}

// The shape stored on res.locals after a successful validate(): for each schema
// in the bundle, the parsed (inferred) type under the same key. Keys absent from
// the bundle are absent here too, so handlers only see what they validated.
export type Validated<S extends ValidationSchemas> = {
  [K in keyof S]: S[K] extends z.ZodType ? z.infer<S[K]> : never;
};

// Builds an Express middleware that validates the chosen request parts against
// their schemas. On the first failure it short-circuits to a 400 via handleError;
// on success it stores the parsed values on res.locals.validated and calls next().
// It never writes back to req.params/req.query, which are read-only getters in
// Express 5 — the parsed values live on res.locals instead.
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const out: Record<string, unknown> = {};
    for (const key of ["params", "query", "body"] as const) {
      const schema = schemas[key];
      if (!schema) continue;
      const result = schema.safeParse(req[key]);
      if (!result.success) {
        handleError(new ValidationError(result.error), res);
        return;
      }
      out[key] = result.data;
    }
    res.locals.validated = out;
    next();
  };
}

// Typed accessor for the validated payload. Pass the same DTO bundle type used in
// the matching validate() call so the parsed parts come back fully typed, e.g.
//   const { body } = validated<typeof createFlightDto>(res);
export function validated<S extends ValidationSchemas>(res: Response): Validated<S> {
  return res.locals.validated as Validated<S>;
}
