const jwt = require("jsonwebtoken");
const { reseller } = require('../models')

module.exports = {
  async isAuth(req, res, next) {
    // console.log('masuk ke auth')
    try {
      let error = {
        name: "authentication",
        errors: []
      }
      let token = req.headers.token
      console.log(token, '<<<<<<<<<< ini tokennya')
      if (!token) {
        error.errors.push('Authentication Failed')
        throw error
      } else {
        let decodeToken = jwt.verify(token, process.env.SECRET);

        let result = await reseller.findOne({
          where: {
            kode: decodeToken.kode_reseller
          },
          order: [['tgl_daftar', 'DESC']]
        })
        if (result) {
          req.logedInUser = decodeToken;
          next();
        } else {
          error.errors.push('Authentication Failed')
          throw error
        }
      }
    } catch (err) {
      next(err);
    }
  },

  isAuthorized: (req, res, next) => {
    if (req.user.role == "admin") {
      next();
    } else {
      res.status(401).json({
        message: "User Not Authorized",
      });
    }
  },
};
