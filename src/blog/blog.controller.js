import BlogServices from "./blog.service";
import GetBlogsResource from "./resource/get-blog.resource";

class BlogController {
  /**
   * Get all blogs
   * @param {*} req
   * @param {*} res
   */
  static async getAllBlog(req, res) {
    const { data, meta } = await BlogServices.getAllBlog(
      req.query.search,
      req.query.perPage,
      req.query.page
    );

    return res.send({ data: new GetBlogsResource(data), meta });
  }

  /**
   * Get blog data by id
   * @param {*} req
   * @param {*} res
   */
  static async getBlogDataById(req, res) {
    const data = await BlogServices.getBlogDataById(
      req.params.blogId,
      req.user
    );

    const newData = new GetBlogsResource(data);

    return res.send({ data: newData.length > 0 ? newData[0] : null });
  }

  /**
   * Delete blog by id
   * @param {*} req
   * @param {*} res
   */
  static async deleteBlogById(req, res) {
    await BlogServices.deleteBlogById(req.params.blogId, req.user);

    return res.send({ message: "Blog deleted successfully" });
  }

  /**
   * Update blog by id
   * @param {*} req
   * @param {*} res
   */
  static async updateBlogById(req, res) {
    await BlogServices.updateBlogById(
      req.file,
      req.params.blogId,
      req.body,
      req.user
    );

    return res.send({ message: "Update blog successfully" });
  }

  /**
   * Add blog
   * @param {*} req
   * @param {*} res
   */
  static async addBlog(req, res) {
    await BlogServices.addBlog(req.file, req.body, req.user);

    return res.send({ message: "Blog created successfully" });
  }
}

export default BlogController;
