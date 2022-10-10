function applyExtraSetup(sequelize) {
  const {
   user,
   product,
   department,
   request,
   request_product,
  } = sequelize.models;
  
  request.belongsTo(user, {
    as: "user",
    foreignKey: {
      name: "id_user",
      allowNull: true
    },
    hooks: true,
    onDelete: 'cascade'
  });
  user.hasMany(request, {
    as: "requests",
    foreignKey: "id_user"
  });

  product.belongsTo(department, {
    as: "department",
    foreignKey: {
      name: "id_department",
      allowNull: true
    },
    hooks: true,
    onDelete: 'cascade'
  });

  department.hasMany(product, {
    as: "products",
    foreignKey: "id_department"
  });

  request.belongsToMany(product, {
    through: request_product
  });
  product.belongsToMany(request, {
    through: request_product
  });
 
}

module.exports = {
  applyExtraSetup
};