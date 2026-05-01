module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      slug: {
        type: DataTypes.STRING(50),
      },
      
    },
    {
      tableName: "category",
      indexes: [

      ],
      hooks: {
      },
    }
  );
  Category.associate = function (models) {

 
  };

  return Category;
};
