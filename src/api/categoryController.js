const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Category = require("../config/model/category");
const imageURL = "public/uploads";
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageURL);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: Storage,
  fileFilter:(req,file,cb)=>{
    if(file.mimetype=="image/png" ||
    file.mimetype=="image/jpg" ||
    file.mimetype=="image/jpeg" ||
    file.mimetype=="image/svg"
    ){
      cb(null,true)
    }else{
      cb(null,false)
      return cb(new Error("Only .png,.jpg,.jpeg and .svg format allowed"))      
    }
  },
 });
const fileUpload = upload.any();
module.exports = {
  addCategory: async (req, res) => {
    try {
      const { host } = req.headers;
      fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        }
        if (!req.body.label) {
          return res.status(200).send({
            data: [],
            message: "Category name required!",
            success: false,
          });
        }
        if (req?.files[0]?.path === undefined) {
          return res.status(200).send({
            data: [],
            message: "category Image required!",
            success: false,
          });
        }
       const subCategory = req?.files
          ?.filter((fl) => fl?.fieldname !== "image")
          .map((image) => {
            return {
              label: image.fieldname,
              subCategoryImage: `http://${host}/${image?.path?.replaceAll(
                "\\",
                "/"
              )}`,
            };
          });
        let temp = [];
        if (subCategory.length) {
          for (let index = 0; index < subCategory.length; index++) {
            let i = temp?.findIndex(
              (fi) => fi?.label === subCategory[index]?.label
            );
            if (i === -1) {
              temp.push(subCategory[index]);
            }
          }
        }
        if (
          temp.length > 0 &&
          subCategory.length > 0 &&
          temp.length === subCategory.length
        ) {
          if (temp.length) {
            Category.findOne({
              label: req.body.label,
            }).then((newCategory) => {
              if (newCategory) {
                const newsubCategory = Category.findByIdAndUpdate(
                  newCategory._id,
                  {
                    subCategory: subCategory,
                  },
                  {
                    new: true,
                  }
                ).then((newsubCategory) => {
                  if (newsubCategory) {
                    return res.status(200).send({
                      data: newsubCategory,
                      message: "Successfully updated sub Categories..!",
                      success: true,
                    });
                  }
                });
              } else {
                const newCategory = new Category({
                  label: req.body.label,
                  image: `http://${host}/${req?.files[0]?.path.replaceAll(
                    "\\",
                    "/"
                  )}`,
                  subCategory: subCategory,
                });
                newCategory
                  .save()
                  .then((Category) => {
                    return res.status(200).send({
                      data: Category,
                      message: "Successfully Added Category..!",
                      success: true,
                    });
                  })
                  .catch((err) => {
                    console.log("error 4", err);
                    return res.status(404).send({
                      data: [],
                      message: `error..! ${err.message}`,
                      status: false,
                    });
                  });
              }
            });
          } else {
            Category.findOne({
              label: req.body.label,
            }).then((newCategory) => {
              if (newCategory) {
              return res.send({
                  data: [],
                  message: "Category already exists...!",
                  success: false,
                });
              }
            });
          }
        } else if (temp.length === 0 && subCategory.length === 0) {
          Category.findOne({
            label: req.body.label,
          }).then((cat) => {
            if (cat) {
              return res.status(200).send({
                data: [],
                message: "Category already exists...!",
                success: false,
              });
            } else {
              const newCategory = new Category({
                label: req.body.label,
                image: `http://${host}/${req?.files[0]?.path.replaceAll(
                  "\\",
                  "/"
                )}`,
                subCategory: subCategory,
              });
              newCategory
                .save()
                .then((Category) => {
                  return res.status(200).send({
                    data: Category,
                    message: "Successfully Added Category..!",
                    success: true,
                  });
                })
                .catch((err) => {
                  console.log("error 4", err);
                  return res.status(404).send({
                    data: [],
                    message: `error..! ${err.message}`,
                    status: false,
                  });
                });
            }
          });
        } else {
          res.send({
            data: [],
            message: "Duplication of Subcategory not allowed...!",
            success: false,
          });
        }
      });
    } catch (error) {
      console.log("error 5", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewCategory: async (req, res) => {
    try {
      if (!req.query.search) {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        let count = await Category.count();
        await Category.find()
          .skip(skip)
          .limit(limit)
          .then((categories) => {
            if (!categories.length) {
              return res.status(200).send({
                data: [],
                message: "No categories found..!",
                success: false,
                count: count,
              });
            }
            return res.status(200).send({
              data: categories,
              message: "Successfully fetched all categories..!",
              success: true,
              count: count,
            });
          })
          .catch((err) => {
            console.log("error 3", err);
            return res.status(404).send({
              data: [],
              message: `error..! ${err.message}`,
              status: false,
            });
          });
      } else if (req.query.search) {
        await Category.find({ label: { $regex: req.query.search } })
          .then((categories) => {
            if (categories.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No categories found..!",
                success: false,
                count: categories.length,
              });
            }
            return res.status(200).send({
              data: categories,
              message: "Successfully fetched categories..!",
              success: true,
              count: categories.length,
            });
          })
          .catch((err) => {
            console.log("error 1", err);
            return res.status(404).send({
              data: [],
              message: `error..! ${err.message}`,
              status: false,
            });
          });
      }
    } catch (error) {
      console.log("error 2", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  editCategory: async (req, res) => {
    try {
      const { host } = req.headers;
      fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        }
        if (!req.body.label) {
          return res.status(200).send({
            data: [],
            message: "Category name required!",
            success: false,
          });
        }
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          Category.find({ _id: req.params.id }).then((categories) => {
            if (categories.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No categories found with given id..!",
                success: false,
              });
            } else {
              const subCategory = req?.files
                ?.filter((fl) => fl?.fieldname !== "image")
                .map((image) => {
                  return {
                    label: image.fieldname,
                    subCategoryImage: `http://${host}/${image?.path?.replaceAll(
                      "\\",
                      "/"
                    )}`,
                  };
                });
              let temp = [];
              if (subCategory.length) {
                for (let index = 0; index < subCategory.length; index++) {
                  let i = temp?.findIndex(
                    (fi) => fi?.label === subCategory[index]?.label
                  );
                  if (i === -1) {
                    temp.push(subCategory[index]);
                  }
                }
              }
              if (
                temp.length > 0 &&
                subCategory.length > 0 &&
                temp.length === subCategory.length
              ) {
                if (temp.length) {
                  Category.findOne({
                    label: req.body.label,
                  }).then((newCategory) => {
                    if (newCategory) {
                      const newsubCategory = Category.findByIdAndUpdate(
                        newCategory._id,
                        {
                          subCategory: subCategory,
                        },
                        {
                          new: true,
                        }
                      ).then((newsubCategory) => {
                        if (newsubCategory) {
                          return res.status(200).send({
                            data: newsubCategory,
                            message: "Successfully updated sub Categories..!",
                            success: true,
                          });
                        }
                      });
                    } else {
                      if (req?.files[0]?.path) {
                        Category.findByIdAndUpdate(
                          req.params.id,
                          {
                            label: req.body.label,
                            image: `http://${host}/${req?.files[0]?.path?.replaceAll(
                              "\\",
                              "/"
                            )}`,
                            subCategory: subCategory,
                          },
                          {
                            new: true,
                          }
                        ).then((newCategories) => {
                          if (newCategories) {
                            return res.status(200).send({
                              data: newCategories,
                              message: "Successfully updated Categories..!",
                              success: true,
                            });
                          }
                        });
                      } else {
                        Category.findByIdAndUpdate(
                          req.params.id,
                          {
                            label: req.body.label,
                            subCategory: subCategory,
                          },
                          {
                            new: true,
                          }
                        ).then((newCategories) => {
                          if (newCategories) {
                            return res.status(200).send({
                              data: newCategories,
                              message: "Successfully updated Categories..!",
                              success: true,
                            });
                          }
                        });
                      }
                    }
                  });
                } 
              } 
              else if (temp.length === 0 && subCategory.length === 0) {
                Category.findOne({
                  label: req.body.label,
                }).then((cat) => {
                  if (cat) {
                    return res.status(200).send({
                      data: [],
                      message: "Category already exists...!",
                      success: false,
                    });
                  } else {
                    Category.findByIdAndUpdate(
                      req.params.id,
                      {
                        label: req.body.label,
                        image: `http://${host}/${req?.files[0]?.path?.replaceAll(
                          "\\",
                          "/"
                        )}`,
                        subCategory: subCategory,
                      },
                      {
                        new: true,
                      }
                    )
                      .then((Category) => {
                        return res.status(200).send({
                          data: Category,
                          message: "Successfully updated Category..!",
                          success: true,
                        });
                      })
                      .catch((err) => {
                        console.log("error 4", err);
                        return res.status(404).send({
                          data: [],
                          message: `error..! ${err.message}`,
                          status: false,
                        });
                      });
                  }
                });
              } 
              
              else {
                res.send({
                  data: [],
                  message: "Duplication of Subcategory not allowed...!",
                  success: false,
                });
              }
            }
          });
        } else {
          return res.status(200).send({
            data: [],
            message: `Cannot find category with id ${req.params.id}`,
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
  viewCategoryDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Category.find({ _id: req.params.id }).then((categories) => {
          if (categories.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No categories found with given id..!",
              success: false,
            });
          } else {
            Category.findById({ _id: req.params.id })
              .then((category) => {
                if (category.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No category found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: category,
                  message: "Successfully fetched category details..!",
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
          message: `Cannot find category with id ${req.params.id}`,
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
};
