import GetUserResource from "../user/resource/get-user.resource";
import UserService from "../user/user.service";
import AuthServices from "./auth.service";
import authService from "./auth.service";
const expiresInSeconds = 31536000;

class AuthController {
  /**
   * User login
   * @param {*} req
   * @param {*} res
   */
  static async loginUser(req, res) {
    const login = await AuthServices.loginUser(req.body);

    return res.send({
      message: "Login successfully",
      auth: {
        tokenType: "Bearer",
        accessToken: login.accessToken,
        expiresIn: expiresInSeconds,
      },
    });
  }

  /**
   * User Registration
   * @param {*} req
   * @param {*} res
   */
  static async signupUser(req, res) {
    await authService.signupUser(req.body);

    return res.send({
      message: "User signup successfully.",
    });
  }

  /**
   * User OTP verifcation
   * @param {*} req
   * @param {*} res
   */
  static async userOtpVerification(req, res) {
    const userData = await authService.userOtpVerification(
      req.body.role,
      req.body.type,
      req.body.email,
      req.body.otp
    );

    return res.send({
      data: {
        ...new GetUserResource(userData),
        auth: {
          tokenType: "Bearer",
          accessToken: userData.accessToken,
          expiresIn: expiresInSeconds,
        },
      },
    });
  }

  /**
   * Resend OTP
   * @param {*} req
   * @param {*} res
   */
  static async resendOtp(req, res) {
    await authService.resendOtp(req.body.role, req.body.email);

    return res.send({ message: "Resend OTP successfully!" });
  }

  /**
   * Auth logout
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async logoutUser(req, res) {
    await AuthServices.userLogout(req.user);

    return res.send({ message: "User logged out successfully" });
  }
}

export default AuthController;
