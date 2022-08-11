const mongoose = require("mongoose");
const Stock = require("../config/model/stock");
module.exports = {
  addStock: async (req, res) => {
    try {
      const { product, category, subCategory, quantity, unit } = req.body;
      function makeid() {
        let text = "";
        let possible = "0123456789";
        for (var i = 0; i < 4; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
      await Stock.find({
        product: product,
        category: category,
        subCategory: subCategory,
      })
        .then((oldStock) => {
          if (oldStock.length) {
            return res.status(200).send({
              data: [],
              message: "Stock already exists..!",
              success: false,
            });
          }
          else {
            const newStock = new Stock({
              product: product,
              category: category,
              subCategory: subCategory,
              quantity: quantity,
              unit: unit,
              stockId: makeid(),
            });
            newStock
              .save()
              .then((stock) => {
                return res.status(200).send({
                  data: stock,
                  message: "Successfully Added stock..!",
                  success: true,
                });
              })
              .catch((err) => {
                console.log("error", err);
                let errormessage=err.message
                return res.status(404).send({
                  data: [],
                  message: "error",errormessage,
                  status: false,
                });
              });
          }
       })
    } catch (error) {
      console.log("error", error);
      let errormessage=error.message
      return res.status(404).send({
        data: [],
        message: "error",errormessage,
        status: false,
      });
    }
  },
  viewStock: async (req, res) => {
    try {
      if (req.query.search) {
        await Stock.find({
          product: { $regex: req.query.search },
        })
          .then((stock) => {
            if (stock.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No Stock found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: stock,
              message: "Successfully fetched stock..!",
              success: true,
            });
          })
          .catch((err) => {
            console.log("error", err);
            let errormessage=err.message
            return res.status(404).send({
              data: [],
              message: "error",errormessage,
              status: false,
            });
          });
      } else if (req.query.id) {
        const search = req.query.id;
        await Stock.find({ stockId: { $regex: search } })
          .then((stocks) => {
            if (!stocks.length) {
              return res.status(200).send({
                data: [],
                message: "No stock found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: stocks,
              message: "Successfully fetched stocks..!",
              success: true,
            });
          })
          .catch((error) => {
            console.log("error", error);
            let errormessage=error.message
            return res.status(404).send({
              dat: [],
              message: "error",errormessage,
              status: false,
            });
          });
      }
       else {
        await Stock.find()
          .then((stock) => {
            if (stock.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No stock available..!",
                success: true,
              });
            }
            Stock.find({
              quantity: { $gte: 10 },
            }).then((inStock) => {
              Stock.find({
                quantity: { $lt: 10 },
              }).then((outStock) => {
                res.status(200).send({
                  data: {
                    totalStock: stock,
                    inStock: inStock,
                    outStock: outStock,
                  },
                  message: "Successfully fetched stock..!",
                  success: true,
                });
              });
            });
          })
          .catch((error) => {
            console.log("error", error);
            let errormessage=error.message
            return res.status(404).send({
              data: [],
              message: "error..!",errormessage,
              success: false,
            });
          });
      }
    } catch (error) {
      console.log("error", error);
      let errormessage=error.message
      return res.status(404).send({
        data: [],
        message: "error",errormessage,
        status: false,
      });
    }
  },

  editStock: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        const newStock = Stock.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { quantity: req.body.quantity },
          },
          {
            new: true,
          }
        )
          .then((newStock) => {
            if (newStock) {
              return res.status(200).send({
                data: newStock,
                message: "Successfully updated Stock..!",
                success: true,
              });
            }
          })
          .catch((error) => {
            console.log("error", error);
            let errormessage=error.message
            return res.status(404).send({
              dat: [],
              message: "error",
              status: false,
            });
          });
      } else {
        return res.status(200).send({
          data: [],
          message: "Cannot find Stock with id " + req.params.id,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      let errormessage=error.message
      return res.status(404).send({
        dat: [],
        message: "error",errormessage,
        status: false,
      });
    }
  },
  deleteStock: async (req, res) => {
    try {
      await Stock.findByIdAndRemove(req.params.id)
        .then((stock) => {
          res.status(200).send({
            data: stock,
            message: "Successfully deleted stock..!",
            success: true,
          });
        })
        .catch((error) => {
          console.log("error", error);
          return res.status(200).send({
            data: [],
            message: "stock not found with id " + req.params.id,
            success: false,
          });
        });
    } catch (error) {
      console.log("error", error);
      let errormessage=error.message
      return res.status(404).send({
        data: [],
        message: "error",errormessage,
        status: false,
      });
    }
  },
};
