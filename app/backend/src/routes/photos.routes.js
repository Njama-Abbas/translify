const Router = require("express").Router();

const photosController = require("../controllers/photos.controller"),
  multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5000000, //5mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(new Error("Only upload files with jpg|jpeg|png format"));
    }
    cb(undefined, true); // continue with upload
  },
});

Router.get("/:id", photosController.getPhotoById);

Router.get("/img", photosController.getUserProfilePhotoID);

Router.post(
  "/create",
  upload.single("photo"),
  photosController.uploadPhoto,
  (err, req, res, next) => {
    if (err) {
      res.status(500).json({
        upload_error: err.message,
      });
    }
  }
);

module.exports = Router;
