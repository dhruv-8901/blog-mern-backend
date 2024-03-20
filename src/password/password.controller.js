import PasswordService from "./password.service";
const expiresInSeconds = 31536000;

class PasswordController {
  /**
   * forgot password
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async forgotPassword(req, res) {
    const data = await PasswordService.forgotPassword(req.body);

    return res.send({
      message:
        "Please check your inbox. We sent you an sms with reset password OTP",
      data: {
        auth: {
          tokenType: "Bearer",
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: expiresInSeconds,
        },
      },
    });
  }

  /**
   * Forgot otp verification
   * @param {*} req
   * @param {*} res
   */
  static async forgotOtpVerification(req, res) {
    await PasswordService.forgotOtpVerification(req.body.otp, req.body.email);

    return res.send({
      message: "OTP successfully verified.",
    });
  }

  /**
   * reset password
   * @param {*} req
   * @param {*} res
   */
  static async resetPassword(req, res) {
    await PasswordService.resetPassword(req.body.password, req.user);

    return res.send({
      message: "Reset password successfully.",
    });
  }

  /**
   * Change password
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async changePassword(req, res) {
    await PasswordService.changePassword(
      req.user,
      req.body.oldPassword,
      req.body.newPassword
    );

    return res.send({
      message: "Password change successfully.",
    });
  }
}

export default PasswordController;
