const Joi = require('joi');


const cartItemSchema = Joi.object({
  productId: Joi.number().integer().required(),
  variantId: Joi.number().integer().optional().allow(null),
  quantity: Joi.number().integer().required()
});

// Schema for a single cart item
exports.singleCartItemSchema = cartItemSchema;

exports.cartSchema = Joi.alternatives().try(
  cartItemSchema,
  Joi.array().items(cartItemSchema).min(1)
);

exports.cartDeleteSchema = Joi.object({
  productId: Joi.number().integer().required(),
  variantId: Joi.number().integer().optional().allow(null),
});

