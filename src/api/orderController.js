const mongoose = require("mongoose");
const Order = require("../config/model/order");
const Product = require("../config/model/product");
const User = require("../config/model/user");
module.exports = {
  addOrder: async (req, res) => {
    try {
      // const {productId}=req.body
      // const newOrder=await Order.create({
      // productId:productId,
      // userId: userId,
      // status:"pending"
      //   })
      //     if (!newOrder) {
      //       return res.status(404).send({
      //         data: [],
      //         message: "Failed to place order..!",
      //         success: false,
      //       });
      //     }
      //     return res.status(200).send({
      //       data: [newOrder],
      //       message: "Successfully placed order..!",
      //       success: true,
      //     });
const pArray=[]
      req.body.productId.forEach((pid) => {
        const did = pid.id;
        console.log("pid", did);
      Product.find({ _id: { $in: did } }, function (err, items) {
            
          //array of object creation  
          pArray.push(items)     
        });
        });
       setTimeout(()=>{
        console.log('pArray',pArray)
       },1000)     
            
      if (!productDetails) {
        return res.status(404).send({
          data: [],
          message: "No product details found..!",
          success: false,
        });
      }
      const userDetails = await User.findOne({
        _id: userId,
      });
      if (!userDetails) {
        return res.status(404).send({
          data: [],
          message: "No user details found..!",
          success: false,
        });
      }
      return res.status(200).send({
        data: [{ productList: productDetails }, { userDetails: userDetails }],
        message: "Successfully fetched details..!",
        success: true,
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
