const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const createDefaultAdmin = require("./utils/createDefaultAdmin");
const chatRouter = require("./Routes/ChatRoutes");
require("dotenv").config();

const cors = require("cors");
const { default: axios } = require("axios");

const PORT = process.env.PORT ;

// databases connections
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();
createDefaultAdmin(); 
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

// home routes defined
const homeRouter = require("./Routes/HomeRoutes");
app.use("/api/v1", homeRouter);

//chat routes
app.use("/api/v1", chatRouter);

// khalti payment
app.use("/initiate-payment", async (req, res) => {
  const MAX_RETRIES = 3; // Number of retry attempts
  let attempt = 0;
  let success = false;

  while (attempt < MAX_RETRIES && !success) {
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
      success = true;
      return res.json(khaltiResponse.data);
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt >= MAX_RETRIES) {
        return res.status(503).json({
          error: "Khalti service is temporarily unavailable. Please try again later.",
        });
      }

      // Wait before retrying (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});




app.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
