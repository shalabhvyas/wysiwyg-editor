const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;
const router = express.Router();
const multer = require("multer");
const cors = require("cors");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/photos/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("photo");

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.use(cors());
app.listen(port, () => console.log(`Listening on port ${port}`));
