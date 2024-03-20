import moment from "moment";
import { baseUrl } from "../../common/config/constant.config";

export default class GetBlogsResource {
  constructor(blogs) {
    return blogs.map((data) => ({
      _id: data._id,
      title: data.title,
      content: data.content,
      image: data.image ? baseUrl(data.image) : null,
      isActive: data.isActive,
      blogPostedAt: data.created_at,
      isAuthor: data.isAuthor,
    }));
  }
}
