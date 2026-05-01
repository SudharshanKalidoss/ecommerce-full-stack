const { tryCatch } = require("../middlewares/try-catch");
const { formatResponse } = require("../utils/format-response");
const { STATUS, RESPONSE_MESSAGES } = require("../utils/status");
const { STATUS_CODES } = require("../utils/status-codes");
const { ERROR_MESSAGES } = require("../utils/error-messages");
const productService = require("../service/product")
const variantService = require("../service/variant");

const path = require('path');
const fs = require('fs/promises');
const { generateProductImages } = require("../utils/image-processor");
const { sequelize, models } = require("../config/db");
const { Op } = require("sequelize");

const parseVariants = (variants) => {
  if (variants === undefined || variants === null) return [];
  if (typeof variants === "string") {
    try {
      variants = JSON.parse(variants);
    } catch (err) {
      return null;
    }
  }

  if (!Array.isArray(variants)) return null;

  return variants
    .map((variant) => ({
      id: variant.id !== undefined && variant.id !== null ? parseInt(variant.id, 10) : undefined,
      size: typeof variant.size === "string" ? variant.size.trim() : variant.size,
      salePrice: parseFloat(variant.salePrice),
      comparePrice:
        variant.comparePrice !== undefined && variant.comparePrice !== null
          ? parseFloat(variant.comparePrice)
          : null,
      stock: parseInt(variant.stock, 10),
    }))
    .filter(
      (variant) =>
        variant.size &&
        !Number.isNaN(variant.salePrice) &&
        !Number.isNaN(variant.stock)
    );
}


exports.fetchAllProduct = tryCatch(async (req, res) => {

  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    orderDirection = "DESC",
    search,
  } = req.query;

  const where = {};

  let fieldsToBeIncluded = ["id", "title", "salePrice", "comparePrice", "status" , "thumbnail" , "thumbnailFile"]
  const order = [[orderBy, orderDirection]]

  if (search) {
    where.title = { [Op.like]: `%${search}%` }; 
  }


  const products = await productService.fetchAllProduct(parseInt(page), parseInt(limit), where, fieldsToBeIncluded, order, []);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.FETCHED, products))

})


exports.fetchProductById = tryCatch(async (req, res) => {

  const id = req.params.id;

  let fieldsToBeIncluded = ["id", "title", "salePrice", "comparePrice", "status" , "shortDescription" , "description" , "categoryId" , "slug" , "stock" , "thumbnailFile" , "thumbnail"]

  const modelsToBeIncluded = [{
    model: models.variant,
    as : "variants",
   
    attributes: ["id", "size", "salePrice", "comparePrice", "stock"],
  }]



  const products = await productService.fetchProductById(parseInt(id),  fieldsToBeIncluded, modelsToBeIncluded);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.FETCHED, products))

})


exports.fetchAllProductForGride = tryCatch(async (req, res) => {

  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    orderDirection = "DESC",
    search,
    categoryId
  } = req.query;

  const where = {};

  let fieldsToBeIncluded = ["id", "title", "slug", "salePrice", "comparePrice", "status" , "createdAt" , "thumbnail" , "thumbnailFile"]
  const modelsToBeIncluded = [{
    model: models.variant,
    as : "variants",
    required: false,
    attributes: ["id", "size", "salePrice", "comparePrice", "stock"],
  },]
  const order = [[orderBy, orderDirection]]

  if (search) {
    where.title = { [Op.like]: `%${search}%` }; 
  }

  if(categoryId){
    console.log("Category ID:", categoryId);
    where.categoryId = categoryId;
  }

  const products = await productService.fetchAllProduct(parseInt(page), parseInt(limit), where, fieldsToBeIncluded, order, modelsToBeIncluded);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.FETCHED, products))

})





exports.productCreate = tryCatch(async (req, res) => {
  try {
    const body = req.body;
        console.log("Request body:", body);
    console.log("Thumbnail file:", req.file);

    const thumbnail = req.file;

    console.log("Request body:", body);
    console.log("Thumbnail file:", thumbnail);

   
    // const { error } = productSchema.validate(body);

    // if (error) {
    //   return res.status(STATUS_CODES.VALIDATION_FAILED.code).send(formatResponse(STATUS.FAILED, error.message))
    // }



    console.log(req.body , "fasdkjasdklasjklds")






    const productData = {
      title: body.title,
      slug: body.slug,
      shortDescription: body.shortDescription,
      description: body.description,
      salePrice: parseFloat(body.salePrice),
      stock: parseInt(body.stock, 10),
      comparePrice: body.comparePrice !== undefined ? parseFloat(body.comparePrice) : null,
      categoryId: body.categoryId !== undefined ? parseInt(body.categoryId, 10) : null,
      status: body.status !== undefined ? ["true", "1", 1, true].includes(body.status) : undefined,
    }

    const createdProduct = await productService.createProduct(productData);

    const variants = parseVariants(body.variants);
    if (Array.isArray(variants) && variants.length > 0) {
      const bulkVariants = variants.map((variant) => ({
        productId: createdProduct.id,
        size: variant.size,
        salePrice: variant.salePrice,
        comparePrice: variant.comparePrice,
        stock: variant.stock,
      }));

      await variantService.bulkCreateVariants(bulkVariants);
    }

    // await productUtils.uploadProductThumbnail(createdProduct, thumbnail);



  //     if (!thumbnail || thumbnail.length === 0) {
  //   return;
  // }

  const image = thumbnail;

  const productDirectory = path.join('uploads', 'products');
  await fs.mkdir(productDirectory, { recursive: true });
  await fs.mkdir(`${productDirectory}/thumbnail`, { recursive: true });


  const imagePath = `${image.destination}/${image.filename}`;
  const fileNameWithoutExtension = path.basename(
    image.filename,
    path.extname(image.filename)
  );
  const fileName = `${fileNameWithoutExtension}-thumbnail`;
  const file = `${fileNameWithoutExtension}-thumbnail.webp`;
  //   const outPath = `${image.destination}`;

  await generateProductImages(imagePath, productDirectory, fileName);

  createdProduct.thumbnailFile = file;

  await createdProduct.save();


    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.CREATED, createdProduct))
  } catch (err) {
    throw err
  }

})


exports.updateProduct = tryCatch(async (req, res) => {
  try {
    const body = req.body;
    const productId = parseInt(req.params.id, 10);
    const thumbnail = req.file;

    const product = await productService.fetchProductById(productId, ["id", "slug"], []);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.PRODUCTS.NOT_FOUND));
    }

    if (body.slug) {
      const slugConflict = await productService.fetchProductBySlug(body.slug, productId);
      if (slugConflict) {
        return res.status(STATUS_CODES.CONFLICT.code).send(formatResponse(STATUS.FAILED, "Product slug already exists"));
      }
    }

    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.salePrice !== undefined) updateData.salePrice = parseFloat(body.salePrice);
    if (body.comparePrice !== undefined) updateData.comparePrice = parseFloat(body.comparePrice);
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);
    if (body.categoryId !== undefined) updateData.categoryId = parseInt(body.categoryId, 10);
    if (body.status !== undefined) {
      updateData.status = ["true", "1", 1, true].includes(body.status);
    }

    const parsedVariants = body.variants !== undefined ? parseVariants(body.variants) : null;
    const transaction = await sequelize.transaction();

    try {
      await productService.updateProduct(product, updateData, { transaction });

      if (parsedVariants !== null) {
        const existingVariants = await variantService.fetchVariants({ productId }, ["id"], { transaction });
        const existingVariantIds = new Set(existingVariants.map((variant) => variant.id));
        const incomingVariantIds = parsedVariants.filter((variant) => variant.id).map((variant) => variant.id);

        const deletedIds = existingVariants
          .map((variant) => variant.id)
          .filter((variantId) => !incomingVariantIds.includes(variantId));

        if (deletedIds.length > 0) {
          await variantService.deleteVariants({ id: deletedIds, productId }, { transaction });
        }

        const variantsToCreate = [];
        for (const variant of parsedVariants) {
          const payload = {
            productId,
            size: variant.size,
            salePrice: variant.salePrice,
            comparePrice: variant.comparePrice,
            stock: variant.stock,
          };

          if (variant.id && existingVariantIds.has(variant.id)) {
            await variantService.updateVariant(variant.id, payload, { transaction });
          } else if (!variant.id) {
            variantsToCreate.push(payload);
          }
        }

        if (variantsToCreate.length > 0) {
          await variantService.bulkCreateVariants(variantsToCreate, { transaction });
        }
      }

      if (thumbnail) {
        const productDirectory = path.join("uploads", "products");
        await fs.mkdir(productDirectory, { recursive: true });
        await fs.mkdir(`${productDirectory}/thumbnail`, { recursive: true });

        const imagePath = `${thumbnail.destination}/${thumbnail.filename}`;
        const fileNameWithoutExtension = path.basename(thumbnail.filename, path.extname(thumbnail.filename));
        const fileName = `${fileNameWithoutExtension}-thumbnail`;
        const file = `${fileNameWithoutExtension}-thumbnail.webp`;

        await generateProductImages(imagePath, productDirectory, fileName);

        await product.update({ thumbnailFile: file }, { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    const updatedProduct = await productService.fetchProductById(productId, ["id", "title", "slug", "shortDescription", "description", "salePrice", "comparePrice", "stock", "categoryId", "status", "thumbnailFile", "thumbnail"], [
      {
        model: models.variant,
        as: "variants",
        attributes: ["id", "size", "salePrice", "comparePrice", "stock"],
      },
    ]);

    return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.UPDATED, updatedProduct));
  } catch (err) {
    throw err;
  }
});


exports.getProductById = tryCatch(async (req, res) => {
  const productId = req.params.id;
  const productWhere = { id: productId, status: true };

  const productFields = ["id", "title", "shortDescription", "description", 'salePrice', "comparePrice",  "slug", "stock",  "status", "thumbnailFile", "thumbnail", ]

  const model = [{
    model: models.category,
    where: { status: true},
    required: false,
    attributes: ["id", "name"],
  },]

  const product = await productService.fetchSingleProduct(productWhere, productFields, model)

  if (!product) {
    return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.PRODUCTS.NOT_FOUND))
  }

  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.FETCHED, product))
})

exports.deleteProductById = tryCatch(async (req, res) => {
  const productId = req.params.id;
  const product = await productService.fetchProductById(productId);

  if (!product) {
    return res.status(STATUS_CODES.NOT_FOUND.code).send(formatResponse(STATUS.FAILED, ERROR_MESSAGES.PRODUCTS.NOT_FOUND));
  }
  await product.destroy();

  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.DELETED));
});



exports.fetchProductBySlug = tryCatch(async (req, res) => {

  const id = req.params.slug;
  const where = { slug: id };

  console.log(req.params.slug , "fasdkjasdklasjklds")

  let fieldsToBeIncluded = ["id", "title", "salePrice", "comparePrice", "status" , "shortDescription" , "description" , "categoryId" , "slug" , "stock" , "thumbnailFile" , "thumbnail"]

  const modelsToBeIncluded = [{
    model: models.variant,
    as : "variants",
   
    attributes: ["id", "size", "salePrice", "comparePrice", "stock"],
  }]



  const products = await productService.fetchSingleProduct(where,  fieldsToBeIncluded, modelsToBeIncluded);
  return res.status(STATUS_CODES.OK.code).send(formatResponse(STATUS.SUCCESS, RESPONSE_MESSAGES.PRODUCTS.FETCHED, products))

})
