const express = require("express");
const router = express.Router();
const { multerInstance } = require("../../helpers");
const usersController = require("../../controller/users");
const authMiddleware = require("../../middlewares/jwt");

router.post("/signup", usersController.add);

router.post("/login", usersController.get);

router.post("/logout", authMiddleware, usersController.logout);

router.post('/verify', usersController.verifyAgain)

router.get("/current", authMiddleware, usersController.check);

router.get('/verify/:verificationToken', usersController.verify)

router.patch("/", authMiddleware, usersController.subs);

router.patch(
  "/avatars", authMiddleware,
  multerInstance.single("picture"),
  usersController.setAvatar,
);

module.exports = router;
