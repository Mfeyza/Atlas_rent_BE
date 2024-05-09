"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt=require('jsonwebtoken')

module.exports = {
  login: async (req, res) => {
    const { username, email, password } = req.body;
    if ((username || email) && password) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
     console.log(user.password,passwordEncrypt(password))
      if (user && user.password === passwordEncrypt(password)) {
        console.log(user)
        if (user.isActive) {
        
          let tokenData = await Token.findOne({ userId: user.id });
          if (!tokenData)
            tokenData = await Token.create({
              userId: user.id,
              token: passwordEncrypt(user.id + Date.now()),
            });
          const accessInfo = {
            key: process.env.ACCESS_KEY,
            time: process.env?.ACCESS_EXP || "30m",
            data: {
              _id: user._id,
              id: user.id,
              username: user.username,
              email: user.email,
              password: user.password,
              isActive: user.isActive,
              isAdmin: user.isAdmin,
            },
          };
          const refreshInfo = {
            key: process.env.REFRESH_KEY,
            time: "3d",
            data: {
              id: user.username,
              password: user.password,
            },
          };
          const accessToken = jwt.sign(accessInfo.data, accessInfo.key, {
            expiresIn: accessInfo.time,
          });
          const refreshToken = jwt.sign(refreshInfo.data, refreshInfo.key, {
            expiresIn: refreshInfo.time,
          });

          res.status(200).send({
            error: false,
            token: tokenData.token,
            bearer: {
              access: accessToken,
              refresh: refreshToken,
            },
            user,
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("This account is not active.");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong username/email or password.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username/email and password.");
    }
  },
  refresh: async (req, res) => {
    const refreshToken = req.body?.bearer?.refresh;

    if (refreshToken) {
      const refreshData = await jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY
      );

      if (refreshData) {
        const user = await User.findOne({ _id: refreshData.id });
        if (user && user.password == refreshData.password) {
          res.status(200).send({
            error: false,
            bearer: {
              access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
                expiresIn: process.env?.ACCESS_EXP || "30m",
              }),
            },
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("Wrong id or password.");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("JWT refresh data is wrong.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter bearer.refresh");
    }
  },
  logout: async (req, res) => {
    const auth = req.headers?.authorization;
    const tokenKey = auth ? auth.split(" ") : null;
    if (tokenKey[0] == "Token") {
      const result = await Token.deleteOne({ token: tokenKey[1] });
      res.send({
        error: false,
        message: "Token deleted. Logout was OK.",
        result,
      });
    } else {
      res.send({
        error: false,
        message: "JWT: No need any process for logout.",
      });
    }
  },
};
