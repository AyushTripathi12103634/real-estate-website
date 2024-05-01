import express from "express";
import { changepasswordController, loginController, registerController } from "../controllers/authController.js";
const router = express.Router();
router.post("/register",registerController);
router.post("/login",loginController);
router.post("/change-password",changepasswordController);
export default router;
// forgot password, edit profile