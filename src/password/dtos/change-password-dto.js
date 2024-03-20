import Joi from "joi";

export default Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Confirm password does not match" }),
});
