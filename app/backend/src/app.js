require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors");

const dbConfig = require("./config/db.config"),
  db = require("./models");

const { initializeDB } = require("./utils/initializeDB");

//require routes
const { user, orders, mpesa, auth, driver, photos } = require("./routes");

//mongodb connection
//const URI = `mongodb://${dbConfig.local.HOST}:${dbConfig.local.PORT}/${dbConfig.local.DB}`,
const URI = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@aedb.dmvyj.mongodb.net/${dbConfig.db_name}?retryWrites=true&w=majority`,


const  app = express(),
  corsOptions = {
    origin: ["http://localhost:3000"],
  };

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (_req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
    res.header("Access-Control-Allow-Origin', '*'");
  next();
});

//conect to db
db.mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to MongoDb");
    initializeDB();
  })
  .then(() => {
    console.log("DATABASE INITIALIZED");
  })
  .catch((err) => {
    console.error("Connection err", err);
    process.exit(1);
  });
/**
 * Handle unknown database errors
 */

app.use(function handleDatabaseError(error, request, response, next) {
  if (error instanceof MongoError) {
    console.log(error.message);
    if (error.code === 11000) {
      return response.status(409).json({
        httpStatus: 409,
        type: "MongoError",
        message: error.message,
      });
    } else {
      return response.status(503).json({
        httpStatus: 503,
        type: "MongoError",
        message: error.message,
      });
    }
  }
  next(error);
});

/**
 * Routes
 */
app.use("/api/user", user);
app.use("/api/orders", orders);
app.use("/api/mpesa", mpesa);
app.use("/api/auth", auth);
app.use("/api/driver", driver);
app.use("/api/photos", photos);

app.get("/", (_req, res) => res.send("Hello World!"));

const PORT = process.env.PORT || 801;

app.listen(PORT, () => console.log(` ${PORT}! is Live`));
