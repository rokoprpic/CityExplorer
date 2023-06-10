const Joi = require("joi");

module.exports.citySchema = Joi.object({
    city: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

