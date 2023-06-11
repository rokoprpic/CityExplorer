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

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});

