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
          return res.status(200).send({
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
            function makeid() {
              let text = "";
              let possible = "0123456789";
              for (var i = 0; i < 4; i++)
                text += possible.charAt(
                  Math.floor(Math.random() * possible.length)
                );

              return text;
            }
            const newOrder = await Order.create({
              product: [{ productList: items }],
              user: userDetails[0],
              status: "pending",
              orderId: makeid(),
            });
            if (!newOrder) {
              return res.status(200).send({
                data: [],
                message: "Failed to place order..!",
                success: false,
              });
            }
            return res.status(200).send({
              data: newOrder,
              message: "Successfully placed order..!",
              success: true,
            });
          }
        );
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
  viewTotalOrder: async (req, res) => {
    try {
      if (req.query.search) {
        const search = req.query.search;
        await Order.find({ orderId: { $regex: search } })
          .then((orders) => {
            if (!orders.length) {
              return res.status(200).send({
                data: [],
                message: "No order found..!",
                success: true,
              });
            }
            return res.status(200).send({
              data: orders,
              message: "Successfully fetched orders..!",
              success: true,
            });
          })
          .catch((err) => {
            console.log("error", err);
            return res.status(404).send({
              data: [],
              message: "error",
              status: false,
            });
          });
      } else if (req.query.startDate && req.query.endDate) {
        const { startDate, endDate } = req.query;
        await Order.find({
          createdAt: {
            $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
            $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
          },
        })
          .sort({ createdAt: "asc" })
          .then((orderList) => {
            if (orderList.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No orders yet..!",
                success: true,
              });
            }
            res.status(200).send({
              data: orderList,
              message: "Successfully fetched orders..!",
              success: true,
            });
          });
      } else {
        await Order.find().then((orders) => {
          if (orders.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No orders yet..!",
              success: true,
            });
          }
          Order.find({
            status: "pending",
          }).then((pendingOrders) => {
            Order.find({
              status: "completed",
            }).then((completedOrders) => {
              res.status(200).send({
                data: orders,
                shorthanddetails: {
                  totalorders: orders,
                  pendingOrders: pendingOrders,
                  completedOrders: completedOrders,
                },
                message: "Successfully fetched orders..!",
                success: true,
              });
            });
          });
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: "error",
        status: false,
      });
    }
  },
};
