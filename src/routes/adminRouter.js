var express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userController = require("../api/userController");
const categoryController = require("../api/categoryController");
const productController = require("../api/productController");
const orderController = require("../api/orderController");
const stockController = require("../api/stockController");
const { validate } = require("../utils/validation");
const validation = require("../utils/validationSchema");
const tokenAuth = require("../utils/JWTService");
const { JWT } = require("google-auth-library");
router.get("/", function (req, res, next) {
  res.send("welcome to adminPanel");
});
router.post("/user", validate(validation.usersignup), userController.addUser);
router.post(
  "/google",
  validate(validation.googleAuth),
  userController.googleAuth
);
router.get("/user", userController.viewUsers);
router.put(
  "/user/:id",
  validate(validation.userEditsignup),
  userController.editUsers
);
router.delete("/user/:id", userController.deleteUsers);
router.post("/login", validate(validation.signin), userController.login);
router.post(
  "/category",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  categoryController.addCategory
);
router.get(
  "/category",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  categoryController.viewCategory
);
router.put(
  "/category/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  categoryController.editCategory
);
router.post(
  "/product",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  productController.addProduct
);
router.get(
  "/product",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  productController.viewProduct
);
router.put(
  "/product/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  productController.editProduct
);
router.delete("/product/:id", productController.deleteProduct);
router.post(
  "/order",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.orderValid),
  orderController.addOrder
);
router.get(
  "/order",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  orderController.viewTotalOrder
);
router.put(
  "/order/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.orderEditValid),
  orderController.editOrder
);
router.post(
  "/stock",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.stockValid),
  stockController.addStock
);
router.get(
  "/stock",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  stockController.viewStock
);
router.put(
  "/stock/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.stockValid),
  stockController.editStock
);
router.delete(
  "/stock/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  stockController.deleteStock
);
router.put("/addUser/:id", userController.addUserDetails);
router.get("/product/:id", productController.viewProductDetails);
router.get("/order/:id", orderController.viewOrderDetails);
router.get("/user/:id", userController.viewUserDetails);
router.get("/category/:id", categoryController.viewCategoryDetails);
module.exports = router;
