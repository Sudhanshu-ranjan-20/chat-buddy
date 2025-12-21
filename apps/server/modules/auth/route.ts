import express from "express";
import Controller from "./controller";
import Validator from "./validator";
import { celebrate } from "celebrate";
export default express
  .Router()
  .post(
    "/login",
    celebrate(Validator.loginSchema()),
    Controller.login.bind(Controller)
  )
  .post(
    "/signup",
    celebrate(Validator.signupSchema()),
    Controller.signup.bind(Controller)
  )
  .post("/logout", Controller.logout.bind(Controller));
