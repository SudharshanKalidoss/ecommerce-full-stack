const { USER_ROLES } = require("../utils/user-roles");

exports.adminOnly = async (req, res, next) => {
    const user = req.user;

    if (user && user.role == USER_ROLES.ADMIN) {
        next();
    } else {
        console.log("Access denied. Admin only." , user);
        return res.status(403).send("Access denied. Admin only.");
    }

};