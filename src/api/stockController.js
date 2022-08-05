const mongoose = require("mongoose");
const Stock = require("../config/model/stock");
module.exports = {
  addStock: async (req, res) => {
    try {
      const { product, category, subCategory, quantity, unit } = req.body;
      await Stock.find({ product: product }).then((oldStock) => {
        if (oldStock.length === 0) {
          console.log("new");
          Stock.create({
            product: product,
            category: category,
            subCategory: subCategory,
            quantity: quantity,
            unit: unit,
          }).then((stock) => {
            if (!stock) {
              return res.status(404).send({
                message: "Failed to add stock..!",
                success: false,
              });
            }
            return res.status(200).send({
              data: stock,
              message: "Successfully Added new Stock..!",
              success: true,
            });
          });
        } else {
          const oldQuantity = parseInt(oldStock[0].quantity);
          const newQuantity = parseInt(quantity);
          const TotalQuantity = oldQuantity + newQuantity;
          Stock.updateOne(
            {
              product: product,
            },
            {
              $set: {
                quantity: TotalQuantity,
              },
            }
          ).then((setStock) => {
            Stock.find({ product: product }).then((stockUpdate) => {
              return res.status(200).send({
                data: stockUpdate,
                message: "Stock Updated..!",
                success: true,
              });
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
  viewStock: async (req, res) => {
    try {
      await Stock.find().then((stock) => {
        if (stock.length === 0) {
          return res.status(200).send({
            message: "No stock  available..!",
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
              data: { totalStock: stock, inStock: inStock, outStock: outStock },
              message: "Successfully fetched stock..!",
              success: true,
            });
          });
        });
      });
    } catch (error) {
      return res.status(404).send({
        message: "error",
        status: false,
      });
    }
  },
  searchStock: async (req, res) => {
    try {
      if (req.body.search === "") {
        return res.status(404).send({
          message: "Search field required..!",
          success: false,
        });
      }
      await Stock.find({
        product: { $regex: req.body.search },
      }).then((stock) => {
        if (stock.length === 0) {
          return res.status(200).send({
            message: "No Stock found..!",
            success: true,
          });
        }
        return res.status(200).send({
          data: stock,
          message: "Successfully fetched stock..!",
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
