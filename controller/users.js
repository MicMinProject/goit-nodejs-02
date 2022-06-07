const { patternUserAdd, patternUserPatch } = require("../joi");
const service = require("../service/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET } = process.env;
const { User } = require("../service/schemas/users");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const { isImage, storeDir } = require("../helpers");

const add = async (req, res, next) => {
  const body = req.body;
  const { password, email } = req.body;
  const validated = patternUserAdd.validate(body);
  const checkEmail = await service
    .findUser({ email: validated.value.email })
    .lean();
  if (checkEmail && body) {
    return res.status(409).json({ message: "Email in use" });
  }
  if (validated.error) {
    return res.status(400).json({
      message: validated.error.message,
    });
  }
  try {
    const newUser = new User({
      email,
      avatarURL: gravatar.url(email, {
        protocol: "http",
        d: "identicon",
        s: "250",
      }),
    });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: { email: newUser.email, subscription: "starter" },
    });
  } catch (err) {
    next(err);
  }
};

const get = async (req, res, next) => {
  const body = req.body;
  const { password } = body;
  const validated = patternUserAdd.validate(body);
  if (validated.error) {
    return res.status(400).json({
      message: validated.error.message,
    });
  }
  const checkEmail = await service.findUser({ email: validated.value.email });
  const isCorrectPassword = await checkEmail.validatePassword(password);
  if (!checkEmail || !isCorrectPassword) {
    return res.status(400).json({
      message: "Wrong credentials",
    });
  }
  try {
    const payload = { id: checkEmail._id, email: checkEmail.email };
    const token = jwt.sign(payload, SECRET, { expiresIn: "4h" });
    checkEmail.token = token;
    checkEmail.save();
    res.status(200).json({
      token: token,
      user: { email: checkEmail.email, subscription: "starter" },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const delToken = await service.findUser({ _id: req.user.id });
    delToken.token = null;
    delToken.save();
    res.status(204).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

const check = async (req, res, next) => {
  const { email, subscription, id } = req.user;
  try {
    const user = await service.findUser({ _id: id });
    if (user) {
      res.status(200).json({ data: { email, subscription } });
    }
  } catch (err) {
    next(err);
  }
};

const subs = async (req, res, next) => {
  const { _id } = req.user;
  const body = req.body;
  const validated = patternUserPatch.validate(body);
  if (validated.error) {
    return res.status(400).json({
      message: validated.error.message,
    });
  }
  try {
    const user = await service.findUser({ _id });
    user.subscription = body.subscription;
    user.save();
    res.status(201).json({
      message: `Subscription has changed for ${body.subscription}`,
    });
  } catch (err) {
    next(err);
  }
};

const setAvatar = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { _id } = req.user;
  if (!req.file) {
    return res.status(400).json({
      message: "This is not a photo",
    });
  }
  const { path: temporaryName } = req.file;
  const extension = path.extname(temporaryName);
  const fileName = path.join(storeDir, `${uuidv4()}${extension}`);
  try {
    const isValidImage = await isImage(temporaryName);
    if (!isValidImage) {
      await fs.unlink(temporaryName);
      return res.status(400).json({
        message: "This is not a proper image",
      });
    }
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return res.status(400).json({ message: err });
  }

  const user = await service.findUser({ _id });
  user.avatarURL = fileName;
  user.save();
  return res.status(200).json({
    avatarURL: fileName,
  });
};

module.exports = {
  add,
  get,
  logout,
  check,
  subs,
  setAvatar,
};
