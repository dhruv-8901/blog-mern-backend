import moment from "moment";
import { baseUrl } from "../../common/config/constant.config";

export default class GetUserResource {
  constructor(data) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
  }
}
