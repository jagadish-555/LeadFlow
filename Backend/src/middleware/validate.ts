import type { RequestHandler } from 'express'
import { z, type ZodType } from 'zod'

const validateBody = <T>(schema: ZodType<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: z.flattenError(result.error),
        },
      })
    }

    req.body = result.data
    next()
  }
}

export default validateBody
