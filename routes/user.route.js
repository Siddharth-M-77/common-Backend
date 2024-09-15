import express from "express";
import {
  login,
  Logout,
  userRegistration,
} from "../controllers/user.controller.js";
import  upload  from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  userRegistration
);
router.route("/login").post(login);
router.route("/logout").get(Logout);

export default router;
