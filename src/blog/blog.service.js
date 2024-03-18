import Blog from "../../model/blog";
import mongoose from "mongoose";
import { BadRequestException } from "../error-exception";
import { unlinkFile } from "../common/helper";
import { PAGINATION } from "../common/constants/constant";
const ObjectId = mongoose.Types.ObjectId;

class BlogServices {
  /**
   * get all blogs
   */
  static async getAllBlog(
    search = "",
    perPage = PAGINATION.DEFAULT_PER_PAGE,
    currentPage = PAGINATION.DEFAULT_PAGE
  ) {
    let skip = Number((currentPage - 1) * perPage);
    let limit = Number(perPage);

    const data = await Blog.find({
      title: { $regex: search, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const totalData = await Blog.find({
      title: { $regex: search, $options: "i" },
    });

    return {
      data,
      meta: {
        total: totalData.length,
        get lastPage() {
          return this.total ? Math.ceil(Number(this.total / this.perPage)) : 0;
        },
        perPage: +perPage,
        currentPage: +currentPage,
      },
    };
  }

  /**
   * Get blog data by blogId
   * @param {*} blogId
   */
  static async getBlogDataById(blogId, authUser) {
    const blogDetails = await Blog.findOne({ _id: blogId });
    if (!blogDetails) {
      return [];
    }
    let isAuthor = false;
    if (blogDetails.userId.equals(ObjectId(authUser._id))) {
      isAuthor = true;
    }

    return [{ ...blogDetails._doc, isAuthor }];
  }

  /**
   * Add blog
   * @param {*} image
   * @param {*} data
   * @param {*} authUser
   */
  static async addBlog(image, data, authUser) {
    if (image) {
      data.image = image.destination + "/" + image.filename;
    }

    return await Blog.create({ ...data, userId: authUser._id });
  }

  /**
   * Update blog by Id
   * @param {*} image
   * @param {*} blogId
   * @param {*} data
   * @param {*} authUser
   */
  static async updateBlogById(image, blogId, data, authUser) {
    const blogExist = await Blog.findOne({ _id: blogId, userId: authUser._id });
    if (!blogExist) {
      throw new BadRequestException("Blog not found");
    }

    if (image) {
      data.image = image.destination + "/" + image.filename;
      console.log(blogExist.image);
      unlinkFile(blogExist.image);
    }

    return await Blog.updateOne({ _id: blogId }, data);
  }

  /**
   * Delete blog by id
   * @param {*} blogId
   * @param {*} authUser
   */
  static async deleteBlogById(blogId, authUser) {
    const blogExist = await Blog.findOne({
      _id: blogId,
      userId: authUser._id,
    });
    if (!blogExist) {
      throw new BadRequestException("Blog not found");
    }

    return await Blog.deleteOne({ _id: blogId });
  }
}

export default BlogServices;
