import express from "express";
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import adminRouter from "./src/routes/adminRouter.js";
// import dbCon from "./src/config/connections/connection.js";
import cors from "cors";
app.use(cors({ origin: true, credentials: true }));
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.DB_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`DB Connected...!`);
  })
  .catch((err) => {
    console.log(`Could not connect to the database. Exiting now...${err}`);
  });
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/", adminRouter);
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
