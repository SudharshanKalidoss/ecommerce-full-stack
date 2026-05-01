module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "cart",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      productId: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        field: "product_id",
      },
      variantId: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        field: "variant_id",
      },
      quantity: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        field: "user_id",
      },
    },
    {
      tableName: "carts",
      timestamps: true,
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.product, {
      foreignKey: "productId",
      // as: "product_id",
      onDelete: "CASCADE",
    });
    Cart.belongsTo(models.variant, {
      foreignKey: "variantId", 
      onDelete: "CASCADE",
    });
    Cart.belongsTo(models.users, { foreignKey: "userId", });
  };
  return Cart;
};
