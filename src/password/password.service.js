import moment from "moment";
import User from "../../model/user";
import { randomNumberGenerator } from "../common/helper";
import sendMail from "../common/send-mail";
import { BadRequestException } from "../error-exception";
import UserServices from "../user/user.service";
import AuthHelper from "../common/auth.helper";

class PasswordService {
  /**
   * Forgot password
   * @param {*} data
   * @returns
   */
  static async forgotPassword(data) {
    const { countryCode, phone } = data;
    const userExist = await User.findOne({ countryCode, phone });

    if (!userExist) {
      throw new BadRequestException("User does not exist.");
    }

    // const otp = randomNumberGenerator(5);
    const otp = 77777;

    await User.updateOne(
      { countryCode, phone },
      {
        forgotOtp: otp,
        forgotOtpSendAt: new Date(),
        validForForgotPassword: false,
      }
    );

    const tokens = await AuthHelper.tokensGenerator(userExist.id);

    return tokens;
  }

  /**
   * forgot otp verification
   * @param {*} otp
   * @param {*} email
   */
  static async forgotOtpVerification(otp, email) {
    email = email.toLowerCase();
    const userExist = await User.findOne({ email });

    if (!userExist) {
      throw new BadRequestException("User not found.");
    } else if (!userExist.forgotOtpSendAt) {
      throw new BadRequestException(
        "Invalid forgot request, first click on to the forgot password."
      );
    }

    if (moment(userExist.forgotOtpSendAt).add(1, "minute") < moment()) {
      throw new BadRequestException("OTP expired.");
    }

    if (userExist.forgotOtp !== otp) {
      throw new BadRequestException("Invalid OTP!");
    }

    return await User.updateOne({ email }, { validForForgotPassword: true });
  }

  /**
   * Reset password
   * @param {*} password
   * @param {*} authUser
   * @returns
   */
  static async resetPassword(password, authUser) {
    if (!authUser.validForForgotPassword) {
      throw new BadRequestException(
        "Invalid forgot request, first verify forgot password OTP."
      );
    }

    const userData = await User.findOne({ _id: authUser._id });

    const matchHashedPassword = await AuthHelper.matchHashedPassword(
      password,
      userData.password
    );

    if (matchHashedPassword) {
      throw new BadRequestException(
        "New Password must be different from the previous password."
      );
    }

    const hashedPassword = await AuthHelper.bcryptPassword(password);

    return await User.updateOne(
      { _id: authUser._id },
      { password: hashedPassword, validForForgotPassword: false }
    );
  }

  /**
   * Change password
   * @param {*} authUser
   * @param {*} oldPassword
   * @param {*} password
   */
  static async changePassword(authUser, oldPassword, newPassword) {
    const userData = await User.findOne({
      countryCode: authUser.countryCode,
      phone: authUser.phone,
    });

    const matchHashedPassword = await AuthHelper.matchHashedPassword(
      oldPassword,
      userData.password
    );

    if (!matchHashedPassword) {
      throw new BadRequestException("Old password does not match!");
    }

    const newMatchHashedPassword = await AuthHelper.matchHashedPassword(
      newPassword,
      userData.password
    );

    if (newMatchHashedPassword) {
      throw new BadRequestException(
        "New Password must be different from the previous password."
      );
    }

    const hashedPassword = await AuthHelper.bcryptPassword(newPassword);

    return await User.updateOne(
      { countryCode: authUser.countryCode, phone: authUser.phone },
      { password: hashedPassword }
    );
  }
}

export default PasswordService;
