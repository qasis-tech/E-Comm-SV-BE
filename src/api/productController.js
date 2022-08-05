const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../config/model/product");
const imageURL = "src/assets/images";
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageURL);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: Storage,
});
const fileUpload = upload.any();
module.exports = {
  addProduct: async (req, res) => {
    try {
      await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(404).send({
            message: "Error in image uploading..!",
            success: false,
          });
        } else {
          const imageArray = [];
          const videoArray = [];
          req.files.forEach((file) => {
            if (file.fieldname === "productImage") {
              imageArray.push({ image: file.path });
            } else {
              videoArray.push({ video: file.path });
            }
          });
          const newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            subCategory: req.body.subCategory,
            unit: req.body.unit,
            quantity: req.body.quantity,
            description: req.body.description,
            features: req.body.features,
            price: req.body.price,
            offerUnit: req.body.offerUnit,
            offerQuantity: req.body.offerQuantity,
            offerPrice: req.body.offerPrice,
            productImage: imageArray,
            productVideo: videoArray,
          });
          newProduct.save().then((product) => {
            return res.status(200).send({
              data: product,
              message: "Successfully Added Products..!",
              success: true,
            });
          });
        }
      });
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },
  viewProduct: async (req, res) => {
    try {
      await Product.find().then((products) => {
        return res.status(200).send({
          data: products,
          message: "Successfully fetched all Products..!",
          success: true,
        });
      });
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },

  editProduct: async (req, res) => {
    try {
      await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(404).send({
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const imageArray = [];
        const videoArray = [];
        req.files.forEach((file) => {
          if (file.fieldname === "productImage") {
            imageArray.push({ image: file.path });
          } else {
            videoArray.push({ video: file.path });
          }
        });
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          const newProduct = Product.findByIdAndUpdate(
            req.params.id,
            {
              name: req.body.name,
              category: req.body.category,
              subCategory: req.body.subCategory,
              unit: req.body.unit,
              quantity: req.body.quantity,
              description: req.body.description,
              features: req.body.features,
              price: req.body.price,
              offerUnit: req.body.offerUnit,
              offerQuantity: req.body.offerQuantity,
              offerPrice: req.body.offerPrice,
              productImage: imageArray,
              productVideo: videoArray,
            },
            {
              new: true,
            }
          ).then((newProducts) => {
            if (newProducts) {
              return res.status(200).send({
                data: newProducts,
                message: "Successfully updated Products..!",
                success: true,
              });
            }
          });
        } else {
          return res.status(404).send({
            message: "Cannot find product with id " + req.params.id,
            success: false,
          });
        }
      });
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },
  searchProduct: async (req, res) => {
    try {
      if(req.body.search==="")
      {
        return res.status(404).send({
          message: "Search field required..!",
          success: false,
        });
      }
      await Product.find({ 
        name: {$regex: req.body.search}})
            .then((products) => {
            if(products.length===0){
              return res.status(200).send({
                message: "No products found..!",
                success: true,
              });
            }
        return res.status(200).send({
          data: products,
          message: "Successfully fetched products..!",
          success: true,
        });
      });
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  }, 
};
