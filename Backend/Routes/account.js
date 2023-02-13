const router = require("express").Router();
const AccountController = require("../Controllers/AccountControllers");
const middlewareController = require("../Middlewares/middlewareControllers");
// get all account
router.get(
  "/",
  middlewareController.verifyToken,
  AccountController.getAllAccount
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  middlewareController.verifyAuthDelete,
  AccountController.deleteAcount
);

module.exports = router;
