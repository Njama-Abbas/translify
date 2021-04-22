require("dotenv").config();
const { client, driver } = require("./routes");

const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors");
const dbConfig = require("./config/db.config"),
  db = require("./models");

const URI = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
  app = express(),
  corsOptions = {
    origin: ["http://localhost:903"],
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
  next();
});

db.mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to MongoDb");
  })
  .catch((err) => {
    console.error("Connection err", err);
    process.exit;
  });

/**
 * Handle database errors
 */
app.use(function handleDatabaseError(error, request, response, next) {
  if (error instanceof db.mongoose.Error) {
    return response.status(500).json({
      type: "MongoError",
      message: error.message,
    });
  }
  next(error);
});

/**
 * Routes
 */

app.use("/api/drivers", driver);
app.use("/api/clients", client);

app.get("/", (_req, res) => res.send("Hello World!"));

const PORT = process.env.PORT || 901;

app.listen(PORT, () => {
  console.log(` ${PORT}! is Live`);
});
