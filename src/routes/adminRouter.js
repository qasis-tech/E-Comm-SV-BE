var express = require("express");
const router = express.Router();
const userController = require("../api/userController");
const categoryController = require("../api/categoryController");
const productController = require("../api/productController");
const orderController = require("../api/orderController");
const stockController = require("../api/stockController");
const { validate,signupvalidate } = require("../utils/validation");
const validation = require("../utils/validationSchema");
const tokenAuth=require('../utils/JWTService');
const { JWT } = require("google-auth-library");
router.get("/", function (req, res, next) {
  res.send("welcome to adminPanel");
});
router.post("/signup",validate(validation.usersignup),userController.addUser);
router.post("/google",validate(validation.googleAuth),userController.googleAuth);
router.get("/signup",userController.viewUsers);
router.put("/signup/:id",userController.editUsers);
router.delete("/signup/:id",userController.deleteUsers);
router.post("/login", validate(validation.signin), userController.login);
router.post("/category",tokenAuth.verifyToken,categoryController.addCategory);
router.get("/category",tokenAuth.verifyToken,categoryController.viewCategory);
router.put("/category/:id",tokenAuth.verifyToken,categoryController.editCategory);
router.post("/product",tokenAuth.verifyToken,productController.addProduct);
router.get("/product",tokenAuth.verifyToken,productController.viewProduct);
router.put("/product/:id",tokenAuth.verifyToken,productController.editProduct);
router.post("/order",tokenAuth.verifyToken,orderController.addOrder);
router.get("/order",tokenAuth.verifyToken,orderController.viewTotalOrder);
router.post("/stock",tokenAuth.verifyToken,stockController.addStock);
router.get("/stock",tokenAuth.verifyToken,stockController.viewStock);
router.put("/stock/:id",tokenAuth.verifyToken,stockController.editStock);
router.delete("/stock/:id",tokenAuth.verifyToken,stockController.deleteStock);
router.put("/addUser/:id",userController.addUserDetails);
module.exports = router;
