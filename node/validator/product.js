const Joi = require('joi');

const variantSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  size: Joi.string().valid('S', 'M', 'L', 'XL').required(),
  salePrice: Joi.number().precision(2).required(),
  comparePrice: Joi.number().precision(2).optional().allow(null, ''),
  stock: Joi.number().integer().required(),
});

const parseVariants = (value, helpers) => {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return helpers.error('any.invalid');

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return helpers.error('any.invalid');
    }
    const { error, value: validated } = Joi.array().items(variantSchema).validate(parsed, { abortEarly: false });
    if (error) {
      return helpers.error('any.invalid');
    }
    return validated;
  } catch (err) {
    return helpers.error('any.invalid');
  }
};

const variantsSchema = Joi.alternatives().try(
  Joi.array().items(variantSchema).min(1),
  Joi.string().custom(parseVariants)
);

exports.productCreateSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  shortDescription: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  salePrice: Joi.number().precision(2).required(),
  comparePrice: Joi.number().precision(2).optional().allow(null, ''),
  status: Joi.boolean().truthy('true').truthy('1').falsy('false').falsy('0').optional(),
  categoryId: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  variants: variantsSchema.optional(),
});

exports.productUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  slug: Joi.string().optional(),
  shortDescription: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  salePrice: Joi.number().precision(2).optional(),
  comparePrice: Joi.number().precision(2).optional().allow(null, ''),
  status: Joi.boolean().truthy('true').truthy('1').falsy('false').falsy('0').optional(),
  categoryId: Joi.number().integer().optional(),
  stock: Joi.number().integer().optional(),
  variants: variantsSchema.optional(),
}).or('title', 'slug', 'shortDescription', 'description', 'salePrice', 'comparePrice', 'status', 'categoryId', 'stock', 'variants');
