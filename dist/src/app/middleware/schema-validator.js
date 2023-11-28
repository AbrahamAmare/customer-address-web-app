"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        return next();
    }
    catch (error) {
        // console.log(fromZodError(error));
        return res.status(422).json(error.errors);
    }
};
exports.default = validate;
//# sourceMappingURL=schema-validator.js.map