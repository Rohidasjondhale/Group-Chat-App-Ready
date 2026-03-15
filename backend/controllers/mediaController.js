const s3 = require("../config/aws");

exports.uploadMedia = async (req, res) => {

  try {

    const file = req.file;

    const params = {
  Bucket: "chat-media-rohit",
  Key: Date.now() + "_" + file.originalname,
  Body: file.buffer,
  ContentType: file.mimetype
};

    const data = await s3.upload(params).promise();

    res.status(200).json({
      url: data.Location
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Upload failed"
    });

  }

};