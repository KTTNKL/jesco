const userService = require("./userService");
const bcrypt = require("bcrypt");
const orderService=require("../order/orderService")
exports.register = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  const checkingUsername = await userService.findByUsername(username);
  const checkingUserEmail = await userService.findByEmail(email);
  if(!checkingUserEmail && !checkingUsername){
    if (password === confirm_password) {
      const user = await userService.register(username, email, password);
      res.redirect("/login");
    }
    else {
      const wrongConfirm = true;
      res.render("auth/views/login", { wrongConfirm });
    }
  }
  else{
    const duplicate = true;
    res.render("auth/views/login", {duplicate});
  }
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
  } catch (err) { }

  res.render("auth/views/account", { user });
};

exports.viewAccount = async (req, res) => {
  const listOrder=await orderService.viewAllOrder(req.user._id);
  let count=1;
  listOrder.map(order=>{
    order._id=order._id.toString();
    order.num=count;
    count+=1;
  })

  res.render("auth/views/account",{listOrder});
};
