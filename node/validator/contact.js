const Joi = require('joi');

const socialProfileSchema = Joi.object({
  platform: Joi.string().required(),
  url: Joi.string().uri().required(),
});

exports.contactUpdateSchema = Joi.object({
  primaryContact: Joi.string().optional().allow(''),
  primaryEmail: Joi.string().email().optional().allow(''),
  address: Joi.string().optional().allow(''),
  socialProfiles: Joi.alternatives().try(
    Joi.array().items(socialProfileSchema),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        const { error } = Joi.array().items(socialProfileSchema).validate(parsed);
        if (error) return helpers.error('any.invalid');
        return parsed;
      } catch (err) {
        return helpers.error('any.invalid');
      }
    })
  ).optional(),
});