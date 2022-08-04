const mongoose = require("mongoose");
const Order = require("../config/model/order");
const Product = require("../config/model/product");
const User = require("../config/model/user");
module.exports = {
  addOrder: async (req, res) => {
    try {
      await User.find(
        {
          _id: req.body.userId,
        },
        { name: 1, mobileNumber: 1, email: 1, pinCode: 1 }
      ).then((userDetails) => {
        if (!userDetails) {
          return res.status(404).send({
            data: [],
            message: "Failed to fetch user details..!",
            success: false,
          });
        }
        const productDetails = req.body.productId.map((item) => item.id);
        Product.find(
          { _id: { $in: productDetails } },
          async function (err, items) {
            const products = req.body.productId;
            items.forEach((data) => {
              products.forEach((aa) => {
                if (aa.id === data.id) {
                  data.unit = aa.unit;
                  data.quantity = aa.quantity;
                }
              });
            });
            const newOrder = await Order.create({
              product: [{ productList: items }],
              user: userDetails[0],
              status: "pending",
            });
            if (!newOrder) {
              return res.status(404).send({
                data: [],
                message: "Failed to place order..!",
                success: false,
              });
            }
            return res.status(200).send({
              data: [newOrder],
              message: "Successfully placed order..!",
              success: true,
            });
          }
        );
      });
    } catch (error) {
      return res.status(404).send({
        data: [error],
        message: "error",
        status: false,
      });
    }
  },
  viewOrder: async (req, res) => {
    try {
      const pData = await Order.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "orders",
            foreignField: "id",
            as: "productDetails",
          },
        },
      ]);
      if (!pData) {
        return res.status(404).send({
          data: [],
          message: "can't fetch data",
          status: false,
        });
      }
      return res.status(200).send({
        data: [pData],
        message: "success",
        status: true,
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
