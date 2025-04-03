const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cors = require("cors");
const { default: axios } = require("axios");

const PORT = process.env.PORT ;

// databases connections
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();
// middleware
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
// app.use(
//   session({
//     secret: "kjhgju7658gfgh",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true,
//       httpOnly: true,
//       sameSite: "strict",
//       expires: new Date(Date.now() + 1000 * 86400), // Expires in 1 day
//     },
//   })
// );

// user routes defined
const userrouter = require("./Routes/UserRoutes");
app.use("/api/v1", userrouter);

// products routes defined
const productRouter = require("./Routes/ProductRoute");
app.use("/api/v1", productRouter);

// cart routes defined
const cartRouter = require("./Routes/CartRoutes");
app.use("/api/v1", cartRouter);

// category routes defined
const categoryRouter = require("./Routes/CategoryRoute");
app.use("/api/v1", categoryRouter);

// category routes defined
const offerRouter = require("./Routes/OfferRoutes");
app.use("/api/v1", offerRouter);

// wishlist routes defined
const wishlistRouter = require("./Routes/WishlistRoutes");
app.use("/api/v1", wishlistRouter);

// order routes defined
const orderRouter = require("./Routes/orderRoute");
app.use("/api/v1", orderRouter);

// khalti payment
app.use("/initiate-payment", async (req, res) => {
  try {
    const payload = req.body;
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: process.env.KHALTIAUTHORIZATIONKEY,
        },
      }
    );
    res.json(khaltiResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
