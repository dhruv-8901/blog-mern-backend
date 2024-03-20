import moment from "moment";
import AccessToken from "../../model/accessToken";
import User from "../../model/user";
import AuthHelper from "../common/auth.helper";
import { ROLE } from "../common/constants/constant";
import { randomNumberGenerator } from "../common/helper";
import sendMail from "../common/send-mail";
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "../error-exception";
import Blog from "../../model/blog";

class AuthServices {
  /**
   * Register user
   * @param {*} data
   */
  static async signupUser(data) {
    const email = data.email.toLowerCase();
    if (await User.findOne({ email })) {
      throw new BadRequestException("Email already in use.");
    }

    const hashedPassword = await AuthHelper.bcryptPassword(data.password);

    return User.create({
      password: hashedPassword,
      email: data.email.toLowerCase(),
      name: data.name,
    });
  }

  /**
   * Login user
   * @param {*} data
   */
  static async loginUser(data) {
    let { email, password } = data;
    email = email.toLowerCase();
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw new UnauthorizedException("User not found!");
    }

    const matchHashedPassword = await AuthHelper.matchHashedPassword(
      password,
      userExist.password
    );

    if (!matchHashedPassword) {
      throw new BadRequestException("Invalid credentials");
    }

    const accessToken = await AuthHelper.accessTokenGenerator(userExist._id);

    await Blog.create({
      userId: userExist._id,
      name: "react learning",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      image: "/media/blog",
      isActive: true,
    });

    return { accessToken };
  }

  /**
   * User otp verification
   * @param {*} role
   * @param {*} email
   * @param {*} otp
   */
  static async userOtpVerification(role, type, email, otp) {
    email = email.toLowerCase();
    const userExist = await User.findOne({ email, role });

    if (!userExist) {
      throw new UnauthorizedException(
        `${role == ROLE.USER ? "User" : "Recruiter"} Not Found.`
      );
    }

    if (type == 1) {
      if (userExist.emailVerifiedAt) {
        throw new UnauthorizedException(
          `${
            role == ROLE.USER ? "User's" : "Recruiter's"
          } email already verified.`
        );
      }

      if (userExist.otp !== otp) {
        throw new UnauthorizedException("Invalid OTP");
      }

      if (userExist.otpExpireAt < Date.now()) {
        throw new ForbiddenException("OTP has expired");
      }
    } else {
      const userOtp = await LoginOtp.findOne({
        otp,
        userId: userExist._id,
        isOtpUsed: false,
      });

      if (!userOtp) {
        throw new UnauthorizedException("Invalid OTP");
      } else if (userOtp.otpExpireAt < Date.now()) {
        throw new ForbiddenException("OTP has expired");
      }

      await LoginOtp.updateOne({ _id: userOtp._id }, { isOtpUsed: true });
    }

    const accessToken = await AuthHelper.accessTokenGenerator(userExist._id);

    userExist.accessToken = accessToken;

    delete userExist.password;

    return userExist;
  }

  /**
   * Resend OTP
   * @param {*} role
   * @param {*} email
   */
  static async resendOtp(role, email) {
    email = email.toLowerCase();
    const userExist = await User.findOne({ email, role });

    if (!userExist) {
      throw new UnauthorizedException(
        `${role == ROLE.USER ? "User" : "Recruiter"} Not Found.`
      );
    }

    if (userExist.emailVerifiedAt) {
      throw new UnauthorizedException(
        `${
          role == ROLE.USER ? "User's" : "Recruiter's"
        } email already verified.`
      );
    }

    const otp = randomNumberGenerator(6);

    const obj = {
      to: email,
      subject: "Signup verification code for hiremate",
      otp,
    };

    await sendMail(obj, "otp-verification");

    return User.updateOne(
      { _id: userExist._id },
      { otp, otpExpireAt: new Date(moment().add(1, "minutes")) }
    );
  }

  /**
   * User logout
   * @param {*} authUser
   */
  static async userLogout(authUser) {
    return await AccessToken.updateOne(
      { token: authUser.jti },
      { isRevoked: true }
    );
  }
}

export default AuthServices;
