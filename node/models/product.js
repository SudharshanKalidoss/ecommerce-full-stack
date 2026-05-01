const serverAddress = `${process.env.URL}`;
let staticPath = `/uploads/products/`;

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "short_description",
      },
      description: {
        type: DataTypes.TEXT,
      },
      categoryId : {
        type : DataTypes.INTEGER(10),
      },
   
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: "sale_price",
      },
      comparePrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: "compare_price",
      },
      sku: {
        type: DataTypes.STRING(50),
      },
      slug: {
        type: DataTypes.STRING,
      },
      isFeatured: {  
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_featured",
      },
      taxStatus: {
        type: DataTypes.BOOLEAN,
        // defaultValue: false,
        allwoNull: false,
        field: "tax_status"
      },
      stock: {
        type: DataTypes.INTEGER(5),
      },

      averageRating: {
        type: DataTypes.DOUBLE(3, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
        field: "average_rating"
      },
      totalRating: {
        type: DataTypes.INTEGER,
        field: "total_rating"
      },
      thumbnailFile: {
        type: DataTypes.STRING,
        field: "thumbnail_file"
      },
      thumbnail: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${serverAddress}${staticPath}/thumbnail/${this.thumbnailFile} `
        }
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

     
    },
    {
      tableName: "products",
      indexes: [
  
      ],
      hooks: {
       
      },

    }
  );
  Product.associate = function (models) {

 
Product.hasMany(models.variant, {
    foreignKey: {
      name: "productId",
      field: "product_id",
    },
    as: "variants",
    onDelete: "CASCADE",
  });
   

  };

  return Product;
};
