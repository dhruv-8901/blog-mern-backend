import passport from "passport";
import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt";
import { JWT, ROLE } from "../constants/constant";
import User from "../../../model/user";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET,
};

passport.use(
  new JWTstratagy(options, async (jwtPayload, done) => {
    try {
      let user = await User.findOne({
        _id: jwtPayload.id,
      });

      if (!user) {
        return done(null, false);
      }
      delete user._doc.password;
      return done(null, {
        ...user._doc,
        jti: jwtPayload.jti,
        userType: jwtPayload.userType,
      });
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  })
);
