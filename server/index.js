import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { fileURLToPath } from "url";
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { updateInfo } from "./controllers/users.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});
const compressImage = async (buffer) => {
  const compressedImage = await imagemin.buffer(buffer, {
    plugins: [
      imageminMozjpeg({ quality: 1 })
    ]
  });
  return compressedImage;
};
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'YOUR_FOLDER_NAME',
    public_id: (req, file) => 'unique_name_for_image',
  },
  // Set the transformer option to compress the uploaded image
  // transformer: async (req, file) => {
  //   const compressedImage = await compressImage(file.buffer);
  //   return { buffer: compressedImage };
  // }
});
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
*/
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.patch("/users/:id",verifyToken ,upload.single("picture"), updateInfo);
app.post("/posts",verifyToken,upload.single("picture"),createPost);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

    /* ADD DATA ONE TIME 
     User.insertMany(users);
     Post.insertMany(posts);
     */
  })
  .catch((error) => console.log(`${error} did not connect`));