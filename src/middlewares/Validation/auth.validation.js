const joi = require("joi");

exports.validateRegistration = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    password: joi
      .string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
        ),
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one number, and one special character",
      }),
    role: joi.string().valid("admin", "user").optional(),
  });
  return schema.validate(data);
};

exports.validateLogin = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    password: joi
      .string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
        ),
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one number, and one special character",
      }),
  });
  return schema.validate(data);
};
