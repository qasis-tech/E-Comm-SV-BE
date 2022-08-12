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
});
const fileUpload = upload.any();
module.exports = {
  addCategory: async (req, res) => {
     try {
      const hostname = req.headers.host;  
      await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const subCategory = [];
        req.files.forEach((image) => {
          if (image.fieldname !== "image") {
            subCategory.push({
              label: image.fieldname,
              subCategoryImage:'http://'+hostname+'/'+image.path.replaceAll('\\', "/"),
            });
          }
        });
        Category.findOne({
          label: req.body.label,
        }).then((newCategory) => {
          if (newCategory)
            return res.status(200).send({
              data: [],
              message: "Catergory already exists..!",
              success: false,
            });
          else {
              const newCategory = new Category({
              label: req.body.label,
              image:'http://'+hostname+'/'+req.files[0].path.replaceAll('\\', "/"),
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
      });
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        data: [error],
        message: "error",
        errormessage,
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
        await Category.find()
          .skip(skip)
          .limit(limit)
          .then((categories) => {
            if (categories.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No categories found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: categories,
              message: "Successfully fetched all categories..!",
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
        await Category.find({ label: { $regex: req.query.search } })
          .then((categories) => {
            if (categories.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No categories found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: categories,
              message: "Successfully fetched categories..!",
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
  editCategory: async (req, res) => {
    try {
      const hostname = req.headers.host; 
      await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const subCategory = [];
        req.files.forEach((image) => {
          if (image.fieldname !== "image") {
            subCategory.push({
              label: image.fieldname,
              subCategoryImage:'http://'+hostname+'/'+image.path.replaceAll('\\', "/"),
            });
          }
        });
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          const newCategory = Category.findByIdAndUpdate(
            req.params.id,
            {
              label: req.body.label,
              image: 'http://'+hostname+'/'+req.files[0].path.replaceAll('\\', "/"),
              subCategory: subCategory,
            },
            {
              new: true,
            }
          )
            .then((newCategories) => {
              if (newCategories) {
                return res.status(200).send({
                  data: newCategories,
                  message: "Successfully updated Categories..!",
                  success: true,
                });
              }
              else{
                return res.status(404).send({
                  data: [],
                  message: "Invalid Id",
                  status: false,
                });
              }
            })
          } else {
          return res.status(200).send({
            data: [],
            message: "Cannot find category with id " + req.params.id,
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
};
