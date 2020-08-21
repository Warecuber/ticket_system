const Joi = require("@hapi/joi");

// register validation

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(2).max(255).required(),
  });

  return ({ error, value } = schema.validate(data));
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return ({ error, value } = schema.validate(data));
};

const ticketValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    reporter: Joi.string().required(),
    subject: Joi.string().required(),
    description: Joi.string().min(6).required(),
  });

  return ({ error, value } = schema.validate(data));
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.ticketValidation = ticketValidation;
