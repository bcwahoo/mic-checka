const router = require("express").Router();
const albumRoutes = require("./albums");
const userRoutes = require("./user");

// Album routes
router.use("/albums", albumRoutes);
router.use("/users", userRoutes);
module.exports = router;
