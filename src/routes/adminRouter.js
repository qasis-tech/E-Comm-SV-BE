import express from "express";
const router = express.Router();
import userController from "../api/userController.js";
import categoryController from "../api/categoryController.js";
import productController from "../api/productController.js";
import orderController from "../api/orderController.js";
import stockController from "../api/stockController.js";
import sliderController from "../api/sliderController.js";
import validate from "../utils/validation.js";
import validation from "../utils/validationSchema.js";
import tokenAuth from "../utils/JWTService.js";
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
  "/verifyOtp",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.otpValid),
  userController.verifyOtp
);
router.post(
  "/resetOtp",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.resetValid),
  userController.resetPassword
);
router.post(
  "/verifyResetOtp",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  validate(validation.resetOtpValid),
  userController.verifyResetPasswordOtp
);
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
router.delete(
  "/product/:id",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  productController.deleteProduct
);
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
router.get("/stock/:id", stockController.viewStockDetails);
router.post(
  "/slider",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  sliderController.addSlider
);
router.get(
  "/slider",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  sliderController.viewSlider
);
router.post(
  "/deal",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  sliderController.addDeal
);
router.get(
  "/deal",
  tokenAuth.verifyToken,
  tokenAuth.verifyMyToken,
  sliderController.viewDeal
);
export default router;
