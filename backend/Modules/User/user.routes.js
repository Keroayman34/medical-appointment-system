import express from "express";
import {
  signup,
  signin,
  deleteUser,
  verifyAccount,
} from "./user.controller.js";
import { checkEmail } from "../../Middlewares/chackEmail.js";
import { hashPass } from "../../Middlewares/hashPass.js";
import { validate } from "../../Middlewares/validation.middleware.js"; 
import catchError from "../../Middlewares/catchError.js";
const userRouter = express.Router();

userRouter.post(
  "/signup",
  validate,
  catchError(checkEmail),
  hashPass,
  signup,
);

userRouter.post("/signin", catchError(checkEmail), signin);

userRouter.delete("/users/:id", deleteUser);

userRouter.get("/verify/:email", verifyAccount);

export default userRouter;
