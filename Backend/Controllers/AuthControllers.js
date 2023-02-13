const AccountModel = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const AuthControllers = {
  // creat access token
  createAccessToken: (account) => {
    return jwt.sign(
      { id: account.id, admin: account.admin },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "5s" }
    );
  },
  // create refresh token
  createRefreshToken: (account) => {
    return jwt.sign(
      { id: account.id, admin: account.admin },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "1d" }
    );
  },
  // register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.pass, salt);

      const newAccount = await new AccountModel({
        name: req.body.name,
        email: req.body.email,
        pass: hashed,
      });

      // save to mongo
      const account = await newAccount.save();
      res.status(200).json(account);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const account = await AccountModel.findOne({ name: req.body.name });
      if (!account) {
        return res.status(404).json("Wrong user name");
      }
      const validatePass = await bcrypt.compare(req.body.pass, account.pass);
      if (!validatePass) {
        return res.status(404).json("Wrong user pass");
      }
      if (account && validatePass) {
        const accessToken = AuthControllers.createAccessToken(account);
        const refreshToken = AuthControllers.createRefreshToken(account);
        refreshTokens.push(refreshToken);
        console.log(refreshTokens);
        // timf hieu them ve may cai key
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { pass, ...rest } = account._doc;
        return res.status(200).json({ ...rest, accessToken, refreshToken });
      }
    } catch (err) {
      //   res.status(500).json(err);
    }
  },

  // thuong dung redis de luu cai refresh token
  requestRefreshToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log(refreshTokens);
    console.log(refreshToken);
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json("Refresh token is not valid");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // create new access token, refresh token
      const newAccessToken = AuthControllers.createAccessToken(user);
      const newRefreshToken = AuthControllers.createRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },

  // LOG OUT
  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.json("Logged out successfully");
  },
};

module.exports = AuthControllers;
