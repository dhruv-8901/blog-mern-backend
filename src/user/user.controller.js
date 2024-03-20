import GetUserResource from "./resource/get-user.resource";
import UserServices from "./user.service";

class UserController {
  /**
   * Update user data
   * @param {*} req
   * @param {*} res
   */
  static async updateUserData(req, res) {
    await UserServices.updateUserData(req.body, req.user);

    return res.send({
      message: "User update successfully.",
    });
  }

  /**
   * Get user data
   * @param {*} req
   * @param {*} res
   */
  static async getUserData(req, res) {
    const data = await UserServices.getUserData(req.user);

    return res.send({ data: new GetUserResource(data) });
  }

  /**
   * Delete user account
   * @param {*} req
   * @param {*} res
   */
  static async deleteUserAccount(req, res) {
    await UserServices.deleteUserAccount(req.user);

    return res.send({ message: "User account deleted successfully." });
  }
}

export default UserController;
