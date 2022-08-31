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
      
      // console.log('name',req.body.name)
      fileUpload(req, res, (err) => {
        
        if (err) {
          console.log("error in image upload", err);
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        } else {
          const unitList = ["kg", "g", "ltr", "no"];
          if (!req.body.name) {
            return res.status(200).send({
              data: [],
              message: "Product Name required!",
              success: false,
            });
          }
          if (!req.body.category) {
            return res.status(200).send({
              data: [],
              message: "Category required!",
              success: false,
            });
          }
        
          if (!req.body.unit) {
            return res.status(200).send({
              data: [],
              message: "unit required!",
              success: false,
            });
          }
          if (unitList.indexOf(req.body.unit) === -1) {
            return res.status(200).send({
              data: [],
              message: `allowed units ${unitList}`,
              success: false,
            });
          }
          if (!req.body.quantity) {
            return res.status(200).send({
              data: [],
              message: "quantity required!",
              success: false,
            });
          }
          if (isNaN(req.body.quantity)) {
            return res.status(200).send({
              data: [],
              message: "quantity must be a number!",
              success: false,
            });
          }
          if (!req.body.description) {
            return res.status(200).send({
              data: [],
              message: "description required!",
              success: false,
            });
          }
          if (!req.body.features) {
            return res.status(200).send({
              data: [],
              message: "features required!",
              success: false,
            });
          }
          if (!req.body.price) {
            return res.status(200).send({
              data: [],
              message: "price required!",
              success: false,
            });
          }
          if (isNaN(req.body.price)) {
            return res.status(200).send({
              data: [],
              message: "price must be a number!",
              success: false,
            });
          }
          if (!req.body.offerUnit) {
            return res.status(200).send({
              data: [],
              message: "offerunit required!",
              success: false,
            });
          }
          if (unitList.indexOf(req.body.offerUnit) === -1) {
            return res.status(200).send({
              data: [],
              message: `allowed offer units..! ${unitList}`,
              success: false,
            });
          }
          if (!req.body.offerQuantity) {
            return res.status(200).send({
              data: [],
              message: "offer quantity required!",
              success: false,
            });
          }
          if (isNaN(req.body.offerQuantity)) {
            return res.status(200).send({
              data: [],
              message: "Offer quantity must be a number!",
              success: false,
            });
          }
          if (!req.body.offerPrice) {
            return res.status(200).send({
              data: [],
              message: "offer price required!",
              success: false,
            });
          }
          if (isNaN(req.body.offerPrice)) {
            return res.status(200).send({
              data: [],
              message: "Offer price must be a number!",
              success: false,
            });
          }
          if (req?.files[0]?.path === undefined) {
            return res.status(200).send({
              data: [],
              message: "product Image required!",
              success: false,              
            });
          }
          console.log('file==>',req.files[0].path)
          Product.find({
            name: req.body.name,
            category: req.body.category,
            subCategory: req.body.subCategory,
          })
            .then((oldProduct) => {
              if (oldProduct.length) {
                  return res.status(200).send({
                  data: [],
                  message: "Product already exists..!",
                  success: false,
                 
                });
              } else {
                const imageArray = [];
                const videoArray = [];
                const imgResult = [];
                const fileFormat = [
                  "image/jpeg",
                  "image/jpg",
                  "image/png",
                  "image/svg",
                ];
                req.files.forEach((file) => {
                  if (file.fieldname === "productImage") {
                    if (fileFormat.indexOf(req?.files[0]?.mimetype) === -1) {
                      imgResult.push(req?.files[0]?.mimetype);
                    }
                    imageArray.push({
                      image:
                        "http://" +
                        hostname +
                        "/" +
                        file.path.replaceAll("\\", "/"),
                    });
                  } else {
                    videoArray.push({
                      video:
                        "http://" +
                        hostname +
                        "/" +
                        file.path.replaceAll("\\", "/"),
                    });
                    // console.log("video", req?.files[0]?.mimetype);
                  }
                });
                if (imgResult.length) {
                  return res.status(200).send({
                    data: [],
                    message: `allowed file format ${fileFormat}`,
                    success: false,
                  });
                }
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
                    return res.status(404).send({
                      data: [],
                      message: `error..! ${err.message}`,
                      status: false,
                    });
                  });
              }
            })
            .catch((err) => {
              console.log("error", err);
              return res.status(404).send({
                data: [],
                message: `error..! ${err.message}`,
                status: false,
              });
            });
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
   viewProduct: async (req, res) => {
    try {
      if (req.query.search || req.query.category || req.query.subCategory) {
        let searchValue = "";
        let categoryArray = [];
        let subCategoryArray = [];
        if (req.query.search) {
          searchValue = req.query.search;
        }
        if (req.query.category) {
          categoryArray = req.query.category.split(",");
        }
        if (req.query.subCategory) {
          subCategoryArray = req.query.subCategory.split(",");
        }
        if (req.query.search) {
          await Product.aggregate([
            {
              $match: {
                $or: [
                  { category: { $in: categoryArray } },
                  { subCategory: { $in: subCategoryArray } },
                  { name: { $regex: searchValue } },
                ],
              },
            },
          ])
            .then((products) => {
              if (products.length === 0) {
                return res.status(200).send({
                  data: [],
                  message: "No products found..!",
                  success: false,
                  count: products.length,
                });
              }
              return res.status(200).send({
                data: products,
                message: "Successfully fetched products..!",
                success: true,
                count: products.length,
              });
            })
            .catch((err) => {
              console.log("error", err);
              return res.status(404).send({
                data: [],
                message: `error..! ${err.message}`,
                status: false,
              });
            });
        } else {
          await Product.aggregate([
            {
              $match: {
                $or: [
                  { category: { $in: categoryArray } },
                  { subCategory: { $in: subCategoryArray } },
                ],
              },
            },
          ])
            .then((products) => {
              if (products.length === 0) {
                return res.status(200).send({
                  data: [],
                  message: "No products found..!",
                  success: false,
                  count: products.length,
                });
              }
              return res.status(200).send({
                data: products,
                message: "Successfully fetched products..!",
                success: true,
                count: products.length,
              });
            })
            .catch((err) => {
              console.log("error", err);
              return res.status(404).send({
                data: [],
                message: `error..! ${err.message}`,
                status: false,
              });
            });
        }
      } else {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        let count = await Product.count();
        await Product.find()
          .skip(skip)
          .limit(limit)
          .then((products) => {
            if (products.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No Products found..!",
                success: false,
                count: count,
              });
            }
            return res.status(200).send({
              data: products,
              message: "Successfully fetched all Products..!",
              success: true,
              count: count,
            });
          })
          .catch((err) => {
            console.log("error", err);
            return res.status(404).send({
              data: [],
              message: `error..! ${err.message}`,
              status: false,
            });
          });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  editProduct: async (req, res) => {
    try {
      const hostname = req.headers.host;
      fileUpload(req, res, (err) => {
        if (err) {
          console.log("error in image upload", err);
          return res.status(200).send({
            message: "Error in image uploading..!",
            success: false,
          });
        }
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          Product.find({ _id: req.params.id }).then((products) => {
            if (products.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No product found with given id..!",
                success: false,
              });
            } else {
              const unitList = ["kg", "g", "ltr", "no"];
              if (!req.body.name) {
                return res.status(200).send({
                  data: [],
                  message: "Product Name required!",
                  success: false,
                });
              }
              if (!req.body.category) {
                return res.status(200).send({
                  data: [],
                  message: "Category required!",
                  success: false,
                });
              }
                if (!req.body.unit) {
                return res.status(200).send({
                  data: [],
                  message: "unit required!",
                  success: false,
                });
              }
              if (unitList.indexOf(req.body.unit) === -1) {
                return res.status(200).send({
                  data: [],
                  message: `allowed units ${unitList}`,
                  success: false,
                });
              }
              if (!req.body.quantity) {
                return res.status(200).send({
                  data: [],
                  message: "quantity required!",
                  success: false,
                });
              }
              if (isNaN(req.body.quantity)) {
                return res.status(200).send({
                  data: [],
                  message: "quantity must be a number!",
                  success: false,
                });
              }
              if (!req.body.description) {
                return res.status(200).send({
                  data: [],
                  message: "description required!",
                  success: false,
                });
              }
              if (!req.body.features) {
                return res.status(200).send({
                  data: [],
                  message: "features required!",
                  success: false,
                });
              }
              if (!req.body.price) {
                return res.status(200).send({
                  data: [],
                  message: "price required!",
                  success: false,
                });
              }
              if (isNaN(req.body.price)) {
                return res.status(200).send({
                  data: [],
                  message: "price must be a number!",
                  success: false,
                });
              }
              if (!req.body.offerUnit) {
                return res.status(200).send({
                  data: [],
                  message: "offer unit required!",
                  success: false,
                });
              }
              if (unitList.indexOf(req.body.offerUnit) === -1) {
                return res.status(200).send({
                  data: [],
                  message: `allowed offer units ${unitList}`,
                  success: false,
                });
              }
              if (!req.body.offerQuantity) {
                return res.status(200).send({
                  data: [],
                  message: "offer quantity required!",
                  success: false,
                });
              }
              if (isNaN(req.body.offerQuantity)) {
                return res.status(200).send({
                  data: [],
                  message: "offer quantity must be a number!",
                  success: false,
                });
              }
              if (!req.body.offerPrice) {
                return res.status(200).send({
                  data: [],
                  message: "offer price required!",
                  success: false,
                });
              }
              if (isNaN(req.body.offerPrice)) {
                return res.status(200).send({
                  data: [],
                  message: "offer price must be a number!",
                  success: false,
                });
              }
              const imageArray = [];
              const videoArray = [];
              req?.files?.forEach((file) => {
                if (file.fieldname === "productImage") {
                  imageArray.push({
                    image:
                      "http://" +
                      hostname +
                      "/" +
                      file.path.replaceAll("\\", "/"),
                  });
                } else {
                  videoArray.push({
                    video:
                      "http://" +
                      hostname +
                      "/" +
                      file.path.replaceAll("\\", "/"),
                  });
                }
              });
              if (req?.files[0]?.path) {
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
                    }
                  })
                  .catch((err) => {
                    console.log("error", err);
                    return res.status(404).send({
                      data: [],
                      message: `error..! ${err.message}`,
                      status: false,
                    });
                  });
              } else {
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
                    }
                  })
                  .catch((err) => {
                    console.log("error", err);
                    return res.status(404).send({
                      data: [],
                      message: `error..! ${err.message}`,
                      status: false,
                    });
                  });
              }
            }
          });
        } else {
          return res.status(200).send({
            data: [],
            message: `Cannot find product with id ${req.params.id}`,
            success: false,
          });
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewProductDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Product.find({ _id: req.params.id }).then((products) => {
          if (products.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No products found with given id..!",
              success: false,
            });
          } else {
            Product.findById({ _id: req.params.id })
              .then((products) => {
                if (products.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No Product found..!",
                    success: false,
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
                return res.status(404).send({
                  data: [],
                  message: `error..! ${err.message}`,
                  status: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Cannot find product with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  deleteProduct: async (req, res) => {
  //   try {
  //     if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
  //       Product.find({ _id: req.params.id }).then((product) => {
  //         if (product.length === 0) {
  //           return res.status(200).send({
  //             data: [],
  //             message: "No Product found with given id..!",
  //             success: false,
  //           });
  //         } else {
  //           Product.findByIdAndRemove(req.params.id)
  //             .then((product) => {
  //               res.status(200).send({
  //                 data: product,
  //                 message: "Successfully deleted product..!",
  //                 success: true,
  //               });
  //             })
  //             .catch((error) => {
  //               console.log("error", error);
  //               return res.status(200).send({
  //                 data: [],
  //                 message: `product not found with id ${req.params.id}`,
  //                 success: false,
  //               });
  //             });
  //         }
  //       });
  //     } else {
  //       return res.status(200).send({
  //         data: [],
  //         message: "Cannot find product with id " + req.params.id,
  //         success: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     return res.status(404).send({
  //       data: [],
  //       message: `error..! ${error.message}`,
  //       status: false,
  //     });
  //   }
  // },
}
}
