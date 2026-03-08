const joi = require("joi");

exports.validateTask = (data) => {
  const schema = joi.object().keys({
    title: joi.string().min(3).required(),
    description: joi.string().optional(),
    assignedTo: joi.number().required(),
    priority: joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
    dueDate: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .messages({
        "string.pattern.base": "dueDate must be in YYYY-MM-DD format",
      }),
  });
  return schema.validate(data);
};
