import Joi from "joi";

export default Joi.object().keys({
  blogId: Joi.string().required(),
});
