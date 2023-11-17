import { AnyZodObject, ZodEffects, Schema } from "zod";
import { Request, Response, NextFunction } from "express";
import { fromZodError } from "zod-validation-error";

const validate =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      return next();
    } catch (error) {
      // console.log(fromZodError(error));
      return res.status(422).json(error.errors);
    }
  };

export default validate;
