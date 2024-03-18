const client = require("../middleware/client");
const axios = require("axios");

exports.login = (req, res) => {
  return res.redirect(client.getAuthorizationUri());
};

exports.link = (req, res) => {
  const link = client.getAuthorizationUri();
  return res.send({ link: link });
};

exports.authorisation = async (req, res) => {
  const errors = {};
  const token = await client.getToken(req.originalUrl);
  if (!token) {
    errors["error"] = "unable to login";
    return res.status(400).send(errors);
  }
  // console.log(token)
  console.log(token.access_token);
  res.cookie("token", token.access_token);
  return res.redirect(process.env.ORIGIN);
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.send({ msg: "logged out succesfully" });
};

// exports.deauthorize = async (req, res) => {
//   const errors = {};
//   const token = req.headers.authorization;
//   if (!token) {
//     errors["error"] = "Permission not granted";
//     return res.json(errors);
//   }
//   try {

//     console.log(token)

//     const response = await axios.get(`https://www.strava.com/api/v3/athlete`, {
//       headers: { Authorization: token },
//     });

//     console.log(response.data)
//     await axios.post(`https://www.strava.com/api/v3/deauthorize`, {
//       headers: { Authorization: token },
//     });

    

   

//     return res.send({ msg: "successfuly deauthorised" });
//   } catch (err) {
//     console.log(err);
//   }
// };
