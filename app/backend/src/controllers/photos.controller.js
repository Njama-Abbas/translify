const db = require("../models");
const PHOTO = db.photo;

module.exports = {
  uploadPhoto: async (req, res) => {
    const { userId } = req.body;
    const file = req.file.buffer;

    const profilePhoto = await PHOTO.findOne({
      userId,
    });
    //check if a user has a profile picture in db
    if (profilePhoto) {
      let updatedPhoto;

      try {
        //if yes delete existing photo
        await PHOTO.findByIdAndDelete(profilePhoto._id);

        //create a new photo
        updatedPhoto = await PHOTO.create({
          userId,
          photo: file,
        });

        await updatedPhoto.save();
      } catch (err) {
        res.status(500).json({
          message: err,
        });

        return;
      }
      res.status(201).json({
        photo_id: updatedPhoto._id,
      });

      return;
    } else {
      //profile photo does not exist in database yet

      let profilePhoto;

      try {
        //create a new photo
        profilePhoto = await PHOTO.create({
          userId,
          photo: file,
        });

        await profilePhoto.save();
      } catch (err) {
        res.status(500).json({
          message: err,
        });

        return;
      }

      res.status(201).json({
        photo_id: profilePhoto._id,
      });

      return;
    }
  },

  getPhotoById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await PHOTO.findById(id);
      res.type(".png").send(result.photo);
    } catch (error) {
      res.status(400).json({
        get_error: "Error getting photo",
      });
    }
  },

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns mongoose object id for a users profile picture
   */
  getUserProfilePhotoID: async (req, res) => {
    const { userid: userId } = req.headers;

    let photo;

    try {
      photo = await PHOTO.findOne({
        userId,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
      console.log(error);
      return;
    }

    if (!photo) {
      res.status(404).json({
        message: "Photo not found",
      });
      return;
    }

    res.status(200).json({
      photo_id: photo._id,
    });
  },
};
