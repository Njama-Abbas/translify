const db = require("../models");
const PHOTO = db.photo;

exports.uploadPhoto = (req, res) => {
  const { userId, photo_name } = req.body;
  const file = req.file.buffer;

  const profilePhoto = new PHOTO({
    userId,
    photo: file,
  });

  profilePhoto.save((err, photo) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
      return;
    }
    res.status(200).json({
      photo_id: photo._id,
    });
  });
};

exports.getPhotoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PHOTO.findById(id);
    res.type(".png").send(result.photo);
  } catch (error) {
    res.status(400).json({
      get_error: "Error getting photo",
    });
  }
};

exports.getUserProfilePhotoID = async (req, res) => {
  const { userid: userId } = req.headers;

  PHOTO.findOne(
    {
      userId,
    },
    (err, photo) => {
      if (err) {
        res.status(500).json({
          message: err,
        });
        return;
      }
      if (!photo) {
        res.status(404).json({
          message: "Photo not found",
        });
        return;
      }
      res.status(201).json({
        photo_id: photo._id,
      });
    }
  );
};
