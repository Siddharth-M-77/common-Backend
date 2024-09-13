import express from "express";
import {
  login,
  Logout,
  userRegistration,
} from "../controllers/user.controller.js";


const router = express.Router();

router.route("/register").post(userRegistration);
router.route("/login").post(login);
router.route("/logout").get(Logout);

export default router;
