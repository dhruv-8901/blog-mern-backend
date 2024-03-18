import Joi from "joi";

export default Joi.object().keys({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Confirm password does not match" }),
});
