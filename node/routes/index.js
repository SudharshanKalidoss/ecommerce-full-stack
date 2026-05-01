const AuthRoutes = require("./auth");
const CategoryRoutes = require("./categories");
const ContactRoutes = require("./contact");


const AdminAuthRoutes = require("./admin-auth");
const AdminDashboardRoutes = require("./admin-dashboard");
const AdminProductsRoutes = require("./admin-products");
const AdminCateogryRoutes = require("./admin-category");
const AdminUserRoute = require("./admin-users");
const AdminContactRoute = require("./admin-contact");

const initRoutes = (app) => {
    // route Configurations
    app.get("/api/health", (req, res) => {
        const currentDate = new Date().toISOString(); // ISO format for date
        res.status(200).json({ message: "Server Up", date: currentDate });
    });
      app.use("/api/auth", AuthRoutes);
      app.use("/api/categories", CategoryRoutes);
      app.use("/api/products", require("./products"));
    app.use("/api/users", require("./users"));
    app.use("/api/contact", ContactRoutes);
    app.use("/api/admin/auth", AdminAuthRoutes);
    app.use("/api/admin/dashboard", AdminDashboardRoutes);
    app.use("/api/admin/products", AdminProductsRoutes);
    app.use("/api/admin/categories",AdminCateogryRoutes);
    app.use("/api/admin/users", AdminUserRoute);
    app.use("/api/admin/contact", AdminContactRoute);


}

module.exports = initRoutes;