module.exports = (sequelize, DataTypes) => {
  const Variant = sequelize.define(
    "variant",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },

      // ✅ ADD THIS
      size: {
        type: DataTypes.ENUM("S", "M", "L", "XL"),
        allowNull: false,
      },

      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "sale_price",
      },

      comparePrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: "compare_price", 
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "variant",
    }
  );

  Variant.associate = function (models) {
    Variant.belongsTo(models.product, {
      foreignKey: {
        name: "productId",
        field: "product_id",
      },
    });
  };

  return Variant;
};