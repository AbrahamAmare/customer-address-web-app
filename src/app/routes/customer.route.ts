import {
  AddCustomerPhone,
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  updateCustomerAddress,
  updateCustomerPhone,
} from "../controllers/customers.controller";
import validate from "../middleware/schema-validator";
import express from "express";

const router = express.Router();
router.route("/").get(getCustomers).post(createCustomer);

router
  .route("/:customerId")
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

router.route("/:customerId/address").patch(updateCustomerAddress);

router
  .route("/:customerId/phones")
  .patch(updateCustomerPhone)
  .post(AddCustomerPhone);

export default router;
