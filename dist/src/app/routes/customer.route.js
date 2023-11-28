"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customers_controller_1 = require("../controllers/customers.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route("/").get(customers_controller_1.getCustomers).post(customers_controller_1.createCustomer);
router
    .route("/:customerId")
    .get(customers_controller_1.getCustomer)
    .put(customers_controller_1.updateCustomer)
    .delete(customers_controller_1.deleteCustomer);
router.route("/:customerId/address").patch(customers_controller_1.updateCustomerAddress);
router
    .route("/:customerId/phones")
    .patch(customers_controller_1.updateCustomerPhone)
    .post(customers_controller_1.AddCustomerPhone);
exports.default = router;
//# sourceMappingURL=customer.route.js.map