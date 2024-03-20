import Joi from "joi";

export default Joi.object({
  role: Joi.number().valid(1, 2).required(),
  email: Joi.string().email().required(),
});
