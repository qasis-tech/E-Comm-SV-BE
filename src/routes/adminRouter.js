var express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const userController = require("../api/userController");
const loginController = require("../api/loginController");
const categoryController = require("../api/categoryController");
const productController = require("../api/productController");
const orderController = require("../api/orderController");
const { validate,signupvalidate } = require("../utils/validation");
const validation = require("../utils/validationSchema");
router.get("/", function (req, res, next) {
  res.send("welcome to adminPanel");
});
router.post("/signup",userController.addUser);
router.get("/google",userController.googleAuth);
router.post("/login", validate(validation.signin), loginController.login);
router.post("/category",categoryController.addCategory);
router.get("/category",categoryController.viewCategory);
router.put("/category/:id",categoryController.editCategory);
router.post("/product",productController.addProduct);
router.get("/product",productController.viewProduct);
router.put("/product/:id",productController.editProduct);
router.post("/order",orderController.addOrder);
router.get("/order",orderController.viewOrder);

module.exports = router;
