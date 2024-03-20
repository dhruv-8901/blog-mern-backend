import User from "../../model/user";
import { unlinkFile } from "../common/helper";
import { ConflictException } from "../error-exception";

class UserServices {
  /**
   * Get user data
   * @param {*} authUser
   */
  static async getUserData(authUser) {
    return await User.findOne({ _id: authUser._id });
  }

  /**
   * Update user
   * @param {*} data
   * @param {*} profileImage
   * @param {*} authUser
   */
  static async updateUserData(data, authUser) {
    if (data.email && data.email.toLowerCase() !== authUser.email) {
      if (await User.findOne({ email: data.email.toLowerCase() })) {
        throw new ConflictException("Email is already in use");
      }
      data.email = data.email.toLowerCase();
    }

    return await User.updateOne({ _id: authUser._id }, { ...data });
  }
}

export default UserServices;
