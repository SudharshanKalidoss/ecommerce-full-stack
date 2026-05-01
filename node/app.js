const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const https = require('https');
const fs = require('fs');
const errorHandler = require("./middlewares/error-handler");
const initRoutes = require("./routes/index.js");

require("dotenv").config();


const path = require("path");

const port = process.env.PORT | 3001;
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(morgan("dev"));


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3005",
      "http://localhost:3000",
      "http://localhost:3007",
      "http://localhost:5173",

      
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// app.use(cors(corsOptions));

app.use(cors({
  origin: true, // allow all origins dynamically
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

initRoutes(app);

app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
