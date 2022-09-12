const mongoose = require("mongoose");
const Stock = require("../config/model/stock");
module.exports = {
  addStock: async (req, res) => {
    try {
      const { product, category, subCategory, quantity, unit } = req.body;
      const unitList = ["kg", "g", "ltr", "no"];
      if (unitList.indexOf(unit) === -1) {
        return res.status(200).send({
          data: [],
          message: `allowed units ${unitList}`,
          success: false,
        });
      } else {
        function makeid() {
          let text = "";
          let possible = "0123456789";
          for (var i = 0; i < 4; i++)
            text += possible.charAt(
              Math.floor(Math.random() * possible.length)
            );
          return text;
        }
        await Stock.find({
          product: product,
          category: category,
          subCategory: subCategory,
        }).then((oldStock) => {
          if (oldStock.length) {
            return res.status(200).send({
              data: [],
              message: "Stock already exists..!",
              success: false,
            });
          } else {
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
                return res.status(404).send({
                  data: [],
                  message: `error..! ${err.message}`,
                  status: false,
                });
              });
          }
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
                success: false,
                count: stock.length,
              });
            }
            return res.status(200).send({
              data: { totalStock: stock },
              message: "Successfully fetched stock..!",
              success: true,
              count: stock.length,
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
      } else if (req.query.id) {
        const search = req.query.id;
        await Stock.find({ stockId: { $regex: search } })
          .then((stocks) => {
            if (!stocks.length) {
              return res.status(200).send({
                data: [],
                message: "No stock found..!",
                success: false,
                count: stocks.length,
              });
            }
            return res.status(200).send({
              data: { totalStock: stocks },
              message: "Successfully fetched stocks..!",
              success: true,
              count: stocks.length,
            });
          })
          .catch((error) => {
            console.log("error", error);
            return res.status(404).send({
              data: [],
              message: `error..! ${error.message}`,
              status: false,
            });
          });
      } else {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        let count = await Stock.count();
        const inStockCount = await Stock.find({
          quantity: { $gte: 10 },
        }).count();
        const outStockCount = await Stock.find({
          quantity: { $lt: 10 },
        }).count();
        await Stock.find().sort({_id:-1})
          .skip(skip)
          .limit(limit)
          .then((stock) => {
            if (stock.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No stock available..!",
                success: false,
                count: count,
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
                  count: count,
                  shorthanddetails: {
                    totalstock: count,
                    inStock: inStockCount,
                    outStock: outStockCount,
                  },
                });
              });
            });
          })
          .catch((error) => {
            console.log("error", error);
            return res.status(404).send({
              data: [],
              message: `error..! ${error.message}`,
              success: false,
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
  editStock: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Stock.find({ _id: req.params.id }).then((stock) => {
          if (stock.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No stock found with given id..!",
              success: false,
            });
          } else {
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
                return res.status(404).send({
                  data: [],
                  message: `error..! ${error.message}`,
                  status: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Cannot find Stock with id ${req.params.id}`,
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
  deleteStock: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Stock.find({ _id: req.params.id }).then((stock) => {
          if (stock.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No Stock found with given id..!",
              success: false,
            });
          } else {
            Stock.findByIdAndRemove(req.params.id)
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
                  message: `Cannot find Stock with id ${req.params.id}`,
                  success: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Cannot find Stock with id ${req.params.id}`,
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
  viewStockDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Stock.find({ _id: req.params.id }).then((stocks) => {
          if (stocks.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No stock found with given id..!",
              success: false,
            });
          } else {
            Stock.findById({ _id: req.params.id })
              .then((stocks) => {
                if (stocks.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No Stock found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: stocks,
                  message: "Successfully fetched stock details..!",
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
          message: `Cannot find stock with id ${req.params.id}`,
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
