import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import Slider from "../config/model/slider.js";
import Deal from "../config/model/deal.js";
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
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Only .png,.jpg,.jpeg and .svg format allowed for images")
      );
    }
  },
  limits: {
    files: 5,
    fileSize: 4000000,
  },
});
const upload1 = multer({
  storage: Storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Only .png,.jpg,.jpeg and .svg format allowed for images")
      );
    }
  },
});
const fileUpload = upload.any();
const uploadSingle = upload1.single("image");
export default {
  addSlider: async (req, res) => {
    try {
      const hostname = req.headers.host;
      fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        } else {
          if (req?.files[0]?.path === undefined) {
            return res.status(200).send({
              data: [],
              message: "Slider image required!",
              success: false,
            });
          }
          const imageArray = [];
          req.files.forEach((file) => {
            imageArray.push({
              image: `http://${hostname}/${file.path.replaceAll("\\", "/")}`,
            });
          });
          const newSlider = new Slider({
            sliderImage: imageArray,
          });
          newSlider
            .save()
            .then((slider) => {
              return res.status(200).send({
                data: slider,
                message: "Successfully Added slider images..!",
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
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewSlider: async (req, res) => {
    try {
      let limit = 10;
      let skip = 0;
      if (req.query.limit && req.query.skip) {
        limit = parseInt(req.query.limit);
        skip = parseInt(req.query.skip);
      }
      let count = await Slider.count();
      await Slider.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .then((slider) => {
          if (slider.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No Slider images found..!",
              success: false,
              count: count,
            });
          }
          return res.status(200).send({
            data: slider,
            message: "Successfully fetched all slider images..!",
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
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  addDeal: async (req, res) => {
    try {
      const hostname = req.headers.host;
      uploadSingle(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        } else {
          if (!req.body.startDate) {
            return res.status(200).send({
              data: [],
              message: "Start date required!",
              success: false,
            });
          }
          if (!req.body.endDate) {
            return res.status(200).send({
              data: [],
              message: "End date required!",
              success: false,
            });
          }
          if (req.body.startDate>req.body.endDate) {
            return res.status(200).send({
              data: [],
              message: "start date should be less than end date!",
              success: false,
            });
          }
       
        
          if (req?.file?.path === undefined) {
            return res.status(200).send({
              data: [],
              message: "Image required!",
              success: false,
            });
          }
          const newDeal = new Deal({
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            dealImage: `http://${hostname}/${req.file.path.replaceAll(
              "\\",
              "/"
            )}`,
          });
          newDeal
            .save()
            .then((deal) => {
              return res.status(200).send({
                data: deal,
                message: "Successfully Added Deal of the day..!",
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
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewDeal: async (req, res) => {
    try {
      let limit = 10;
      let skip = 0;
      if (req.query.limit && req.query.skip) {
        limit = parseInt(req.query.limit);
        skip = parseInt(req.query.skip);
      }
      let count = await Deal.count();
      await Deal.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .then((deal) => {
          if (deal.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No deal of the day found..!",
              success: false,
              count: count,
            });
          }
          return res.status(200).send({
            data: deal,
            message: "Successfully fetched all deals..!",
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
