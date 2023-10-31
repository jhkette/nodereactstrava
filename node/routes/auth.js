const express = require("express");
const client = require("../middleware/client");

const login = (req, res) => {
  return res.redirect(client.getAuthorizationUri());
};

const link = (req, res) => {
  const link = client.getAuthorizationUri()
  return res.json({ link: link });
};

const authorisation = async (req, res) => {
  const errors = {};
  const token = await client.getToken(req.originalUrl);
  if (!token) {
    errors["error"] = "unable to login";
    return res.status(400).json(errors);
  }
 
  res.cookie("token", token.access_token);
  return res.redirect("http://localhost:8080/");
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({msg: "logged out succesfully"});
};
const router = express.Router();
router.get("/link", link);
router.get("/login", login);
router.get("/authorise", authorisation);
router.get("/logout", logout);
module.exports = router;
