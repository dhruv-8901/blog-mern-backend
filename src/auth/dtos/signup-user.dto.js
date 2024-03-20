import Joi from "joi";

export default Joi.object().keys({
  role: Joi.number().valid(1, 2).required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  number: Joi.number().required(),
  location: Joi.string().required(),
  linkedin: Joi.alternatives().conditional("role", {
    is: 2,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  sector: Joi.alternatives().conditional("role", {
    is:2,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  university: Joi.alternatives().conditional("role", {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  major: Joi.alternatives().conditional("role", {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  gpa: Joi.alternatives().conditional("role", {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  workStatus: Joi.alternatives().conditional("role", {
    is: 1,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  profileImage: Joi.string().optional(),
  resume: Joi.string().optional(),
});
