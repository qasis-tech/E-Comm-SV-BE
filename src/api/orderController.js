const { exist } = require("joi");
const mongoose = require("mongoose");
const order = require("../config/model/order");
const Order = require("../config/model/order");
const Product = require("../config/model/product");
const User = require("../config/model/user");
module.exports = {
  addOrder: async (req, res) => {
    try {
      const products = req.body.productId;
      const unitList = ["kg", "g", "ltr", "no"];
      const unitArray = [];
      const productArray = [];
      products.forEach((units) => {
        if (unitList.indexOf(units.unit) === -1) {
          unitArray.push(units.unit);
          productArray.push(units.id);
        }
      });
      if (unitArray.length) {
        res.status(200).send({
          data: [],
          message:
            "Allowed units for product id " + productArray + " are " + unitList,
          success: false,
        });
      } else {
        if (mongoose.Types.ObjectId.isValid(req.body.userId) === true) {
          User.find(
            {
              _id: req.body.userId,
            },
            {
              name: 1,
              mobileNumber: 1,
              email: 1,
              pinCode: 1,
              primaryAddress: 1,
              location: 1,
            }
          ).then((userDetails) => {
            if (!userDetails.length) {
              return res.status(200).send({
                data: [],
                message: "User not exists..!",
                success: false,
              });
            }
            const productDetails = products.map((item) => item.id);
            Product.find(
              { _id: { $in: productDetails } },
              async function (err, items) {
                if (err) {
                  return res.status(200).send({
                    data: [],
                    message: "Enter correct product Id..!",
                    success: false,
                  });
                }
                items.forEach((data) => {
                  products.forEach((productData) => {
                    if (productData.id === data.id) {
                      data.unit = productData.unit;
                      data.quantity = productData.quantity;
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
                const newOrder = Order.create({
                  product: items,
                  user: userDetails[0],
                  status: "Order Pending",
                  orderId: makeid(),
                  regDate:new Date()
                })
                  .then((newOrder) => {
                    return res.status(200).send({
                      data: newOrder,
                      message: "Successfully placed order..!",
                      success: true,
                    });
                  })
                  .catch((error) => {
                    console.log("error", error);
                    let errormessage = error.message;
                    return res.status(200).send({
                      data: [],
                      message: "Failed to place order..!",
                      errormessage,
                      success: false,
                    });
                  });
              }
            );
          });
        } else {
          return res.status(200).send({
            data: [],
            message: "Cannot find user with id " + req.body.userId,
            success: false,
          });
        }
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
  viewTotalOrder: async (req, res) => {
    try {
      if (req.query) {
        let categoryArray = [];
        let dateArray=[]
        let subCategoryArray = [];
        let searchArray = [];
        let statusArray = [];
        if (req.query.category) {
          categoryArray = req.query.category.split(",");          
        }       
        if (req.query.date) {
        dateArray = req.query.date.split(',');
        }
        console.log('date',dateArray)
        if (req.query.subcategory) {
          subCategoryArray = req.query.subcategory.split(",");        
        }
        if (req.query.search) {
          searchArray = req.query.search.split(",");
        }
        if (req.query.status) {
          statusArray = req.query.status.split(",");
          // statusArray = Object.values(req.query.status);
          // statusArray = statusArray.filter(function (item) {
          //   return item !== ",";
          // });
        }
        Order.aggregate([
          { $unwind: "$product" },
          {
            $match: {
              $or: [
                { "product.category": { $in: categoryArray } },
                { createdAt: { $in: dateArray } },
                { "product.subCategory": { $in: subCategoryArray } },
                { orderId: { $in: searchArray } },
                {
                  status: { $in: statusArray },
                },
              ],
            },
          },
        ])
          .then((orders) => {
            if (!orders.length) {
              return res.status(200).send({
                data: [],
                message: "No order found..!",
                success: false,
                count: orders.length,
              });
            }
            return res.status(200).send({
              data: orders,
              message: "Successfully fetched orders..!",
              success: true,
              count: orders.length,
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
      } else {
        let limit = 10;
        let skip = 0;
        if (req.query.limit && req.query.skip) {
          limit = parseInt(req.query.limit);
          skip = parseInt(req.query.skip);
        }
        const totalOrders = await Order.find().count();
        const pendingOrders = await Order.find({
          status: "Order Pending",
        }).count();
        const completedOrders = await Order.find({
          status: "Delivered",
        }).count();
        await Order.find()
          .skip(skip)
          .limit(limit)
          .then((orders) => {
            if (orders.length === 0) {
              return res.status(200).send({
                data: [],
                message: "No orders yet..!",
                success: false,
                count: totalOrders,
              });
            }
            res.status(200).send({
              data: orders,
              shorthanddetails: {
                totalorders: totalOrders,
                pendingOrders: pendingOrders,
                completedOrders: completedOrders,
              },
              message: "Successfully fetched orders..!",
              success: true,
              count: totalOrders,
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
  viewOrderDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Order.find({ _id: req.params.id }).then((orders) => {
          if (orders.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No order found with given id..!",
              success: false,
            });
          } else {
            Order.findById({ _id: req.params.id })
              .then((order) => {
                if (order.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No order found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: order,
                  message: "Successfully fetched order details..!",
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
      } else {
        return res.status(200).send({
          data: [],
          message: "Cannot find order with id " + req.params.id,
          success: false,
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
  editOrder: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Order.find({ _id: req.params.id }).then((orders) => {
          if (orders.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No order found with given id..!",
              success: false,
            });
          } else {
            const orderStatus = [
              "Awaiting order confirming",
              "Awaiting payment",
              "Order Pending",
              "Order received",
              "Awaiting pickup",
              "Shipped",
              "Cancelled",
              "Awaiting refunding",
              "Refunded",
              "Delivered",
            ];
            if (orderStatus.indexOf(req.body.status) === -1) {
              return res.status(200).send({
                data: [],
                message: "allowed status",
                orderStatus,
                success: false,
              });
            }
            const newOrder = Order.findByIdAndUpdate(
              req.params.id,
              {
                status: req.body.status,
              },
              {
                new: true,
              }
            )
              .then((newOrder) => {
                if (newOrder) {
                  return res.status(200).send({
                    data: newOrder,
                    message: "Successfully updated Order status..!",
                    success: true,
                  });
                }
              })
              .catch((error) => {
                console.log("error", error);
                let errormessage = error.message;
                return res.status(404).send({
                  dat: [],
                  message: "error",
                  status: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: "Cannot find order with id " + req.params.id,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      let errormessage = error.message;
      return res.status(404).send({
        dat: [],
        message: "error",
        errormessage,
        status: false,
      });
    }
  },
};
