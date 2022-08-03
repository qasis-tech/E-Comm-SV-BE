const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Category = require("../config/model/category");
const imageURL = "src/assets/images";
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
         await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(404).send({
            data: [err],
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const subCategory = [];
        const list = [{ title: "sub1" }, { title: "sub2" }, { title: "sub3" }];
        req.files.forEach((image) => {
          list.forEach((data) => {
            if (data.title === image.fieldname) {
              subCategory.push({
                title: data.title,
                subCategoryImage: image.path,
              });
            }
          });
        });
        Category.findOne({
          name: req.body.name,
        }).then((newCategory) => {
          if (newCategory)
            return res.status(404).send({
              data: [],
              message: "Catergory already exists..!",
              success: false,
            });
          else {
            Category.create({
              name: req.body.name,
              image: req.files[0].path,
              subCategory: subCategory,
            }).then((category) => {
              if (!category) {
                return res.status(404).send({
                  data: [],
                  message: "Failed to add categories..!",
                  success: false,
                });
              }
              return res.status(200).send({
                data: [category],
                message: "Successfully Added new Categories..!",
                success: true,
              });
            });
          }
        });
      });
    } catch (error) {
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },
  viewCategory: async (req, res) => {
    try {
      await Category.find().then((categories) => {
        return res.status(200).send({
          data: [categories],
          message: "Successfully fetched all categories..!",
          success: true,
        });
      });
    } catch (error) {
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },
  editCategory: async (req, res) => {
    try {
      await fileUpload(req, res, (err) => {
        if (err) {
          return res.status(404).send({
            data: [err],
            message: "Error in image uploading..!",
            success: false,
          });
        }
        const subCategory = [];
        const list = [
          { title: "subcat1" },
          { title: "subcat2" },
          { title: "subcat3" },
        ];
        req.files.forEach((image) => {
          list.forEach((data) => {
            if (data.title === image.fieldname) {
              subCategory.push({
                title: data.title,
                subCategoryImage: image.path,
              });
            }
          });
        });
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          const newCategory = Category.findByIdAndUpdate(
            req.params.id,
            {
              name: req.body.name,
              image: req.files[0].path,
              subCategory: subCategory,
            },
            {
              new: true,
            }
          ).then((newCategories) => {
            if (newCategories) {
              return res.status(200).send({
                data: [newCategories],
                message: "Successfully updated Categories..!",
                success: true,
              });
            }
          });
        } else {
          return res.status(404).send({
            data: [],
            message: "Cannot find category with id " + req.params.id,
            success: false,
          });
        }
      });
    } catch (error) {
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },
};
