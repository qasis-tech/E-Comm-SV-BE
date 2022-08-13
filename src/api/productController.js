const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../config/model/product");
const { json } = require("body-parser");
const { features } = require("process");
const imageURL = "public/uploads";
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
      const hostname = req.headers.host;
      await fileUpload(req, res, (err) => {
        if (err) {
          console.log("error in image upload", err);
          return res.status(200).send({
            data: [],
            message: "Error in image uploading..!",
            success: false,
          });
        } else {
          const imageArray = [];
          const videoArray = [];
          req.files.forEach((file) => {
            if (file.fieldname === "productImage") {
              imageArray.push({
                image:
                  "http://" + hostname + "/" + file.path.replaceAll("\\", "/"),
              });
            } else {
              videoArray.push({
                video:
                  "http://" + hostname + "/" + file.path.replaceAll("\\", "/"),
              });
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
          newProduct
            .save()
            .then((product) => {
              return res.status(200).send({
                data: product,
                message: "Successfully Added Products..!",
                success: true,
              });
            })
            .catch((err) => {
              console.log("error", err);
              let errormessage = err.message;
              return res.status(404).send({
                data: [],
                message: "error",
                errormessage,
                status: false,
              });
            });
        }
      });
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        data: [],
        message: "error",
        errormessage,
        status: false,
      });
    }
  },
  viewProduct: async (req, res) => {
    try {
      if (!req.query.search) {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        await Product.find()
          .skip(skip)
          .limit(limit)
          .then((products) => {
            if (products.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No Products found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: products,
              message: "Successfully fetched all Products..!",
              success: true,
            });
          })
          .catch((err) => {
            console.log("error", err);
            let errormessage = err.message;
            return res.status(404).send({
              data: [],
              message: "error",
              errormessage,
              status: false,
            });
          });
      } else if (req.query.search) {
        const search = req.query.search;
        await Product.find({
          name: { $regex: search },
        })
          .then((products) => {
            if (products.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No products found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: products,
              message: "Successfully fetched products..!",
              success: true,
            });
          })
          .catch((err) => {
            console.log("error", err);
            let errormessage = err.message;
            return res.status(404).send({
              data: [],
              message: "error",
              errormessage,
              status: false,
            });
          });
      }
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        data: [],
        message: "error",
        errormessage,
        status: false,
      });
    }
  },

  editProduct: async (req, res) => {
    try {
      const hostname = req.headers.host;
      await fileUpload(req, res, (err) => {
        if (err) {
          console.log("error in image upload", err);
          return res.status(200).send({
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const imageArray = [];
        const videoArray = [];
        req.files.forEach((file) => {
          if (file.fieldname === "productImage") {
            imageArray.push({
              image:
                "http://" + hostname + "/" + file.path.replaceAll("\\", "/"),
            });
          } else {
            videoArray.push({
              video:
                "http://" + hostname + "/" + file.path.replaceAll("\\", "/"),
            });
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
          )
            .then((newProducts) => {
              if (newProducts) {
                return res.status(200).send({
                  data: newProducts,
                  message: "Successfully updated Products..!",
                  success: true,
                });
              } else {
                return res.status(404).send({
                  data: [],
                  message: "Invalid Id",
                  status: false,
                });
              }
            })
            .catch((err) => {
              console.log("error", err);
              let errormessage = err.message;
              return res.status(404).send({
                data: [],
                message: "error",
                errormessage,
                status: false,
              });
            });
        } else {
          return res.status(200).send({
            data: [],
            message: "Cannot find product with id " + req.params.id,
            success: false,
          });
        }
      });
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        data: [],
        message: "error",
        errormessage,
        status: false,
      });
    }
  },
  viewProductDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        await Product.findById({ _id: req.params.id })
          .then((products) => {
            if (products.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No Product found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: products,
              message: "Successfully fetched Product details..!",
              success: true,
            });
          })
          .catch((err) => {
            console.log("error", err);
            let errormessage = err.message;
            return res.status(404).send({
              data: [],
              message: "error",
              errormessage,
              status: false,
            });
          });
      } else {
        return res.status(200).send({
          data: [],
          message: "Cannot find product with id " + req.params.id,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        data: [],
        message: "error",
        errormessage,
        status: false,
      });
    }
  },
};
