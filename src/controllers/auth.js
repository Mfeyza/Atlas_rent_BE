"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    const { username, email, password } = req.body;
    if ((username || email) && password) {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (user && user.password == passwordEncrypt(password)) {
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
          }); //'accessToken: Kısa ömürlüdür ve genellikle uygulama içerisinde kullanıcıya özel kaynaklara erişimde kullanılır. jwt.sign fonksiyonu, belirli kullanıcı bilgilerini (accessInfo.data), bir "secret key" (accessInfo.key) kullanarak imzalar ve belirli bir süre sonrasında geçersiz olacak şekilde (expiresIn: accessInfo.time) bir token oluşturur.
          const refreshToken = jwt.sign(refreshInfo.data, refreshInfo.key, {
            expressIn: refreshInfo.time,
          }); //'refreshToken: Uzun ömürlüdür ve erişim token'ının süresi dolduğunda yeni bir erişim token'ı almak için kullanılır. Yine jwt.sign fonksiyonu kullanılarak, bu sefer farklı bir "secret key" (refreshInfo.key) ve daha uzun bir geçerlilik süresi (expiresIn: refreshInfo.time) ile oluşturulur.

          res.status(200).send({
            //' dönen cevap
            error: false,
            token: tokenData.token, //' tokena tokendatadan nokta notasyonu ulaş
            bearer: {
              //'oluşturulan accessToken ve refreshToken, yanıtın bir parçası olarak gönderilir,bearer nesnesi altında, access ve refresh alanları olarak iki JWT tokenı döndürülür. "Bearer" terimi, bu tokenların "Bearer Token" olarak kullanılacağını ifade eder; yani, istemci bu tokenları "Authorization: Bearer <token>" şeklinde HTTP başlığında göndererek kendini yetkilendirebilir.
              access: accessToken,
              refresh: refreshToken,
            },
            user, //' istek yapan kullanıcının bilgilerini gönderir
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
    const refreshToken = req.body?.bearer?.refresh; //'İstemci tarafından gönderilen HTTP isteğinin gövdesinden (req.body) refresh token alınır.

    if (refreshToken) {
      const refreshData = await jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY
      ); //'jwt.verify metodu kullanılarak, alınan refresh token, çevre değişkenlerinde saklanan özel bir anahtar (REFRESH_KEY) kullanılarak doğrulanır. Bu işlem, token'ın geçerliliğini ve bütünlüğünü kontrol eder.
      //!async da sync da yazılabilir ama defaultu sync bu yüzdne altını çiziyor

      if (refreshData) {
        const user = await User.findOne({ _id: refreshData.id }); //' refresh token doğrulanırsa token içinde saklanan kullanıcı ıd si alınır ve bu bilgilere sahip kullanıcı bulunur.

        if (user && user.password == refreshData.password) {
          //'user varsa userın passwordu refreshdatadaki password ile uyuşuyorsa

          res.status(200).send({
            error: false,
            bearer: {
              access: jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {
                expiresIn: process.env?.ACCESS_EXP || "30m",
              }), //'jwt.sign metodu kullanılarak kullanıcı için yeni bir erişim token'ı oluşturulur. Bu token, kısa süreli bir geçerlilik süresine sahip olacak şekilde ayarlanır (expiresIn).
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
    const auth = req.headers?.authorization; // Token ...tokenKey... //' headers var mı bak headrsta authorization var mı
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] //'tokenkey e auth varmı varsa bölerek ata
    // const result = await Token.deleteOne({ token: tokenKey[1] }) //' result değişkenine tokenkeyin 1. indexındeki elemanı ata bul ve sil :)
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
