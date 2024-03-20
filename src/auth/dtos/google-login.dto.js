import Joi from "joi";

export default Joi.object().keys({
  role: Joi.number().valid(1, 2).required(),
  token: Joi.string().required(),
});
