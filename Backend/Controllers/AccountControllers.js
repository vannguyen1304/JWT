const AccountModel = require("../models/Account");

const AccountController = {
  // get all users
  getAllAccount: async (req, res) => {
    try {
      const account = await AccountModel.find();
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // delete account
  deleteAcount: async (req, res) => {
    try {
      const account = await AccountModel.findById(req.params.id);
      return res.status(200).json("delete thanh cong");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = AccountController;
