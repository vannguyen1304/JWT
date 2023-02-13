const router = require("express").Router();
const authController = require("../Controllers/AuthControllers");
const middlewareController = require("../Middlewares/middlewareControllers");

//REGISTER
router.post("/register", authController.registerUser);

//LOGIN
router.post("/login", authController.loginUser);

//refresh
router.post("/refresh", authController.requestRefreshToken);

// LOG OUT
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);

module.exports = router;
