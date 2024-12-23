import JWT from 'jsonwebtoken'
import validator from 'validator'
import "dotenv/config";

export const authMiddleware = async (req, res, next) => {
  try {
    // Skip token verification for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next();
    }
    const token = JSON.parse(req.headers['authorization']?.split(" ")[1]);
    if (!token) {
      return res.status(401).send({
        message: 'Token not provided',
        success: false
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err || !validator.isJWT(token)) {
        return res.status(401).send({
          message: 'Auth Failed verify',
          success: false
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};