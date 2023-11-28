"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res);
    }
    catch (error) {
        return next(error);
    }
};
exports.default = tryCatch;
//# sourceMappingURL=tryCatch.utils.js.map