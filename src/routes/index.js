const { Router } = require("express");
const router = Router();
const routerRecipes = require("./routerRecipes")
const routerTypes = require("./routerTypes")
const routerUsers = require("./routerUsers")


router.use("/recipes", routerRecipes);
router.use("/types", routerTypes);
router.use("/users", routerUsers);


module.exports = router;