const userService = require("./userService");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userService.register(username, email, password);
  res.redirect("/login");
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

exports.login = (req, res) => {
  const wrongPassword = req.query["wrong-password"] !== undefined;
  res.render("auth/views/login", { wrongPassword });
};

exports.updateAccount = async function (req, res) {
  const user = req.body;
  try {
    if (user.email_address) {
      req.session.passport.user.email_address = user.email_address;
    }
    if (user.address) {
      req.session.passport.user.address = user.address;

    }
    if (user.phone) {
      req.session.passport.user.phone = user.phone;

    }

    await userService.update(user);
    if (user["old-password"] !== "" && user["new-password"] !== "") {
      const isValid = await userService.validPassword(
        user["old-password"],
        req.user
      );
      if (isValid) {
        user.password = await bcrypt.hash(user["new-password"], 10);
        await userService.update(user);
        console.log("password changed successfully");
      }
    }
  } catch (err) {}

  res.render("auth/views/account", { user });
};

exports.viewAccount = (req, res) => {
  res.render("auth/views/account");
};
