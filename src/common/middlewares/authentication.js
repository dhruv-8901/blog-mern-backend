// jwt AUTHENTICATION
import AccessToken from "../../../model/accessToken";
import { HttpStatus } from "../../error-exception";
import passport from "passport";
import { ROLE } from "../constants/constant";

export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user || user.userType == ROLE.ADMIN) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    const exist = await AccessToken.findOne({
      token: user.jti,
      isRevoked: false,
      userId: user._id,
    });

    if (!exist) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  })(req, res, next);
};
